import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

type CardProps = { headline: string; description: string; href?: string };

/** Two-column layout: copy on the left, visual on the right. Placeholder content. */
const SplitCard = ({ headline, description, href = "#" }: CardProps) => (
  <div className="grid items-center gap-10 md:grid-cols-2">
    <div>
      <h3 className="text-2xl font-semibold uppercase sm:text-3xl lg:text-4xl">
        {headline}
      </h3>
      <p className="mt-6 max-w-md font-slab text-base">{description}</p>
      <a
        href={href}
        className="mt-8 inline-flex items-center gap-3 rounded-md bg-white/10 px-5 py-3 font-slab text-sm transition-colors hover:bg-white/20"
      >
        Read the case study <span aria-hidden>→</span>
      </a>
    </div>
    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
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
