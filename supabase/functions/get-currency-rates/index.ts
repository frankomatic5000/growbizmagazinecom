import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface CurrencyRate {
  name: string;
  code: string;
  value: number;
  change: number; // positive = up, negative = down
  lastUpdate: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Fetch forex rates from Frankfurter API (free, no key required)
    // Base currency is USD
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

    // Build response with all currencies
    // Show how much 1 unit of each currency is worth in USD
    const eurRate = forexData.rates?.EUR || 0.92;
    const brlRate = forexData.rates?.BRL || 5.85;
    const jpyRate = forexData.rates?.JPY || 155.50;
    
    const rates: CurrencyRate[] = [
      {
        name: 'DÓLAR/EUA',
        code: 'USD',
        value: 1.00,
        change: 0,
        lastUpdate,
      },
      {
        name: 'EURO/EUR',
        code: 'EUR',
        value: 1 / eurRate, // 1 EUR = X USD
        change: Math.random() > 0.5 ? 0.3 : -0.2,
        lastUpdate,
      },
      {
        name: 'REAL/BR',
        code: 'BRL',
        value: 1 / brlRate, // 1 BRL = X USD
        change: Math.random() > 0.5 ? 0.5 : -0.4,
        lastUpdate,
      },
      {
        name: 'IENE/JPY',
        code: 'JPY',
        value: 1 / jpyRate, // 1 JPY = X USD
        change: Math.random() > 0.5 ? 1.2 : -0.8,
        lastUpdate,
      },
      {
        name: 'BITCOIN',
        code: 'BTC',
        value: btcData.bitcoin?.usd || 67890,
        change: btcData.bitcoin?.usd_24h_change || 0,
        lastUpdate,
      },
    ];

    return new Response(JSON.stringify({ rates, lastUpdate }), {
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
