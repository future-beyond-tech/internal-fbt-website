import Container from "@/components/layout/Container";
import { defaultMetadata } from "@/lib/seo";

export const metadata = defaultMetadata(
  "Services",
  "Secure, scalable, and intelligent software engineering for startups and security-critical organizations.",
  "/services"
);
export default function ServicesPage() {
    return (
        <section className="py-20 sm:py-24 lg:py-32" aria-labelledby="services-heading">
            <Container>
                <div className="space-y-12 sm:space-y-16">
                    <header className="text-center">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:text-sm">
                            Offerings
                        </p>
                        <h1 id="services-heading" className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
                            Our Services
                        </h1>
                        <p className="mt-3 max-w-2xl mx-auto text-sm text-slate-600 dark:text-slate-400 sm:mt-4 sm:text-base">
                            We help organizations build secure, scalable, and intelligent
                            systems — designed for longevity, not shortcuts.
                        </p>
                    </header>

                    <div className="grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-2">
                    <Service
                        title="Product Engineering"
                        description="We design and build production-grade software products using clean architecture, modern stacks, and scalable system design."
                    />
                    <Service
                        title="Security & Vulnerability Engineering"
                        description="We identify and mitigate risks early through threat modeling, vulnerability assessment, and secure-by-design practices."
                    />
                    <Service
                        title="AI Automation"
                        description="We apply AI responsibly to automate analysis, decision support, and security workflows — enhancing human expertise."
                    />
                    <Service
                        title="Architecture & Consulting"
                        description="We guide teams in making the right technical decisions early, avoiding costly rewrites and architectural debt."
                    />
                    </div>
                </div>
            </Container>
        </section>
    );
}

function Service({
                     title,
                     description,
                 }: {
    title: string;
    description: string;
}) {
    return (
        <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow sm:p-8 hover:shadow-md">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 sm:text-xl">{title}</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 sm:mt-4 sm:text-base leading-relaxed">{description}</p>
        </article>
    );
}
