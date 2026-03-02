import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";
import { Shield, Lock, FileCheck, Award } from "lucide-react";

const principles = [
  { icon: Shield, label: "Independence" },
  { icon: FileCheck, label: "Accuracy" },
  { icon: Award, label: "Credibility" },
  { icon: Lock, label: "Responsibility" }
];

const EditorialPrinciples = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-primary/10 py-16 md:py-24 overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-primary font-medium tracking-widest uppercase text-sm mb-4">
                Our Standards
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Editorial Principles
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                The foundation of our journalistic integrity
              </p>
            </div>
          </div>
        </section>

        {/* Core Values Bar */}
        <section className="py-8 border-b border-border bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {principles.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Editorial Integrity */}
              <div className="relative">
                <div className="flex items-start gap-6">
                  <div className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
                      Editorial Integrity
                    </h2>
                    <div className="space-y-4">
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        At GrowBiz Magazine, editorial integrity is a <strong className="text-foreground">non-negotiable principle</strong> and the foundation of everything we publish.
                      </p>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        We are committed to independence, accuracy, credibility, and responsibility in our editorial process. Our content is developed with discernment, fairness, and respect for context, avoiding sensationalism, distortion, or agenda-driven narratives.
                      </p>
                      <div className="bg-muted/30 p-6 rounded-lg border-l-4 border-primary">
                        <p className="text-foreground leading-relaxed">
                          We believe responsible media serves society by informing, illuminating, and encouraging thoughtful reflection, while respecting human dignity and the complexity of life.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* Editorial Independence */}
              <div className="relative">
                <div className="flex items-start gap-6">
                  <div className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
                      Editorial Independence
                    </h2>
                    <div className="space-y-4">
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        Editorial independence is <strong className="text-foreground">essential to our credibility</strong> as a media platform.
                      </p>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        Our editorial decisions are made free from political, ideological, religious, or commercial pressure. Partnerships, contributors, and sponsors do not determine our editorial direction, content selection, or narrative approach.
                      </p>
                      <div className="bg-muted/30 p-6 rounded-lg border-l-4 border-primary">
                        <p className="text-foreground leading-relaxed">
                          We maintain a clear separation between editorial content and sponsored material, ensuring transparency, trust, and intellectual honesty.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="pt-12 mt-8 border-t border-border text-center">
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

export default EditorialPrinciples;
