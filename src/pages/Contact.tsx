import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import NewsHeader from "@/components/news/NewsHeader";
import NewsFooter from "@/components/news/NewsFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const contactSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("Email inválido").max(255),
  phone: z.string().max(20).optional(),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
      });

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo seu contato. Responderemos em breve.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NewsHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Entre em Contato
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Estamos aqui para ouvir você. Envie sua mensagem, sugestão ou dúvida.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Contact Info Cards */}
              <div className="space-y-6">
                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-display text-xl">Telefone</CardTitle>
                    <CardDescription>Ligue para nós</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-medium">
                      (XX) XXXX-XXXX
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Segunda a Sexta, 9h às 18h
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="font-display text-xl">WhatsApp</CardTitle>
                    <CardDescription>Mensagem rápida</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-medium">
                      (XX) XXXXX-XXXX
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Respondemos em até 24h
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="font-display text-xl">E-mail</CardTitle>
                    <CardDescription>Envie um e-mail</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-medium">
                      contato@growbiz.com
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Para parcerias e imprensa
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-display text-2xl">
                      Envie sua mensagem
                    </CardTitle>
                    <CardDescription>
                      Preencha o formulário abaixo e entraremos em contato o mais breve possível.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome completo *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Seu nome" 
                                    {...field} 
                                    className="bg-background"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>E-mail *</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="seu@email.com" 
                                    {...field}
                                    className="bg-background"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone (opcional)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="tel" 
                                  placeholder="(XX) XXXXX-XXXX" 
                                  {...field}
                                  className="bg-background"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mensagem *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Escreva sua mensagem aqui..."
                                  rows={6}
                                  {...field}
                                  className="bg-background resize-y"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full md:w-auto"
                        >
                          {isSubmitting ? (
                            "Enviando..."
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Enviar Mensagem
                            </>
                          )}
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

      <NewsFooter />
    </div>
  );
};

export default Contact;
