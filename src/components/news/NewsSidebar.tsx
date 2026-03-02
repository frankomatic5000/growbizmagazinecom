import Link from "next/link";
import { TrendingUp } from "lucide-react";
import type { Article } from "@/lib/sanity/types";
import { formatDate } from "@/lib/utils";

interface NewsSidebarProps {
  mostRead?: Article[];
}

export function NewsSidebar({ mostRead = [] }: NewsSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="news-sidebar">
        <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          Most Read
        </h2>
        {mostRead.length > 0 ? (
          <ol className="space-y-4">
            {mostRead.map((article, index) => (
              <li key={article._id} className="group">
                <Link href={`/articles/${article.slug}`} className="flex gap-3 items-start">
                  <span className="text-2xl font-bold text-primary/40 group-hover:text-primary transition-colors">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    {article.publishedAt && (
                      <span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">No articles published yet.</p>
        )}
      </div>
    </aside>
  );
}
