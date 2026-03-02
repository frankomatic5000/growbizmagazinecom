import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCategoryBySlug,
  getArticlesByCategory,
  getAllCategorySlugs,
  getLatestArticles,
} from "@/lib/sanity/queries";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import { EmptyState } from "@/components/news/EmptyState";

export const revalidate = 120;

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description ?? `Browse ${category.title} articles on GrowBiz Magazine.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, articles, latest] = await Promise.all([
    getCategoryBySlug(slug),
    getArticlesByCategory(slug, 24),
    getLatestArticles(5),
  ]);

  if (!category) notFound();

  return (
    <div className="news-container py-8">
      <div className="mb-8 pb-4 border-b-2 border-primary">
        <h1 className="text-3xl font-bold">{category.title}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-2">{category.description}</p>
        )}
      </div>

      {articles.length === 0 ? (
        <EmptyState
          title={`No articles in ${category.title}`}
          description="Check back soon for new content in this category."
        />
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
              <NewsSidebar mostRead={latest} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
