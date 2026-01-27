import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useArticles } from '@/hooks/useArticles';
import type { ArticleCategory } from '@/hooks/useArticles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const articleSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  subtitle: z.string().max(300, 'Subtítulo muito longo').optional(),
  author: z.string().min(1, 'Autor é obrigatório').max(100, 'Nome muito longo'),
  category: z.enum(['culture_arts', 'education', 'entrepreneurship_business', 'society_humanity', 'psychology_wellbeing', 'sustainability_future', 'lifestyle_purpose', 'events', 'opinion_essays', 'biographies']),
  main_image: z.string().url('URL de imagem inválida').optional().or(z.literal('')),
  body: z.string().min(1, 'Conteúdo é obrigatório'),
  is_published: z.boolean(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

const categories = [
  { value: 'culture_arts', label: 'Culture & Arts' },
  { value: 'education', label: 'Education' },
  { value: 'entrepreneurship_business', label: 'Entrepreneurship & Business' },
  { value: 'society_humanity', label: 'Society & Humanity' },
  { value: 'psychology_wellbeing', label: 'Psychology & Well-Being' },
  { value: 'sustainability_future', label: 'Sustainability & Future' },
  { value: 'lifestyle_purpose', label: 'Lifestyle with Purpose' },
  { value: 'events', label: 'Events' },
  { value: 'opinion_essays', label: 'Opinion & Essays' },
  { value: 'biographies', label: 'Biographies' },
];

export default function AdminArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { getArticleById, createArticle, updateArticle } = useArticles();

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    subtitle: '',
    author: '',
    category: 'culture_arts',
    main_image: '',
    body: '',
    is_published: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/secure-content-editor-2026/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id || !isAdmin) return;

      setIsFetching(true);
      try {
        const article = await getArticleById(id);
        if (article) {
          setFormData({
            title: article.title,
            subtitle: article.subtitle || '',
            author: article.author,
            category: article.category as ArticleCategory,
            main_image: article.main_image || '',
            body: article.body,
            is_published: article.is_published,
          });
        } else {
          toast.error('Artigo não encontrado');
          navigate('/secure-content-editor-2026');
        }
      } catch (err) {
        toast.error('Erro ao carregar artigo');
        navigate('/secure-content-editor-2026');
      } finally {
        setIsFetching(false);
      }
    };

    if (isEditing && isAdmin) {
      loadArticle();
    }
  }, [id, isAdmin, isEditing, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const validation = articleSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && id) {
        await updateArticle(id, {
          title: formData.title,
          subtitle: formData.subtitle || null,
          author: formData.author,
          category: formData.category,
          main_image: formData.main_image || null,
          body: formData.body,
          is_published: formData.is_published,
        });
        toast.success('Artigo atualizado com sucesso');
      } else {
        await createArticle({
          title: formData.title,
          subtitle: formData.subtitle || null,
          author: formData.author,
          category: formData.category,
          main_image: formData.main_image || null,
          body: formData.body,
          is_published: formData.is_published,
          created_by: user?.id,
        });
        toast.success('Artigo criado com sucesso');
      }

      navigate('/secure-content-editor-2026');
    } catch (err) {
      console.error('Error saving article:', err);
      toast.error('Erro ao salvar artigo');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/secure-content-editor-2026"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </Link>
            <h1 className="text-xl font-bold">
              {isEditing ? 'Editar Artigo' : 'Novo Artigo'}
            </h1>
          </div>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="admin-card space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Digite o título da notícia"
                className="admin-input text-lg"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                placeholder="Digite um subtítulo (opcional)"
                className="admin-input"
              />
              {errors.subtitle && (
                <p className="text-sm text-destructive">{errors.subtitle}</p>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="admin-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Autor *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                  placeholder="Nome do autor"
                  className="admin-input"
                />
                {errors.author && (
                  <p className="text-sm text-destructive">{errors.author}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value as ArticleCategory,
                    }))
                  }
                >
                  <SelectTrigger className="admin-select">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="admin-card space-y-4">
            <div className="space-y-2">
              <Label htmlFor="main_image">Imagem Principal (URL)</Label>
              <div className="flex gap-2">
                <Input
                  id="main_image"
                  value={formData.main_image}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      main_image: e.target.value,
                    }))
                  }
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="admin-input flex-1"
                />
              </div>
              {errors.main_image && (
                <p className="text-sm text-destructive">{errors.main_image}</p>
              )}
            </div>

            {formData.main_image && (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={formData.main_image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {!formData.main_image && (
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                  <p>Cole uma URL de imagem acima</p>
                </div>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="admin-card space-y-4">
            <div className="space-y-2">
              <Label htmlFor="body">Conteúdo *</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, body: e.target.value }))
                }
                placeholder="Digite o conteúdo da notícia. Use duas quebras de linha para criar parágrafos."
                className="admin-textarea min-h-[400px]"
              />
              {errors.body && (
                <p className="text-sm text-destructive">{errors.body}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Dica: Use duas quebras de linha para separar parágrafos.
              </p>
            </div>
          </div>

          {/* Publish toggle */}
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_published" className="text-base font-medium">
                  Publicar artigo
                </Label>
                <p className="text-sm text-muted-foreground">
                  Artigos publicados ficam visíveis para todos os visitantes.
                </p>
              </div>
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_published: checked }))
                }
              />
            </div>
          </div>

          {/* Submit button (mobile) */}
          <div className="md:hidden">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Artigo
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
