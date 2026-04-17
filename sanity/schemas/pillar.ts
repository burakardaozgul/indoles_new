import { defineType, defineField } from "sanity";

export const pillarSchema = defineType({
  name: "pillar",
  title: "Pillar",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key",
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
    defineField({ name: "name", title: "Name", type: "localeString" }),
    defineField({ name: "slug", title: "Slug", type: "localeSlug" }),
    defineField({ name: "tagline", title: "Tagline", type: "localeString" }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "localeRichText",
    }),
  ],
});
