import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import NewsHeader from '@/components/news/NewsHeader';
import NewsFooter from '@/components/news/NewsFooter';
import NewsCard from '@/components/news/NewsCard';
import NewsSidebar from '@/components/news/NewsSidebar';
import EmptyState from '@/components/news/EmptyState';
import { useArticles } from '@/hooks/useArticles';
import type { Article } from '@/hooks/useArticles';

export default function NewsSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchArticles } = useArticles();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setArticles([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const results = await searchArticles(query);
      setArticles(results);
      setIsLoading(false);
    };

    performSearch();
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <NewsHeader />

      <main className="news-container py-8">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
          <Search className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-3xl font-bold">Search</h1>
            {query && (
              <p className="text-muted-foreground">
                Results for: <strong>"{query}"</strong>
              </p>
            )}
          </div>
        </div>

        {!query.trim() ? (
          <EmptyState
            title="Enter a search term"
            description="Use the search bar at the top of the page to find articles."
          />
        ) : isLoading ? (
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
            title="No results found"
            description={`We couldn't find any articles for "${query}". Try using different keywords.`}
          />
        ) : (
          <div className="news-grid-main">
            <div className="lg:col-span-2">
              <p className="text-muted-foreground mb-6">
                {articles.length} {articles.length === 1 ? 'result found' : 'results found'}
              </p>
              <div className="space-y-4">
                {articles.map((article) => (
                  <NewsCard key={article.id} article={article} variant="horizontal" />
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
