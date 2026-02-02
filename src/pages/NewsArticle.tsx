import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import NewsHeader from '@/components/news/NewsHeader';
import NewsFooter from '@/components/news/NewsFooter';
import NewsSidebar from '@/components/news/NewsSidebar';
import { useArticles } from '@/hooks/useArticles';
import type { Article } from '@/hooks/useArticles';
import { Button } from '@/components/ui/button';
import { MagazineFlipbook } from '@/components/magazine/MagazineFlipbook';
import type { MagazineConfig, MagazinePage } from '@/types/magazine';

const categoryLabels: Record<string, string> = {
  culture_arts: 'Culture & Arts',
  education: 'Education',
  entrepreneurship_business: 'Entrepreneurship & Business',
  society_humanity: 'Society & Humanity',
  psychology_wellbeing: 'Psychology & Well-Being',
  sustainability_future: 'Sustainability & Future',
  lifestyle_purpose: 'Lifestyle with Purpose',
  events: 'Events',
  opinion_essays: 'Opinion & Essays',
  biographies: 'Biographies',
};

export default function NewsArticle() {
  const { id } = useParams<{ id: string }>();
  const { getArticleById, incrementViewCount } = useArticles();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;

      setIsLoading(true);
      const data = await getArticleById(id);
      setArticle(data);
      setIsLoading(false);

      // Increment view count
      if (data) {
        incrementViewCount(id);
      }
    };

    loadArticle();
  }, [id]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article?.title || '')}`,
    linkedin: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(article?.title || '')}`,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NewsHeader />
        <main className="news-container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="aspect-[16/9] bg-muted rounded-lg" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
        </main>
        <NewsFooter />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <NewsHeader />
        <main className="news-container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
        </main>
        <NewsFooter />
      </div>
    );
  }

  const formattedDate = format(new Date(article.created_at), "MMMM d, yyyy 'at' h:mm a", {
    locale: enUS,
  });

  // Check if this is a magazine layout article
  const isMagazineLayout = (article as any).is_magazine_layout === true;
  const magazinePages = (article as any).magazine_pages as MagazinePage[] | undefined;
  const hasMagazineContent = isMagazineLayout && magazinePages && magazinePages.length > 0;

  const magazineConfig: MagazineConfig = {
    pages: magazinePages || []
  };

  // For magazine layout, render full-width
  if (hasMagazineContent) {
    return (
      <div className="min-h-screen bg-background">
        <NewsHeader />

        <main className="news-container py-8">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          {/* Category */}
          <span className="news-category mb-4 inline-block">
            {categoryLabels[article.category] || article.category}
          </span>

          {/* Title */}
          <h1 className="news-headline text-3xl md:text-4xl lg:text-5xl mb-4">
            {article.title}
          </h1>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-xl text-muted-foreground mb-6">
              {article.subtitle}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
            <span className="font-medium text-foreground">{article.author}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.view_count} views
            </span>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-3 mb-8">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Share2 className="h-4 w-4" />
              Compartilhar:
            </span>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
              aria-label="Share on Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:opacity-80 transition-opacity"
              aria-label="Share on Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-80 transition-opacity"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>

          {/* Magazine Flipbook */}
          <MagazineFlipbook
            config={magazineConfig}
            articleTitle={article.title}
            articleSubtitle={article.subtitle || undefined}
            mainImage={article.main_image || undefined}
          />

          {/* Share buttons bottom */}
          <div className="mt-12 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Share2 className="h-4 w-4" />
                Compartilhar:
              </span>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:opacity-80 transition-opacity"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-80 transition-opacity"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </main>

        <NewsFooter />
      </div>
    );
  }

  // Standard article layout
  return (
    <div className="min-h-screen bg-background">
      <NewsHeader />

      <main className="news-container py-8">
        <div className="news-grid-main">
          {/* Article content */}
          <article className="lg:col-span-2">
            {/* Back button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            {/* Category */}
            <span className="news-category mb-4 inline-block">
              {categoryLabels[article.category] || article.category}
            </span>

            {/* Title */}
            <h1 className="news-headline text-3xl md:text-4xl lg:text-5xl mb-4">
              {article.title}
            </h1>

            {/* Subtitle */}
            {article.subtitle && (
              <p className="text-xl text-muted-foreground mb-6">
                {article.subtitle}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
              <span className="font-medium text-foreground">{article.author}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.view_count} views
              </span>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-3 mb-8">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Share2 className="h-4 w-4" />
                Share:
              </span>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:opacity-80 transition-opacity"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-80 transition-opacity"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>

            {/* Featured image */}
            {article.main_image && (
              <figure className="mb-8">
                <img
                  src={article.main_image}
                  alt={article.title}
                  className="w-full rounded-lg"
                />
              </figure>
            )}

            {/* Article body */}
            <div className="prose prose-lg max-w-none">
              {article.body.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-foreground mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Share buttons bottom */}
            <div className="mt-12 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Share2 className="h-4 w-4" />
                  Share:
                </span>
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:opacity-80 transition-opacity"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-80 transition-opacity"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <NewsSidebar />
          </div>
        </div>
      </main>

      <NewsFooter />
    </div>
  );
}