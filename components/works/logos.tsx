import Image from "next/image";

/** Logos for the top-left spot of each work card, all real image files in /public. */

export const BoomLogo = () => (
  <Image
    loading="eager"
    src="/boom-logo.png"
    alt="Boom"
    width={960}
    height={259}
    className="h-8 w-auto sm:h-12 brightness-0 invert"
  />
);

export const SignalFoundryLogo = () => (
  <Image
    loading="eager"
    src="/signalfoundry-mark.png"
    alt="SignalFoundry"
    width={1576}
    height={341}
    className="h-8 w-auto sm:h-12"
  />
);

export const VerityLogo = () => (
  <Image
    loading="eager"
    src="/verity-mark.png"
    alt="Verity"
    width={943}
    height={345}
    className="h-8 w-auto sm:h-12"
  />
);

export const DoctorWeb3Logo = () => (
  <Image
    loading="eager"
    src="/doctorweb3-mark.png"
    alt="DoctorWeb3"
    width={1369}
    height={345}
    className="h-8 w-auto sm:h-12"
  />
);
