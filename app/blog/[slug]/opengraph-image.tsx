import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getPost, getPosts } from "@/lib/blog";
import { SITE } from "@/lib/constants";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const generateStaticParams = async () =>
  (await getPosts()).map(({ slug }) => ({ slug }));

/** The cover as a JPEG data URL (the OG renderer can't read WebP), or null. */
const coverData = async (slug: string) => {
  const file = path.join(process.cwd(), "public/blog", slug, "cover.jpg");
  if (!existsSync(file)) return null;
  return `data:image/jpeg;base64,${(await readFile(file)).toString("base64")}`;
};

const Image = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const post = await getPost(slug);
  const cover = await coverData(slug);
  const name = post?.title.split(": ")[0] ?? SITE.name;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "linear-gradient(180deg, #cbeeff 0%, #85cef2 100%)",
        color: "#050811",
      }}
    >
      {cover && (
        <img
          src={cover}
          alt=""
          width={1200}
          height={670}
          style={{ position: "absolute", inset: 0, objectFit: "cover" }}
        />
      )}
      <div
        style={{
          position: "absolute",
          right: 48,
          top: 48,
          display: "flex",
          flexDirection: "column",
          maxWidth: 620,
          padding: "36px 44px",
          borderRadius: 36,
          background: "rgba(255,255,255,0.92)",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#1030ae" }}>
          {post?.tag ?? "Blog"}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 10,
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontSize: 26,
            color: "#4e5058",
          }}
        >
          {SITE.name}, senior software engineer
        </div>
      </div>
    </div>,
    size,
  );
};

export default Image;
