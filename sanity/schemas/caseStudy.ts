import { defineType, defineField } from "sanity";

export const caseStudySchema = defineType({
  name: "caseStudy",
  title: "Vaka Çalışması",
  type: "document",
  fields: [
    defineField({
      name: "clientName",
      title: "Müşteri Adı",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "clientSector",
      title: "Sektör",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Başlık",
      type: "localeString",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localeSlug",
    }),
    defineField({
      name: "problemType",
      title: "Problem Tipi",
      type: "string",
      description:
        "Sektör değil — problem-tipi bazlı filtreleme için. Bkz. CLAUDE.md §5.",
      options: {
        list: [
          { title: "Verim kaybı", value: "efficiency_loss" },
          { title: "Maliyet optimizasyonu", value: "cost_optimization" },
          { title: "Pazara açılma", value: "market_expansion" },
          { title: "Dijital dönüşüm", value: "digital_transformation" },
          { title: "Müşteri edinimi", value: "customer_acquisition" },
        ],
      },
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
    }),
    defineField({ name: "lead", title: "Lead", type: "localeRichText" }),
    defineField({
      name: "challenge",
      title: "Problem",
      type: "localeRichText",
    }),
    defineField({ name: "approach", title: "Yaklaşım", type: "localeRichText" }),
    defineField({ name: "outcome", title: "Sonuç", type: "localeRichText" }),
    defineField({
      name: "publishedAt",
      title: "Yayın Tarihi",
      type: "datetime",
    }),
  ],
});
