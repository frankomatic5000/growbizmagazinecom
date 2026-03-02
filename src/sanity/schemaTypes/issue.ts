import { defineField, defineType } from "sanity";

export const issue = defineType({
  name: "issue",
  title: "Magazine Issue",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (R) => R.required() }),
    defineField({ name: "issueNumber", title: "Issue Number", type: "number" }),
    defineField({ name: "volume", title: "Volume", type: "number" }),
    defineField({ name: "publishDate", title: "Publish Date", type: "date" }),
    defineField({ name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "pdfUrl", title: "PDF Download URL", type: "url" }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
  ],
});
