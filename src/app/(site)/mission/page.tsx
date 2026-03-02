import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Mission",
  description: "The mission of GrowBiz Magazine — stories that reveal meaning, beauty, and depth.",
};

export default function MissionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        <section className="bg-primary/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-primary font-medium tracking-widest uppercase text-sm mb-4">Our Purpose</span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Mission</h1>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <article className="max-w-4xl mx-auto prose prose-lg">
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our mission is to tell stories that matter — stories rooted in universal values, human dignity, and the pursuit of meaning. We believe journalism can elevate the human spirit and contribute to a more thoughtful, compassionate world.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                GrowBiz Magazine exists to bridge cultures, celebrate virtues, and amplify voices that speak to the deeper dimensions of human experience. Through rigorous, thoughtful editorial work, we aim to inform, inspire, and connect people across borders and backgrounds.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We are committed to credibility, sensitivity, and depth — producing content that respects the complexity of life and serves readers seeking substance over noise.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
