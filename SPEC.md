# SPEC.md — Growbiz Magazine

> Product specification for the Growbiz Magazine website migration from Lovable to Next.js + Sanity + Vercel.

---

## 1. Project Summary

**Product:** Growbiz Magazine — a digital business magazine covering entrepreneurship, finance, leadership, technology, and growth strategy.

**Goal:** Migrate the existing Lovable prototype to a scalable, CMS-driven production website that editors can manage without developer involvement.

**Primary Outcome:** A fully functional magazine website where:
- Editorial team publishes articles, issues, and categories via Sanity Studio
- Content is served via ISR (fast static pages, auto-refreshed on publish)
- The visual design matches the original Lovable build exactly
- SEO, performance, and accessibility are production-grade

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR/ISR, SEO, file-based routing, Vercel-native |
| CMS | Sanity v3 | Flexible schemas, GROQ, real-time Studio, great DX |
| Deployment | Vercel | Zero-config Next.js, previews, edge network |
| Styling | Tailwind CSS v3 + shadcn/ui | Matches Lovable build, design system consistency |
| Auth/Forms | Supabase | Retained from original build |
| Language | TypeScript (strict) | Type safety across CMS types and components |
| Analytics | Vercel Analytics | Privacy-first, zero config on Vercel |

---

## 3. Design System

The visual design is derived from the Lovable build. **Do not deviate from these without explicit approval.**

### Color Palette
Import from the original `tailwind.config.ts`. Key brand colors to preserve:
- **Primary:** (to be confirmed from Lovable build — extract from `tailwind.config.ts`)
- **Background:** White / off-white for content areas
- **Text:** Near-black for body, slightly lighter for secondary
- **Accent:** (to be confirmed — check Lovable build)

### Typography
- **Headlines:** (extract from Lovable build — likely Google Font)
- **Body:** (extract from Lovable build)
- Font sizes, weights, and line-heights should match the Lovable config

### Component Library
- shadcn/ui components (Button, Card, Badge, Sheet, etc.)
- Custom magazine components built on top of shadcn primitives
- All existing component styles from Lovable are migrated verbatim

---

## 4. Pages & Routes

### Public Pages

| Route | Page | Data Source | Render Strategy |
|---|---|---|---|
| `/` | Homepage | Sanity: featured articles, latest, categories | ISR (60s) |
| `/articles` | All Articles | Sanity: paginated article list | ISR (60s) |
| `/articles/[slug]` | Single Article | Sanity: article by slug | ISR + revalidateTag |
| `/categories/[slug]` | Category Archive | Sanity: articles by category | ISR (120s) |
| `/issues` | Issues Archive | Sanity: all magazine issues | ISR (300s) |
| `/issues/[slug]` | Single Issue | Sanity: issue + its articles | ISR + revalidateTag |
| `/authors/[slug]` | Author Profile | Sanity: author + their articles | ISR (300s) |
| `/advertise` | Advertise Page | Static (CMS optional) | Static |
| `/about` | About Page | Static (CMS optional) | Static |
| `/contact` | Contact Page | Static + Supabase form | Static |
| `/search` | Search Results | Client-side Sanity search | CSR |

### Admin

| Route | Page | Notes |
|---|---|---|
| `/studio/[[...tool]]` | Sanity Studio | Embedded, editor-only |

---

## 5. Content Model (Sanity Schemas)

### `article`
```
title:          string (required)
slug:           slug (auto-generated from title)
publishedAt:    datetime
status:         'draft' | 'published' | 'archived'
excerpt:        text (max 200 chars)
body:           portableText (rich text)
mainImage:      image (with alt text)
author:         reference → author
category:       reference → category
issue:          reference → issue (optional)
tags:           array of strings
featured:       boolean (show in hero/featured sections)
sponsored:      boolean (mark as sponsored content)
seo: {
  metaTitle:    string
  metaDesc:     string
  ogImage:      image
}
```

### `author`
```
name:           string (required)
slug:           slug
bio:            text
image:          image
role:           string (e.g. "Staff Writer", "Contributor")
socialLinks: {
  twitter:      url
  linkedin:     url
  website:      url
}
```

