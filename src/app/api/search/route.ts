import { type NextRequest } from "next/server";
import { searchArticles } from "@/lib/sanity/queries";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) {
    return Response.json({ results: [] });
  }
  const results = await searchArticles(q);
  return Response.json({ results });
}
