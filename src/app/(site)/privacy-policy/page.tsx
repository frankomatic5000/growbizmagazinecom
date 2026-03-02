import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for GrowBiz Magazine.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        <section className="bg-primary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 2025</p>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <article className="max-w-4xl mx-auto prose prose-lg">
              <h2>Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you subscribe to our newsletter, contact us, or interact with our website. This may include your name, email address, and any other information you choose to provide.</p>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to send you our newsletter, respond to your inquiries, improve our website, and comply with legal obligations.</p>

              <h2>Newsletter Subscriptions</h2>
              <p>If you subscribe to our newsletter, we will use your email address to send you updates, articles, and other content from GrowBiz Magazine. You may unsubscribe at any time by clicking the unsubscribe link in any email we send.</p>

              <h2>Cookies</h2>
              <p>We use cookies and similar technologies to enhance your experience on our website. You can control cookies through your browser settings.</p>

              <h2>Data Security</h2>
              <p>We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure.</p>

              <h2>Third-Party Services</h2>
              <p>We may use third-party services such as analytics providers. These services may collect information about your use of our website.</p>

              <h2>Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at contactus@growbizmagazine.com.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
