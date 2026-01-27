-- First, update any existing articles to a valid category before changing the enum
UPDATE public.articles SET category = 'news' WHERE category IS NOT NULL;

-- Drop and recreate the enum with new values
ALTER TYPE article_category RENAME TO article_category_old;

CREATE TYPE article_category AS ENUM (
  'culture_arts',
  'education',
  'entrepreneurship_business',
  'society_humanity',
  'psychology_wellbeing',
  'sustainability_future',
  'lifestyle_purpose',
  'events',
  'opinion_essays',
  'biographies'
);

-- Update the column to use the new enum
ALTER TABLE public.articles 
  ALTER COLUMN category DROP DEFAULT,
  ALTER COLUMN category TYPE article_category USING 'culture_arts'::article_category,
  ALTER COLUMN category SET DEFAULT 'culture_arts'::article_category;

-- Drop the old enum type
DROP TYPE article_category_old;