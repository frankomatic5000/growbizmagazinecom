import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Vision",
  description: "The vision of GrowBiz Magazine for the future of global media.",
};

export default function VisionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        <section className="bg-primary/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-primary font-medium tracking-widest uppercase text-sm mb-4">Our Future</span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Vision</h1>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <article className="max-w-4xl mx-auto prose prose-lg">
              <p className="text-xl text-muted-foreground leading-relaxed">
                We envision a world where media platforms are built on virtue rather than virality — where the pursuit of truth, beauty, and wisdom guides every editorial decision.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                GrowBiz Magazine aspires to become a reference point for thoughtful global journalism — a trusted voice that readers turn to not just for information, but for perspective, reflection, and inspiration.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our vision is to build a community of readers, writers, and thinkers united by a commitment to depth over noise — people who believe that meaningful stories can change minds, open hearts, and build bridges across cultures.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
