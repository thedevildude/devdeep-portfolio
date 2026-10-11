import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import BrandCarousel from "@/components/sections/BrandCarousel";
import Open from "@/components/sections/Open";
import Works from "@/components/sections/Works";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Intro />
        <BrandCarousel />
        <Open />
        <Works />
      </main>
      <Footer />
    </>
  );
}
