-- Add is_headline column to articles table
ALTER TABLE public.articles 
ADD COLUMN is_headline boolean NOT NULL DEFAULT false;

-- Create function to ensure only one headline exists at a time
CREATE OR REPLACE FUNCTION public.ensure_single_headline()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If setting this article as headline, remove headline from all other articles
    IF NEW.is_headline = true THEN
        UPDATE public.articles 
        SET is_headline = false 
        WHERE id != NEW.id AND is_headline = true;
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger to run before insert or update
CREATE TRIGGER ensure_single_headline_trigger
BEFORE INSERT OR UPDATE ON public.articles
FOR EACH ROW
WHEN (NEW.is_headline = true)
EXECUTE FUNCTION public.ensure_single_headline();