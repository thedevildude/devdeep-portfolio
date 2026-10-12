import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

const STACK = [
  "AWS Lambda",
  "DynamoDB",
  "React.js",
  "Node.js",
  "TypeScript",
] as const;

const DESCRIPTION =
  "An agentic marketing platform that turns creator intake into on-brand campaign strategies and publishes them across 50+ channels, cutting setup from hours to minutes. A multi-play engine lets AI agents launch coordinated content across platforms in one operation.";

/** Two-column layout: copy on the left, visual on the right. */
const SignalFoundryCard = () => (
  <div className="grid items-stretch gap-10 md:grid-cols-2">
    <div className="flex flex-col justify-between gap-6">
      <div>
        <h3 className="text-2xl font-semibold uppercase sm:text-3xl lg:text-4xl">
          Agentic marketing platform
        </h3>
        <p className="mt-6 font-slab text-sm">{DESCRIPTION}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
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
      <a
        href="#"
        className="inline-flex items-center gap-3 self-start rounded-md bg-white/10 px-5 py-3 font-slab text-sm transition-colors hover:bg-white/20"
      >
        Read case study <span aria-hidden>→</span>
      </a>
    </div>
    <div className="relative min-h-60 w-full overflow-hidden rounded-xl">
      <Image
        src={PLACEHOLDER_IMAGE}
        alt="SignalFoundry"
        fill
        sizes="50vw"
        className="object-cover"
      />
    </div>
  </div>
);

export default SignalFoundryCard;
