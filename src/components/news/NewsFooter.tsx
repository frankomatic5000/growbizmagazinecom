import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  institutional: [
    { name: 'Sobre Nós', path: '/sobre' },
    { name: 'Equipe', path: '/equipe' },
    { name: 'Contato', path: '/contact' },
    { name: 'Trabalhe Conosco', path: '/carreiras' },
  ],
  categories: [
    { name: 'Notícias', path: '/categoria/news' },
    { name: 'Política', path: '/categoria/politics' },
    { name: 'Economia', path: '/categoria/economy' },
    { name: 'Esportes', path: '/categoria/sports' },
  ],
  legal: [
    { name: 'Política de Privacidade', path: '/privacy-policy' },
    { name: 'Termos de Uso', path: '/termos' },
    { name: 'Cookies', path: '/cookies' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: '#' },
  { name: 'Twitter', icon: Twitter, url: '#' },
  { name: 'Instagram', icon: Instagram, url: '#' },
  { name: 'Youtube', icon: Youtube, url: '#' },
];

export default function NewsFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-12">
      <div className="news-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <div className="flex flex-col">
                <h2 className="text-2xl font-serif font-semibold tracking-tight">
                  GrowBiz
                </h2>
                <span className="text-[9px] font-sans font-medium tracking-[0.15em] text-muted-foreground uppercase">
                  A Global Media of Virtues
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Sua fonte confiável de notícias e informações. Cobrindo os principais
              acontecimentos do Brasil e do mundo com credibilidade e imparcialidade.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/20 hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Institutional */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Institucional</h3>
            <ul className="space-y-2">
              {footerLinks.institutional.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categorias</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GrowBiz. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
