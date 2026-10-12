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

/** Two columns; the visual on the right runs the full height of the card, edge to edge. */
const SignalFoundryCard = () => (
  <div className="grid flex-1 md:grid-cols-2">
    <div className="flex flex-col justify-between gap-8 px-5 pt-20 pb-8 sm:px-12 sm:pt-26 md:pr-10 lg:pl-16">
      <div>
        <h3 className="text-xl font-semibold uppercase sm:text-3xl lg:text-4xl">
          Agentic marketing platform
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

    <div className="relative aspect-video md:aspect-auto md:min-h-60">
      <Image
        src={PLACEHOLDER_IMAGE}
        alt="SignalFoundry"
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  </div>
);

export default SignalFoundryCard;
