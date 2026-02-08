import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { name, email, company, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await resend.emails.send({
            from: "FBT Website <onboarding@resend.dev>",
            to: process.env.CONTACT_EMAIL!,
            replyTo: email,
            subject: `New contact request from ${name}`,
            text: `
Name: ${name}
Email: ${email}
Company: ${company || "N/A"}

Message:
${message}
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
