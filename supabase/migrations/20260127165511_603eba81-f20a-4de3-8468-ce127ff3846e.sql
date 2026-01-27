-- Create contact messages table
CREATE TABLE public.contact_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert messages (public contact form)
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Only admins can read messages
CREATE POLICY "Admins can view all messages"
ON public.contact_messages
FOR SELECT
USING (is_admin());

-- Only admins can update messages (mark as read)
CREATE POLICY "Admins can update messages"
ON public.contact_messages
FOR UPDATE
USING (is_admin());

-- Only admins can delete messages
CREATE POLICY "Admins can delete messages"
ON public.contact_messages
FOR DELETE
USING (is_admin());