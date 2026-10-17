/** Renders text with the *starred* phrase in light italic deep blue. */
const Accent = ({ text }: { text: string }) =>
  text.split("*").map((part, i) =>
    i % 2 ? (
      <em key={i} className="font-accent font-light text-ink-blue italic">
        {part}
      </em>
    ) : (
      part
    ),
  );

export default Accent;
