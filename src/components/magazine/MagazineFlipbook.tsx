import { useRef, useCallback, useState, forwardRef } from "react";
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

// Wrapper para as páginas - necessário para react-pageflip
const Page = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = "" }, ref) => {
    return (
      <div ref={ref} className={`magazine-page ${className}`}>
        {children}
      </div>
    );
  },
);
Page.displayName = "Page";

export function MagazineFlipbook({ config, articleTitle, articleSubtitle, mainImage }: MagazineFlipbookProps) {
  const bookRef = useRef<any>(null);
  const fullscreenBookRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();

  const handlePrevPage = useCallback(() => {
    const book = isFullscreen ? fullscreenBookRef.current : bookRef.current;
    if (book && book.pageFlip) {
      book.pageFlip().flipPrev();
    }
  }, [isFullscreen]);

  const handleNextPage = useCallback(() => {
    const book = isFullscreen ? fullscreenBookRef.current : bookRef.current;
    if (book && book.pageFlip) {
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

  // Proporções A4: 210mm x 297mm = ratio 1:1.414
  const A4_RATIO = 1.414;

  const getRegularDimensions = () => {
    const maxWidth = Math.min(window.innerWidth * 0.8, 300);
    const width = maxWidth;
    const height = width * A4_RATIO;
    return { width, height };
  };

  const getFullscreenDimensions = () => {
    if (isMobile) {
      // Mobile: calcular baseado na altura disponível
      const availableHeight = window.innerHeight - 80; // Espaço para navegação
      const heightBasedWidth = availableHeight / A4_RATIO;
      const maxWidth = window.innerWidth - 24;
      const width = Math.min(heightBasedWidth, maxWidth);
      const height = width * A4_RATIO;
      return { width: Math.floor(width), height: Math.floor(height) };
    }
    // Desktop: baseado na altura
    const availableHeight = window.innerHeight - 120;
    const width = Math.min(availableHeight / A4_RATIO, 500);
    const height = width * A4_RATIO;
    return { width: Math.floor(width), height: Math.floor(height) };
  };

  const regularDims = getRegularDimensions();
  const fullscreenDims = getFullscreenDimensions();

  return (
    <>
      {/* Regular View */}
      <div className="bg-secondary rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-secondary/80">
          <span className="text-secondary-foreground/70 text-sm font-medium">📖 Modo Revista</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="text-secondary-foreground/70 hover:text-secondary-foreground hover:bg-secondary-foreground/10"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Tela Cheia
          </Button>
        </div>

        {/* Flipbook Container */}
        <div className="flex items-center justify-center py-6 px-2 overflow-hidden">
          <div className="relative">
            {/* @ts-ignore - react-pageflip types issue */}
            <HTMLFlipBook
              ref={bookRef}
              width={regularDims.width}
              height={regularDims.height}
              size="fixed"
              minWidth={200}
              maxWidth={400}
              minHeight={280}
              maxHeight={600}
              showCover={true}
              mobileScrollSupport={false}
              className="magazine-flipbook"
              style={{}}
              startPage={0}
              drawShadow={true}
              flippingTime={600}
              usePortrait={true}
              startZIndex={0}
              autoSize={false}
              maxShadowOpacity={0.5}
              showPageCorners={false}
              disableFlipByClick={true}
              useMouseEvents={true}
              swipeDistance={0}
              clickEventForward={false}
            >
              {/* Cover Page */}
              <Page className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80">
                {mainImage ? (
                  <>
                    <img
                      src={mainImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  </>
                ) : null}
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-primary-foreground text-center">
                  <h1 className="text-xl md:text-2xl font-bold mb-3 font-serif leading-tight">{articleTitle}</h1>
                  {articleSubtitle && (
                    <p className="text-sm opacity-90 font-serif italic max-w-xs">{articleSubtitle}</p>
                  )}
                </div>
              </Page>

              {/* Content Pages */}
              {config.pages.map((page) => (
                <Page key={page.id} className="bg-background page-with-scroll">
                  <MagazinePageRenderer page={page} isFullscreen={false} />
                </Page>
              ))}

              {/* Back Cover */}
              <Page className="bg-gradient-to-br from-secondary to-secondary/90 flex items-center justify-center p-8">
                <div className="text-center text-secondary-foreground/60">
                  <p className="font-serif italic">FIM</p>
                </div>
              </Page>
            </HTMLFlipBook>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 px-4 py-3 bg-secondary/80 border-t border-border">
          <Button variant="ghost" size="icon" onClick={handlePrevPage} className="text-secondary-foreground hover:bg-secondary-foreground/10">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span className="text-secondary-foreground/60 text-sm">Use as setas para navegar</span>
          <Button variant="ghost" size="icon" onClick={handleNextPage} className="text-secondary-foreground hover:bg-secondary-foreground/10">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[100vw] w-screen h-screen max-h-screen p-0 bg-secondary border-none [&>button]:hidden">
          <DialogTitle className="sr-only">Revista em Tela Cheia</DialogTitle>
          <DialogDescription className="sr-only">Visualize a revista em modo tela cheia</DialogDescription>

          <div className="flex flex-col h-full">
            {/* Fullscreen Header - escondido no mobile */}
            {!isMobile && (
              <div className="flex items-center justify-between px-6 py-3 bg-secondary/80 shrink-0">
                <h3 className="text-secondary-foreground font-medium truncate max-w-[60%]">{articleTitle}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(false)}
                  className="text-secondary-foreground hover:bg-secondary-foreground/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Fechar
                </Button>
              </div>
            )}

            {/* Mobile close button - posicionado no canto */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(false)}
                className="absolute top-2 right-2 z-50 text-secondary-foreground bg-secondary/80 hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </Button>
            )}

            {/* Fullscreen Flipbook */}
            <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
              {/* @ts-ignore - react-pageflip types issue */}
              <HTMLFlipBook
                ref={fullscreenBookRef}
                width={fullscreenDims.width}
                height={fullscreenDims.height}
                size="fixed"
                minWidth={200}
                maxWidth={600}
                minHeight={280}
                maxHeight={900}
                showCover={true}
                mobileScrollSupport={false}
                className="magazine-flipbook"
                style={{}}
                startPage={0}
                drawShadow={!isMobile}
                flippingTime={500}
                usePortrait={true}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={isMobile ? 0.2 : 0.4}
                showPageCorners={false}
                disableFlipByClick={true}
                useMouseEvents={true}
                swipeDistance={0}
                clickEventForward={false}
              >
                {/* Cover Page */}
                <Page className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80">
                  {mainImage ? (
                    <>
                      <img
                        src={mainImage}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                    </>
                  ) : null}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 md:p-8 text-primary-foreground text-center">
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 font-serif leading-tight">
                      {articleTitle}
                    </h1>
                    {articleSubtitle && (
                      <p className="text-base md:text-xl opacity-90 font-serif italic max-w-md">{articleSubtitle}</p>
                    )}
                  </div>
                </Page>

                {/* Content Pages */}
                {config.pages.map((page) => (
                  <Page key={page.id} className="bg-background page-with-scroll">
                    <MagazinePageRenderer page={page} isFullscreen={true} />
                  </Page>
                ))}

                {/* Back Cover */}
                <Page className="bg-gradient-to-br from-secondary to-secondary/90 flex items-center justify-center p-8">
                  <div className="text-center text-secondary-foreground/60">
                    <p className="font-serif italic text-xl">FIM</p>
                  </div>
                </Page>
              </HTMLFlipBook>
            </div>

            {/* Fullscreen Navigation - compacto no mobile */}
            <div className={`flex items-center justify-center gap-4 md:gap-8 px-4 md:px-6 py-2 md:py-3 bg-secondary/80 shrink-0 ${isMobile ? 'safe-area-bottom' : ''}`}>
              <Button 
                variant="ghost" 
                size={isMobile ? "icon" : "lg"} 
                onClick={handlePrevPage} 
                className="text-secondary-foreground hover:bg-secondary-foreground/10"
              >
                <ChevronLeft className="h-6 w-6" />
                {!isMobile && <span className="ml-2">Anterior</span>}
              </Button>

              {!isMobile && (
                <span className="text-secondary-foreground/60 text-sm">Use as setas para navegar</span>
              )}

              <Button 
                variant="ghost" 
                size={isMobile ? "icon" : "lg"} 
                onClick={handleNextPage} 
                className="text-secondary-foreground hover:bg-secondary-foreground/10"
              >
                {!isMobile && <span className="mr-2">Próxima</span>}
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
