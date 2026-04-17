import { defineType, defineField } from "sanity";

export const articleSchema = defineType({
  name: "article",
  title: "Yazı",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Başlık", type: "localeString" }),
    defineField({ name: "slug", title: "Slug", type: "localeSlug" }),
    defineField({ name: "excerpt", title: "Özet", type: "localeString" }),
    defineField({ name: "body", title: "Gövde", type: "localeRichText" }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Growth", value: "growth" },
          { title: "Transform", value: "transform" },
          { title: "Build", value: "build" },
          { title: "Industry", value: "industry" },
        ],
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Yayın Tarihi",
      type: "datetime",
    }),
  ],
});
