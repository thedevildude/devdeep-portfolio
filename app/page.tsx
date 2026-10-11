import type { Metadata } from "next";
import { HOMEPAGE_METADATA } from "@/lib/constants";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import BrandCarousel from "@/components/sections/BrandCarousel";
import Open from "@/components/sections/Open";
import Works from "@/components/sections/Works";

export const metadata: Metadata = {
  title: HOMEPAGE_METADATA.title,
  description: HOMEPAGE_METADATA.description,
  keywords: [...HOMEPAGE_METADATA.keywords],
  openGraph: {
    title: HOMEPAGE_METADATA.title,
    description: HOMEPAGE_METADATA.description,
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="relative z-10 bg-background">
          <Intro />
          <BrandCarousel />
          <Open />
          <Works />
        </div>
      </main>
      <Footer />
    </>
  );
}
