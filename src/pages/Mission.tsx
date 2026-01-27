import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";

const Mission = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Mission
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Our purpose and commitment to meaningful journalism
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <article className="max-w-4xl mx-auto prose prose-lg max-w-none space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our mission is to create and curate meaningful editorial content that reflects the depth of human experience, highlights universal virtues, and fosters thoughtful dialogue across cultures and disciplines.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                We exist to publish stories that elevate understanding, inspire reflection, and encourage responsible contribution to society — honoring beauty, intelligence, ethics, and purpose.
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

export default Mission;
