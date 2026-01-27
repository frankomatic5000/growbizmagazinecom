import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { name: "Culture & Arts", path: "/categoria/culture_arts" },
  { name: "Education", path: "/categoria/education" },
  { name: "Entrepreneurship & Business", path: "/categoria/entrepreneurship_business" },
  { name: "Society & Humanity", path: "/categoria/society_humanity" },
  { name: "Psychology & Well-Being", path: "/categoria/psychology_wellbeing" },
  { name: "Sustainability & Future", path: "/categoria/sustainability_future" },
  { name: "Lifestyle with Purpose", path: "/categoria/lifestyle_purpose" },
  { name: "Events", path: "/categoria/events" },
  { name: "Opinion & Essays", path: "/categoria/opinion_essays" },
  { name: "Biographies", path: "/categoria/biographies" },
];

export default function NewsHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="news-container py-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="news-container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            {/* Container adicionado para centralizar o texto */}
            <div className="flex flex-col items-center">
              <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground tracking-tight">GrowBiz</h1>
              <span className="text-[10px] md:text-xs font-sans font-medium tracking-[0.2em] text-muted-foreground uppercase">
                A Global Media of Virtues
              </span>
            </div>
          </Link>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10"
              />
              <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="mt-4 md:hidden">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10"
                autoFocus
              />
              <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Navigation */}
      <nav className="border-t border-border bg-card">
        <div className="news-container">
          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1 py-2 overflow-x-auto">
            {categories.map((category) => (
              <li key={category.path}>
                <Link
                  to={category.path}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded transition-colors whitespace-nowrap"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile nav */}
          {isMenuOpen && (
            <ul className="md:hidden py-4 space-y-1">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link
                    to={category.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}
