import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", allow: "/" },
  sitemap: `${SITE.url}/sitemap.xml`,
});

export default robots;
