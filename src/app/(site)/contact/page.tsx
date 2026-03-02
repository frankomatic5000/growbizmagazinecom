"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(20).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  website: z.string().max(0, "Bot detected").optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", website: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    if (data.website && data.website.length > 0) {
      toast.success("Message sent! Thank you for reaching out. We'll respond soon.");
      form.reset();
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent! Thank you for reaching out. We'll respond soon.");
      form.reset();
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        <section className="bg-primary/10 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">Contact Us</h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                We&apos;re here to listen. Send us your message, suggestion, or question.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="space-y-6">
                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-serif text-xl">Phone</CardTitle>
                    <CardDescription>Give us a call</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-medium">+1 (973) 937-1073</p>
                    <p className="text-sm text-muted-foreground mt-1">Monday to Friday, 9am to 6pm</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="font-serif text-xl">WhatsApp</CardTitle>
                    <CardDescription>Quick message</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-medium">+1 (973) 937-1073</p>
                    <p className="text-sm text-muted-foreground mt-1">We respond within 24 hours</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="font-serif text-xl">Email</CardTitle>
                    <CardDescription>Send us an email</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-medium">contactus@growbizmagazine.com</p>
                    <p className="text-sm text-muted-foreground mt-1">For partnerships and press</p>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Send your message</CardTitle>
                    <CardDescription>Fill out the form below and we&apos;ll get back to you as soon as possible.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full name *</FormLabel>
                              <FormControl><Input placeholder="Your name" {...field} className="bg-background" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl><Input type="email" placeholder="your@email.com" {...field} className="bg-background" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (optional)</FormLabel>
                            <FormControl><Input type="tel" placeholder="+1 (555) 000-0000" {...field} className="bg-background" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        {/* Honeypot */}
                        <FormField control={form.control} name="website" render={({ field }) => (
                          <FormItem className="absolute left-[-9999px] opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
                            <FormLabel>Website</FormLabel>
                            <FormControl><Input type="text" autoComplete="off" tabIndex={-1} {...field} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="message" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message *</FormLabel>
                            <FormControl><Textarea placeholder="Write your message here..." rows={6} {...field} className="bg-background resize-y" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
                          {isSubmitting ? "Sending..." : <><Send className="h-4 w-4 mr-2" />Send Message</>}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
