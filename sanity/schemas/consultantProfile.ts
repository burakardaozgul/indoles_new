import { defineType, defineField } from "sanity";

export const consultantProfileSchema = defineType({
  name: "consultantProfile",
  title: "Danışman Profili",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Ad", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "title", title: "Ünvan", type: "localeString" }),
    defineField({ name: "shortBio", title: "Kısa Biyografi", type: "localeString" }),
    defineField({ name: "longBio", title: "Uzun Biyografi", type: "localeRichText" }),
    defineField({
      name: "pillars",
      title: "Pillar'lar",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "Growth", value: "growth" },
              { title: "Transform", value: "transform" },
              { title: "Build", value: "build" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "active",
      title: "Aktif",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
