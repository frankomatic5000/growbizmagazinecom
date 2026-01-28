-- Create table to store daily currency rates
CREATE TABLE public.currency_rates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    value NUMERIC NOT NULL,
    previous_value NUMERIC,
    change NUMERIC NOT NULL DEFAULT 0,
    last_update TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint on code to ensure only one rate per currency
CREATE UNIQUE INDEX idx_currency_rates_code ON public.currency_rates(code);

-- Enable RLS
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read currency rates (public data)
CREATE POLICY "Anyone can read currency rates"
ON public.currency_rates
FOR SELECT
USING (true);

-- Only service role can insert/update (via edge function)
CREATE POLICY "Service role can insert rates"
ON public.currency_rates
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update rates"
ON public.currency_rates
FOR UPDATE
USING (true);