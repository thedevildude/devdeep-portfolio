import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { DEMO_VIDEO, SITE } from "@/lib/constants";
import { SERVICES } from "@/lib/services";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const posts = await getPosts();
  return [
    {
      url: SITE.url,
      changeFrequency: "monthly",
      priority: 1,
      videos: [
        {
          title: DEMO_VIDEO.name,
          description: DEMO_VIDEO.description,
          thumbnail_loc: `${SITE.url}${DEMO_VIDEO.poster}`,
          content_loc: `${SITE.url}${DEMO_VIDEO.src}`,
          duration: 18,
          publication_date: DEMO_VIDEO.uploadDate,
        },
      ],
    },
    {
      url: `${SITE.url}/blog`,
      lastModified: posts[0]?.updated,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...SERVICES.map((s) => ({
      url: `${SITE.url}/hire/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...posts.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: post.updated,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
};

export default sitemap;
