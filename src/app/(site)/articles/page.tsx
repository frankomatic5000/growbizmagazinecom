import { getLatestArticles } from "@/lib/sanity/queries";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import { EmptyState } from "@/components/news/EmptyState";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Articles",
  description: "Browse all articles from GrowBiz Magazine.",
};

export default async function ArticlesPage() {
  const articles = await getLatestArticles(24);

  return (
    <div className="news-container py-8">
      <h1 className="text-3xl font-bold mb-8 pb-3 border-b-2 border-primary">All Articles</h1>
      {articles.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <NewsCard key={article._id} article={article} />
              ))}
            </div>
          </div>
          <aside className="w-full xl:w-80 xl:flex-shrink-0">
            <div className="xl:sticky xl:top-8">
              <NewsSidebar mostRead={articles.slice(0, 5)} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
