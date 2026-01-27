-- Create table for email verification codes
CREATE TABLE public.admin_verification_codes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_verification_codes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own codes (for verification)
CREATE POLICY "Users can view their own codes"
ON public.admin_verification_codes
FOR SELECT
USING (user_id = auth.uid());

-- Allow insert via service role only (edge function)
-- No insert policy for regular users - edge function uses service role

-- Create index for faster lookups
CREATE INDEX idx_admin_verification_codes_user_email 
ON public.admin_verification_codes(user_id, email, used);

-- Auto-cleanup old codes (optional function)
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.admin_verification_codes 
    WHERE expires_at < now() OR used = true;
END;
$$;