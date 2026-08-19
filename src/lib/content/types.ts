export type Locale = "tr" | "en";
export type Pillar = "growth" | "transform" | "build";
export type Persona = "industrial" | "commerce";
export type ProblemType =
  | "efficiency_loss"
  | "cost_optimization"
  | "market_expansion"
  | "digital_transformation"
  | "customer_acquisition";

export type Localized<T> = Record<Locale, T>;
export type PersonaText = Record<Persona, Localized<string>>;
export type PersonaList = Record<Persona, Localized<string[]>>;

export type PillarContent = {
  key: Pillar;
  name: Localized<string>;
  tagline: PersonaText;
  heroLede: Localized<string>;
  description: PersonaText;
  methodology: Array<{
    step: string;
    title: Localized<string>;
    description: Localized<string>;
  }>;
  services: Array<{
    slug: string;
    name: Localized<string>;
    shortDescription: PersonaText;
  }>;
  metrics: Array<{ value: string; label: Localized<string> }>;
};

export type PackageContent = {
  slug: Localized<string>;
  name: Localized<string>;
  /**
   * Adın tek satırlık karşılığı. "MVP Build" ve "AI Pilot" gibi adlar
   * geleneksel sanayi alıcısı için opak; açıklaması yalnız detay sayfasındaydı
   * (docs/15-content-audit.md §D8). Liste sayfasında adın hemen altında durur.
   */
  descriptor: Localized<string>;
  pillar: Pillar;
  /**
   * Taahhüdün şekli — paket listesindeki geometrik şemayı seçer
   * (`package-diagram.tsx`). Süreden veya fiyattan türetilmez; paketin ne tür
   * bir iş olduğu yazıyla belirtilir.
   */
  kind: "diagnose" | "sprint" | "pilot" | "build";
  durationWeeks: number;
  pricing: { TRY: number; EUR: number; USD: number };
  outcome: PersonaText;
  summary: PersonaText;
  scope: PersonaList;
  deliverables: PersonaList;
  whoFor: PersonaList;
  faq: Array<{
    question: Localized<string>;
    answer: PersonaText;
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
  /** Takım slider'ındaki portre bloğunda gösterilen baş harfler. */
  initials: string;
  /**
   * Portre bloğunun tonu. Fotoğraf gelene kadar her kişiyi ayrıştıran
   * tek değişken bu — palette dışı bir renk kategorisi değil, portre
   * jeneratörünün girdisi.
   */
  portraitTone: string;
  /** Takım slider'ında büyük punto gösterilen tek cümle. */
  quote: Localized<string>;
  /** Kadro listesinde sıralama; küçük olan önce gelir. */
  order: number;
};
