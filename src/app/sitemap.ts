import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * Uma página só, que é o domínio inteiro.
 *
 * O painel do Keystatic e a API dele ficam de fora pelo robots.txt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, changeFrequency: "weekly", priority: 1 }];
}
