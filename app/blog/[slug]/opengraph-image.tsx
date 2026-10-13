import { ImageResponse } from "next/og";
import { getPost, getPosts } from "@/lib/blog";
import { SITE } from "@/lib/constants";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const generateStaticParams = async () =>
  (await getPosts()).map(({ slug }) => ({ slug }));

const Image = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const post = await getPost((await params).slug);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#05070d",
        color: "#ffebeb",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, color: "#2f6bff" }}>
        {post?.tag.toUpperCase() ?? "BLOG"}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 72,
          fontWeight: 700,
          lineHeight: 1.08,
          textTransform: "uppercase",
        }}
      >
        {post?.title ?? SITE.name}
      </div>
      <div style={{ display: "flex", fontSize: 32, color: "#9aa4b8" }}>
        {SITE.name} · Full Stack Software Engineer
      </div>
    </div>,
    size,
  );
};

export default Image;
