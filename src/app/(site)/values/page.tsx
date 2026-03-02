import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Values",
  description: "The core values that guide GrowBiz Magazine.",
};

const values = [
  { title: "Kindness", description: "We approach every story with empathy and care for the people involved." },
  { title: "Justice", description: "We hold truth to account and stand for what is fair and right." },
  { title: "Courage", description: "We tell difficult stories with honesty and without fear." },
  { title: "Wisdom", description: "We seek depth, nuance, and understanding in everything we publish." },
  { title: "Beauty", description: "We believe great journalism can be a work of art." },
  { title: "Humility", description: "We remain open to learning, correction, and growth." },
];

export default function ValuesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        <section className="bg-primary/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-primary font-medium tracking-widest uppercase text-sm mb-4">What We Stand For</span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Values</h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Our values are not just words — they are the foundation of every story we tell.
              </p>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-serif text-xl font-bold text-primary mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
