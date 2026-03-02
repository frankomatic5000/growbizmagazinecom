# CLAUDE.md — Growbiz Magazine

> This file is the primary guide for Claude (or any AI coding assistant) working on this codebase. Read it fully before writing any code.

---

## Project Overview

**Growbiz Magazine** is a digital business magazine website. The original prototype was built in Lovable (Vite + React + TypeScript + Tailwind + shadcn/ui + Supabase) and is being migrated to a production-grade stack:

- **Framework:** Next.js 14+ (App Router)
- **CMS:** Sanity v3 (embedded Studio at `/studio`)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS v3 + shadcn/ui
- **Language:** TypeScript (strict mode)
- **Database/Auth:** Supabase (retained for auth, newsletters, form submissions)
- **Images:** Sanity CDN + Next.js `<Image>` component

The design, color palette, typography, and component structure from the Lovable build should be **faithfully preserved** in the migration. Think of this as a rebuild, not a redesign.

---

## Original Stack (Lovable → Source of Truth for Design)

The original repo lives at: `https://github.com/frankomatic5000/growbizmagazinecom`

Key traits of the Lovable build to carry over:
- Vite SPA → becomes Next.js App Router (SSR/ISR)
- React Router → Next.js file-based routing
- Supabase for data → **Sanity CMS** for editorial content; Supabase **retained** for user auth + form submissions
- Hardcoded/mock article data → dynamic Sanity-powered content
- shadcn/ui components → kept as-is (they are framework-agnostic)
- Tailwind config (colors, fonts, spacing) → copy verbatim from `tailwind.config.ts`

---

## Repository Structure

```
growbizmagazine/
├── app/                              # Next.js App Router
│   ├── (site)/                       # Public-facing routes group
│   │   ├── layout.tsx                # Shared layout: Header + Footer
│   │   ├── page.tsx                  # Homepage
│   │   ├── articles/
│   │   │   ├── page.tsx              # All articles listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Single article page
│   │   ├── categories/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Category archive page
│   │   ├── issues/
│   │   │   ├── page.tsx              # Magazine issues archive
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Single issue page
│   │   ├── authors/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Author profile page
│   │   ├── advertise/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   └── search/
│   │       └── page.tsx
│   ├── studio/
│   │   └── [[...tool]]/
│   │       └── page.tsx              # Embedded Sanity Studio
│   └── api/
│       ├── revalidate/
│       │   └── route.ts              # Webhook → ISR tag revalidation
│       ├── draft-mode/
│       │   ├── enable/route.ts
│       │   └── disable/route.ts
│       └── newsletter/
│           └── route.ts              # Newsletter signup → Supabase
│
├── components/
│   ├── ui/                           # shadcn/ui primitives (do not edit)
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── CategoryNav.tsx
│   ├── magazine/
│   │   ├── ArticleCard.tsx           # Standard article card
│   │   ├── ArticleCardFeatured.tsx   # Large hero-style card
│   │   ├── ArticleGrid.tsx           # Grid layout wrapper
│   │   ├── ArticleBody.tsx           # Portable Text renderer
│   │   ├── AuthorByline.tsx
│   │   ├── CategoryBadge.tsx
│   │   ├── IssueCard.tsx
│   │   └── TableOfContents.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedArticles.tsx
│   │   ├── LatestArticles.tsx
│   │   ├── CategorySection.tsx
│   │   └── NewsletterBanner.tsx
│   └── shared/
│       ├── SeoHead.tsx
│       ├── BreadcrumbNav.tsx
│       ├── SearchBar.tsx
│       └── ShareButtons.tsx
│
├── lib/
│   ├── sanity/
│   │   ├── client.ts                 # Sanity client (standard + preview)
│   │   ├── queries.ts                # All GROQ queries
│   │   ├── image.ts                  # urlForImage() helper
│   │   └── types.ts                  # TypeScript types for all Sanity docs
│   ├── supabase/
│   │   ├── client.ts                 # Supabase browser client
│   │   └── server.ts                 # Supabase server client
│   └── utils.ts                      # Shared helpers (cn, formatDate, etc.)
│
├── sanity/
│   ├── schemaTypes/
│   │   ├── article.ts
│   │   ├── author.ts
│   │   ├── category.ts
│   │   ├── issue.ts
│   │   ├── advertBanner.ts
│   │   └── siteSettings.ts
│   ├── structure.ts                  # Custom Studio desk structure
│   ├── plugins/                      # Optional: presentation, media
│   └── sanity.config.ts
│
├── public/
│   └── images/                       # Static assets only
│
├── styles/
│   └── globals.css
│
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── components.json                   # shadcn/ui config
├── sanity.cli.ts
├── CLAUDE.md                         # ← you are here
└── SPEC.md
```

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values.

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=        # From sanity.io dashboard
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=                # Viewer token for SSR fetching
SANITY_WEBHOOK_SECRET=                # Random string for ISR webhook auth

# Supabase (retained for auth + forms)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=            # Server-only, never expose client-side

