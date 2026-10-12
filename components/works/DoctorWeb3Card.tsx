import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

const STACK = [
  "Solidity",
  "Hardhat",
  "Ethers.js",
  "Ethereum",
  "IPFS",
  "React.js",
] as const;

const DESCRIPTION =
  "A decentralized platform for patients and hospitals to store and share medical records on Ethereum. Records stay encrypted on IPFS, and Solidity smart contracts share the access passwords with authorized parties only.";

/** Two columns; the visual on the right runs the full height of the card, edge to edge. */
const DoctorWeb3Card = () => (
  <div className="grid flex-1 md:grid-cols-2">
    <div className="flex flex-col justify-between gap-8 px-6 pt-26 pb-8 sm:pl-12 md:pr-10 lg:pl-16">
      <div>
        <h3 className="text-2xl font-semibold uppercase sm:text-3xl lg:text-4xl">
          Decentralized medical records
        </h3>
        <p className="mt-6 font-slab text-base">{DESCRIPTION}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {STACK.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-current/10 px-2 py-0.5 text-xs"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
      <a
        href="#"
        className="inline-flex items-center gap-3 self-start rounded-md bg-current/10 px-5 py-3 font-slab text-sm transition-colors hover:bg-current/20"
      >
        Read case study <span aria-hidden>→</span>
      </a>
    </div>

    <div className="relative min-h-60">
      <Image
        src={PLACEHOLDER_IMAGE}
        alt="DoctorWeb3"
        fill
        sizes="50vw"
        className="object-cover"
      />
    </div>
  </div>
);

export default DoctorWeb3Card;
