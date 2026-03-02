import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Site Name", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "logoLight", title: "Logo (Light BG)", type: "image" }),
    defineField({ name: "logoDark", title: "Logo (Dark BG)", type: "image" }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "twitter", type: "url", title: "Twitter/X" }),
        defineField({ name: "facebook", type: "url", title: "Facebook" }),
        defineField({ name: "instagram", type: "url", title: "Instagram" }),
        defineField({ name: "linkedin", type: "url", title: "LinkedIn" }),
        defineField({ name: "youtube", type: "url", title: "YouTube" }),
      ],
    }),
    defineField({
      name: "seo",
      title: "Default SEO",
      type: "object",
      fields: [
        defineField({ name: "defaultMetaTitle", type: "string", title: "Default Meta Title" }),
        defineField({ name: "defaultMetaDesc", type: "text", title: "Default Meta Description", rows: 2 }),
        defineField({ name: "defaultOgImage", type: "image", title: "Default OG Image" }),
      ],
    }),
    defineField({ name: "footerText", title: "Footer Text", type: "text", rows: 2 }),
  ],
});
