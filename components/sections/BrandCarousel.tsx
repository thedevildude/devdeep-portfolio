import Image from "next/image";
import { BRANDS } from "@/lib/constants";
import Container from "../ui/Container";

const BrandCarousel = () => (
  <Container isHeader className="bg-foreground/95 py-8 sm:py-12">
    <section
      id="brands"
      className="grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-6 px-0 sm:flex sm:flex-wrap sm:justify-between sm:gap-x-16 sm:gap-y-8 sm:px-6"
    >
      {BRANDS.map((brand) => (
        <Image
          key={brand.name}
          src={brand.logo}
          alt={brand.name}
          width={160}
          height={48}
          className="h-10 w-auto sm:h-14 object-contain"
        />
      ))}
    </section>
  </Container>
);

export default BrandCarousel;
