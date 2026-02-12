import { NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const MAX_REQUESTS_PER_WINDOW = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
  captchaToken: string;
};

type ValidationResult =
  | { success: true; data: ContactPayload }
  | { success: false; error: string };

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const rateLimitKey = `contact:${clientIp}`;
  const rateLimit = checkRateLimit(
    rateLimitKey,
    MAX_REQUESTS_PER_WINDOW,
    RATE_LIMIT_WINDOW_MS
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const responseHeaders = {
    "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
    "X-RateLimit-Remaining": String(rateLimit.remaining),
  };

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400, headers: responseHeaders }
    );
  }

  if (isHoneypotTriggered(body)) {
    return NextResponse.json({ success: true }, { headers: responseHeaders });
  }

  const validated = validateContactPayload(body);
  if (!validated.success) {
    return NextResponse.json(
      { error: validated.error },
      { status: 400, headers: responseHeaders }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;
  const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
  const emailFrom =
    process.env.EMAIL_FROM ?? "FBT Website <onboarding@resend.dev>";

  if (!resendApiKey || !contactEmail || !turnstileSecretKey) {
    console.error(
      "Missing RESEND_API_KEY, CONTACT_EMAIL, or TURNSTILE_SECRET_KEY"
    );
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500, headers: responseHeaders }
    );
  }

  const captchaValid = await verifyTurnstileToken({
    token: validated.data.captchaToken,
    secretKey: turnstileSecretKey,
    remoteIp: clientIp,
  });

  if (!captchaValid) {
    return NextResponse.json(
      { error: "Captcha verification failed. Please try again." },
      { status: 400, headers: responseHeaders }
    );
  }

  const sanitizedName = sanitizeSingleLine(validated.data.name);
  const sanitizedEmail = sanitizeSingleLine(validated.data.email);
  const sanitizedCompany = sanitizeSingleLine(validated.data.company ?? "N/A");
  const sanitizedMessage = sanitizeMessage(validated.data.message);

  try {
    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: emailFrom,
      to: contactEmail,
      replyTo: sanitizedEmail,
      subject: `New contact request from ${sanitizedName}`,
      text: `Name: ${sanitizedName}
Email: ${sanitizedEmail}
Company: ${sanitizedCompany}

Message:
${sanitizedMessage}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message." },
        { status: 502, headers: responseHeaders }
      );
    }

    return NextResponse.json({ success: true }, { headers: responseHeaders });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500, headers: responseHeaders }
    );
  }
}

function validateContactPayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object") {
    return { success: false, error: "Invalid request payload." };
  }

  const body = payload as Record<string, unknown>;

  const name = normalizeText(body.name);
  const email = normalizeText(body.email);
  const company = normalizeText(body.company);
  const message = normalizeText(body.message);
  const captchaToken = normalizeText(body.captchaToken);

  if (!name || name.length < 2 || name.length > 120) {
    return { success: false, error: "Please provide a valid name." };
  }

  if (!email || email.length > 254 || !isValidEmail(email)) {
    return { success: false, error: "Please provide a valid email address." };
  }

  if (company && company.length > 120) {
    return { success: false, error: "Company name is too long." };
  }

  if (!message || message.length < 10 || message.length > 4000) {
    return {
      success: false,
      error: "Message must be between 10 and 4000 characters.",
    };
  }

  if (!captchaToken) {
    return { success: false, error: "Please complete the captcha challenge." };
  }

  return {
    success: true,
    data: {
      name,
      email,
      company,
      message,
      captchaToken,
    },
  };
}

function isHoneypotTriggered(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const website = normalizeText((payload as Record<string, unknown>).website);
  return Boolean(website);
}

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizeSingleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function sanitizeMessage(value: string): string {
  return value.replace(/\r/g, "").trim();
}

async function verifyTurnstileToken({
  token,
  secretKey,
  remoteIp,
}: {
  token: string;
  secretKey: string;
  remoteIp: string;
}): Promise<boolean> {
  try {
    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    if (remoteIp && remoteIp !== "unknown") {
      params.set("remoteip", remoteIp);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}
