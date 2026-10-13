/** Renders schema.org structured data. `<` is escaped so content can't close the script tag. */
const JsonLd = ({ data }: { data: Record<string, unknown> }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
);

export default JsonLd;
