import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";
import { Globe, BookOpen, Users, Sparkles } from "lucide-react";

const highlights = [
  {
    icon: Globe,
    title: "Global Reach",
    description: "Stories that cross cultures, countries, and time"
  },
  {
    icon: BookOpen,
    title: "Values-Driven",
    description: "Kindness, justice, courage, and wisdom"
  },
  {
    icon: Users,
    title: "Diverse Voices",
    description: "Multiple countries and realities united"
  },
  {
    icon: Sparkles,
    title: "Timeless Perspective",
    description: "Depth over immediacy, meaning over noise"
  }
];

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsHeader />

      <main className="flex-grow">
        {/* Hero Section with decorative elements */}
        <section className="relative bg-primary/10 py-16 md:py-24 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-primary font-medium tracking-widest uppercase text-sm mb-4">
                Who We Are
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                About Us
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                An independent, global digital magazine created to tell stories that reveal meaning, beauty, and depth
              </p>
            </div>
          </div>
        </section>

        {/* Highlights Grid */}
        <section className="py-12 md:py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {highlights.map((item, index) => (
                <div key={index} className="text-center p-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <article className="max-w-4xl mx-auto">
              {/* Opening Quote */}
              <div className="relative mb-12 p-8 bg-muted/30 rounded-lg border-l-4 border-primary">
                <p className="text-xl md:text-2xl font-serif text-foreground italic leading-relaxed">
                  "We are a values-driven media platform. We believe that kindness, justice, courage, and wisdom are not circumstantial ideas or contemporary trends, but universal virtues."
                </p>
              </div>

              <div className="prose prose-lg max-w-none space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">GrowBiz Magazine</strong> is an independent, global digital magazine created to tell stories that cross cultures, countries, and time — stories that reveal meaning, beauty, and depth.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  We are a values-driven media platform. We believe that kindness, justice, courage, and wisdom are not circumstantial ideas or contemporary trends, but universal virtues, recognized throughout human history as expressions of what is most elevated in human experience.
                </p>

                <div className="my-10 py-8 border-y border-border">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    GrowBiz Magazine brings together voices from multiple countries and realities, offering an editorial space where human journeys, entrepreneurship, science, art, education, family life, and contemporary culture are presented with respect, sensitivity, and awareness.
                  </p>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  We value the human being not as the ultimate origin of all things, but as a living work, capable of cultivating virtue, creating, serving, and contributing to society in dialogue with something greater than oneself. We recognize that life is not limited to what is visible, measurable, or immediate. There is a deeper, quieter, essential dimension that sustains human existence.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  We believe that beauty, aesthetics, intelligence, and classical virtues elevate life when lived with truth, responsibility, and humility — not as expressions of ego, but as a conscious response to the gift of existence.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Published in English, as part of an American media company, GrowBiz Magazine is born with a global vocation and a timeless perspective. Our content invites reflection, maturity, and a form of growth that goes beyond the external, reaching inward toward meaning and purpose.
                </p>

                <div className="bg-muted/20 p-6 rounded-lg my-10">
                  <p className="text-lg text-foreground font-medium leading-relaxed">
                    More than a magazine, we are an editorial space that respects the complexity of life, human dignity, and the mystery that sustains it.
                  </p>
                </div>
              </div>

              {/* Signature */}
              <div className="pt-12 mt-12 border-t border-border text-center">
                <div className="inline-block">
                  <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">
                    GrowBiz Magazine
                  </h2>
                  <p className="text-primary font-medium tracking-wide uppercase text-sm">
                    The Global Media of Virtues.
                  </p>
                </div>
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
