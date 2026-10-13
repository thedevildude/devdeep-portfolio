import Link from "next/link";
import Image from "next/image";

const STACK = [
  "AWS Lambda",
  "DynamoDB",
  "React.js",
  "Node.js",
  "TypeScript",
] as const;

const DESCRIPTION =
  "An agentic marketing platform that turns creator intake into on-brand campaign strategies and publishes them across 50+ channels, cutting setup from hours to minutes. A multi-play engine lets AI agents launch coordinated content across platforms in one operation.";

/** Stacked below lg, then two columns; the visual on the right runs the full height of the card, edge to edge. */
const SignalFoundryCard = () => (
  <div className="grid flex-1 lg:grid-cols-2">
    <div className="flex flex-col justify-between gap-6 px-5 pt-20 pb-8 sm:px-12 sm:pt-26 lg:pr-10 lg:pl-16">
      <div>
        <h3 className="text-lg font-semibold uppercase sm:text-3xl xl:text-4xl">
          Agentic marketing platform
        </h3>
        <p className="mt-4 font-slab text-sm sm:mt-6 sm:text-base lg:text-sm xl:text-base">
          {DESCRIPTION}
        </p>
        <ul className="mt-4 flex sm:mt-6 flex-wrap gap-2">
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
      <Link
        href="/blog/signalfoundry-one-plan-many-plays"
        className="inline-flex items-center gap-3 self-start rounded-md bg-current/10 px-5 py-2.5 font-slab text-sm transition-colors hover:bg-current/20"
      >
        Read case study <span aria-hidden>→</span>
      </Link>
    </div>

    <div className="relative aspect-16/10 lg:aspect-auto lg:min-h-60">
      {/* Animated GIF: the optimizer would only flatten it, so serve it as-is. */}
      <Image
        loading="eager"
        src="/signalfoundry-demo.gif"
        alt="SignalFoundry product screens"
        fill
        unoptimized
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-contain"
      />
    </div>
  </div>
);

export default SignalFoundryCard;
