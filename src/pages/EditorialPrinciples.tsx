import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";

const EditorialPrinciples = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Editorial Principles
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                The foundation of our journalistic integrity
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <article className="max-w-4xl mx-auto prose prose-lg max-w-none space-y-10">
              {/* Editorial Integrity */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
                  Editorial Integrity
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At GrowBiz Magazine, editorial integrity is a non-negotiable principle and the foundation of everything we publish.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We are committed to independence, accuracy, credibility, and responsibility in our editorial process. Our content is developed with discernment, fairness, and respect for context, avoiding sensationalism, distortion, or agenda-driven narratives.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We believe responsible media serves society by informing, illuminating, and encouraging thoughtful reflection, while respecting human dignity and the complexity of life.
                </p>
              </div>

              <hr className="border-border" />

              {/* Editorial Independence */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
                  Editorial Independence
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Editorial independence is essential to our credibility as a media platform.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our editorial decisions are made free from political, ideological, religious, or commercial pressure. Partnerships, contributors, and sponsors do not determine our editorial direction, content selection, or narrative approach.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We maintain a clear separation between editorial content and sponsored material, ensuring transparency, trust, and intellectual honesty.
                </p>
              </div>

              {/* Signature */}
              <div className="pt-8 mt-8 border-t border-border text-center">
                <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
                  GrowBiz Magazine
                </h2>
                <p className="text-primary font-medium tracking-wide uppercase text-sm">
                  The Global Media of Virtues.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <NewsFooter />
    </div>
  );
};

export default EditorialPrinciples;
