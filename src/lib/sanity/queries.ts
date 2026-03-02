import { groq } from "next-sanity";
import { client } from "./client";
import type { Article, Author, Category, Issue, AdvertBanner, SiteSettings } from "./types";

const articleCardFields = groq`
  _id, title,
  "slug": slug.current,
  publishedAt, excerpt, featured, headline, sponsored,
  mainImage { asset, hotspot, alt },
  "author": author-> { name, "slug": slug.current, image },
  "category": category-> { title, "slug": slug.current, color }
`;

export async function getFeaturedArticles(limit = 5): Promise<Article[]> {
  return client.fetch(
    groq`*[_type == "article" && status == "published" && featured == true] | order(publishedAt desc) [0...$limit] { ${articleCardFields} }`,
    { limit },
    { next: { tags: ["article"] } }
  );
}

export async function getHeadlineArticle(): Promise<Article | null> {
  return client.fetch(
    groq`*[_type == "article" && status == "published" && headline == true] | order(publishedAt desc) [0] { ${articleCardFields} }`,
    {},
    { next: { tags: ["article"] } }
  );
}

export async function getLatestArticles(limit = 12): Promise<Article[]> {
  return client.fetch(
    groq`*[_type == "article" && status == "published"] | order(publishedAt desc) [0...$limit] { ${articleCardFields} }`,
    { limit },
    { next: { tags: ["article"] } }
  );
}

export async function getArticlesByCategory(slug: string, limit = 12): Promise<Article[]> {
  return client.fetch(
    groq`*[_type == "article" && status == "published" && category->slug.current == $slug] | order(publishedAt desc) [0...$limit] { ${articleCardFields} }`,
    { slug, limit },
    { next: { tags: ["article"] } }
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return client.fetch(
    groq`*[_type == "article" && slug.current == $slug][0] {
      _id, title, "slug": slug.current, publishedAt, excerpt, featured, headline, sponsored, tags,
      mainImage { asset, hotspot, alt },
      body,
      "author": author-> { name, "slug": slug.current, image, role, bio, socialLinks },
      "category": category-> { title, "slug": slug.current, color },
      "issue": issue-> { title, "slug": slug.current, issueNumber },
      seo
    }`,
    { slug },
    { next: { tags: ["article"] } }
  );
}

export async function getAllArticleSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(
    groq`*[_type == "article" && status == "published"] { "slug": slug.current }`,
    {},
    { next: { tags: ["article"] } }
  );
}

export async function searchArticles(query: string): Promise<Article[]> {
  return client.fetch(
    groq`*[_type == "article" && status == "published" && [title, excerpt] match $searchText] | order(publishedAt desc) [0...20] { ${articleCardFields} }`,
    { searchText: `*${query}*` }
  );
}

export async function getArticlesByAuthor(authorSlug: string, limit = 12): Promise<Article[]> {
  return client.fetch(
    groq`*[_type == "article" && status == "published" && author->slug.current == $authorSlug] | order(publishedAt desc) [0...$limit] { ${articleCardFields} }`,
    { authorSlug, limit },
    { next: { tags: ["article"] } }
  );
}

export async function getAllCategories(): Promise<Category[]> {
  return client.fetch(
    groq`*[_type == "category"] | order(title asc) { _id, title, "slug": slug.current, description, color }`,
    {},
    { next: { tags: ["category"] } }
  );
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return client.fetch(
    groq`*[_type == "category" && slug.current == $slug][0] { _id, title, "slug": slug.current, description, color }`,
    { slug },
    { next: { tags: ["category"] } }
  );
}

export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
  return client.fetch(groq`*[_type == "category"] { "slug": slug.current }`);
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  return client.fetch(
    groq`*[_type == "author" && slug.current == $slug][0] { _id, name, "slug": slug.current, image, role, bio, socialLinks }`,
    { slug },
    { next: { tags: ["author"] } }
  );
}

export async function getAllAuthorSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(groq`*[_type == "author"] { "slug": slug.current }`);
}

export async function getAllIssues(): Promise<Issue[]> {
  return client.fetch(
    groq`*[_type == "issue"] | order(publishDate desc) { _id, title, "slug": slug.current, issueNumber, volume, publishDate, coverImage, description, pdfUrl, featured }`,
    {},
    { next: { tags: ["issue"] } }
  );
}

export async function getLatestIssue(): Promise<Issue | null> {
  return client.fetch(
    groq`*[_type == "issue"] | order(publishDate desc) [0] { _id, title, "slug": slug.current, issueNumber, coverImage, publishDate, pdfUrl }`,
    {},
    { next: { tags: ["issue"] } }
  );
}

export async function getIssueBySlug(slug: string): Promise<Issue | null> {
  return client.fetch(
    groq`*[_type == "issue" && slug.current == $slug][0] { _id, title, "slug": slug.current, issueNumber, volume, publishDate, coverImage, description, pdfUrl }`,
    { slug },
    { next: { tags: ["issue"] } }
  );
}

export async function getAllIssueSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(groq`*[_type == "issue"] { "slug": slug.current }`);
}

export async function getAdsByPlacement(placement: string): Promise<AdvertBanner[]> {
  return client.fetch(
    groq`*[_type == "advertBanner" && placement == $placement && active == true] { _id, title, image, linkUrl, placement }`,
    { placement },
    { next: { tags: ["advertBanner"] } }
  );
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return client.fetch(
    groq`*[_type == "siteSettings"][0] { siteName, tagline, logoLight, logoDark, socialLinks, seo, footerText }`,
    {},
    { next: { tags: ["siteSettings"] } }
  );
}
