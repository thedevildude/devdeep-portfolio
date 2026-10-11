import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Section from "@/components/ui/Section";
import { SITE } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <Section id="hero">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
            {SITE.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{SITE.description}</p>
        </Section>
        <Section id="work" title="Work">
          <p className="text-muted">Projects coming soon.</p>
        </Section>
        <Section id="contact" title="Contact">
          <p className="text-muted">Get in touch.</p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
