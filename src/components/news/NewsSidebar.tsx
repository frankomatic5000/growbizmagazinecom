import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { useArticles } from '@/hooks/useArticles';
import type { Article } from '@/hooks/useArticles';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyRate {
  name: string;
  code: string;
  value: number;
  change: number;
  lastUpdate: string;
}

export default function NewsSidebar() {
  const { getMostReadArticles } = useArticles();
  const [mostRead, setMostRead] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    const loadMostRead = async () => {
      const articles = await getMostReadArticles(5);
      setMostRead(articles);
      setIsLoading(false);
    };
    loadMostRead();
  }, []);

  const fetchRates = async () => {
    setRatesLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-currency-rates');
      
      if (error) {
        console.error('Error fetching rates:', error);
        return;
      }
      
      if (data?.rates) {
        setRates(data.rates);
        setLastUpdate(data.lastUpdate);
      }
    } catch (err) {
      console.error('Failed to fetch currency rates:', err);
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // Refresh every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatValue = (code: string, value: number) => {
    if (code === 'BTC') {
      return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
    if (code === 'JPY') {
      return value.toFixed(2);
    }
    return value.toFixed(4);
  };

  const formatLastUpdate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <aside className="space-y-6">
      {/* Most Read */}
      <div className="news-sidebar">
        <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          Mais Lidas
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
                      {article.view_count} visualizações
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhum artigo publicado ainda.
          </p>
        )}
      </div>

      {/* Markets */}
      <div className="news-sidebar">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Mercados</h2>
          <button
            onClick={fetchRates}
            disabled={ratesLoading}
            className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
            title="Atualizar cotações"
          >
            <RefreshCw className={`h-4 w-4 text-muted-foreground ${ratesLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {ratesLoading && rates.length === 0 ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex justify-between py-2 border-b border-border">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-4 bg-muted rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {rates.map((rate, index) => (
              <div
                key={rate.code}
                className={`flex justify-between items-center py-2 ${
                  index < rates.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <span className="font-medium text-sm">{rate.name}</span>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-sm font-semibold ${
                      rate.change > 0
                        ? 'text-green-600'
                        : rate.change < 0
                        ? 'text-red-600'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {formatValue(rate.code, rate.value)}
                  </span>
                  {rate.change !== 0 && (
                    rate.change > 0 ? (
                      <ArrowUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-600" />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {lastUpdate && (
          <p className="text-xs text-muted-foreground mt-3">
            Última atualização: {formatLastUpdate(lastUpdate)}
          </p>
        )}
      </div>
    </aside>
  );
}
