import Marquee from "@/components/ui/Marquee";
import { NAME } from "@/lib/constants";

const Name = () => (
  <section
    id="name"
    className="flex flex-col justify-center gap-8 bg-foreground py-16 sm:min-h-svh sm:gap-10 sm:py-24 text-bright-indigo"
  >
    <Marquee>
      <span className="whitespace-nowrap px-8 font-hindi text-[25vw] leading-[1.3] font-semibold tracking-[0.15em]">
        {NAME.hindi}
      </span>
    </Marquee>

    <div className="px-6 text-center">
      <h2 className="text-4xl font-hindi font-semibold sm:text-7xl lg:text-8xl uppercase">
        {NAME.english}
      </h2>
      <p className="mt-3 text-base font-light sm:mt-4 sm:text-3xl lg:text-4xl">
        (<span className="italic mr-3 sm:mr-5">pronounced</span>
        <span className="font-semibold">deyv.</span>deep)
      </p>
    </div>

    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-6 md:grid-cols-2 mt-6 text-base sm:mt-15 sm:text-2xl lg:text-3xl font-slab">
      <p>
        &ldquo;Devdeep&rdquo; translates to the Divine Lamp or Illumination of
        Wisdom, rooted in Sanskrit.
      </p>
      <p>
        The name symbolizes{" "}
        <span className="font-semibold">clarity, deep insight,</span> and
        illuminating complexity into simpleness.
      </p>
    </div>
  </section>
);

export default Name;
