/** Renders text with the *starred* phrase in the italic serif accent. */
const Accent = ({ text }: { text: string }) =>
  text.split("*").map((part, i) =>
    i % 2 ? (
      <em
        key={i}
        className="font-display-serif text-[1.08em] font-normal text-ink-blue italic"
      >
        {part}
      </em>
    ) : (
      part
    ),
  );

export default Accent;
