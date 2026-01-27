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
              Política de Privacidade
            </h1>

            {/* Last Updated */}
            <p className="text-muted-foreground mb-12">
              Última atualização: 27 de Janeiro de 2026
            </p>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Na GrowBiz, respeitamos sua privacidade e estamos comprometidos em proteger suas informações pessoais.
                Esta Política de Privacidade explica como coletamos, usamos e protegemos seus dados quando você visita
                nosso portal de notícias ou interage com nossos serviços.
              </p>

              {/* Section 1 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Informações que Coletamos
                </h2>
                <p className="text-muted-foreground mb-4">
                  Coletamos informações que você nos fornece diretamente, incluindo:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Nome e endereço de e-mail quando você se inscreve em nossa newsletter</li>
                  <li>Informações de contato quando você envia mensagens através do nosso formulário de contato</li>
                  <li>Dados de navegação e preferências de categorias de notícias</li>
                  <li>Qualquer outra informação que você escolha fornecer ao se comunicar conosco</li>
                </ul>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Como Usamos Suas Informações
                </h2>
                <p className="text-muted-foreground mb-4">
                  Utilizamos as informações coletadas para:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Enviar newsletters e atualizações sobre notícias nas categorias de seu interesse</li>
                  <li>Personalizar sua experiência de navegação em nosso portal</li>
                  <li>Responder às suas perguntas e fornecer suporte</li>
                  <li>Melhorar nosso site e serviços editoriais</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Categorias de Conteúdo
                </h2>
                <p className="text-muted-foreground mb-4">
                  A GrowBiz oferece conteúdo editorial nas seguintes categorias:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Cultura & Artes</li>
                  <li>Educação</li>
                  <li>Empreendedorismo & Negócios</li>
                  <li>Sociedade & Humanidade</li>
                  <li>Psicologia & Bem-estar</li>
                  <li>Sustentabilidade & Futuro</li>
                  <li>Lifestyle & Propósito</li>
                  <li>Eventos</li>
                  <li>Opinião & Ensaios</li>
                  <li>Biografias</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Compartilhamento de Informações
                </h2>
                <p className="text-muted-foreground mb-4">
                  Não vendemos, trocamos ou alugamos suas informações pessoais a terceiros. Podemos compartilhar suas
                  informações apenas nas seguintes circunstâncias:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Com provedores de serviço que nos auxiliam na operação do site e condução de nossos negócios</li>
                  <li>Quando exigido por lei ou para proteger nossos direitos</li>
                  <li>Com seu consentimento explícito</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Cookies e Rastreamento
                </h2>
                <p className="text-muted-foreground">
                  Utilizamos cookies e tecnologias similares de rastreamento para melhorar sua experiência de navegação,
                  lembrar suas preferências de leitura e analisar o tráfego do site. Você pode controlar as preferências
                  de cookies através das configurações do seu navegador.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Seus Direitos
                </h2>
                <p className="text-muted-foreground mb-4">
                  Você tem o direito de:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Acessar, atualizar ou excluir suas informações pessoais</li>
                  <li>Cancelar a inscrição da nossa newsletter a qualquer momento</li>
                  <li>Opor-se ao processamento dos seus dados</li>
                  <li>Solicitar uma cópia dos seus dados</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Para exercer qualquer um desses direitos, entre em contato conosco através da nossa{" "}
                  <a
                    href="/contact"
                    className="text-primary underline underline-offset-4 decoration-2 hover:text-primary/80 transition-colors"
                  >
                    página de contato
                  </a>
                  .
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Segurança dos Dados
                </h2>
                <p className="text-muted-foreground">
                  Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações pessoais
                  contra acesso não autorizado, alteração, divulgação ou destruição.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Privacidade de Menores
                </h2>
                <p className="text-muted-foreground">
                  Nosso site não é destinado a menores de 13 anos. Não coletamos intencionalmente informações pessoais
                  de crianças menores de 13 anos.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Alterações nesta Política
                </h2>
                <p className="text-muted-foreground">
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre quaisquer
                  alterações publicando a nova Política de Privacidade nesta página e atualizando a data de
                  "Última atualização".
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                  Contato
                </h2>
                <p className="text-muted-foreground">
                  Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através
                  da nossa{" "}
                  <a
                    href="/contact"
                    className="text-primary underline underline-offset-4 decoration-2 hover:text-primary/80 transition-colors"
                  >
                    página de contato
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
