import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface VerifyCodeRequest {
  email: string;
  userId: string;
  code: string;
}

// Rate limiting for brute-force protection
const rateLimitMap = new Map<string, { count: number; resetTime: number; blocked: boolean }>();
const RATE_LIMIT_MAX = 5; // Max 5 attempts per window
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minute block after exceeded

function checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  // Check if blocked
  if (entry?.blocked && now < entry.resetTime) {
    return { allowed: false, remainingAttempts: 0 };
  }
  
  // Reset if window expired
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS, blocked: false });
    return { allowed: true, remainingAttempts: RATE_LIMIT_MAX - 1 };
  }
  
  // Block if limit exceeded
  if (entry.count >= RATE_LIMIT_MAX) {
    entry.blocked = true;
    entry.resetTime = now + BLOCK_DURATION_MS;
    return { allowed: false, remainingAttempts: 0 };
  }
  
  entry.count++;
  return { allowed: true, remainingAttempts: RATE_LIMIT_MAX - entry.count };
}

function getClientIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
         req.headers.get("x-real-ip") || 
         "unknown";
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const clientIP = getClientIP(req);
    
    const { email, userId, code }: VerifyCodeRequest = await req.json();

    // Input validation first (before rate limit check for valid requests)
    if (!email || !userId || !code) {
      return new Response(
        JSON.stringify({ error: "Email, userId e código são obrigatórios" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate code format (6 digits only)
    if (!/^\d{6}$/.test(code)) {
      return new Response(
        JSON.stringify({ valid: false, error: "Formato de código inválido" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Rate limit check with user-specific key
    const rateLimitKey = `${clientIP}:${userId}`;
    const { allowed, remainingAttempts } = checkRateLimit(rateLimitKey);
    
    if (!allowed) {
      console.warn(`Rate limit exceeded for verification: ${rateLimitKey}`);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Muitas tentativas incorretas. Aguarde 30 minutos.",
          blocked: true 
        }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find the code
    const { data: codeData, error: fetchError } = await supabaseAdmin
      .from("admin_verification_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .gte("expires_at", new Date().toISOString())
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching code:", fetchError);
      return new Response(
        JSON.stringify({ error: "Erro ao verificar código" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!codeData) {
      console.log(`Invalid code attempt for ${email}, remaining: ${remainingAttempts}`);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Código inválido ou expirado",
          remainingAttempts 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark code as used
    await supabaseAdmin
      .from("admin_verification_codes")
      .update({ used: true })
      .eq("id", codeData.id);

    // Clear rate limit on successful verification
    rateLimitMap.delete(rateLimitKey);

    console.log("Code verified successfully for:", email);

    return new Response(
      JSON.stringify({ valid: true, message: "Código verificado com sucesso" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in verify-admin-code:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
