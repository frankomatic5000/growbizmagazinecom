import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { 
  MagazinePage, 
  MagazineImage, 
  LayoutType 
} from '@/types/magazine';
import { 
  LAYOUT_TEMPLATES, 
  createEmptyImage 
} from '@/types/magazine';

interface MagazinePageEditorProps {
  page: MagazinePage;
  pageIndex: number;
  totalPages: number;
  onChange: (page: MagazinePage) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
}

export function MagazinePageEditor({
  page,
  pageIndex,
  totalPages,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate
}: MagazinePageEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const template = LAYOUT_TEMPLATES[page.layoutType];

  const handleLayoutChange = (layoutType: LayoutType) => {
    const newTemplate = LAYOUT_TEMPLATES[layoutType];
    const newImages: MagazineImage[] = newTemplate.imagePositions.map(position => {
      const existing = page.images.find(img => img.position === position);
      return existing || createEmptyImage(position);
    });

    onChange({
      ...page,
      layoutType,
      images: newImages
    });
  };

  const handleTextChange = (text: string) => {
    onChange({ ...page, text });
  };

  const handleImageChange = (imageId: string, updates: Partial<MagazineImage>) => {
    const newImages = page.images.map(img => 
      img.id === imageId ? { ...img, ...updates } : img
    );
    onChange({ ...page, images: newImages });
  };

  const handleAddImage = (position: MagazineImage['position']) => {
    const newImage = createEmptyImage(position);
    onChange({ ...page, images: [...page.images, newImage] });
  };

  const handleRemoveImage = (imageId: string) => {
    onChange({ ...page, images: page.images.filter(img => img.id !== imageId) });
  };

  return (
    <Card className="border-2 border-border hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <GripVertical className="h-5 w-5 cursor-grab" />
            </div>
            <Badge variant="outline" className="font-mono">
              Página {pageIndex + 1}
            </Badge>
            <CardTitle className="text-sm font-medium">
              {template.icon} {template.name}
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
              disabled={pageIndex === 0}
              title="Mover para cima"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
              disabled={pageIndex === totalPages - 1}
              title="Mover para baixo"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
              title="Duplicar página"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-destructive hover:text-destructive"
              title="Excluir página"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            >
              {isExpanded ? 'Recolher' : 'Expandir'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Layout Selector */}
          <div className="space-y-2">
            <Label>Tipo de Layout</Label>
            <Select
              value={page.layoutType}
              onValueChange={(value) => handleLayoutChange(value as LayoutType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LAYOUT_TEMPLATES).map(([key, template]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span>{template.icon}</span>
                      <span>{template.name}</span>
                      <span className="text-muted-foreground text-xs">
                        - {template.description}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Images Section */}
          {template.imagePositions.length > 0 && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Imagens ({template.imagePositions.length} posição(ões))
              </Label>
              
              <div className="grid gap-3">
                {template.imagePositions.map((position) => {
                  const image = page.images.find(img => img.position === position);
                  
                  return (
                    <div key={position} className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="capitalize">
                          {position.replace('-', ' ')}
                        </Badge>
                        {image && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(image.id); }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      {image ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="URL da imagem"
                            value={image.url}
                            onChange={(e) => handleImageChange(image.id, { url: e.target.value })}
                          />
                          
                          {image.url && (
                            <div className="relative aspect-video rounded overflow-hidden bg-background">
                              <img
                                src={image.url}
                                alt="Preview"
                                className={`w-full h-full ${image.fit === 'cover' ? 'object-cover' : 'object-contain'}`}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Select
                              value={image.fit}
                              onValueChange={(value) => handleImageChange(image.id, { fit: value as 'cover' | 'contain' })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cover">Preencher</SelectItem>
                                <SelectItem value="contain">Conter</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Legenda (opcional)"
                              value={image.caption || ''}
                              onChange={(e) => handleImageChange(image.id, { caption: e.target.value })}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={(e) => { e.stopPropagation(); handleAddImage(position); }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Imagem
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Separator />

          {/* Text Content */}
          <div className="space-y-2">
            <Label>Texto da Página</Label>
            <Textarea
              placeholder="Digite o conteúdo de texto desta página..."
              value={page.text}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={6}
              className="font-serif"
            />
            <p className="text-xs text-muted-foreground">
              Use duas quebras de linha para separar parágrafos.
            </p>
          </div>

          {/* Optional Styling */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Cor de Fundo</Label>
              <Input
                type="color"
                value={page.backgroundColor || '#ffffff'}
                onChange={(e) => onChange({ ...page, backgroundColor: e.target.value })}
                className="h-10 p-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Cor do Texto</Label>
              <Input
                type="color"
                value={page.textColor || '#000000'}
                onChange={(e) => onChange({ ...page, textColor: e.target.value })}
                className="h-10 p-1"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
