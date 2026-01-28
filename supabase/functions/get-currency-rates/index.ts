import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface CurrencyRate {
  name: string;
  code: string;
  value: number;
  previous_value: number | null;
  change: number;
  last_update: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if this is an update request (from cron) or just a read request
    const url = new URL(req.url);
    const isUpdate = url.searchParams.get('update') === 'true';

    if (isUpdate) {
      // Fetch fresh rates from external APIs
      console.log('Fetching fresh rates from external APIs...');
      
      // Fetch forex rates from Frankfurter API (free, no key required)
      const forexResponse = await fetch(
        'https://api.frankfurter.app/latest?from=USD&to=EUR,BRL,JPY'
      );
      
      if (!forexResponse.ok) {
        throw new Error(`Forex API error: ${forexResponse.status}`);
      }
      
      const forexData = await forexResponse.json();
      console.log('Forex data:', forexData);

      // Fetch Bitcoin price from CoinGecko (free, no key required)
      const btcResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
      );
      
      if (!btcResponse.ok) {
        throw new Error(`CoinGecko API error: ${btcResponse.status}`);
      }
      
      const btcData = await btcResponse.json();
      console.log('Bitcoin data:', btcData);

      const lastUpdate = new Date().toISOString();

      // Calculate values in USD
      const eurRate = forexData.rates?.EUR || 0.92;
      const brlRate = forexData.rates?.BRL || 5.85;
      const jpyRate = forexData.rates?.JPY || 155.50;
      const btcValue = btcData.bitcoin?.usd || 67890;

      const currencies = [
        { code: 'USD', name: 'DÓLAR/EUA', value: 1.00 },
        { code: 'EUR', name: 'EURO/EUR', value: 1 / eurRate },
        { code: 'BRL', name: 'REAL/BR', value: 1 / brlRate },
        { code: 'JPY', name: 'IENE/JPY', value: 1 / jpyRate },
        { code: 'BTC', name: 'BITCOIN', value: btcValue },
      ];

      // Update each currency in the database
      for (const currency of currencies) {
        // Get current value from database to use as previous_value
        const { data: existingRate } = await supabase
          .from('currency_rates')
          .select('value')
          .eq('code', currency.code)
          .maybeSingle();

        const previousValue = existingRate?.value || currency.value;
        const change = previousValue > 0 
          ? ((currency.value - previousValue) / previousValue) * 100 
          : 0;

        // Upsert the rate
        const { error } = await supabase
          .from('currency_rates')
          .upsert({
            code: currency.code,
            name: currency.name,
            value: currency.value,
            previous_value: previousValue,
            change: change,
            last_update: lastUpdate,
          }, {
            onConflict: 'code',
          });

        if (error) {
          console.error(`Error upserting ${currency.code}:`, error);
        }
      }

      console.log('Rates updated successfully');
    }

    // Always return the current rates from the database
    const { data: rates, error } = await supabase
      .from('currency_rates')
      .select('*')
      .order('code');

    if (error) {
      console.error('Error fetching rates from database:', error);
      throw error;
    }

    // If no rates in database yet, fetch and store them
    if (!rates || rates.length === 0) {
      console.log('No rates in database, fetching initial data...');
      
      // Redirect to update mode
      const updateUrl = new URL(req.url);
      updateUrl.searchParams.set('update', 'true');
      
      // Fetch forex rates
      const forexResponse = await fetch(
        'https://api.frankfurter.app/latest?from=USD&to=EUR,BRL,JPY'
      );
      const forexData = await forexResponse.json();
      
      // Fetch Bitcoin
      const btcResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
      );
      const btcData = await btcResponse.json();

      const lastUpdate = new Date().toISOString();
      const eurRate = forexData.rates?.EUR || 0.92;
      const brlRate = forexData.rates?.BRL || 5.85;
      const jpyRate = forexData.rates?.JPY || 155.50;
      const btcValue = btcData.bitcoin?.usd || 67890;

      const initialRates: CurrencyRate[] = [
        { code: 'USD', name: 'DÓLAR/EUA', value: 1.00, previous_value: null, change: 0, last_update: lastUpdate },
        { code: 'EUR', name: 'EURO/EUR', value: 1 / eurRate, previous_value: null, change: 0, last_update: lastUpdate },
        { code: 'BRL', name: 'REAL/BR', value: 1 / brlRate, previous_value: null, change: 0, last_update: lastUpdate },
        { code: 'JPY', name: 'IENE/JPY', value: 1 / jpyRate, previous_value: null, change: 0, last_update: lastUpdate },
        { code: 'BTC', name: 'BITCOIN', value: btcValue, previous_value: null, change: 0, last_update: lastUpdate },
      ];

      // Insert initial rates
      for (const rate of initialRates) {
        await supabase
          .from('currency_rates')
          .upsert({
            code: rate.code,
            name: rate.name,
            value: rate.value,
            previous_value: rate.previous_value,
            change: rate.change,
            last_update: rate.last_update,
          }, {
            onConflict: 'code',
          });
      }

      return new Response(JSON.stringify({ 
        rates: initialRates, 
        lastUpdate 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Transform database format to API format
    const formattedRates = rates.map(rate => ({
      name: rate.name,
      code: rate.code,
      value: Number(rate.value),
      change: Number(rate.change),
      lastUpdate: rate.last_update,
    }));

    // Sort rates in desired order
    const orderMap: Record<string, number> = { 'USD': 0, 'EUR': 1, 'BRL': 2, 'JPY': 3, 'BTC': 4 };
    formattedRates.sort((a, b) => (orderMap[a.code] ?? 99) - (orderMap[b.code] ?? 99));

    const lastUpdate = rates[0]?.last_update || new Date().toISOString();

    return new Response(JSON.stringify({ rates: formattedRates, lastUpdate }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error fetching currency rates:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
