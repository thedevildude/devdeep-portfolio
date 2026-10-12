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
  <div className="flex-1 px-6 pt-26 pb-8 sm:px-12 lg:px-16">
    <h3 className="text-left text-2xl font-semibold uppercase sm:text-3xl lg:text-4xl">
      Serverless QA platform
    </h3>

    <div className="mt-8 grid items-stretch gap-8 md:grid-cols-3">
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

      <div className="relative aspect-video w-full overflow-hidden ring-1 ring-current/15 md:col-span-2">
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
