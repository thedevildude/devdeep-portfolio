import Image from "next/image";
import { BRANDS } from "@/lib/constants";
import Marquee from "./Marquee";

/** Intrinsic pixel size of each file in /public, so next/image reserves the right space. */
const SIZES: Record<string, { width: number; height: number }> = {
  "Capital Compute": { width: 722, height: 142 },
  Boom: { width: 960, height: 259 },
  "Open Healthcare Network": { width: 960, height: 360 },
  "eGov Foundation": { width: 665, height: 258 },
};

/** Enough repeats that one copy is wider than any viewport; the Marquee doubles it for the loop. */
const REPEATS = [0, 1, 2];

const LogoMarquee = () => (
  <section
    aria-labelledby="logo-marquee-title"
    className="bg-foreground/95 py-8 text-background sm:py-12"
  >
    <h2
      id="logo-marquee-title"
      className="mb-6 text-center text-xs font-semibold tracking-[0.3em] uppercase opacity-60 sm:mb-8 sm:text-sm"
    >
      Trusted by teams building real products
    </h2>
    <div className="mask-[linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
      <Marquee>
        {REPEATS.flatMap((set) =>
          BRANDS.map((brand) => {
            const { width, height } = SIZES[brand.name];
            return (
              <Image
                key={`${set}-${brand.name}`}
                src={brand.logo}
                alt={set === 0 ? `${brand.name} logo` : ""}
                title={set === 0 ? brand.name : undefined}
                width={width}
                height={height}
                sizes="160px"
                className="mx-10 h-9 w-auto shrink-0 object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:mx-16 sm:h-12"
              />
            );
          }),
        )}
      </Marquee>
    </div>
  </section>
);

export default LogoMarquee;
