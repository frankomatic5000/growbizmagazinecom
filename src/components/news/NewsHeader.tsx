"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const categories = [
  { name: "Culture & Arts", path: "/category/culture_arts" },
  { name: "Education", path: "/category/education" },
  { name: "Entrepreneurship & Business", path: "/category/entrepreneurship_business" },
  { name: "Society & Humanity", path: "/category/society_humanity" },
  { name: "Psychology & Well-Being", path: "/category/psychology_wellbeing" },
  { name: "Sustainability & Future", path: "/category/sustainability_future" },
  { name: "Lifestyle with Purpose", path: "/category/lifestyle_purpose" },
  { name: "Events", path: "/category/events" },
  { name: "Opinion & Essays", path: "/category/opinion_essays" },
  { name: "Biographies", path: "/category/biographies" },
];

export function NewsHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-white/10 shadow-sm">
      {/* Top bar */}
      <div className="bg-black/90">
        <div className="news-container py-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">
              {new Date().toLocaleDateString("en-US", {
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
      <div className="news-container py-4 bg-black">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-growbiz.jpg"
              alt="GrowBiz - A Global Media of Virtues"
              width={240}
              height={96}
              className="h-24 md:h-28 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4 gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0 text-white hover:text-white hover:bg-white/10">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full text-white hover:text-white hover:bg-transparent"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-white hover:bg-white/10"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-white hover:bg-white/10"
            >
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
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                autoFocus
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full text-white hover:text-white hover:bg-transparent"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Navigation */}
      <nav className="border-t border-white/10 bg-black">
        <div className="news-container">
          <ul className="hidden md:flex items-center gap-1 py-2 overflow-x-auto">
            {categories.map((category) => (
              <li key={category.path}>
                <Link
                  href={category.path}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors whitespace-nowrap"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          {isMenuOpen && (
            <ul className="md:hidden py-4 space-y-1">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link
                    href={category.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-white hover:text-white hover:bg-white/10 rounded transition-colors"
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
