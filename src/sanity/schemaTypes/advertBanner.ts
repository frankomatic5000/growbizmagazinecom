import { defineField, defineType } from "sanity";

export const advertBanner = defineType({
  name: "advertBanner",
  title: "Advertisement Banner",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Internal Name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "image", title: "Banner Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "linkUrl", title: "Link URL", type: "url" }),
    defineField({ name: "placement", title: "Placement", type: "string", options: { list: ["sidebar", "leaderboard", "inline", "footer"] } }),
    defineField({ name: "active", title: "Active", type: "boolean", initialValue: true }),
    defineField({ name: "startDate", title: "Start Date", type: "datetime" }),
    defineField({ name: "endDate", title: "End Date", type: "datetime" }),
  ],
});
