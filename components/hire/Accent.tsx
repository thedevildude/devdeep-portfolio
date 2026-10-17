/** Renders text with the *starred* phrase in the blue slab-serif accent. */
const Accent = ({ text }: { text: string }) =>
  text.split("*").map((part, i) =>
    i % 2 ? (
      <em
        key={i}
        className="font-slab font-light text-ink-blue not-italic"
      >
        {part}
      </em>
    ) : (
      part
    ),
  );

export default Accent;
