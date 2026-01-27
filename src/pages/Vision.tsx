import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";

const Vision = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Vision
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Where we aspire to be as a global media platform
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <article className="max-w-4xl mx-auto prose prose-lg max-w-none space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our vision is to be a globally respected independent media platform, recognized for its intellectual depth, aesthetic excellence, and commitment to timeless values.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                We envision GrowBiz Magazine as a space where diverse voices meet without reductionism, where growth is understood not only as success or progress, but as maturity, consciousness, and alignment with meaning.
              </p>

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

export default Vision;
