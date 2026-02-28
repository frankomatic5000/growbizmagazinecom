-- Remove overly permissive INSERT/UPDATE policies on currency_rates
-- Service role bypasses RLS by default, so no policies needed for writes
DROP POLICY IF EXISTS "Service role can insert rates" ON public.currency_rates;
DROP POLICY IF EXISTS "Service role can update rates" ON public.currency_rates;