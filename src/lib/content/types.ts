/**
 * Hardcoded içerik tipleri — Sanity bağlanana kadar placeholder.
 * Sanity CMS bağlanınca bu dosya yerine `src/lib/sanity/queries.ts` kullanılır.
 */

export type Locale = "tr" | "en";
export type Pillar = "growth" | "transform" | "build";
export type ProblemType =
  | "efficiency_loss"
  | "cost_optimization"
  | "market_expansion"
  | "digital_transformation"
  | "customer_acquisition";

export type Localized<T> = Record<Locale, T>;

export type PillarContent = {
  key: Pillar;
  name: Localized<string>;
  tagline: Localized<string>;
  heroLede: Localized<string>;
  description: Localized<string>;
  methodology: Array<{
    step: string;
    title: Localized<string>;
    description: Localized<string>;
  }>;
  services: Array<{
    slug: string;
    name: Localized<string>;
    shortDescription: Localized<string>;
  }>;
  metrics: Array<{ value: string; label: Localized<string> }>;
};

export type PackageContent = {
  slug: Localized<string>;
  name: Localized<string>;
  pillar: Pillar;
  durationWeeks: number;
  pricing: { TRY: number; EUR: number; USD: number };
  outcome: Localized<string>;
  summary: Localized<string>;
  scope: Localized<string[]>;
  deliverables: Localized<string[]>;
  whoFor: Localized<string[]>;
  faq: Array<{
    question: Localized<string>;
    answer: Localized<string>;
  }>;
};

export type CaseStudyContent = {
  slug: string;
  clientName: Localized<string>;
  clientSector: Localized<string>;
  problemType: ProblemType;
  pillar: Pillar;
  title: Localized<string>;
  lead: Localized<string>;
  challenge: Localized<string[]>;
  approach: Localized<string[]>;
  outcome: Localized<string[]>;
  metrics: Array<{ value: string; label: Localized<string> }>;
  durationWeeks: number;
  testimonial?: {
    quote: Localized<string>;
    authorRole: Localized<string>;
  };
};

export type ArticleContent = {
  slug: Localized<string>;
  title: Localized<string>;
  excerpt: Localized<string>;
  body: Localized<string[]>;
  category: Pillar | "industry";
  tags: string[];
  authorSlug: string;
  publishedAt: string;
  readingMinutes: number;
};

export type ConsultantContent = {
  slug: string;
  name: string;
  title: Localized<string>;
  shortBio: Localized<string>;
  longBio: Localized<string[]>;
  pillars: Pillar[];
  expertise: string[];
  linkedinUrl?: string;
};
