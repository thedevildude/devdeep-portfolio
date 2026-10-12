import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

type CardProps = { headline: string; description: string; href?: string };

/** Full-width, left-aligned headline on top; below, a third for copy and two thirds for the visual. Placeholder content. */
const StackedCard = ({ headline, description, href = "#" }: CardProps) => (
  <div>
    <h3 className="text-left text-3xl font-semibold uppercase sm:text-4xl lg:text-5xl">
      {headline}
    </h3>

    <div className="mt-8 grid items-center gap-8 md:grid-cols-3">
      <div>
        <p className="font-slab text-lg">{description}</p>
        <a
          href={href}
          className="mt-6 inline-flex items-center gap-3 rounded-md bg-white/10 px-5 py-3 font-slab text-base transition-colors hover:bg-white/20"
        >
          Read the case study <span aria-hidden>→</span>
        </a>
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl md:col-span-2">
        <Image
          src={PLACEHOLDER_IMAGE}
          alt={headline}
          fill
          sizes="66vw"
          className="object-cover"
        />
      </div>
    </div>
  </div>
);

export default StackedCard;
