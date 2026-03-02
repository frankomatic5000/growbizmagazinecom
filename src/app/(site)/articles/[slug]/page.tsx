import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import type { Metadata } from "next";
import { getArticleBySlug, getAllArticleSlugs, getLatestArticles, getArticlesByCategory } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import { ArticleBody } from "@/components/ArticleBody";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import { estimateReadTime } from "@/lib/utils";

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  const imageUrl = article.seo?.ogImage
    ? urlForImage(article.seo.ogImage).width(1200).height(630).url()
    : article.mainImage
    ? urlForImage(article.mainImage).width(1200).height(630).url()
    : undefined;
  return {
    title: article.seo?.metaTitle ?? article.title,
    description: article.seo?.metaDesc ?? article.excerpt,
    openGraph: {
      title: article.seo?.metaTitle ?? article.title,
      description: article.seo?.metaDesc ?? article.excerpt,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, latest] = await Promise.all([
    getArticleBySlug(slug),
    getLatestArticles(5),
  ]);

  if (!article) notFound();

  const relatedArticles = article.category?.slug
    ? await getArticlesByCategory(article.category.slug, 4)
    : [];
  const related = relatedArticles.filter((a) => a._id !== article._id).slice(0, 3);

  const dateStr = article.publishedAt
    ? format(new Date(article.publishedAt), "MMMM d, yyyy 'at' h:mm a", { locale: enUS })
    : "";

  const mainImageUrl = article.mainImage
    ? urlForImage(article.mainImage).width(1200).url()
    : null;

  const readTime = article.body ? estimateReadTime(article.body) : 1;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://growbizmagazine.com";
  const articleUrl = `${siteUrl}/articles/${article.slug}`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(article.title)}`,
  };

  return (
    <div className="news-container py-8">
      <div className="news-grid-main">
        {/* Article content */}
        <article className="lg:col-span-2 xl:col-span-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          {article.category && (
            <Link href={`/category/${article.category.slug}`}>
              <span className="news-category mb-4 inline-block">{article.category.title}</span>
            </Link>
          )}

          <h1 className="news-headline text-3xl md:text-4xl lg:text-5xl mb-4">{article.title}</h1>

          {article.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
            {article.author?.name && (
              <span className="font-medium text-foreground">{article.author.name}</span>
            )}
            {dateStr && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {dateStr}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readTime} min read
            </span>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-3 mb-8">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Share2 className="h-4 w-4" />
              Share:
            </span>
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
              aria-label="Share on Facebook">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:opacity-80 transition-opacity"
              aria-label="Share on Twitter">
              <Twitter className="h-4 w-4" />
            </a>
            <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-80 transition-opacity"
              aria-label="Share on LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>

          {mainImageUrl && (
            <figure className="mb-8">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={mainImageUrl}
                  alt={article.mainImage?.alt ?? article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  priority
                />
              </div>
            </figure>
          )}

          {article.body && <ArticleBody body={article.body} />}

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
              {article.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-muted text-sm rounded-full text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom share */}
          <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Share2 className="h-4 w-4" />Share:
            </span>
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
              aria-label="Share on Facebook"><Facebook className="h-4 w-4" /></a>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:opacity-80 transition-opacity"
              aria-label="Share on Twitter"><Twitter className="h-4 w-4" /></a>
            <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-80 transition-opacity"
              aria-label="Share on LinkedIn"><Linkedin className="h-4 w-4" /></a>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-primary">
                More from {article.category?.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((a) => (
                  <NewsCard key={a._id} article={a} />
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <NewsSidebar mostRead={latest} />
          </div>
        </div>
      </div>
    </div>
  );
}
