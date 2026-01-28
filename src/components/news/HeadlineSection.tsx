import { Link } from 'react-router-dom';
import type { Article } from '@/hooks/useArticles';

interface HeadlineSectionProps {
  article: Article;
}

export default function HeadlineSection({ article }: HeadlineSectionProps) {
  return (
    <section className="mb-10">
      <div className="relative bg-card rounded-xl overflow-hidden border border-border">
        <div className="p-8 md:p-12 lg:p-16 text-center">
          {/* Main headline - clickable */}
          <Link to={`/article/${article.id}`} className="group">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 text-foreground group-hover:text-primary transition-colors cursor-pointer">
              {article.title}
            </h1>
          </Link>
          
          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {article.subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
