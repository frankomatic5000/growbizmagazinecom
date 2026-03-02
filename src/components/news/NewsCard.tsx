import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import type { Article } from "@/lib/sanity/types";
import { urlForImage } from "@/lib/sanity/image";

interface NewsCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact" | "horizontal";
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
  const dateStr = article.publishedAt
    ? format(new Date(article.publishedAt), "MMMM d, yyyy", { locale: enUS })
    : "";

  const imageUrl = article.mainImage
    ? urlForImage(article.mainImage).width(800).height(450).url()
    : null;

  const categoryLabel = article.category?.title ?? "";
  const categorySlug = article.category?.slug ?? "";

  if (variant === "featured") {
    return (
      <article className="group relative overflow-hidden rounded-lg bg-card">
        <Link href={`/articles/${article.slug}`} className="block">
          <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={article.mainImage?.alt ?? article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            {categoryLabel && (
              <span className="news-category mb-3 inline-block">{categoryLabel}</span>
            )}
            <h2 className="news-headline news-headline-lg text-white mb-2">{article.title}</h2>
            {article.excerpt && (
              <p className="text-white/80 text-lg mb-3 line-clamp-2">{article.excerpt}</p>
            )}
            <div className="flex items-center gap-3 text-white/60 text-sm">
              {article.author?.name && <span>{article.author.name}</span>}
              {article.author?.name && dateStr && <span>•</span>}
              {dateStr && <time dateTime={article.publishedAt}>{dateStr}</time>}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="group news-card rounded-lg overflow-hidden">
        <Link href={`/articles/${article.slug}`} className="flex gap-4">
          <div className="relative w-32 md:w-40 flex-shrink-0 aspect-square overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={article.mainImage?.alt ?? article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="160px"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-xs">No image</span>
              </div>
            )}
          </div>
          <div className="flex-1 py-2 pr-4">
            {categoryLabel && (
              <span className="news-category text-xs mb-2 inline-block">{categoryLabel}</span>
            )}
            <h3 className="news-headline text-base md:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            {dateStr && <div className="news-meta"><time dateTime={article.publishedAt}>{dateStr}</time></div>}
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group py-3 border-b border-border last:border-0">
        <Link href={`/articles/${article.slug}`} className="block">
          <h3 className="news-headline text-base line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <div className="news-meta mt-1 flex items-center gap-2">
            {categoryLabel && (
              <Link href={`/category/${categorySlug}`} className="text-primary font-medium hover:underline">
                {categoryLabel}
              </Link>
            )}
            {categoryLabel && dateStr && <span>•</span>}
            {dateStr && <time dateTime={article.publishedAt}>{dateStr}</time>}
          </div>
        </Link>
      </article>
    );
  }

  // Default variant
  return (
    <article className="group news-card rounded-lg overflow-hidden">
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={article.mainImage?.alt ?? article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          {categoryLabel && (
            <span className="news-category mb-2 inline-block">{categoryLabel}</span>
          )}
          <h3 className="news-headline news-headline-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="news-subhead text-sm line-clamp-2 mb-3">{article.excerpt}</p>
          )}
          <div className="news-meta flex items-center gap-2">
            {article.author?.name && <span>{article.author.name}</span>}
            {article.author?.name && dateStr && <span>•</span>}
            {dateStr && <time dateTime={article.publishedAt}>{dateStr}</time>}
          </div>
        </div>
      </Link>
    </article>
  );
}
