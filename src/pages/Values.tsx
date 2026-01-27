import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";
import { Heart, Scale, Shield, Lightbulb, MessageCircle, Sparkles } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Kindness",
    description: "We believe kindness is a foundational strength in communication. It shapes how stories are told, how voices are represented, and how dialogue is cultivated — always with respect, dignity, and care."
  },
  {
    icon: Scale,
    title: "Justice",
    description: "We are committed to fairness, balance, and ethical responsibility in storytelling. Justice guides our editorial judgment, ensuring accuracy, context, and integrity."
  },
  {
    icon: Shield,
    title: "Courage",
    description: "We value courage as intellectual honesty — the willingness to think deeply, ask meaningful questions, and engage complex subjects with clarity and seriousness."
  },
  {
    icon: Lightbulb,
    title: "Wisdom",
    description: "We believe wisdom arises from reflection, discernment, experience, and humility. It allows us to prioritize substance over noise and depth over immediacy."
  },
  {
    icon: MessageCircle,
    title: "Freedom of Thought and Expression",
    description: "We believe freedom of thought, discourse, and expression is essential to understanding and growth. GrowBiz Magazine is a space for plural ideas and respectful dialogue, exercised with responsibility."
  },
  {
    icon: Sparkles,
    title: "Transformation",
    description: "We believe media has the power to transform — not through sensationalism, but through insight, awareness, and meaningful content that expands perspective and contributes positively to society."
  }
];

const Values = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Values
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-8 md:gap-10">
                {values.map((value, index) => (
                  <div key={index} className="flex gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground">
                        {value.title}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Signature */}
              <div className="pt-12 mt-12 border-t border-border text-center">
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
