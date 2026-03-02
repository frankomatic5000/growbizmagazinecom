export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number };
  alt?: string;
  caption?: string;
}

export interface Author {
  _id: string;
  name: string;
  slug: string;
  image?: SanityImage;
  role?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Issue {
  _id: string;
  title: string;
  slug: string;
  issueNumber?: number;
  volume?: number;
  publishDate?: string;
  coverImage?: SanityImage;
  description?: string;
  pdfUrl?: string;
  featured?: boolean;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  status: "draft" | "published" | "archived";
  excerpt?: string;
  mainImage?: SanityImage;
  author?: Author;
  category?: Category;
  issue?: Issue;
  tags?: string[];
  featured?: boolean;
  headline?: boolean;
  sponsored?: boolean;
  body?: unknown[];
  seo?: {
    metaTitle?: string;
    metaDesc?: string;
    ogImage?: SanityImage;
  };
}

export interface AdvertBanner {
  _id: string;
  title: string;
  image?: SanityImage;
  linkUrl?: string;
  placement: "sidebar" | "leaderboard" | "inline" | "footer";
  active: boolean;
}

export interface SiteSettings {
  siteName?: string;
  tagline?: string;
  logoLight?: SanityImage;
  logoDark?: SanityImage;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo?: {
    defaultMetaTitle?: string;
    defaultMetaDesc?: string;
    defaultOgImage?: SanityImage;
  };
  footerText?: string;
}
