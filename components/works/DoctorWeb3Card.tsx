import Link from "next/link";
import { PAPERS } from "@/lib/constants";
import DoctorWeb3Mock from "./DoctorWeb3Mock";

const STACK = [
  "Solidity",
  "Truffle",
  "Chainlink",
  "Ethers.js",
  "Ethereum",
  "IPFS",
  "React.js",
] as const;

const DESCRIPTION =
  "A platform for patients to share medical records with verified doctors and hospitals on Ethereum. Reports are encrypted before they reach IPFS, and Solidity contracts record who may receive each one, for how long, with Chainlink-backed verification.";

/** Two columns; the visual on the right runs the full height of the card, edge to edge. */
const DoctorWeb3Card = () => (
  <div className="grid flex-1 md:grid-cols-2">
    <div className="flex flex-col justify-between gap-8 px-5 pt-20 pb-8 sm:px-12 sm:pt-26 md:pr-10 lg:pl-16">
      <div>
        <h3 className="text-lg font-semibold uppercase sm:text-3xl lg:text-4xl">
          Decentralized medical records
        </h3>
        <p className="mt-6 font-slab text-sm sm:text-base">{DESCRIPTION}</p>
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
      <div className="flex flex-wrap gap-2">
        <Link
          href="/blog/doctorweb3-medical-records-on-ethereum"
          className="inline-flex items-center gap-3 rounded-md bg-current/10 px-5 py-2.5 font-slab text-sm transition-colors hover:bg-current/20"
        >
          Read case study <span aria-hidden>→</span>
        </Link>
        <a
          href={PAPERS.doctorweb3.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-md border border-current/50 px-5 py-2.5 font-slab text-sm transition-colors hover:bg-current/10"
        >
          IEEE paper <span aria-hidden>↗</span>
        </a>
      </div>
    </div>

    <div className="relative aspect-3/4 sm:aspect-4/3 md:aspect-auto md:min-h-60">
      <DoctorWeb3Mock />
    </div>
  </div>
);

export default DoctorWeb3Card;
