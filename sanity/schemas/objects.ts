import { defineType, defineField } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "Lokalize Metin",
  type: "object",
  fields: [
    defineField({
      name: "tr",
      title: "Türkçe",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (r) => r.required(),
    }),
  ],
});

export const localeSlug = defineType({
  name: "localeSlug",
  title: "Lokalize Slug",
  type: "object",
  fields: [
    defineField({
      name: "tr",
      title: "TR slug",
      type: "slug",
      options: { source: (_, options) => (options.parent as { title?: { tr?: string } })?.title?.tr ?? "" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "en",
      title: "EN slug",
      type: "slug",
      options: { source: (_, options) => (options.parent as { title?: { en?: string } })?.title?.en ?? "" },
      validation: (r) => r.required(),
    }),
  ],
});

export const localeRichText = defineType({
  name: "localeRichText",
  title: "Lokalize Zengin Metin",
  type: "object",
  fields: [
    defineField({ name: "tr", title: "TR", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "en", title: "EN", type: "array", of: [{ type: "block" }] }),
  ],
});
