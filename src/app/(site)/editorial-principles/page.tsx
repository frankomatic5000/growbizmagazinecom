import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Principles",
  description: "The editorial principles that guide our journalism at GrowBiz Magazine.",
};

const principles = [
  { title: "Independence", description: "Our editorial decisions are made free from commercial or political pressure." },
  { title: "Accuracy", description: "We verify facts rigorously before publication and correct errors transparently." },
  { title: "Fairness", description: "We present multiple perspectives and give subjects the opportunity to respond." },
  { title: "Humanity", description: "We treat every person in our stories with dignity and compassion." },
  { title: "Transparency", description: "We are open about our methods, sources, and potential conflicts of interest." },
  { title: "Depth", description: "We prioritize understanding over speed, choosing context over clicks." },
];

export default function EditorialPrinciplesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        <section className="bg-primary/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-primary font-medium tracking-widest uppercase text-sm mb-4">How We Work</span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Editorial Principles</h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                The standards and commitments that guide our journalism every day.
              </p>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {principles.map((principle, index) => (
                <div key={index} className="flex gap-6 p-6 bg-card border border-border rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-lg">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">{principle.title}</h3>
                    <p className="text-muted-foreground">{principle.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
