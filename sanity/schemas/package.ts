import { defineType, defineField } from "sanity";

export const packageSchema = defineType({
  name: "package",
  title: "Paket",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Başlık",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localeSlug",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "pillar",
      title: "Pillar",
      type: "string",
      options: {
        list: [
          { title: "Growth", value: "growth" },
          { title: "Transform", value: "transform" },
          { title: "Build", value: "build" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "outcome", title: "Outcome", type: "localeString" }),
    defineField({
      name: "description",
      title: "Açıklama",
      type: "localeRichText",
    }),
    defineField({
      name: "durationWeeks",
      title: "Süre (hafta)",
      type: "number",
    }),
    defineField({ name: "priceTRY", title: "Fiyat (TRY)", type: "number" }),
    defineField({ name: "priceEUR", title: "Fiyat (EUR)", type: "number" }),
    defineField({ name: "priceUSD", title: "Fiyat (USD)", type: "number" }),
    defineField({
      name: "active",
      title: "Aktif",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
