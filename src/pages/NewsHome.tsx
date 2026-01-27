import { useEffect, useState } from 'react';
import NewsHeader from '@/components/news/NewsHeader';
import NewsFooter from '@/components/news/NewsFooter';
import NewsCard from '@/components/news/NewsCard';
import NewsSidebar from '@/components/news/NewsSidebar';
import EmptyState from '@/components/news/EmptyState';
import { useArticles } from '@/hooks/useArticles';
import type { Article } from '@/hooks/useArticles';

export default function NewsHome() {
  const { articles, isLoading, fetchArticles } = useArticles();
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [secondaryArticles, setSecondaryArticles] = useState<Article[]>([]);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles(true);
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      // First article is featured
      setFeaturedArticle(articles[0]);
      // Next 4 are secondary
      setSecondaryArticles(articles.slice(1, 5));
      // Rest are other articles
      setOtherArticles(articles.slice(5));
    } else {
      setFeaturedArticle(null);
      setSecondaryArticles([]);
      setOtherArticles([]);
    }
  }, [articles]);

  return (
    <div className="min-h-screen bg-background">
      <NewsHeader />

      <main className="news-container py-8">
        {isLoading ? (
          <div className="animate-pulse space-y-8">
            <div className="aspect-[21/9] bg-muted rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[16/10] bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <section className="mb-8">
                <NewsCard article={featuredArticle} variant="featured" />
              </section>
            )}

            {/* Main content grid */}
            <div className="news-grid-main">
              {/* Left column - Articles */}
              <div className="lg:col-span-2 space-y-8">
                {/* Secondary articles grid */}
                {secondaryArticles.length > 0 && (
                  <section>
                    <div className="news-grid-2col">
                      {secondaryArticles.map((article) => (
                        <NewsCard key={article.id} article={article} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Other articles */}
                {otherArticles.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-4 pb-2 border-b border-border">
                      Mais Notícias
                    </h2>
                    <div className="space-y-4">
                      {otherArticles.map((article) => (
                        <NewsCard
                          key={article.id}
                          article={article}
                          variant="horizontal"
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Right column - Sidebar */}
              <div className="lg:col-span-1">
                <NewsSidebar />
              </div>
            </div>
          </>
        )}
      </main>

      <NewsFooter />
    </div>
  );
}
