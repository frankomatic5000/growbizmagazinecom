import { useEffect, useState } from "react";
import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";
import NewsCard from "@/components/news/NewsCard";
import NewsSidebar from "@/components/news/NewsSidebar";
import EmptyState from "@/components/news/EmptyState";
import { useArticles } from "@/hooks/useArticles";
import type { Article } from "@/hooks/useArticles";

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
          <>
            {/* Featured Articles Section */}
            {featuredArticles.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-primary">Featured</h2>
                {featuredArticles.length === 1 ? (
                  <NewsCard article={featuredArticles[0]} variant="featured" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredArticles.slice(0, 4).map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Today's News Section */}
            {todayArticles.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-primary">Today's Articles</h2>
                <div className="news-grid-2col">
                  {todayArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Main content grid */}
            <div className="news-grid-main">
              {/* Left column - Other Articles */}
              <div className="lg:col-span-2 space-y-8">
                {/* Other articles */}
                {otherArticles.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-4 pb-2 border-b border-border">More Articles</h2>
                    <div className="space-y-4">
                      {otherArticles.map((article) => (
                        <NewsCard key={article.id} article={article} variant="horizontal" />
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
