"use client";

import { useState } from "react";

export default function ContactForm() {
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");

        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            company: formData.get("company"),
            message: formData.get("message"),
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setStatus("success");
                form.reset();
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            className="mt-12 space-y-5 sm:mt-16 sm:space-y-6"
            noValidate
            onSubmit={handleSubmit}
        >
            <Input label="Name" placeholder="Your full name" />
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input
                label="Company"
                placeholder="Company or startup name"
                required={false}
            />
            <Textarea
                label="Message"
                placeholder="Tell us briefly about your project, challenge, or idea."
            />

            <div className="pt-2 sm:pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[44px] rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                >
                    {loading ? "Sending…" : "Send Message"}
                </button>
            </div>

            {status === "success" && (
                <p className="text-sm text-emerald-600">
                    Thanks for reaching out. We’ve received your message and will get back
                    to you shortly.
                </p>
            )}

            {status === "error" && (
                <p className="text-sm text-red-600">
                    Something went wrong while sending your message. Please try again or
                    email us directly.
                </p>
            )}
        </form>
    );
}

/* ---------- Input Component ---------- */

function Input({
                   label,
                   type = "text",
                   placeholder,
                   required = true,
               }: {
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
}) {
    const id = label.toLowerCase().replace(/\s+/g, "-");

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                required={required}
                className="mt-2 w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
        </div>
    );
}

/* ---------- Textarea Component ---------- */

function Textarea({
                      label,
                      placeholder,
                  }: {
    label: string;
    placeholder?: string;
}) {
    const id = label.toLowerCase().replace(/\s+/g, "-");

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            <textarea
                id={id}
                name={id}
                rows={5}
                required
                placeholder={placeholder}
                className="mt-2 w-full min-h-[120px] rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
        </div>
    );
}
