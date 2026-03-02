import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";
import { Eye, Star, Compass, TrendingUp } from "lucide-react";

const visionPoints = [
  {
    icon: Star,
    title: "Intellectual Depth",
    description: "Content that challenges and enriches the mind"
  },
  {
    icon: Eye,
    title: "Aesthetic Excellence",
    description: "Beauty in form, substance, and presentation"
  },
  {
    icon: Compass,
    title: "Timeless Values",
    description: "Commitment to principles that transcend trends"
  },
  {
    icon: TrendingUp,
    title: "Meaningful Growth",
    description: "Maturity, consciousness, and alignment with purpose"
  }
];

const Vision = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-primary/10 py-16 md:py-24 overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
          
          {/* Decorative shapes */}
          <div className="absolute top-20 right-20 w-40 h-40 border border-primary/20 rounded-full" />
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-primary/20 rounded-full" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-primary font-medium tracking-widest uppercase text-sm mb-4">
                Our Aspiration
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Vision
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Where we aspire to be as a global media platform
              </p>
            </div>
          </div>
        </section>

        {/* Vision Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Main Vision Statement */}
              <div className="relative mb-12">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full" />
                <div className="pl-8 py-4">
                  <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed">
                    Our vision is to be a globally respected independent media platform, recognized for its <span className="text-primary">intellectual depth</span>, <span className="text-primary">aesthetic excellence</span>, and <span className="text-primary">commitment to timeless values</span>.
                  </p>
                </div>
              </div>

              {/* Vision Description */}
              <div className="bg-muted/30 rounded-2xl p-8 md:p-12 mb-12">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We envision GrowBiz Magazine as a space where diverse voices meet without reductionism, where growth is understood not only as success or progress, but as <strong className="text-foreground">maturity, consciousness, and alignment with meaning</strong>.
                  </p>
                </div>
              </div>

              {/* Vision Points Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-16">
                {visionPoints.map((point, index) => (
                  <div 
                    key={index} 
                    className="flex gap-4 p-6 bg-background border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <point.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-foreground mb-1">{point.title}</h3>
                      <p className="text-sm text-muted-foreground">{point.description}</p>
                    </div>
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

export default Vision;
