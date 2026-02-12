import Link from "next/link";
import Container from "@/components/layout/Container";

export default function CTA() {
    return (
        <section className="py-20 sm:py-28 lg:py-36 bg-slate-900 dark:bg-slate-950 text-white" aria-labelledby="cta-heading">
            <Container>
                <div className="text-center">
                    <h2 id="cta-heading" className="text-xl font-semibold text-white sm:text-2xl">
                        Let&rsquo;s build technology that lasts.
                    </h2>
                    <p className="mt-4 max-w-xl mx-auto text-sm text-slate-300 dark:text-slate-400 sm:text-base">
                        Start a conversation with FBT — thoughtful, practical, and
                        pressure-free.
                    </p>

                    <div className="mt-8">
                        <Link
                            href="/contact"
                            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-white dark:bg-slate-50 px-6 py-3 text-sm font-medium text-slate-900 dark:text-slate-950 transition-colors hover:bg-slate-100 dark:hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-white dark:focus-visible:ring-slate-50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 dark:focus-visible:ring-offset-slate-950"
                        >
                            Contact FBT
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
