import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  Newspaper,
  Loader2,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useArticles } from '@/hooks/useArticles';
import type { Article } from '@/hooks/useArticles';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const categoryLabels: Record<string, string> = {
  news: 'Notícias',
  politics: 'Política',
  economy: 'Economia',
  sports: 'Esportes',
  entertainment: 'Entretenimento',
  technology: 'Tecnologia',
  opinion: 'Opinião',
};

export default function AdminDashboard() {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { fetchArticles, deleteArticle, updateArticle } = useArticles();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication - only redirect if not loading and no user
    if (!authLoading && !user) {
      navigate('/secure-content-editor-2026/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // After auth+role are resolved, block non-admins
    if (!authLoading && user && !isAdmin) {
      toast.error('Acesso negado. Você não tem permissão de administrador.');
      signOut();
      navigate('/secure-content-editor-2026/login');
    }
  }, [authLoading, user, isAdmin, signOut, navigate]);

  useEffect(() => {
    const loadArticles = async () => {
      if (!isAdmin) return;

      setIsLoading(true);
      try {
        // Fetch all articles (including unpublished)
        const { data, error } = await import('@/integrations/supabase/client').then(
          (m) =>
            m.supabase
              .from('articles')
              .select('*')
              .order('created_at', { ascending: false })
        );

        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        console.error('Error loading articles:', err);
        toast.error('Erro ao carregar artigos');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      loadArticles();
    }
  }, [isAdmin]);

  const handleDelete = async () => {
    if (!articleToDelete) return;

    try {
      await deleteArticle(articleToDelete);
      setArticles((prev) => prev.filter((a) => a.id !== articleToDelete));
      toast.success('Artigo excluído com sucesso');
    } catch (err) {
      toast.error('Erro ao excluir artigo');
    } finally {
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  const togglePublish = async (article: Article) => {
    try {
      await updateArticle(article.id, { is_published: !article.is_published });
      setArticles((prev) =>
        prev.map((a) =>
          a.id === article.id ? { ...a, is_published: !a.is_published } : a
        )
      );
      toast.success(
        article.is_published ? 'Artigo despublicado' : 'Artigo publicado'
      );
    } catch (err) {
      toast.error('Erro ao atualizar artigo');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/secure-content-editor-2026/login');
  };

  // Loading while auth/role is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // We'll be redirected by the effect above
  if (!user || !isAdmin) {
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="admin-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Newspaper className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Artigos</p>
                <p className="text-2xl font-bold">{articles.length}</p>
              </div>
            </div>
          </div>
          <div className="admin-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Publicados</p>
                <p className="text-2xl font-bold">
                  {articles.filter((a) => a.is_published).length}
                </p>
              </div>
            </div>
          </div>
          <div className="admin-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <EyeOff className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rascunhos</p>
                <p className="text-2xl font-bold">
                  {articles.filter((a) => !a.is_published).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Gerenciar Artigos</h2>
          <Link to="/secure-content-editor-2026/novo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Artigo
            </Button>
          </Link>
        </div>

        {/* Articles table */}
        <div className="admin-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum artigo criado
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro artigo.
              </p>
              <Link to="/secure-content-editor-2026/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Artigo
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Categoria</th>
                    <th>Autor</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Views</th>
                    <th className="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{article.title}</p>
                          {article.subtitle && (
                            <p className="text-sm text-muted-foreground truncate">
                              {article.subtitle}
                            </p>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="text-sm">
                          {categoryLabels[article.category] || article.category}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm">{article.author}</span>
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            article.is_published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {article.is_published ? (
                            <>
                              <Eye className="h-3 w-3" />
                              Publicado
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              Rascunho
                            </>
                          )}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(article.created_at), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm">{article.view_count}</span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublish(article)}
                            title={
                              article.is_published ? 'Despublicar' : 'Publicar'
                            }
                          >
                            {article.is_published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Link
                            to={`/secure-content-editor-2026/editar/${article.id}`}
                          >
                            <Button variant="ghost" size="icon" title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setArticleToDelete(article.id);
                              setDeleteDialogOpen(true);
                            }}
                            title="Excluir"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir artigo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O artigo será permanentemente
              excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
