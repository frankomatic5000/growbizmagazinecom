import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

// Rate limiting for brute-force protection
const rateLimitMap = new Map<string, { count: number; resetTime: number; blocked: boolean }>();
const RATE_LIMIT_MAX = 5; // Max 5 attempts per window
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour block after exceeded

function checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (entry?.blocked && now < entry.resetTime) {
    return { allowed: false, remainingAttempts: 0 };
  }
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS, blocked: false });
    return { allowed: true, remainingAttempts: RATE_LIMIT_MAX - 1 };
  }
  
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
    
    const { email, code, newPassword }: ResetPasswordRequest = await req.json();

    // Input validation
    if (!email || !code || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Email, código e nova senha são obrigatórios" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Formato de email inválido" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      return new Response(
        JSON.stringify({ success: false, error: "Formato de código inválido" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return new Response(
        JSON.stringify({ error: "A senha deve ter pelo menos 8 caracteres" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (newPassword.length > 72) {
      return new Response(
        JSON.stringify({ error: "A senha não pode ter mais de 72 caracteres" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Rate limit check with email-specific key
    const rateLimitKey = `${clientIP}:${email}`;
    const { allowed, remainingAttempts } = checkRateLimit(rateLimitKey);
    
    if (!allowed) {
      console.warn(`Rate limit exceeded for password reset: ${rateLimitKey}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Muitas tentativas incorretas. Aguarde uma hora.",
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
      console.log(`Invalid reset code attempt for ${email}, remaining: ${remainingAttempts}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
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

    // Update the user's password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      codeData.user_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Error updating password:", updateError);
      return new Response(
        JSON.stringify({ error: "Erro ao atualizar senha" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Clear rate limit on success
    rateLimitMap.delete(rateLimitKey);

    console.log("Password reset successfully for:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Senha alterada com sucesso" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in reset-password-with-code:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
