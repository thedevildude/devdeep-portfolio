import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

type CardProps = { headline: string; description: string; href?: string };

/** Two columns; the visual on the right runs the full height of the card. Placeholder content. */
const SplitCard = ({ headline, description, href = "#" }: CardProps) => (
  <div className="grid flex-1 md:grid-cols-2">
    <div className="flex flex-col justify-between gap-8 px-6 pt-26 pb-8 sm:pl-12 md:pr-10 lg:pl-16">
      <div>
        <h3 className="text-2xl font-semibold uppercase sm:text-3xl lg:text-4xl">
          {headline}
        </h3>
        <p className="mt-6 max-w-md font-slab text-base">{description}</p>
      </div>
      <a
        href={href}
        className="inline-flex items-center gap-3 self-start rounded-md bg-current/10 px-5 py-3 font-slab text-sm transition-colors hover:bg-current/20"
      >
        Read case study <span aria-hidden>→</span>
      </a>
    </div>

    <div className="relative min-h-60">
      <Image
        src={PLACEHOLDER_IMAGE}
        alt={headline}
        fill
        sizes="50vw"
        className="object-cover"
      />
    </div>
  </div>
);

export default SplitCard;
