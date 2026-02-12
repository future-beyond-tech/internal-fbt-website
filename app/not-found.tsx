import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:text-sm">
        Error 404
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-sm text-slate-600 dark:text-slate-400 sm:text-base">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-50 px-6 py-3 text-sm font-medium text-white dark:text-slate-900 transition-colors hover:bg-slate-800 dark:hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
      >
        Back to home
      </Link>
    </div>
  );
}