### `category`
```
title:          string (required)
slug:           slug
description:    text
color:          string (hex — for category badge color)
icon:           string (optional icon name)
```

### `issue`
```
title:          string (e.g. "March 2025 Issue")
slug:           slug
issueNumber:    number
volume:         number
publishDate:    date
coverImage:     image
description:    text
pdfUrl:         url (optional — link to PDF edition)
featured:       boolean
```

### `advertBanner`
```
title:          string (internal reference name)
image:          image
linkUrl:        url
placement:      'sidebar' | 'leaderboard' | 'inline' | 'footer'
active:         boolean
startDate:      datetime
endDate:        datetime
```

### `siteSettings` (singleton)
```
siteName:       string
tagline:        string
logoLight:      image
logoDark:       image
navigationLinks: array of { label, href }
socialLinks: {
  twitter, facebook, instagram, linkedin, youtube
}
seo: {
  defaultMetaTitle:   string
  defaultMetaDesc:    string
  defaultOgImage:     image
}
footerText:     text
```

---

## 6. Page Specifications

### 6.1 Homepage (`/`)

**Sections (in order):**

1. **Hero / Featured Article** — Large full-bleed article card. Source: article with `featured: true`, sorted by `publishedAt` desc. Shows: title, excerpt, category badge, author, date, read time.

2. **Latest Articles Grid** — 6 most recent published articles in a responsive grid (3-col desktop, 2-col tablet, 1-col mobile). Each card shows: image, category badge, title, author, date.

3. **Category Sections** — 2–3 category-specific rows, each showing 4 articles from that category. Categories shown are configurable in `siteSettings`.

4. **Magazine Issue Spotlight** — Latest issue card with cover image, issue number/date, CTA to full issue page.

5. **Newsletter Signup Banner** — Email capture form. Submission goes to Supabase `newsletter_subscribers` table.

6. **Advertisement Banners** — Leaderboard ad between sections (from Sanity `advertBanner`, `placement: 'leaderboard'`).

---

### 6.2 Article Listing Page (`/articles`)

- Paginated grid of all published articles (12 per page)
- Filter bar: by Category, by Date (newest/oldest)
- Sort: newest first (default)
- Each card: image, category badge, title, author byline, date, read time estimate
- Sidebar (desktop): top categories list, featured issue, ad banner

---

### 6.3 Single Article Page (`/articles/[slug]`)

**Layout:** Wide reading layout with optional sidebar

**Content area:**
- Full-bleed hero image with title overlay OR image above title
- Category badge + article title (H1)
- Author byline (avatar + name + date + read time)
- Social share buttons (Twitter, LinkedIn, copy link)
- Article body (Portable Text renderer)
- Tags list
- Author card (bio + links)
- "More from this category" section (3 article cards)

**Sidebar (desktop):**
- Table of Contents (auto-generated from H2/H3 headings)
- Advertisement banner (`placement: 'sidebar'`)
- Latest issue card

**SEO:**
- `generateMetadata()` with per-article `metaTitle`, `metaDesc`, `ogImage`
- JSON-LD `Article` schema
- Canonical URL

---

### 6.4 Category Page (`/categories/[slug]`)

- Category title + description
- Paginated article grid (same card as listing)
- Breadcrumb: Home → Articles → {Category}

---

### 6.5 Issues Page (`/issues`)

- Grid of all magazine issues (cover image + title + date)
- Latest issue highlighted
- Link to PDF download if available

---

### 6.6 Single Issue Page (`/issues/[slug]`)

- Issue cover image (large)
- Issue title, number, date
- PDF download CTA (if available)
- List of all articles in this issue

---

### 6.7 Author Page (`/authors/[slug]`)

- Author photo, name, role, bio
- Social links
- Grid of all articles by this author

---

### 6.8 Contact Page (`/contact`)

- Contact form: name, email, subject, message
- Submission → Supabase `contact_submissions` table
- Success/error toast feedback
- Business info (optional: address, email, phone)

---

### 6.9 Advertise Page (`/advertise`)

- Static page with ad placement options
- Rate card / media kit download (PDF link)
- Contact CTA for ad inquiries

---

### 6.10 About Page (`/about`)

- Magazine mission/story
- Team section (editors, contributors) — optionally sourced from Sanity `author` docs with `role: 'editor'`

