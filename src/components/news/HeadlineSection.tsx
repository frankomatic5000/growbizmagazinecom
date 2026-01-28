import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Article } from '@/hooks/useArticles';

interface HeadlineSectionProps {
  article: Article;
}

export default function HeadlineSection({ article }: HeadlineSectionProps) {
  return (
    <section className="mb-10">
      <div className="relative bg-card rounded-xl overflow-hidden border border-border">
        <div className="p-8 md:p-12 lg:p-16 text-center">
          {/* Main headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 text-foreground">
            {article.title}
          </h1>
          
          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
              {article.subtitle}
            </p>
          )}
          
          {/* CTA Button */}
          <Link to={`/article/${article.id}`}>
            <Button size="lg" className="gap-2 text-lg px-8">
              Ver Mais
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
