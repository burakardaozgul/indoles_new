import type { ConsultantContent } from "./types";

export const CONSULTANTS: ConsultantContent[] = [
  {
    slug: "burak-ozgul",
    name: "Burak Arda Özgül",
    title: {
      tr: "Kurucu / Baş Danışman",
      en: "Founder / Principal Consultant",
    },
    shortBio: {
      tr: "Dijital pazarlama ve AI SaaS kuruculuğu. 8+ yıl marka, büyüme ve teknoloji kesişiminde.",
      en: "Digital marketing and AI SaaS founder. 8+ years at the intersection of brand, growth and technology.",
    },
    longBio: {
      tr: [
        "INDOLES'u sanayi şirketlerinin teknoloji ihtiyacı ile ticaret markalarının büyüme ihtiyacının aynı danışmanlık disiplininde çözülebileceği inancıyla kurdu.",
        "Öncesinde AI SaaS şirketi ADUARDO'nun kurucu ortağıydı. Dijital pazarlama ve reklam ajanslarında 8+ yıllık kıdem.",
        "Çalışma prensibi: teşhis olmadan reçete yok. Projeye teknoloji ile değil, soruyla başlamayı savunur.",
      ],
      en: [
        "Founded INDOLES on the belief that industrial technology needs and commerce growth needs can be solved within the same consulting discipline.",
        "Previously co-founder of AI SaaS company ADUARDO. 8+ years seniority across digital marketing and advertising agencies.",
        "Working principle: no prescription without diagnosis. Advocates starting engagements with a question, not a technology.",
      ],
    },
    pillars: ["growth", "transform", "build"],
    expertise: [
      "Dijital dönüşüm",
      "AI danışmanlığı",
      "Marka stratejisi",
      "Büyüme mimarisi",
    ],
    linkedinUrl: "https://www.linkedin.com/in/burakardaozgul",
  },
];

export function getConsultantBySlug(slug: string): ConsultantContent | null {
  return CONSULTANTS.find((c) => c.slug === slug) ?? null;
}
