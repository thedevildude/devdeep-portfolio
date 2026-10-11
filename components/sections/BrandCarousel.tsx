"use client";

import { motion } from "motion/react";
import { BRANDS } from "@/lib/constants";

const BrandCarousel = () => (
  <section id="brands" className="overflow-hidden border-y border-border py-12">
    <motion.div
      className="flex w-max gap-16"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 25, ease: "linear", repeat: Infinity }}
    >
      {[...BRANDS, ...BRANDS].map((brand, i) => (
        <span key={i} className="whitespace-nowrap text-2xl font-medium text-muted">
          {brand}
        </span>
      ))}
    </motion.div>
  </section>
);

export default BrandCarousel;
