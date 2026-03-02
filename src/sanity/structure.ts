import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Growbiz Magazine")
    .items([
      S.listItem()
        .id("siteSettings")
        .title("Site Settings")
        .child(
          S.document().id("siteSettings").schemaType("siteSettings").title("Site Settings")
        ),
      S.divider(),
      S.listItem().title("Articles").child(S.documentTypeList("article").title("Articles")),
      S.listItem().title("Categories").child(S.documentTypeList("category").title("Categories")),
      S.listItem().title("Authors").child(S.documentTypeList("author").title("Authors")),
      S.listItem().title("Issues").child(S.documentTypeList("issue").title("Magazine Issues")),
      S.divider(),
      S.listItem()
        .title("Advertisement Banners")
        .child(S.documentTypeList("advertBanner").title("Ad Banners")),
    ]);
