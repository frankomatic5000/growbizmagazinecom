import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";
import { Target, Lightbulb, Heart, BookOpen } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Meaningful Content",
    description: "Stories that reflect the depth of human experience"
  },
  {
    icon: Lightbulb,
    title: "Universal Virtues",
    description: "Highlighting timeless values across cultures"
  },
  {
    icon: Heart,
    title: "Thoughtful Dialogue",
    description: "Fostering understanding and connection"
  },
  {
    icon: BookOpen,
    title: "Responsible Media",
    description: "Contributing positively to society"
  }
];

const Mission = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-primary/10 py-16 md:py-24 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-primary/20 rounded-full" />
          <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-primary/20 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-primary/30 rounded-full" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-primary font-medium tracking-widest uppercase text-sm mb-4">
                Our Purpose
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Mission
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Our commitment to meaningful journalism
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Main Quote */}
              <div className="relative mb-12 p-8 md:p-12 bg-muted/30 rounded-2xl border border-border">
                <div className="absolute -top-4 left-8 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary-foreground" />
                </div>
                <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed">
                  Our mission is to create and curate meaningful editorial content that reflects the depth of human experience, highlights universal virtues, and fosters thoughtful dialogue across cultures and disciplines.
                </p>
              </div>

              {/* Supporting Statement */}
              <div className="prose prose-lg max-w-none mb-16">
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  We exist to publish stories that elevate understanding, inspire reflection, and encourage responsible contribution to society — <span className="text-foreground font-medium">honoring beauty, intelligence, ethics, and purpose</span>.
                </p>
              </div>

              {/* Pillars Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {pillars.map((pillar, index) => (
                  <div 
                    key={index} 
                    className="group p-6 bg-background border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <pillar.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif font-semibold text-foreground mb-2">{pillar.title}</h3>
                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                  </div>
                ))}
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
            </div>
          </div>
        </section>
      </main>

      <NewsFooter />
    </div>
  );
};

export default Mission;
