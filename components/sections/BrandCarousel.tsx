import Image from "next/image";
import { BRANDS } from "@/lib/constants";
import Container from "../ui/Container";

const BrandCarousel = () => (
  <Container isHeader className="bg-foreground py-12">
    <section
      id="brands"
      className="flex flex-wrap items-center justify-between gap-x-16 gap-y-8 px-6"
    >
      {BRANDS.map((brand) => (
        <Image
          key={brand.name}
          src={brand.logo}
          alt={brand.name}
          width={160}
          height={48}
          className="h-14 w-auto object-contain"
        />
      ))}
    </section>
  </Container>
);

export default BrandCarousel;
