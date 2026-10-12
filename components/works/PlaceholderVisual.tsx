import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

const PlaceholderVisual = ({ alt }: { alt: string }) => (
  <div className="relative aspect-video w-full overflow-hidden rounded-xl">
    <Image
      src={PLACEHOLDER_IMAGE}
      alt={alt}
      fill
      sizes="50vw"
      className="object-cover"
    />
  </div>
);

export default PlaceholderVisual;
