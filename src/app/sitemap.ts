import { MetadataRoute } from "next";
import { getAllArticleSlugs, getAllCategories, getAllIssues } from "@/lib/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://growbizmagazine.com";

  let articleSlugs: { slug: string }[] = [];
  let categories: { slug: string }[] = [];
  let issues: { slug: string }[] = [];

  try {
    [articleSlugs, categories, issues] = await Promise.all([
      getAllArticleSlugs(),
      getAllCategories(),
      getAllIssues(),
    ]);
  } catch {
    // Sanity not configured yet — return static routes only
  }

  const articleUrls = articleSlugs.map(({ slug }) => ({
    url: `${baseUrl}/articles/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const issueUrls = issues.map((issue) => ({
    url: `${baseUrl}/issues/${issue.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    { url: baseUrl, changeFrequency: "hourly", priority: 1 },
    { url: `${baseUrl}/articles`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/mission`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/vision`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/values`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/editorial-principles`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    ...articleUrls,
    ...categoryUrls,
    ...issueUrls,
  ];
}
