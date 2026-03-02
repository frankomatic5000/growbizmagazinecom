import { type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, message, website } = body;

  // Honeypot check
  if (website && website.length > 0) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: phone || null,
    message,
  });

  if (error) {
    return new Response(JSON.stringify({ error: "Submission failed" }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