---

## 7. Components Specification

### `ArticleCard`
```
Props:
  article: {
    title: string
    slug: string
    mainImage: SanityImage
    excerpt: string
    author: { name, slug, image }
    category: { title, slug, color }
    publishedAt: string
    readTime?: number
  }
  variant?: 'default' | 'compact' | 'featured'
```

### `ArticleBody`
- Renders Sanity Portable Text
- Handles: paragraphs, headings, blockquotes, code blocks, images, internal links, external links
- Uses `@portabletext/react`
- Custom components for: `Image` (next/image), `Code` (syntax highlighted), `CalloutBlock`

### `CategoryBadge`
```
Props:
  category: { title: string, slug: string, color?: string }
  size?: 'sm' | 'md'
```

### `NewsletterBanner`
- Controlled email input
- Submit → `POST /api/newsletter`
- API route → Supabase insert
- Show success/error state

---

## 8. SEO Requirements

- Every page has `generateMetadata()` returning `title`, `description`, `openGraph`, `twitter`
- Default fallback values from `siteSettings` singleton in Sanity
- Article pages include JSON-LD `Article` schema
- Author pages include JSON-LD `Person` schema
- `sitemap.xml` auto-generated via Next.js `app/sitemap.ts`
- `robots.txt` via `app/robots.ts`
- All images have meaningful `alt` text
- Semantic HTML throughout (proper heading hierarchy, `<article>`, `<nav>`, `<main>`, `<aside>`)

---

## 9. Performance Requirements

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| FID/INP | < 200ms |

Strategies:
- ISR for all content pages (stale-while-revalidate)
- `next/image` for all images with explicit width/height
- Font optimization via `next/font`
- No client-side data fetching for initial page load
- Code splitting (automatic via App Router)

---

## 10. Migration Plan

### Phase 1 — Foundation (Week 1)
- [ ] Scaffold Next.js project with App Router
- [ ] Install and configure Tailwind + shadcn/ui (copy Lovable config)
- [ ] Set up Sanity project + schemas
- [ ] Configure Vercel deployment + env vars
- [ ] Set up Supabase connection (retained from Lovable)

### Phase 2 — Layout & Shell (Week 1–2)
- [ ] Migrate Header component (exact match to Lovable)
- [ ] Migrate Footer component (exact match)
- [ ] Migrate MobileNav / hamburger menu
- [ ] Set up global layout in `app/(site)/layout.tsx`

### Phase 3 — Core Pages (Week 2–3)
- [ ] Homepage (all sections)
- [ ] Article listing page
- [ ] Single article page (with Portable Text renderer)
- [ ] Category pages
- [ ] Issues pages

### Phase 4 — Secondary Pages (Week 3)
- [ ] Author pages
- [ ] About page
- [ ] Advertise page
- [ ] Contact page (with Supabase form)
- [ ] Search page

### Phase 5 — CMS & Editorial (Week 3–4)
- [ ] Populate all Sanity schemas with real content
- [ ] Configure Sanity Studio structure
- [ ] Set up ISR webhook from Sanity → Vercel
- [ ] Draft mode / preview setup

### Phase 6 — Polish & Launch (Week 4)
- [ ] SEO audit (metadata, sitemaps, JSON-LD)
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility review
- [ ] Cross-browser + mobile QA
- [ ] DNS cutover to Vercel

---

## 11. Open Questions / Decisions Needed

- [ ] **Authentication:** Will readers need accounts? (login, bookmarks, comments) — retained Supabase auth, but feature scope TBD
- [ ] **Comments:** Any commenting system? (native, Disqus, or none)
- [ ] **Newsletter:** Which ESP? (Mailchimp, ConvertKit, Resend) — currently just Supabase capture
- [ ] **Search:** Sanity-native search vs. Algolia vs. simple GROQ full-text
- [ ] **Analytics:** Vercel Analytics sufficient, or also Google Analytics?
- [ ] **Paywall/Subscriptions:** Any premium content gating required?
- [ ] **Color Palette:** Exact hex values need to be extracted from Lovable `tailwind.config.ts`
- [ ] **Fonts:** Exact fonts need to be confirmed from Lovable build
