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

/** Same layout as Boomshare: headline on top; below, a third for copy and two thirds for the visual. */
const VerityCard = () => (
  <div className="flex flex-1 flex-col px-5 pt-20 pb-6 sm:px-12 sm:pt-24 lg:px-16">
    <h3 className="text-left text-xl font-semibold uppercase sm:text-3xl lg:text-4xl">
      Serverless QA platform
    </h3>

    <div className="mt-6 grid flex-1 items-stretch gap-8 lg:grid-cols-3">
      <div className="flex flex-col justify-between gap-6">
        <div>
          <p className="font-slab text-base">{DESCRIPTION}</p>
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

      <div className="relative aspect-video overflow-hidden lg:aspect-auto lg:min-h-52 ring-1 ring-current/15 lg:col-span-2">
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
