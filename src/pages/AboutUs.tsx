import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                About Us
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Discover who we are and what drives our mission
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <article className="max-w-4xl mx-auto prose prose-lg max-w-none space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                <strong className="text-foreground">GrowBiz Magazine</strong> is an independent, global digital magazine created to tell stories that cross cultures, countries, and time — stories that reveal meaning, beauty, and depth.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                We are a values-driven media platform. We believe that kindness, justice, courage, and wisdom are not circumstantial ideas or contemporary trends, but universal virtues, recognized throughout human history as expressions of what is most elevated in human experience.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                GrowBiz Magazine brings together voices from multiple countries and realities, offering an editorial space where human journeys, entrepreneurship, science, art, education, family life, and contemporary culture are presented with respect, sensitivity, and awareness.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                We value the human being not as the ultimate origin of all things, but as a living work, capable of cultivating virtue, creating, serving, and contributing to society in dialogue with something greater than oneself. We recognize that life is not limited to what is visible, measurable, or immediate. There is a deeper, quieter, essential dimension that sustains human existence.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that beauty, aesthetics, intelligence, and classical virtues elevate life when lived with truth, responsibility, and humility — not as expressions of ego, but as a conscious response to the gift of existence.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Published in English, as part of an American media company, GrowBiz Magazine is born with a global vocation and a timeless perspective. Our content invites reflection, maturity, and a form of growth that goes beyond the external, reaching inward toward meaning and purpose.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                More than a magazine, we are an editorial space that respects the complexity of life, human dignity, and the mystery that sustains it.
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

export default AboutUs;
