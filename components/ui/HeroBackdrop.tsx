import Image from "next/image";
import { HeroImage } from "@/lib/constants";

/**
 * Positions are percentages of the image box, read off the 1672×941 artwork, so the
 * overlays stay on their stars at any viewport size.
 */
const CENTER = { x: 61.8, y: 48.9 };

/** The artwork, slowly pushing in toward its central starburst, with a softly pulsing core. */
const HeroBackdrop = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* An image-shaped box that covers the section, so overlays can use image percentages. */}
    <div
      style={{ transformOrigin: `${CENTER.x}% ${CENTER.y}%` }}
      className="animate-hero-drift absolute top-1/2 left-1/2 aspect-[1672/941] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
    >
      <Image
        src={HeroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div
        className="animate-hero-pulse absolute aspect-square w-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
        style={{
          left: `${CENTER.x}%`,
          top: `${CENTER.y}%`,
          background:
            "radial-gradient(circle, rgba(255,240,255,0.95) 0%, rgba(214,170,255,0.4) 35%, rgba(214,170,255,0) 68%)",
        }}
      />
    </div>
  </div>
);

export default HeroBackdrop;
