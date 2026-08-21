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

/**
 * Vaka akış diyagramı glyph anahtarları. Her glyph bir iş adımının
 * mekanizmasını kodlar; dekoratif ikon değildir (docs/04 §1). Yeni vaka yeni
 * bir adım tipi getirirse önce buraya anahtar, `case-flow.tsx`'e çizim
 * eklenir.
 */
export type CaseFlowIcon =
  | "measure"
  | "segment"
  | "broadcast"
  | "grid"
  | "build"
  | "design"
  | "content"
  | "search"
  | "sync"
  | "server"
  | "advise"
  | "film";

/**
 * Vaka sayfası medya öğesi (ADR-019). Görsel veya video; caption galeri
 * altyazısında `FIG.0N` etiketiyle basılır. `width`/`height` zorunlu —
 * next/image layout shift'i ancak gerçek oranla önler.
 */
export type CaseMedia = {
  /**
   * `youtube`: `src` video kimliğidir. Gömme yalnız tıklamayla yüklenir
   * (facade) ve `youtube-nocookie` üzerinden gider — sayfa açılışında
   * üçüncü taraf çerezi düşmez (docs/14 §KVKK).
   */
  type: "image" | "video" | "youtube";
  src: string;
  /** Video ve youtube: kapak karesi (youtube'da zorunlu — lokal dosya). */
  poster?: string;
  width: number;
  height: number;
  alt: Localized<string>;
  caption?: Localized<string>;
};

export type CaseStudyContent = {
  slug: string;
  clientName: Localized<string>;
  clientSector: Localized<string>;
  problemType: ProblemType;
  pillar: Pillar;
  /** Projenin dönemi — künyede görünür ("Mayıs – Temmuz 2024"). */
  period?: Localized<string>;
  /** `public/` altındaki müşteri logosu; künyede basılır. */
  clientLogo?: string;
  /** Vakada verilen disiplinler — künye listesi. */
  services?: Localized<string[]>;
  title: Localized<string>;
  lead: Localized<string>;
  challenge: Localized<string[]>;
  approach: Localized<string[]>;
  /**
   * Yaklaşımın mekanizma diyagramı — 3-5 düğüm etiketi. Sıra gerçek iş
   * sırasıdır; docs/04 "her görsel bir mekanizma anlatır" kuralının vaka
   * karşılığı. Verilmezse diyagram çizilmez.
   */
  approachFlow?: Localized<string[]>;
  /**
   * Düğüm başına glyph anahtarı (`case-flow.tsx` kayıt defterinden);
   * `approachFlow` ile aynı uzunlukta olmalı. Verilmezse düğümler yalnız
   * numara taşır.
   */
  approachFlowIcons?: CaseFlowIcon[];
  outcome: Localized<string[]>;
  /**
   * `context`: metriğin ölçüm çerçevesi (dönem, baz, yöntem). İçerik
   * dürüstlüğü kuralının (docs/04 §10) metrik karşılığı — iddialı bir rakam
   * bağlamsız basılmaz.
   */
  metrics: Array<{
    value: string;
    label: Localized<string>;
    context?: Localized<string>;
  }>;
  durationWeeks: number;
  /**
   * Kapak görseli — vaka kartlarında (benzer vakalar, liste, anasayfa)
   * kullanılır; galeriye girmez. Kartlar 4:3 kırptığı için merkezinde
   * okunabilir bir kompozisyon olan görsel seçilir.
   */
  cover?: CaseMedia;
  /** Sayfa başındaki geniş görsel. */
  heroMedia?: CaseMedia;
  /** Saha kaydı galerisi — sıra korunur. */
  media?: CaseMedia[];
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

export type ServiceDeliverableKind = "document" | "system" | "training" | "access";

/**
 * Bir hizmetin detay sayfasını taşıyan içerik.
 *
 * Ton orta, ses tek: hizmet detay sayfaları `docs/03-brand-voice-tone.md`
 * §1 ton tablosunda "orta ton, tek versiyon" olarak sabitlenmiş (ADR-014).
 * Yalnız `shortDescription` iki varyantlı ve o da bu sayfada değil,
 * `/hizmetler` listesinde ve anasayfa kartında kullanılıyor.
 *
 * Gerekçe iki yönlü. Belge bakım yükünü ve ton tekrarı riskini gösteriyor;
 * GEO tarafı da aynı yere çıkıyor: `PersonaText` her iki varyantı da DOM'a
 * bastığı için (globals.css → persona merceği) persona-aware bir detay
 * sayfası indekslenebilir metni şişirir, yan yana çelişen cümleler üretir
 * ve `FAQPage` şemasını görünen metinle uyumsuz kılar.
 */
export type ServiceContent = {
  slug: Localized<string>;
  pillar: Pillar;
  name: Localized<string>;

  /**
   * Anasayfa ve liste kartı metni. `pillars.ts`'ten birebir kopyalandı.
   *
   * Persona-aware kalır — docs/03 liste yüzeylerini persona-aware sayıyor.
   * Hizmet detay şablonu bu alanı render etmez.
   */
  shortDescription: PersonaText;

  /** Hero lede — iki cümle, tek ses. */
  lede: Localized<string>;

  /** "Bu üç durumdan biri sizdeyse" — tam 3 madde, tek ses. */
  signals: Localized<string[]>;

  /**
   * Hizmetin üzerinde çalıştığı mecra ve araçlar — hero'daki logo şeridi.
   *
   * Yalnız isim tutulur; logo `lib/design/platform-icons.tsx` kaydından
   * çözülür, kaydı olmayan isim metin rozetine düşer. Her hizmetin somut
   * bir araç seti olmayabilir — alan bu yüzden opsiyonel.
   */
  platforms?: string[];

  scope: {
    /**
     * 6-8 madde, başlık + açıklama çifti.
     *
     * Tek cümlelik maddeler "duvar gibi metin" okunuyordu (Burak,
     * 2026-08-20): başlık taranabilirliği, açıklama derinliği taşır.
     */
    includes: Array<{
      title: Localized<string>;
      description: Localized<string>;
    }>;
    /**
     * 3-4 madde, kısa. Satış öncesi beklenti hizalar; ayrıca rakip hizmet
     * sayfalarında bulunmadığı için AI motorlarının alıntılamaya yatkın
     * olduğu ayrıştırıcı cümleleri üretir.
     */
    excludes: Localized<string[]>;
  };

  /** Tam 4 adım. Pillar yönteminden miras alınmaz — hizmete özeldir. */
  method: Array<{
    step: string;
    title: Localized<string>;
    description: Localized<string>;
    /** Bu adımın sonunda müşterinin elinde ne olur. */
    output: Localized<string>;
  }>;

  /** 5-7 kalem, başlık + açıklama çifti. */
  deliverables: Array<{
    kind: ServiceDeliverableKind;
    title: Localized<string>;
    description: Localized<string>;
  }>;

  /** 4-6 soru. `FAQPage` şeması buradan üretilir. */
  faq: Array<{
    question: Localized<string>;
    answer: Localized<string>;
  }>;

  seo: {
    /** ≤60 karakter. "— INDOLES" eki layout şablonundan gelir. */
    title: Localized<string>;
    /** 80-160 karakter. */
    description: Localized<string>;
    /** Sayfada açık isimle geçmesi gereken varlıklar — audit kontrol listesi. */
    entities: Localized<string[]>;
  };

  /** Paket slug'ı (TR). Boşsa pillar eşlemesine düşülür. */
  relatedPackages: string[];
  /** Komşu hizmet slug'ı (TR), 3 adet. */
  relatedServices: string[];
};
