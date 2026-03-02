"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("Subscribed! Welcome to GrowBiz Magazine.");
        setEmail("");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-secondary text-secondary-foreground py-10">
      <div className="news-container text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
          Subscribe to GrowBiz Magazine
        </h2>
        <p className="text-secondary-foreground/80 mb-6 max-w-md mx-auto">
          Get stories that reveal meaning, beauty, and depth — delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/60"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "…" : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}
