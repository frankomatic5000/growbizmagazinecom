import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const footerLinks = {
  institutional: [
    { name: "About Us", path: "/about" },
    { name: "Mission", path: "/mission" },
    { name: "Vision", path: "/vision" },
    { name: "Editorial Principles", path: "/editorial-principles" },
    { name: "Values", path: "/values" },
    { name: "Contact", path: "/contact" },
  ],
  categories: [
    { name: "Culture & Arts", path: "/category/culture_arts" },
    { name: "Education", path: "/category/education" },
    { name: "Entrepreneurship & Business", path: "/category/entrepreneurship_business" },
    { name: "Society & Humanity", path: "/category/society_humanity" },
  ],
  legal: [
    { name: "Privacy Policy", path: "/privacy-policy" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, url: "https://instagram.com/growbizmagazine" },
];

export default function NewsFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-12">
      <div className="news-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-serif font-semibold tracking-tight">GrowBiz</h2>
                <span className="text-[9px] font-sans font-medium tracking-[0.15em] text-muted-foreground uppercase">
                  A Global Media of Virtues
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Your trusted source for stories that reveal meaning, beauty, and depth. Covering inspiring journeys from around the world with credibility and sensitivity.
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
            <h3 className="font-semibold text-lg mb-4">Institutional</h3>
            <ul className="space-y-2">
              {footerLinks.institutional.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">
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
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GrowBiz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
