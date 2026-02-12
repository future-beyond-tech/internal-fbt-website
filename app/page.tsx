import Hero from "@/components/home/Hero";
import Capabilities from "@/components/home/Capabilities";
import HowWeWorkPreview from "@/components/home/HowWeWorkPreview";
import CTA from "@/components/home/CTA";
import { defaultMetadata } from "@/lib/seo";

export const metadata = defaultMetadata(
  "Home",
  "Secure, scalable, and intelligent software engineering for startups and security-critical organizations.",
  "/"
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <HowWeWorkPreview />
      <CTA />
    </>
  );
}
