-- Add is_featured column to articles table
ALTER TABLE public.articles 
ADD COLUMN is_featured boolean NOT NULL DEFAULT false;