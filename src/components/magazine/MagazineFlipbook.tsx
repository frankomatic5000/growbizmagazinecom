import { useRef, useCallback, useState } from 'react';
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

export function MagazineFlipbook({
  config,
  articleTitle,
  articleSubtitle,
  mainImage
}: MagazineFlipbookProps) {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevPage = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const handleNextPage = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  const handlePageFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const totalPages = config.pages.length + 2; // +2 for cover and back cover

  const FlipbookContent = ({ width, height, isFullscreen = false }: { width: number; height: number; isFullscreen?: boolean }) => (
    <div className="relative select-none">
      {/* @ts-ignore - react-pageflip types issue */}
      <HTMLFlipBook
        ref={bookRef}
        width={width}
        height={height}
        size="fixed"
        minWidth={280}
        maxWidth={1200}
        minHeight={400}
        maxHeight={1600}
        showCover={true}
        mobileScrollSupport={false}
        className="magazine-flipbook shadow-2xl"
        style={{}}
        startPage={0}
        drawShadow={true}
        flippingTime={600}
        usePortrait={false}
        startZIndex={0}
        autoSize={false}
        maxShadowOpacity={0.4}
        showPageCorners={false}
        disableFlipByClick={true}
        useMouseEvents={true}
        swipeDistance={50}
        clickEventForward={false}
        onFlip={handlePageFlip}
      >
        {/* Cover Page */}
        <div className="magazine-page relative overflow-hidden" data-density="hard">
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
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
          )}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white text-center">
            <h1 className={`font-bold mb-4 font-serif leading-tight ${isFullscreen ? 'text-3xl md:text-5xl' : 'text-xl md:text-3xl'}`}>
              {articleTitle}
            </h1>
            {articleSubtitle && (
              <p className={`opacity-90 font-serif italic max-w-md ${isFullscreen ? 'text-lg md:text-2xl' : 'text-sm md:text-base'}`}>
                {articleSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Content Pages */}
        {config.pages.map((page) => (
          <div key={page.id} className="magazine-page bg-white" data-density="soft">
            <MagazinePageRenderer page={page} />
          </div>
        ))}

        {/* Back Cover */}
        <div className="magazine-page bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center p-8" data-density="hard">
          <div className="text-center text-white/50">
            <div className="w-16 h-0.5 bg-white/30 mx-auto mb-4" />
            <p className="font-serif italic text-sm">Fim da leitura</p>
            <div className="w-16 h-0.5 bg-white/30 mx-auto mt-4" />
          </div>
        </div>
      </HTMLFlipBook>
    </div>
  );

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

        {/* Flipbook */}
        <div className="flex items-center justify-center py-8 px-4">
          <FlipbookContent width={320} height={450} isFullscreen={false} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 px-4 py-4 bg-neutral-800/60">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="text-white hover:bg-neutral-700 disabled:opacity-30"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <span className="text-white/60 text-sm min-w-[100px] text-center">
            Página {currentPage + 1} de {totalPages}
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="text-white hover:bg-neutral-700 disabled:opacity-30"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[100vw] w-screen h-screen max-h-screen p-0 bg-neutral-900 border-none">
          <DialogTitle className="sr-only">Revista em Tela Cheia</DialogTitle>
          <DialogDescription className="sr-only">Visualize a revista em modo de tela cheia com navegação por páginas</DialogDescription>
          
          <div className="flex flex-col h-full">
            {/* Fullscreen Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-neutral-800/80">
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

            {/* Fullscreen Flipbook */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
              <FlipbookContent width={550} height={750} isFullscreen={true} />
            </div>

            {/* Fullscreen Navigation */}
            <div className="flex items-center justify-center gap-8 px-6 py-4 bg-neutral-800/80">
              <Button
                variant="ghost"
                size="lg"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="text-white hover:bg-neutral-700 disabled:opacity-30"
              >
                <ChevronLeft className="h-6 w-6 mr-2" />
                Anterior
              </Button>
              
              <span className="text-white/60 text-base">
                {currentPage + 1} / {totalPages}
              </span>
              
              <Button
                variant="ghost"
                size="lg"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className="text-white hover:bg-neutral-700 disabled:opacity-30"
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
