import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsHeader />

      <main className="flex-grow">
        <div className="news-container py-12 md:py-16">
          <article className="max-w-4xl mx-auto">
            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
              Privacy Policy
            </h1>

            {/* Last Updated */}
            <p className="text-muted-foreground mb-12">
              Last updated: January 27, 2026
            </p>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At GrowBiz, we respect your privacy and are committed to protecting your personal information.
                This Privacy Policy explains how we collect, use, and protect your data when you visit
                our news portal or interact with our services.
              </p>

              {/* Section 1 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Information We Collect
                </h2>
                <p className="text-muted-foreground mb-4">
                  We collect information that you provide to us directly, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Name and email address when you subscribe to our newsletter</li>
                  <li>Contact information when you send messages through our contact form</li>
                  <li>Browsing data and news category preferences</li>
                  <li>Any other information you choose to provide when communicating with us</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-muted-foreground mb-4">
                  We use the collected information to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Send newsletters and updates about news in categories of your interest</li>
                  <li>Personalize your browsing experience on our portal</li>
                  <li>Respond to your questions and provide support</li>
                  <li>Improve our website and editorial services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Content Categories
                </h2>
                <p className="text-muted-foreground mb-4">
                  GrowBiz offers editorial content in the following categories:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Culture & Arts</li>
                  <li>Education</li>
                  <li>Entrepreneurship & Business</li>
                  <li>Society & Humanity</li>
                  <li>Psychology & Well-Being</li>
                  <li>Sustainability & Future</li>
                  <li>Lifestyle with Purpose</li>
                  <li>Events</li>
                  <li>Opinion & Essays</li>
                  <li>Biographies</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Information Sharing
                </h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your
                  information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>With service providers who assist us in operating the site and conducting our business</li>
                  <li>When required by law or to protect our rights</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Cookies and Tracking
                </h2>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to improve your browsing experience,
                  remember your reading preferences, and analyze site traffic. You can control cookie preferences
                  through your browser settings.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Your Rights
                </h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access, update, or delete your personal information</li>
                  <li>Unsubscribe from our newsletter at any time</li>
                  <li>Object to the processing of your data</li>
                  <li>Request a copy of your data</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  To exercise any of these rights, please contact us through our{" "}
                  <a
                    href="/contact"
                    className="text-primary underline underline-offset-4 decoration-2 hover:text-primary/80 transition-colors"
                  >
                    contact page
                  </a>
                  .
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Data Security
                </h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Children's Privacy
                </h2>
                <p className="text-muted-foreground">
                  Our website is not intended for children under 13 years of age. We do not knowingly collect personal
                  information from children under 13.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Changes to This Policy
                </h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy periodically. We will notify you of any changes by posting
                  the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Contact
                </h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us through our{" "}
                  <a
                    href="/contact"
                    className="text-primary underline underline-offset-4 decoration-2 hover:text-primary/80 transition-colors"
                  >
                    contact page
                  </a>
                  .
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>

      <NewsFooter />
    </div>
  );
};

export default PrivacyPolicy;
