import { useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MagazineConfig, MagazinePage } from '@/types/magazine';
import { MagazinePageRenderer } from '@/components/magazine/MagazinePageRenderer';

interface MagazinePreviewProps {
  config: MagazineConfig;
  articleTitle: string;
  articleSubtitle: string;
  onClose?: () => void;
}

export function MagazinePreview({
  config,
  articleTitle,
  articleSubtitle,
  onClose
}: MagazinePreviewProps) {
  const bookRef = useRef<any>(null);

  const handlePrevPage = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const handleNextPage = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  if (config.pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-900 text-white">
        <p>Nenhuma página para visualizar</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-neutral-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-800/80 border-b border-neutral-700">
        <h3 className="text-white font-medium">Pré-visualização da Revista</h3>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-neutral-700"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Flipbook Container */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative">
          {/* @ts-ignore - react-pageflip types issue */}
          <HTMLFlipBook
            ref={bookRef}
            width={400}
            height={550}
            size="stretch"
            minWidth={300}
            maxWidth={600}
            minHeight={400}
            maxHeight={800}
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
            <div className="magazine-page bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-8">
              <div className="text-center text-white">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
                  {articleTitle || 'Título da Revista'}
                </h1>
                {articleSubtitle && (
                  <p className="text-lg opacity-90 font-serif italic">
                    {articleSubtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Content Pages */}
            {config.pages.map((page, index) => (
              <div key={page.id} className="magazine-page bg-white">
                <MagazinePageRenderer page={page} />
              </div>
            ))}

            {/* Back Cover */}
            <div className="magazine-page bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center p-8">
              <div className="text-center text-white/60">
                <p className="font-serif italic">Fim</p>
              </div>
            </div>
          </HTMLFlipBook>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 bg-neutral-800/80 border-t border-neutral-700">
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
  );
}
