import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { MagazinePage, MagazineImage } from '@/types/magazine';

interface MagazinePageRendererProps {
  page: MagazinePage;
}

export function MagazinePageRenderer({ page }: MagazinePageRendererProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const getImageByPosition = (position: MagazineImage['position']) => {
    return page.images.find(img => img.position === position);
  };

  const renderImage = (image: MagazineImage | undefined, className: string = '') => {
    if (!image?.url) return null;
    
    return (
      <div 
        className={`relative cursor-zoom-in ${className}`}
        onClick={() => setZoomedImage(image.url)}
      >
        <img
          src={image.url}
          alt={image.caption || ''}
          className={`w-full h-full ${image.fit === 'cover' ? 'object-cover' : 'object-contain'}`}
        />
        {image.caption && (
          <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 text-center">
            {image.caption}
          </p>
        )}
      </div>
    );
  };

  const paragraphs = page.text.split('\n\n').filter(p => p.trim());

  const pageStyle = {
    backgroundColor: page.backgroundColor || '#ffffff',
    color: page.textColor || '#1a1a1a'
  };

  const renderContent = () => {
    switch (page.layoutType) {
      case 'full-image': {
        const bgImage = getImageByPosition('background');
        return (
          <div className="relative w-full h-full" style={pageStyle}>
            {bgImage?.url && (
              <div 
                className="absolute inset-0 cursor-zoom-in"
                onClick={() => setZoomedImage(bgImage.url)}
              >
                <img
                  src={bgImage.url}
                  alt=""
                  className={`w-full h-full ${bgImage.fit === 'cover' ? 'object-cover' : 'object-contain'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="prose prose-sm prose-invert max-w-none">
                {paragraphs.map((p, i) => (
                  <p key={i} className="font-serif leading-relaxed mb-3 last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'image-left': {
        const mainImage = getImageByPosition('main');
        return (
          <div className="grid grid-cols-2 h-full" style={pageStyle}>
            <div className="h-full">
              {renderImage(mainImage, 'h-full')}
            </div>
            <div className="p-6 overflow-auto">
              <div className="prose prose-sm max-w-none">
                {paragraphs.map((p, i) => (
                  <p key={i} className="font-serif leading-relaxed mb-4 text-sm">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'image-right': {
        const mainImage = getImageByPosition('main');
        return (
          <div className="grid grid-cols-2 h-full" style={pageStyle}>
            <div className="p-6 overflow-auto">
              <div className="prose prose-sm max-w-none">
                {paragraphs.map((p, i) => (
                  <p key={i} className="font-serif leading-relaxed mb-4 text-sm">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div className="h-full">
              {renderImage(mainImage, 'h-full')}
            </div>
          </div>
        );
      }

      case 'two-columns': {
        const mainImage = getImageByPosition('main');
        const secondaryImage = getImageByPosition('secondary');
        return (
          <div className="flex flex-col h-full" style={pageStyle}>
            <div className="grid grid-cols-2 gap-3 p-4 h-1/2">
              {renderImage(mainImage, 'h-full rounded')}
              {renderImage(secondaryImage, 'h-full rounded')}
            </div>
            <div className="flex-1 p-4 pt-0 overflow-auto">
              <div className="prose prose-sm max-w-none">
                {paragraphs.map((p, i) => (
                  <p key={i} className="font-serif leading-relaxed mb-3 text-sm">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'header-image': {
        const mainImage = getImageByPosition('main');
        return (
          <div className="flex flex-col h-full" style={pageStyle}>
            <div className="h-2/5">
              {renderImage(mainImage, 'h-full')}
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="prose prose-sm max-w-none">
                {paragraphs.map((p, i) => (
                  <p key={i} className="font-serif leading-relaxed mb-4 text-sm">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'text-only': {
        return (
          <div className="h-full p-8 overflow-auto" style={pageStyle}>
            <div className="prose prose-sm max-w-none">
              {paragraphs.length > 0 && (
                <p className="font-serif text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                  {paragraphs[0]}
                </p>
              )}
              {paragraphs.slice(1).map((p, i) => (
                <p key={i} className="font-serif leading-relaxed mb-4 text-sm">
                  {p}
                </p>
              ))}
            </div>
          </div>
        );
      }

      case 'gallery-grid': {
        const gridImages = [
          getImageByPosition('grid-1'),
          getImageByPosition('grid-2'),
          getImageByPosition('grid-3'),
          getImageByPosition('grid-4')
        ];
        return (
          <div className="flex flex-col h-full" style={pageStyle}>
            <div className="grid grid-cols-2 gap-2 p-3 h-3/5">
              {gridImages.map((img, i) => (
                <div key={i} className="rounded overflow-hidden">
                  {img?.url ? renderImage(img, 'h-full') : (
                    <div className="h-full bg-muted" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex-1 p-4 pt-0 overflow-auto">
              <div className="prose prose-sm max-w-none">
                {paragraphs.map((p, i) => (
                  <p key={i} className="font-serif leading-relaxed mb-3 text-xs">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full h-full overflow-hidden">
        {renderContent()}
        {/* Page number */}
        <div className="absolute bottom-2 right-3 text-xs text-muted-foreground font-mono">
          {page.pageNumber}
        </div>
      </div>

      {/* Zoom Dialog */}
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden">
          <DialogTitle className="sr-only">Imagem em tela cheia</DialogTitle>
          {zoomedImage && (
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="w-full h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
