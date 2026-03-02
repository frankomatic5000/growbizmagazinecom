import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function estimateReadTime(body: unknown[]): number {
  const text =
    body
      ?.filter((b: unknown) => (b as { _type: string })._type === "block")
      .map((b: unknown) =>
        ((b as { children?: { text: string }[] }).children ?? [])
          .map((c) => c.text)
          .join("")
      )
      .join(" ") || "";
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
