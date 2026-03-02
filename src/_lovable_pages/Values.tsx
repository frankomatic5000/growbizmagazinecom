import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";
import { Heart, Scale, Shield, Lightbulb, MessageCircle, Sparkles } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Kindness",
    description: "We believe kindness is a foundational strength in communication. It shapes how stories are told, how voices are represented, and how dialogue is cultivated — always with respect, dignity, and care.",
    color: "bg-rose-500/10 text-rose-600"
  },
  {
    icon: Scale,
    title: "Justice",
    description: "We are committed to fairness, balance, and ethical responsibility in storytelling. Justice guides our editorial judgment, ensuring accuracy, context, and integrity.",
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    icon: Shield,
    title: "Courage",
    description: "We value courage as intellectual honesty — the willingness to think deeply, ask meaningful questions, and engage complex subjects with clarity and seriousness.",
    color: "bg-amber-500/10 text-amber-600"
  },
  {
    icon: Lightbulb,
    title: "Wisdom",
    description: "We believe wisdom arises from reflection, discernment, experience, and humility. It allows us to prioritize substance over noise and depth over immediacy.",
    color: "bg-purple-500/10 text-purple-600"
  },
  {
    icon: MessageCircle,
    title: "Freedom of Thought and Expression",
    description: "We believe freedom of thought, discourse, and expression is essential to understanding and growth. GrowBiz Magazine is a space for plural ideas and respectful dialogue, exercised with responsibility.",
    color: "bg-green-500/10 text-green-600"
  },
  {
    icon: Sparkles,
    title: "Transformation",
    description: "We believe media has the power to transform — not through sensationalism, but through insight, awareness, and meaningful content that expands perspective and contributes positively to society.",
    color: "bg-primary/10 text-primary"
  }
];

const Values = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-primary/10 py-16 md:py-24 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-1/4 left-10 w-3 h-3 bg-rose-400 rounded-full opacity-60" />
          <div className="absolute top-1/3 right-20 w-4 h-4 bg-blue-400 rounded-full opacity-60" />
          <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-amber-400 rounded-full opacity-60" />
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-400 rounded-full opacity-60" />
          <div className="absolute bottom-1/3 right-10 w-3 h-3 bg-green-400 rounded-full opacity-60" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-primary font-medium tracking-widest uppercase text-sm mb-4">
                What We Stand For
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Values
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {values.map((value, index) => (
                  <div 
                    key={index} 
                    className="group p-6 md:p-8 bg-background border border-border rounded-2xl hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex gap-5">
                      <div className="flex-shrink-0">
                        <div className={`w-14 h-14 rounded-2xl ${value.color.split(' ')[0]} flex items-center justify-center`}>
                          <value.icon className={`w-7 h-7 ${value.color.split(' ')[1]}`} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {value.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Signature */}
              <div className="pt-16 mt-16 border-t border-border text-center">
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

export default Values;
