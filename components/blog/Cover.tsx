import Image from "next/image";
import { blogCover } from "@/lib/hireAssets";
import { cn } from "@/lib/utils";

/**
 * A post's 1376×768 cover. Until the image exists, a soft sky gradient
 * holds the same space so layouts don't shift when it's added.
 */
const Cover = ({
  slug,
  alt,
  priority,
  sizes,
  className,
}: {
  slug: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) => {
  const src = blogCover(slug);
  return (
    <div
      className={cn(
        "relative aspect-1376/768 overflow-hidden rounded-4xl bg-linear-to-br from-sky-1 via-sky-2 to-sky-3",
        className,
      )}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      )}
    </div>
  );
};

export default Cover;
