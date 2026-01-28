import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { Article } from '@/hooks/useArticles';

interface NewsCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
}

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

export default function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  const formattedDate = format(new Date(article.created_at), "MMMM d, yyyy", {
    locale: enUS,
  });

  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-lg bg-card">
        <Link to={`/article/${article.id}`} className="block">
          {/* Image */}
          <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            {article.main_image ? (
              <img
                src={article.main_image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <span className="news-category mb-3 inline-block">
              {categoryLabels[article.category] || article.category}
            </span>
            <h2 className="news-headline news-headline-lg text-white mb-2">
              {article.title}
            </h2>
            {article.subtitle && (
              <p className="text-white/80 text-lg mb-3 line-clamp-2">
                {article.subtitle}
              </p>
            )}
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <span>{article.author}</span>
              <span>•</span>
              <time dateTime={article.created_at}>{formattedDate}</time>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="group news-card rounded-lg overflow-hidden">
        <Link to={`/article/${article.id}`} className="flex gap-4">
          {/* Image */}
          <div className="w-32 md:w-40 flex-shrink-0 aspect-square overflow-hidden">
            {article.main_image ? (
              <img
                src={article.main_image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-xs">No image</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 py-2 pr-4">
            <span className="news-category text-xs mb-2 inline-block">
              {categoryLabels[article.category] || article.category}
            </span>
            <h3 className="news-headline text-base md:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <div className="news-meta">
              <time dateTime={article.created_at}>{formattedDate}</time>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group py-3 border-b border-border last:border-0">
        <Link to={`/article/${article.id}`} className="block">
          <h3 className="news-headline text-base line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <div className="news-meta mt-1 flex items-center gap-2">
            <span className="text-primary font-medium">
              {categoryLabels[article.category] || article.category}
            </span>
            <span>•</span>
            <time dateTime={article.created_at}>{formattedDate}</time>
          </div>
        </Link>
      </article>
    );
  }

  // Default variant
  return (
    <article className="group news-card rounded-lg overflow-hidden">
      <Link to={`/article/${article.id}`} className="block">
        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden">
          {article.main_image ? (
            <img
              src={article.main_image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <span className="news-category mb-2 inline-block">
            {categoryLabels[article.category] || article.category}
          </span>
          <h3 className="news-headline news-headline-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          {article.subtitle && (
            <p className="news-subhead text-sm line-clamp-2 mb-3">
              {article.subtitle}
            </p>
          )}
          <div className="news-meta flex items-center gap-2">
            <span>{article.author}</span>
            <span>•</span>
            <time dateTime={article.created_at}>{formattedDate}</time>
          </div>
        </div>
      </Link>
    </article>
  );
}