# App
NEXT_PUBLIC_SITE_URL=https://growbizmagazine.com
```

---

## Coding Conventions

### General
- **TypeScript strict mode** — no `any`, no `@ts-ignore` without explanation
- Use `type` imports: `import type { Article } from '@/lib/sanity/types'`
- Prefer `async/await` over `.then()` chains
- Co-locate types with their usage where practical; shared types go in `lib/sanity/types.ts`

### Next.js App Router
- All data fetching happens in **Server Components** by default
- Use `generateStaticParams()` for all `[slug]` routes
- Use `revalidateTag()` / `next: { tags: [...] }` for fine-grained ISR
- Client Components (`'use client'`) only for: interactivity, hooks, browser APIs
- Never fetch Sanity data inside Client Components — pass data as props from Server Components

### Sanity
- All GROQ queries live in `lib/sanity/queries.ts` — never write inline GROQ in page files
- Always project only the fields you need (don't fetch `...`)
- Use `_type` guards when dealing with Portable Text block types
- Reference the `@sanity/image-url` builder via `lib/sanity/image.ts`

### Tailwind + shadcn/ui
- Use the `cn()` utility from `lib/utils.ts` for conditional classes
- Do not override shadcn/ui component internals — extend via `className` props
- Keep the Tailwind config colors/fonts from the original Lovable build

### Components
- Functional components only — no class components
- One component per file, named export + default export both OK
- Keep components focused: if a component exceeds ~150 lines, split it
- Avoid prop drilling more than 2 levels deep — use composition or Context

---

## Data Architecture

### What lives in Sanity CMS
| Content Type | Description |
|---|---|
| `article` | Magazine articles with rich body, author, category, issue |
| `author` | Staff writers and contributors |
| `category` | Editorial categories (e.g. Finance, Leadership, Tech) |
| `issue` | Monthly/quarterly print/digital magazine issues |
| `advertBanner` | Advertisements and sponsored content |
| `siteSettings` | Global: site name, nav links, social URLs, SEO defaults |

### What stays in Supabase
| Table | Description |
|---|---|
| `newsletter_subscribers` | Email newsletter signups |
| `contact_submissions` | Contact form entries |
| `users` (auth) | Reader accounts (if applicable) |

---

## Key Patterns

### Server Component data fetch
```tsx
// app/(site)/articles/[slug]/page.tsx
import { getArticleBySlug } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)
  if (!article) notFound()
  return <ArticleBody article={article} />
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}
```

### GROQ query pattern
```ts
// lib/sanity/queries.ts
export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    body,
    "author": author-> { name, "slug": slug.current, image },
    "category": category-> { title, "slug": slug.current },
    mainImage,
    seo
  }
`
```

### ISR revalidation webhook
```ts
// app/api/revalidate/route.ts
export async function POST(req: Request) {
  const secret = req.headers.get('x-sanity-webhook-secret')
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }
  const body = await req.json()
  revalidateTag(body._type) // e.g. 'article', 'author'
  return new Response('Revalidated', { status: 200 })
}
```

---

## Migration Checklist (Lovable → Next.js/Sanity)

When migrating a page or component from the Lovable repo:

- [ ] Copy component JSX/TSX structure faithfully
- [ ] Preserve all Tailwind classes exactly
- [ ] Replace `react-router-dom` `<Link>` with `next/link`
- [ ] Replace `react-router-dom` `useNavigate` with `next/navigation` hooks
- [ ] Replace `import.meta.env.VITE_*` with `process.env.NEXT_PUBLIC_*`
- [ ] Replace hardcoded/mock data with Sanity GROQ query
- [ ] Replace Supabase content queries with Sanity (keep Supabase for auth/forms)
- [ ] Replace `<img>` tags with `next/image` `<Image>`
- [ ] Add `generateMetadata()` for SEO on all page files
- [ ] Add `generateStaticParams()` for all dynamic `[slug]` routes

---

## DO and DON'T

| DO | DON'T |
|---|---|
| Fetch data in Server Components | Fetch Sanity data client-side |
| Use `revalidateTag` for ISR | Use `revalidatePath` (too broad) |
| Keep Tailwind classes from Lovable design | Restyle or "improve" the design |
| Use `next/image` for all images | Use raw `<img>` tags |
| Write all GROQ in `queries.ts` | Write inline GROQ strings in pages |
| Use `notFound()` for missing slugs | Return null or empty states silently |
| Add `generateMetadata` to every page | Leave pages without meta tags |

---

## Commands

```bash
# Install
npm install

# Dev server (Next.js + Sanity Studio)
npm run dev

# Build
npm run build

# Sanity Studio standalone
npx sanity dev

# Deploy to Vercel
vercel --prod

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

## Deployment (Vercel)

1. Connect GitHub repo to Vercel
2. Set all environment variables in Vercel dashboard
3. Set **Framework Preset** to Next.js
4. Set **Root Directory** to `/` (repo root)
5. Configure Sanity CORS to allow `https://growbizmagazine.com` and `https://*.vercel.app`
6. Create Sanity webhook → `https://growbizmagazine.com/api/revalidate` with `x-sanity-webhook-secret` header

---

## Sanity Studio Access

The Studio is embedded at `/studio` in the Next.js app. In production, restrict access via Sanity's CORS settings and/or middleware-based auth check.

Local: `http://localhost:3000/studio`
Production: `https://growbizmagazine.com/studio`
