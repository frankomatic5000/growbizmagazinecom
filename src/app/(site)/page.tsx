import { getFeaturedArticles, getHeadlineArticle, getLatestArticles } from "@/lib/sanity/queries";
import { FeaturedCarousel } from "@/components/news/FeaturedCarousel";
import { HeadlineSection } from "@/components/news/HeadlineSection";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import { EmptyState } from "@/components/news/EmptyState";
import { NewsletterBanner } from "@/components/NewsletterSheet";

export const revalidate = 60;

export default async function HomePage() {
  const [headline, featured, latest] = await Promise.all([
    getHeadlineArticle(),
    getFeaturedArticles(5),
    getLatestArticles(24),
  ]);

  const nonFeaturedNonHeadline = latest.filter(
    (a) => !a.featured && !a.headline
  );
  const todayStr = new Date().toDateString();
  const todayArticles = nonFeaturedNonHeadline.filter(
    (a) => a.publishedAt && new Date(a.publishedAt).toDateString() === todayStr
  );
  const otherArticles = nonFeaturedNonHeadline.filter(
    (a) => !a.publishedAt || new Date(a.publishedAt).toDateString() !== todayStr
  );

  const hasContent = headline || featured.length > 0 || latest.length > 0;

  return (
    <div className="news-container py-8">
      {!hasContent ? (
        <EmptyState
          title="No articles yet"
          description="Content is on its way. Check back soon!"
        />
      ) : (
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-10">
            {headline && <HeadlineSection article={headline} />}

            {featured.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-primary">
                  Featured
                </h2>
                <FeaturedCarousel articles={featured} />
              </section>
            )}

            {todayArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-primary">
                  Today&apos;s Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {todayArticles.map((article) => (
                    <NewsCard key={article._id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {otherArticles.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 pb-2 border-b border-border">
                  More Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherArticles.map((article) => (
                    <NewsCard key={article._id} article={article} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full xl:w-80 xl:flex-shrink-0">
            <div className="xl:sticky xl:top-8">
              <NewsSidebar mostRead={latest.slice(0, 5)} />
            </div>
          </aside>
        </div>
      )}

      <div className="mt-12 -mx-4 md:-mx-6 lg:-mx-8">
        <NewsletterBanner />
      </div>
    </div>
  );
}
