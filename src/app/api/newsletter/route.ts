import { type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
  }
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });
  if (error && error.code !== "23505") {
    return new Response(JSON.stringify({ error: "Subscription failed" }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
