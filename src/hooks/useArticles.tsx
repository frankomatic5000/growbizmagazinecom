import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Article = Database['public']['Tables']['articles']['Row'];
type ArticleInsert = Database['public']['Tables']['articles']['Insert'];
type ArticleUpdate = Database['public']['Tables']['articles']['Update'];
type ArticleCategory = Database['public']['Enums']['article_category'];

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async (publishedOnly = true) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (publishedOnly) {
        query = query.eq('is_published', true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setArticles(data || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setIsLoading(false);
    }
  };

  const getArticleById = async (id: string): Promise<Article | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      return data;
    } catch (err) {
      console.error('Error fetching article:', err);
      return null;
    }
  };

  const getArticlesByCategory = async (category: ArticleCategory): Promise<Article[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('category', category)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching articles by category:', err);
      return [];
    }
  };

  const getMostReadArticles = async (limit = 5): Promise<Article[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('view_count', { ascending: false })
        .limit(limit);

      if (fetchError) {
        throw fetchError;
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching most read articles:', err);
      return [];
    }
  };

  const createArticle = async (article: Omit<ArticleInsert, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<Article | null> => {
    try {
      const insertData: ArticleInsert = {
        ...article,
        published_at: article.is_published ? new Date().toISOString() : null,
      };

      const { data, error: insertError } = await supabase
        .from('articles')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return data;
    } catch (err) {
      console.error('Error creating article:', err);
      throw err;
    }
  };

  const updateArticle = async (id: string, updates: ArticleUpdate): Promise<Article | null> => {
    try {
      // If publishing for the first time, set published_at
      if (updates.is_published === true) {
        const existing = await getArticleById(id);
        if (existing && !existing.published_at) {
          updates.published_at = new Date().toISOString();
        }
      }

      const { data, error: updateError } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      return data;
    } catch (err) {
      console.error('Error updating article:', err);
      throw err;
    }
  };

  const deleteArticle = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      return true;
    } catch (err) {
      console.error('Error deleting article:', err);
      throw err;
    }
  };

  const incrementViewCount = async (id: string): Promise<void> => {
    try {
      await supabase.rpc('increment_view_count', { article_id: id });
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  const searchArticles = async (query: string): Promise<Article[]> => {
    try {
      const { data, error: searchError } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,body.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (searchError) {
        throw searchError;
      }

      return data || [];
    } catch (err) {
      console.error('Error searching articles:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    isLoading,
    error,
    fetchArticles,
    getArticleById,
    getArticlesByCategory,
    getMostReadArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    incrementViewCount,
    searchArticles,
  };
}

export type { Article, ArticleInsert, ArticleUpdate, ArticleCategory };
