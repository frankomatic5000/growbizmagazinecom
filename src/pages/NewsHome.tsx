import { useEffect, useState } from 'react';
import NewsHeader from '@/components/news/NewsHeader';
import NewsFooter from '@/components/news/NewsFooter';
import NewsCard from '@/components/news/NewsCard';
import NewsSidebar from '@/components/news/NewsSidebar';
import EmptyState from '@/components/news/EmptyState';
import FeaturedCarousel from '@/components/news/FeaturedCarousel';
import { useArticles } from '@/hooks/useArticles';
import type { Article } from '@/hooks/useArticles';

export default function NewsHome() {
  const { articles, isLoading, fetchArticles } = useArticles();
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [todayArticles, setTodayArticles] = useState<Article[]>([]);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles(true);
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      // Get today's date at midnight for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Separate featured articles
      const featured = articles.filter((a: any) => a.is_featured);
      const nonFeatured = articles.filter((a: any) => !a.is_featured);

      // Get today's articles (published today)
      const todayNews = nonFeatured.filter((a) => {
        const articleDate = new Date(a.published_at || a.created_at);
        articleDate.setHours(0, 0, 0, 0);
        return articleDate.getTime() === today.getTime();
      });

      // Other articles (not featured and not from today)
      const others = nonFeatured.filter((a) => {
        const articleDate = new Date(a.published_at || a.created_at);
        articleDate.setHours(0, 0, 0, 0);
        return articleDate.getTime() !== today.getTime();
      });

      setFeaturedArticles(featured);
      setTodayArticles(todayNews);
      setOtherArticles(others);
    } else {
      setFeaturedArticles([]);
      setTodayArticles([]);
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
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Main content column */}
            <div className="flex-1 min-w-0 space-y-10">
              {/* Featured Articles Carousel */}
              {featuredArticles.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-primary">
                    🌟 Featured
                  </h2>
                  <FeaturedCarousel articles={featuredArticles} />
                </section>
              )}

              {/* Today's News Section */}
              {todayArticles.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-primary">
                    📰 Today's Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {todayArticles.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              )}

              {/* Other articles */}
              {otherArticles.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b border-border">
                    More Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {otherArticles.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar - sticky on desktop */}
            <aside className="w-full xl:w-80 xl:flex-shrink-0">
              <div className="xl:sticky xl:top-8">
                <NewsSidebar />
              </div>
            </aside>
          </div>
        )}
      </main>

      <NewsFooter />
    </div>
  );
}
