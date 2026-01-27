import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
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
  Mail,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminUserManager } from '@/components/admin/AdminUserManager';
import AdminContactMessages from '@/components/admin/AdminContactMessages';
import { toast } from 'sonner';

const categoryLabels: Record<string, string> = {
  culture_arts: 'Culture & Arts',
  education: 'Education',
  entrepreneurship_business: 'Entrepreneurship & Business',
  society_humanity: 'Society & Humanity',
  psychology_wellbeing: 'Psychology & Well-Being',
  sustainability_future: 'Sustainability & Future',
  lifestyle_purpose: 'Lifestyle with Purpose',
  events: 'Events',
  opinion_essays: 'Opinion & Essays',
  biographies: 'Biographies',
};

export default function AdminDashboard() {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { deleteArticle, updateArticle } = useArticles();
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
      toast.error('Access denied. You do not have admin permissions.');
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
        toast.error('Error loading articles');
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
      toast.success('Article deleted successfully');
    } catch (err) {
      toast.error('Error deleting article');
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
        article.is_published ? 'Article unpublished' : 'Article published'
      );
    } catch (err) {
      toast.error('Error updating article');
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
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              {user?.email}
            </span>
            <AdminUserManager />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="admin-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Newspaper className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Articles</p>
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
                    <p className="text-sm text-muted-foreground">Published</p>
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
                    <p className="text-sm text-muted-foreground">Drafts</p>
                    <p className="text-2xl font-bold">
                      {articles.filter((a) => !a.is_published).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Manage Articles</h2>
              <Link to="/secure-content-editor-2026/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Article
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
                    No articles created
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start by creating your first article.
                  </p>
                  <Link to="/secure-content-editor-2026/novo">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Article
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Views</th>
                        <th className="text-right">Actions</th>
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
                                  Published
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3" />
                                  Draft
                                </>
                              )}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(article.created_at), 'MM/dd/yyyy', {
                                locale: enUS,
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
                                  article.is_published ? 'Unpublish' : 'Publish'
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
                                <Button variant="ghost" size="icon" title="Edit">
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
                                title="Delete"
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
          </TabsContent>

          <TabsContent value="messages">
            <AdminContactMessages />
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete article?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The article will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
