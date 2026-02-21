"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: Record<string, string | number>
    ) => void;
  }
}

type ShareButtonProps = {
  text: string;
  url: string;
  className?: string;
  quoteId?: string;
};

function trackShare(platform: string, quoteId: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "quote_shared", {
    platform,
    quote_id: quoteId,
  });
}

export default function ShareButton({
  text,
  url,
  className,
  quoteId = "engineering_authority_v1",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  function openPopup(href: string) {
    window.open(href, "_blank", "noopener,noreferrer,width=640,height=520");
  }

  function handleShareX() {
    openPopup(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`);
    trackShare("x", quoteId);
    setOpen(false);
  }

  function handleShareLinkedIn() {
    openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`);
    trackShare("linkedin", quoteId);
    setOpen(false);
  }

  async function handleCopy() {
    const payload = `${text}\n\n${url}`;

    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      trackShare("clipboard", quoteId);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API may be unavailable in certain browser contexts.
      trackShare("clipboard_failed", quoteId);
    }

    setOpen(false);
  }

  async function handleNativeShare() {
    if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
      return;
    }

    try {
      await navigator.share({ text, url });
      trackShare("native", quoteId);
    } catch {
      // User canceled native share.
    }
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="text-sm">Share this</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="menu"
            className="absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
          >
            {canNativeShare && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                Share using device
              </button>
            )}
            <button
              type="button"
              onClick={handleShareX}
              className="mt-1 flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Share on X
            </button>
            <button
              type="button"
              onClick={handleShareLinkedIn}
              className="mt-1 flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Share on LinkedIn
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-1 flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              {copied ? "Copied" : "Copy quote"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
