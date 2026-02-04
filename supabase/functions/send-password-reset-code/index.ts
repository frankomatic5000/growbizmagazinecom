import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const MAILERSEND_API_KEY = Deno.env.get("MAILERSEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SendCodeRequest {
  email: string;
}

// Rate limiting for spam protection
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 3; // Max 3 requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  entry.count++;
  return true;
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
    // Rate limiting check
    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for password reset IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Muitas tentativas. Aguarde uma hora." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!MAILERSEND_API_KEY) {
      console.error("MAILERSEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Serviço de email não configurado" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email }: SendCodeRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email é obrigatório" }),
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

    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Query user by email - use listUsers with filter for efficiency
    const { data: usersData, error: userError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    // Find user by email from the list (since direct email lookup isn't available)
    // For better performance with large user bases, consider using a database query
    const user = usersData?.users?.find(u => u.email === email);

    if (userError || !user) {
      // Return success even if user not found (security best practice - prevents enumeration)
      console.log("User not found or error, returning success for security");
      return new Response(
        JSON.stringify({ success: true, message: "Se o email existir, um código será enviado" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Delete any existing unused codes for this user
    await supabaseAdmin
      .from("admin_verification_codes")
      .delete()
      .eq("user_id", user.id)
      .eq("used", false);

    // Insert new code
    const { error: insertError } = await supabaseAdmin
      .from("admin_verification_codes")
      .insert({
        user_id: user.id,
        email: email,
        code: code,
        expires_at: expiresAt,
        used: false,
      });

    if (insertError) {
      console.error("Error inserting code:", insertError);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar código" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send email with code using MailerSend REST API
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #000000; padding: 30px; text-align: center;">
              <h1 style="color: #FFD700; margin: 0; font-size: 28px; font-weight: bold;">GrowBiz Magazine</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px;">Recuperação de Senha</h2>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Use o código abaixo para redefinir sua senha. Este código expira em 10 minutos.
              </p>
              <div style="background-color: #f8f9fa; border: 2px dashed #FFD700; border-radius: 8px; padding: 25px; text-align: center; margin: 0 0 30px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #000000; font-family: monospace;">${code}</span>
              </div>
              <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 0;">
                Se você não solicitou a recuperação de senha, ignore este email. Por segurança, não compartilhe este código com ninguém.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="color: #999999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} GrowBiz Magazine. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MAILERSEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: {
          email: "noreply@test-3m5jgroy1ddgdpyo.mlsender.net",
          name: "GrowBiz Magazine"
        },
        to: [
          {
            email: email,
            name: email
          }
        ],
        subject: "Recuperação de Senha - GrowBiz Admin",
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Error sending email:", errorData);
      return new Response(
        JSON.stringify({ error: "Erro ao enviar email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Password reset code sent successfully to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Código enviado com sucesso", userId: user.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in send-password-reset-code:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
