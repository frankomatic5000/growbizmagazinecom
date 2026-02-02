import { useState } from 'react';
import { Plus, BookOpen, Eye, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MagazinePageEditor } from './MagazinePageEditor';
import { MagazinePreview } from './MagazinePreview';
import type { MagazinePage, MagazineConfig } from '@/types/magazine';
import { createEmptyPage } from '@/types/magazine';

interface MagazineBuilderProps {
  config: MagazineConfig;
  onChange: (config: MagazineConfig) => void;
  articleTitle?: string;
  articleSubtitle?: string;
}

export function MagazineBuilder({
  config,
  onChange,
  articleTitle = '',
  articleSubtitle = ''
}: MagazineBuilderProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleAddPage = () => {
    const newPage = createEmptyPage(config.pages.length + 1);
    onChange({
      ...config,
      pages: [...config.pages, newPage]
    });
  };

  const handleUpdatePage = (index: number, updatedPage: MagazinePage) => {
    const newPages = [...config.pages];
    newPages[index] = updatedPage;
    onChange({ ...config, pages: newPages });
  };

  const handleDeletePage = (index: number) => {
    const newPages = config.pages.filter((_, i) => i !== index);
    // Reorder page numbers
    const reorderedPages = newPages.map((page, i) => ({
      ...page,
      pageNumber: i + 1
    }));
    onChange({ ...config, pages: reorderedPages });
  };

  const handleMovePage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.pages.length) return;

    const newPages = [...config.pages];
    [newPages[index], newPages[newIndex]] = [newPages[newIndex], newPages[index]];
    
    // Reorder page numbers
    const reorderedPages = newPages.map((page, i) => ({
      ...page,
      pageNumber: i + 1
    }));
    onChange({ ...config, pages: reorderedPages });
  };

  const handleDuplicatePage = (index: number) => {
    const pageToDuplicate = config.pages[index];
    const newPage: MagazinePage = {
      ...pageToDuplicate,
      id: crypto.randomUUID(),
      pageNumber: config.pages.length + 1,
      images: pageToDuplicate.images.map(img => ({
        ...img,
        id: crypto.randomUUID()
      }))
    };
    onChange({
      ...config,
      pages: [...config.pages, newPage]
    });
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="flex items-center gap-2">
                Construtor de Revista
                <Badge variant="secondary">{config.pages.length} páginas</Badge>
              </CardTitle>
              <CardDescription>
                Monte as páginas da sua revista com diferentes layouts e imagens
              </CardDescription>
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={config.pages.length === 0}>
                  <Eye className="h-4 w-4 mr-2" />
                  Pré-visualizar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0">
                <DialogTitle className="sr-only">Pré-visualização da Revista</DialogTitle>
                <MagazinePreview
                  config={config}
                  articleTitle={articleTitle}
                  articleSubtitle={articleSubtitle}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {config.pages.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <LayoutGrid className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma página criada</h3>
            <p className="text-muted-foreground mb-4">
              Comece adicionando a primeira página da sua revista
            </p>
            <Button onClick={handleAddPage}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Página
            </Button>
          </div>
        ) : (
          <ScrollArea className="max-h-[600px]">
            <div className="space-y-4 pr-4">
              {config.pages.map((page, index) => (
                <MagazinePageEditor
                  key={page.id}
                  page={page}
                  pageIndex={index}
                  totalPages={config.pages.length}
                  onChange={(updatedPage) => handleUpdatePage(index, updatedPage)}
                  onDelete={() => handleDeletePage(index)}
                  onMoveUp={() => handleMovePage(index, 'up')}
                  onMoveDown={() => handleMovePage(index, 'down')}
                  onDuplicate={() => handleDuplicatePage(index)}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {config.pages.length > 0 && (
          <Button onClick={handleAddPage} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Nova Página
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
