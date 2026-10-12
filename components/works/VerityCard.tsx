import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

const STACK = [
  "AWS Lambda",
  "DynamoDB",
  "Step Functions",
  "GitHub Workflows",
  "React.js",
  "TypeScript",
] as const;

const DESCRIPTION =
  "A serverless QA platform on AWS with Playwright automation and 92% test coverage. An AI jury scores findings and fingerprint deduplication removes repeat issues, cutting QA noise.";

/** Full-width headline on top; below, a third for copy and two thirds for the visual. */
const VerityCard = () => (
  <div>
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <h3 className="text-left text-2xl font-semibold uppercase sm:text-3xl lg:text-4xl">
        Serverless QA platform
      </h3>
      <ul className="flex flex-wrap gap-2">
        {STACK.map((tech) => (
          <li
            key={tech}
            className="rounded-full bg-white/10 px-2 py-0.5 text-xs"
          >
            {tech}
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-6 grid items-stretch gap-8 md:grid-cols-3">
      <div className="flex flex-col justify-between gap-6">
        <div>
          <p className="font-slab text-sm">{DESCRIPTION}</p>
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-3 self-start rounded-md bg-white/10 px-5 py-3 font-slab text-sm transition-colors hover:bg-white/20"
        >
          Read case study <span aria-hidden>→</span>
        </a>
      </div>
      <div className="relative min-h-60 w-full overflow-hidden rounded-xl md:col-span-2">
        <Image
          src={PLACEHOLDER_IMAGE}
          alt="Verity"
          fill
          sizes="66vw"
          className="object-cover"
        />
      </div>
    </div>
  </div>
);

export default VerityCard;
