import { useRef, useCallback, useState, forwardRef, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { MagazineConfig } from "@/types/magazine";
import { MagazinePageRenderer } from "./MagazinePageRenderer";
import { useIsMobile } from "@/hooks/use-mobile";

interface MagazineFlipbookProps {
  config: MagazineConfig;
  articleTitle: string;
  articleSubtitle?: string;
  mainImage?: string;
}

// Wrapper para as páginas - ESSENCIAL: overflow-y-auto habilitado para scroll
const Page = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = "" }, ref) => {
    return (
      <div ref={ref} className={`magazine-page ${className}`} style={{ height: '100%', width: '100%' }}>
        <div className="h-full w-full overflow-y-auto overflow-x-hidden page-scroll-container bg-background">
          {children}
        </div>
      </div>
    );
  },
);
Page.displayName = "Page";

export function MagazineFlipbook({ config, articleTitle, articleSubtitle, mainImage }: MagazineFlipbookProps) {
  const bookRef = useRef<any>(null);
  const fullscreenBookRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const isMobile = useIsMobile();

  // Sincronizar página ao mudar de modo
  useEffect(() => {
    if (isFullscreen && fullscreenBookRef.current?.pageFlip) {
      const timer = setTimeout(() => {
        try {
          fullscreenBookRef.current?.pageFlip()?.turnToPage(currentPage);
        } catch (e) {
          console.error("Erro na sincronização:", e);
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen, currentPage]);

  const handleFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  // FUNÇÕES DAS SETAS - CORRIGIDAS
  const handlePrevPage = useCallback(() => {
    const book = isFullscreen ? fullscreenBookRef.current : bookRef.current;
    if (book?.pageFlip) {
      book.pageFlip().flipPrev();
    }
  }, [isFullscreen]);

  const handleNextPage = useCallback(() => {
    const book = isFullscreen ? fullscreenBookRef.current : bookRef.current;
    if (book?.pageFlip) {
      book.pageFlip().flipNext();
    }
  }, [isFullscreen]);

  if (config.pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted text-foreground rounded-xl">
        <p>No pages to view</p>
      </div>
    );
  }

  const A4_RATIO = 1.414;

  const getRegularDimensions = () => {
    const maxWidth = Math.min(window.innerWidth * 0.8, 300);
    const width = maxWidth;
    const height = width * A4_RATIO;
    return { width, height };
  };

  const getFullscreenDimensions = () => {
    if (isMobile) {
      const availableHeight = window.innerHeight - 120;
      const heightBasedWidth = availableHeight / A4_RATIO;
      const width = Math.min(heightBasedWidth, window.innerWidth - 40);
      return { width: Math.floor(width), height: Math.floor(width * A4_RATIO) };
    }
    const availableHeight = window.innerHeight - 150;
    const width = Math.min(availableHeight / A4_RATIO, 500);
    return { width: Math.floor(width), height: Math.floor(width * A4_RATIO) };
  };

  const regularDims = getRegularDimensions();
  const fullscreenDims = getFullscreenDimensions();

  // Configurações unificadas
  const sharedProps = {
    size: "fixed" as const,
    showCover: true,
    mobileScrollSupport: false,
    drawShadow: true,
    flippingTime: 600,
    usePortrait: true,
    startZIndex: 0,
    autoSize: false,
    maxShadowOpacity: 0.5,
    showPageCorners: false,
    disableFlipByClick: true, // Bloqueia clique na página
    useMouseEvents: false,    // Libera o mouse para scroll e setas
    swipeDistance: 0,         // Evita conflitos
    clickEventForward: true,
    onFlip: handleFlip,
  };

  return (
    <>
      <div className="bg-secondary rounded-xl overflow-hidden border border-border">
        {/* HEADER REGULAR */}
        <div className="flex items-center justify-between px-4 py-3 bg-secondary/80">
          <span className="text-secondary-foreground/70 text-sm font-medium">📖 Modo Revista</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="text-secondary-foreground/70 hover:text-secondary-foreground"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Tela Cheia
          </Button>
        </div>

        {/* VIEWPORT REGULAR */}
        <div className="flex items-center justify-center py-6 px-