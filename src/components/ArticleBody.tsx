import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

interface SanityBlock {
  _type: string;
  _key?: string;
  asset?: SanityImage["asset"];
  alt?: string;
  caption?: string;
  children?: { text: string; marks?: string[] }[];
  markDefs?: { _key: string; _type: string; href?: string }[];
  style?: string;
}

const components = {
  types: {
    image: ({ value }: { value: SanityBlock }) => {
      if (!value?.asset) return null;
      const imageUrl = urlForImage(value as Parameters<typeof urlForImage>[0]).width(1200).url();
      return (
        <figure className="my-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={value.alt ?? "Article image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm italic text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="font-display text-3xl md:text-4xl font-bold mt-10 mb-4 leading-tight">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-display text-2xl md:text-3xl font-bold mt-8 mb-3 leading-tight">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-display text-xl md:text-2xl font-bold mt-6 mb-2">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="font-sans text-lg font-semibold mt-5 mb-2">{children}</h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-primary pl-6 my-6 text-lg md:text-xl italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-foreground mb-4 leading-relaxed text-base md:text-lg">{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string } }) => {
      const isExternal = value?.href?.startsWith("http");
      return (
        <a
          href={value?.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-primary underline hover:text-primary/80 transition-colors"
        >
          {children}
        </a>
      );
    },
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
  },
};

interface ArticleBodyProps {
  body: unknown[];
}

export function ArticleBody({ body }: ArticleBodyProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <PortableText value={body as Parameters<typeof PortableText>[0]["value"]} components={components} />
    </div>
  );
}
