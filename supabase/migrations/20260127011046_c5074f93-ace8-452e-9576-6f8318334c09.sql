-- Create app_role enum for role management
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create categories enum
CREATE TYPE public.article_category AS ENUM ('news', 'politics', 'economy', 'sports', 'entertainment', 'technology', 'opinion');

-- Create articles table
CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    author TEXT NOT NULL,
    main_image TEXT,
    body TEXT NOT NULL,
    category article_category NOT NULL DEFAULT 'news',
    is_published BOOLEAN NOT NULL DEFAULT false,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Create helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(auth.uid(), 'admin')
$$;

-- RLS Policies for user_roles table
-- Only admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin() OR user_id = auth.uid());

-- Only admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Only admins can update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin());

-- RLS Policies for articles table
-- Anyone can read published articles
CREATE POLICY "Anyone can read published articles"
ON public.articles
FOR SELECT
USING (is_published = true OR public.is_admin());

-- Only admins can insert articles
CREATE POLICY "Admins can insert articles"
ON public.articles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Only admins can update articles
CREATE POLICY "Admins can update articles"
ON public.articles
FOR UPDATE
TO authenticated
USING (public.is_admin());

-- Only admins can delete articles
CREATE POLICY "Admins can delete articles"
ON public.articles
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(article_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.articles
    SET view_count = view_count + 1
    WHERE id = article_id AND is_published = true;
END;
$$;