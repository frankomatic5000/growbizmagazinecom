import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewsHeader from '@/components/news/NewsHeader';
import NewsFooter from '@/components/news/NewsFooter';
import NewsCard from '@/components/news/NewsCard';
import NewsSidebar from '@/components/news/NewsSidebar';
import EmptyState from '@/components/news/EmptyState';
import { useArticles } from '@/hooks/useArticles';
import type { Article, ArticleCategory } from '@/hooks/useArticles';

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

export default function NewsCategory() {
  const { category } = useParams<{ category: string }>();
  const { getArticlesByCategory } = useArticles();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      if (!category) return;

      setIsLoading(true);
      const data = await getArticlesByCategory(category as ArticleCategory);
      setArticles(data);
      setIsLoading(false);
    };

    loadArticles();
  }, [category]);

  const categoryName = category ? categoryLabels[category] || category : 'Categoria';

  return (
    <div className="min-h-screen bg-background">
      <NewsHeader />

      <main className="news-container py-8">
        <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-border">
          {categoryName}
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <EmptyState
            title={`Nenhuma notícia em ${categoryName}`}
            description={`Ainda não há notícias publicadas nesta categoria. Volte em breve!`}
          />
        ) : (
          <div className="news-grid-main">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <NewsSidebar />
            </div>
          </div>
        )}
      </main>

      <NewsFooter />
    </div>
  );
}
