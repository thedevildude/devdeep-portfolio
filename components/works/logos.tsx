import Image from "next/image";

/** Logos for the top-left spot of each work card, all real image files in /public. */

export const BoomLogo = () => (
  <Image
    src="/boom-logo.png"
    alt="Boom"
    width={960}
    height={259}
    className="h-12 w-auto brightness-0 invert"
  />
);

export const SignalFoundryLogo = () => (
  <Image
    src="/signalfoundry-mark.png"
    alt="SignalFoundry"
    width={1576}
    height={341}
    className="h-12 w-auto"
  />
);

export const VerityLogo = () => (
  <Image
    src="/verity-mark.png"
    alt="Verity"
    width={943}
    height={345}
    className="h-12 w-auto"
  />
);
