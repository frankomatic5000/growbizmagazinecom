import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useArticles } from '@/hooks/useArticles';
import type { Article } from '@/hooks/useArticles';

export default function NewsSidebar() {
  const { getMostReadArticles } = useArticles();
  const [mostRead, setMostRead] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMostRead = async () => {
      const articles = await getMostReadArticles(5);
      setMostRead(articles);
      setIsLoading(false);
    };
    loadMostRead();
  }, []);

  return (
    <aside className="space-y-6">
      {/* Most Read */}
      <div className="news-sidebar">
        <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          Most Read
        </h2>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : mostRead.length > 0 ? (
          <ol className="space-y-4">
            {mostRead.map((article, index) => (
              <li key={article.id} className="group">
                <Link
                  to={`/article/${article.id}`}
                  className="flex gap-3 items-start"
                >
                  <span className="text-2xl font-bold text-primary/40 group-hover:text-primary transition-colors">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {article.view_count} views
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">
            No articles published yet.
          </p>
        )}
      </div>

      {/* Markets Placeholder */}
      <div className="news-sidebar">
        <h2 className="text-lg font-bold mb-4">Markets</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="font-medium">USD/EUR</span>
            <span className="text-green-600">0.92 ↑</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="font-medium">S&P 500</span>
            <span className="text-red-600">5,234 ↓</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="font-medium">Nasdaq</span>
            <span className="text-green-600">16,450 ↑</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-medium">Bitcoin</span>
            <span className="text-green-600">$67,890 ↑</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          * Illustrative data
        </p>
      </div>
    </aside>
  );
}
