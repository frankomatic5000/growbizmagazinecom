import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-sanity-webhook-secret");
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const tag = body._type as string;
  if (tag) revalidateTag(tag);
  return new Response(JSON.stringify({ revalidated: true, tag }), { status: 200 });
}
