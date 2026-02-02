-- Add magazine layout support to articles table
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS is_magazine_layout boolean NOT NULL DEFAULT false;

ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS magazine_pages jsonb DEFAULT '[]'::jsonb;

-- Add comment to explain the magazine_pages structure
COMMENT ON COLUMN public.articles.magazine_pages IS 'JSON array of magazine pages. Each page: { text: string, images: [{url: string, position: string}], layout_type: string, background_color: string }';

-- Create index for magazine layout articles
CREATE INDEX IF NOT EXISTS idx_articles_magazine_layout ON public.articles (is_magazine_layout) WHERE is_magazine_layout = true;