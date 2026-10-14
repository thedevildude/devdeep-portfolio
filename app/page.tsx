import type { Metadata } from "next";
import { DEMO_VIDEO, HOMEPAGE_METADATA, LINKS, SITE } from "@/lib/constants";
import JsonLd from "@/components/ui/JsonLd";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import BrandCarousel from "@/components/sections/BrandCarousel";
import Name from "@/components/sections/Name";
import Works from "@/components/sections/Works";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: HOMEPAGE_METADATA.title,
  description: HOMEPAGE_METADATA.description,
  keywords: [...HOMEPAGE_METADATA.keywords],
  alternates: { canonical: "/" },
  openGraph: {
    title: HOMEPAGE_METADATA.title,
    description: HOMEPAGE_METADATA.description,
  },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Devdeep Ghosh",
          url: SITE.url,
          jobTitle: "Senior Full Stack Software Engineer",
          description: HOMEPAGE_METADATA.description,
          address: { "@type": "PostalAddress", addressCountry: "IN" },
          knowsAbout: [...HOMEPAGE_METADATA.keywords],
          sameAs: [LINKS.linkedin, LINKS.github, LINKS.twitter],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: DEMO_VIDEO.name,
          description: DEMO_VIDEO.description,
          thumbnailUrl: [`${SITE.url}${DEMO_VIDEO.poster}`],
          uploadDate: DEMO_VIDEO.uploadDate,
          duration: DEMO_VIDEO.duration,
          contentUrl: `${SITE.url}${DEMO_VIDEO.src}`,
          width: DEMO_VIDEO.width,
          height: DEMO_VIDEO.height,
          inLanguage: "en",
        }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="relative z-10 bg-background">
          <Intro />
          <BrandCarousel />
          <Name />
          <Works />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
