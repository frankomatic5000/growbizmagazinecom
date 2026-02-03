import { useRef, useCallback, useState, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { MagazineConfig } from '@/types/magazine';
import { MagazinePageRenderer } from './MagazinePageRenderer';

interface MagazineFlipbookProps {
  config: MagazineConfig;
  articleTitle: string;
  articleSubtitle?: string;
  mainImage?: string;
}

// Wrapper para as páginas - necessário para react-pageflip
const Page = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = '' }, ref) => {
    return (
      <div ref={ref} className={`magazine-page ${className}`}>
        {children}
      </div>
    );
  }
);
Page.displayName = 'Page';

export function MagazineFlipbook({
  config,
  articleTitle,
  articleSubtitle,
  mainImage
}: MagazineFlipbookProps) {
  const bookRef = useRef<any>(null);
  const fullscreenBookRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevPage = useCallback(() => {
    if (isFullscreen) {
      fullscreenBookRef.current?.pageFlip()?.flipPrev();
    } else {
      bookRef.current?.pageFlip()?.flipPrev();
    }
  }, [isFullscreen]);

  const handleNextPage = useCallback(() => {
    if (isFullscreen) {
      fullscreenBookRef.current?.pageFlip()?.flipNext();
    } else {
      bookRef.current?.pageFlip()?.flipNext();
    }
  }, [isFullscreen]);

  if (config.pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-neutral-900 text-white rounded-xl">
        <p>Nenhuma página para visualizar</p>
      </div>
    );
  }

  return (
    <>
      {/* Regular View */}
      <div className="bg-neutral-900 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-800/60">
          <span className="text-white/70 text-sm font-medium">
            📖 Modo Revista
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="text-white/70 hover:text-white hover:bg-neutral-700"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Tela Cheia
          </Button>
        </div>

        {/* Flipbook Container */}
        <div className="flex items-center justify-center py-8 px-4 overflow-hidden">
          <div className="relative">
            {/* @ts-ignore - react-pageflip types issue */}
            <HTMLFlipBook
              ref={bookRef}
              width={320}
              height={450}
              size="stretch"
              minWidth={300}
              maxWidth={500}
              minHeight={400}
              maxHeight={700}
              showCover={true}
              mobileScrollSupport={true}
              className="magazine-flipbook"
              style={{}}
              startPage={0}
              drawShadow={true}
              flippingTime={800}
              usePortrait={true}
              startZIndex={0}
              autoSize={true}
              maxShadowOpacity={0.5}
              showPageCorners={true}
              disableFlipByClick={false}
              useMouseEvents={true}
              swipeDistance={30}
              clickEventForward={true}
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
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-white text-center">
                  <h1 className="text-xl md:text-2xl font-bold mb-3 font-serif leading-tight">
                    {articleTitle}
                  </h1>
                  {articleSubtitle && (
                    <p className="text-sm opacity-90 font-serif italic max-w-xs">
                      {articleSubtitle}
                    </p>
                  )}
                </div>
              </Page>

              {/* Content Pages */}
              {config.pages.map((page) => (
                <Page key={page.id} className="bg-white">
                  <MagazinePageRenderer page={page} />
                </Page>
              ))}

              {/* Back Cover */}
              <Page className="bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center p-8">
                <div className="text-center text-white/60">
                  <p className="font-serif italic">Fim</p>
                </div>
              </Page>
            </HTMLFlipBook>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 px-4 py-3 bg-neutral-800/60 border-t border-neutral-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevPage}
            className="text-white hover:bg-neutral-700"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span className="text-white/60 text-sm">
            Clique nas bordas ou arraste para folhear
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPage}
            className="text-white hover:bg-neutral-700"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[100vw] w-screen h-screen max-h-screen p-0 bg-neutral-900 border-none [&>button]:hidden">
          <DialogTitle className="sr-only">Revista em Tela Cheia</DialogTitle>
          <DialogDescription className="sr-only">Visualize a revista em modo de tela cheia</DialogDescription>
          
          <div className="flex flex-col h-full">
            {/* Fullscreen Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-neutral-800/80 shrink-0">
              <h3 className="text-white font-medium truncate max-w-[60%]">
                {articleTitle}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="text-white hover:bg-neutral-700"
              >
                <Minimize2 className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>

            {/* Fullscreen Flipbook - takes all available space, single page mode */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              {/* @ts-ignore - react-pageflip types issue */}
              <HTMLFlipBook
                ref={fullscreenBookRef}
                width={Math.min(window.innerWidth * 0.6, 600)}
                height={Math.min(window.innerHeight - 140, 850)}
                size="fixed"
                minWidth={400}
                maxWidth={700}
                minHeight={500}
                maxHeight={900}
                showCover={true}
                mobileScrollSupport={true}
                className="magazine-flipbook"
                style={{}}
                startPage={0}
                drawShadow={true}
                flippingTime={600}
                usePortrait={true}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={0.4}
                showPageCorners={true}
                disableFlipByClick={false}
                useMouseEvents={true}
                swipeDistance={30}
                clickEventForward={true}
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
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-serif leading-tight">
                      {articleTitle}
                    </h1>
                    {articleSubtitle && (
                      <p className="text-lg md:text-xl opacity-90 font-serif italic max-w-md">
                        {articleSubtitle}
                      </p>
                    )}
                  </div>
                </Page>

                {/* Content Pages */}
                {config.pages.map((page) => (
                  <Page key={page.id} className="bg-white">
                    <MagazinePageRenderer page={page} />
                  </Page>
                ))}

                {/* Back Cover */}
                <Page className="bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center p-8">
                  <div className="text-center text-white/60">
                    <p className="font-serif italic text-xl">Fim</p>
                  </div>
                </Page>
              </HTMLFlipBook>
            </div>

            {/* Fullscreen Navigation */}
            <div className="flex items-center justify-center gap-8 px-6 py-3 bg-neutral-800/80 shrink-0">
              <Button
                variant="ghost"
                size="lg"
                onClick={handlePrevPage}
                className="text-white hover:bg-neutral-700"
              >
                <ChevronLeft className="h-6 w-6 mr-2" />
                Anterior
              </Button>
              
              <span className="text-white/60 text-sm">
                Clique nas bordas ou arraste para folhear
              </span>
              
              <Button
                variant="ghost"
                size="lg"
                onClick={handleNextPage}
                className="text-white hover:bg-neutral-700"
              >
                Próxima
                <ChevronRight className="h-6 w-6 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
