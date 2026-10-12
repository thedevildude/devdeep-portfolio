"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HERO_IMAGES } from "@/lib/constants";

/**
 * The artwork, slowly pushing in toward its central starburst.
 * One of HERO_IMAGES is picked per visit; the pick happens after mount so server and client
 * markup agree, and the statically rendered page doesn't pin everyone to the same image.
 */
const HeroBackdrop = () => {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * HERO_IMAGES.length));
  }, []);

  if (index === null) return <div className="absolute inset-0" />;

  const { src, width, height, center } = HERO_IMAGES[index];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* An image-shaped box that covers the section, so overlays can use image percentages. */}
      <div
        style={{
          transformOrigin: `${center.x}% ${center.y}%`,
          aspectRatio: `${width} / ${height}`,
        }}
        className="animate-hero-drift absolute top-1/2 left-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default HeroBackdrop;
