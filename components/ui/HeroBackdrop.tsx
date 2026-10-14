"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { HERO_IMAGES } from "@/lib/constants";

/**
 * The artwork, slowly pushing in toward its central starburst.
 * One of HERO_IMAGES is picked per visit; the pick happens after mount so server and client
 * markup agree, and the statically rendered page doesn't pin everyone to the same image.
 */
let picked: number | null = null;
const noopSubscribe = () => () => {};
const pickOnClient = () =>
  (picked ??= Math.floor(Math.random() * HERO_IMAGES.length));

const HeroBackdrop = () => {
  // Server snapshot is null, so hydration matches; the client then switches to the pick.
  const index = useSyncExternalStore(noopSubscribe, pickOnClient, () => null);

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
        {/* The box covers the section, so it is as wide as the viewport or as tall-times-ratio. */}
        <Image
          src={src}
          alt=""
          fill
          preload
          sizes={`max(100vw, ${Math.round((100 * width) / height)}vh)`}
          className="object-cover"
        />
      </div>
      {/* Dark wash so the artwork sits back behind the hero copy. */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

export default HeroBackdrop;
