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
  /**
   * Disiplin düzeyi soru-cevap bloğu — sayfada açık metin, JSON-LD'de
   * `FAQPage`.
   *
   * Persona-aware değil: `PersonaText` iki varyantı da DOM'a bastığı için
   * (globals.css → persona merceği) şema, görünen metinle uyumsuz kalır ve
   * aynı soruya yan yana iki cevap indekslenir. Düz `Localized` tutulur.
   *
   * Kapsam bilinçli olarak hizmet sayfalarının bir kademe üstüdür: "hangi
   * disiplin bana uygun", "altında hangi hizmetler var", "nereden başlanır",
   * "hizmet mi paket mi", "birden fazla disiplin birlikte yürür mü". Hizmete
   * özgü soru (fiyat, teslim kalemi, araç seti) `ServiceContent.faq`ta durur;
   * iki katman aynı soruyu cevaplarsa iç rekabet açılır.
   */
  faq?: Array<{ question: Localized<string>; answer: Localized<string> }>;
  /**
   * Arama başlığı ve açıklaması — görünen `name`den ayrı.
   *
   * Marka mimarisi pillar adlarını "Growth / Transform / Build" olarak
   * sabitliyor (CLAUDE.md §5); sayfada görünen ad değişmez. Ancak bu üç URL
   * sitemap'in en yüksek öncelikli bandında ve `name` tek İngilizce kelime
   * olduğu için hiçbir Türkçe arama niyetini karşılamıyordu (denetim T-10).
   * Başlık ve açıklama bu yüzden ayrı alan: marka adı sayfada, arama dili
   * `<title>` ve `<meta description>` içinde.
   *
   * `title` ≤50 karakter — layout'un "%s — INDOLES" şablonu 10 karakter ekler.
   * `description` 140-160.
   */
  seo?: {
    title: Localized<string>;
    description: Localized<string>;
  };
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
  /**
   * Paket SSS'i — sayfada açık metin, JSON-LD'de `FAQPage`.
   *
   * `PersonaText` DEĞİL, düz `Localized` (ADR-022). Persona-aware olduğu
   * sürece `FAQPage` şeması tek varyant basıyordu ve ticaret merceğindeki
   * ziyaretçinin ekranda okuduğu cevapla Google'a giden cevap ayrışıyordu.
   * Cevaplar orta tonda tek metne indirildi ve iki tarafın maddi bilgisini
   * de taşıyor. Paketin anlatı alanları (`outcome`, `summary`, `scope`,
   * `deliverables`, `whoFor`) persona-aware kalmaya devam eder.
   */
  faq: Array<{
    question: Localized<string>;
    answer: Localized<string>;
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
  /**
   * Vaka slug'ı locale başına ayrıdır (2026-08-29'da localize edildi;
   * ADR-019'un "slug locale'den bağımsız" kararı bu tarihte revize oldu).
   *
   * Gerekçe: TR slug EN sayfaya da basıldığı için 9 EN URL'in tamamı Türkçe
   * kelimelerden oluşuyordu (`/en/case-studies/sim-baski-ihracat-icerigi`) —
   * EN okur da EN arama motoru da URL'i okuyamıyordu. Yazılar zaten
   * lokalize slug taşıyor (ADR-020); vakalar tek istisnaydı.
   *
   * Çapraz locale çözüm YOK: `/en` altında TR slug 404 döner (ADR-018) —
   * iki URL'in aynı içeriği sunması canonical sinyalini böler. Değişim
   * launch'tan bir gün sonra yapıldığı ve eski EN URL'ler GSC/IndexNow'a
   * bildirildiği için 9 eski adres `next.config.ts`'te 301 taşınır.
   *
   * TR slug'lar DEĞİŞMEDİ — analitik olay kimliği (`view-events.ts`) ve
   * `articles.ts` gövdesindeki kanonik iç bağlantılar hep `slug.tr` okur.
   */
  slug: Localized<string>;
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
  /**
   * Künyedeki disiplinlerin hizmet sayfası karşılıkları — TR slug'ları
   * (`SERVICES` kayıtlarındaki `slug.tr`).
   *
   * Serbest metin `services` alanı ("CRO ve arayüz iyileştirme") hiçbir
   * sayfaya bağlanmıyordu: kanıt sayfalarından hizmet sayfalarına otorite
   * akmıyordu (denetim L-01). Slug tek kaynakta tutulur, locale'e göre URL
   * render sırasında `SERVICES` üzerinden çözülür — iki dilli URL elle
   * kurulmaz.
   *
   * Yalnız vaka anlatısında gerçekten karşılığı olan hizmet yazılır;
   * `services` metnindeki her kalemin bir hizmet sayfası olmayabilir.
   */
  serviceSlugs?: string[];
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
   *
   * `value` iki dilli: sayı biçimi dile bağlıdır. TR binlik ayracı nokta,
   * ondalık virgül ve para birimi sayıdan sonra gelir ("1,5M $"); EN'de
   * tersi ("$1.5M"). Tek dizge tutulduğunda Türkçe biçim EN sayfalarda
   * görünüyordu ve hizmet sayfalarının kanıt şeridiyle 12 sayfaya daha
   * yayılmıştı.
   */
  metrics: Array<{
    value: Localized<string>;
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
  /**
   * Vakaya özgü soru-cevap bloğu — sayfada açık metin, JSON-LD'de `FAQPage`.
   *
   * 16 yazı ve 12 hizmet sayfası trafiği vaka sayfalarına yönlendiriyordu;
   * varılan yerde bir arama motorunun ya da yapay zeka motorunun
   * alıntılayabileceği soru-cevap yapısı yoktu. Şablondaki H2'lerin tamamı
   * gezinti başlığıydı ("Benzer vakalar", "Hizmetler").
   *
   * Sorular vakanın kendi anlatısından çıkar — problem, yaklaşım, sonuç,
   * `metrics`, `services`, `period`. Vakada geçmeyen rakam, süre veya
   * müşteri sözü yazılmaz; ölçülmemiş vakada bunun kendisi bir cevaptır
   * (docs/04 §10).
   */
  faq?: Array<{ question: Localized<string>; answer: Localized<string> }>;
  /**
   * Arama yüzeyi — sayfada görünen başlıktan ve lede'den ayrı.
   *
   * Vaka `<title>`ı "müşteri — başlık" biçiminde kuruluyordu ve `<meta
   * description>` ham `lead` metniydi; ilk tam denetimde 18 vaka URL'inin
   * tamamı düştü (title 52-92, description 185-399 karakter). Editoryal
   * başlık ve giriş paragrafı sayfada aynen kalır — kısalan yalnız SERP'e
   * giden dizgedir.
   *
   * Aynı desen `PillarContent.seo` ve `ServiceContent.seo`da da var; burada
   * iki alan da opsiyonel çünkü doldurulmamış vaka `clientName — title` ve
   * `lead` fallback'ine düşer.
   *
   * `title` ≤50 karakter — layout'un "%s — INDOLES" şablonu 10 karakter
   * ekler; müşteri adı buraya elle yazılır. `description` 140-160 ve
   * içindeki her rakam `metrics`te geçmek zorundadır (docs/04 §10).
   */
  seo?: {
    title?: Localized<string>;
    description?: Localized<string>;
  };
};

/**
 * Yazı gövdesinin blok modeli (ADR-020). Düz paragraf dizisi blog
 * migrasyonunu taşımıyordu: eski yazılar başlık hiyerarşisi, liste ve alıntı
 * içeriyor; GEO için içindekiler (h2 çapaları) ve soru-cevap yapısı gerekiyor.
 * MDX yerine tipli bloklar: bağımlılık yok, çeviri pariteleri typecheck'te
 * yakalanıyor, TOC ve JSON-LD bloklardan türetiliyor.
 */
export type ArticleBlock =
  | { type: "p"; text: Localized<string> }
  /** `id` içindekiler çapasıdır — kebab-case, locale'den bağımsız. */
  | { type: "h2"; id: string; text: Localized<string> }
  | { type: "h3"; text: Localized<string> }
  | { type: "list"; ordered?: boolean; items: Array<Localized<string>> }
  | { type: "quote"; text: Localized<string> };

/**
 * Yazı konusu (ADR-021).
 *
 * Kapalı union — değerler `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md`
 * §2'deki niyet-bazlı keyword kümelerinden birebir türetildi. Yeni konu açmak
 * tip değişikliği + ADR güncellemesi gerektirir; bu sürtünme bilinçli:
 * taksonomi kontrolsüz büyürse `tags`'in başına geleni yaşar (44 etiketin 40'ı
 * tek yazıda).
 *
 * `category` (pillar) alanı bundan bağımsız durmaya devam eder — hizmet/vaka
 * çapraz linki için doğru veri, ama liste filtresinin ekseni değil.
 */
export type ArticleTopic =
  | "yapay-zeka"
  | "geo"
  | "cro"
  | "performans-pazarlama"
  | "musteri-elde-tutma"
  | "e-ticaret"
  | "ui-ux"
  | "is-gelistirme"
  | "marka-hikaye"
  | "video-kreatif";

export type ArticleContent = {
  slug: Localized<string>;
  title: Localized<string>;
  excerpt: Localized<string>;
  blocks: ArticleBlock[];
  /**
   * Yayın sonrası içerik güncellemesi (ADR-020). `updatedAt` meta şeritte
   * rozet, `updateNote` gövde başında kutu olarak görünür; JSON-LD
   * `dateModified` buradan beslenir. Eski tarihli bilgi güncellenmeden
   * yeniden yayımlanmaz — güncellenen yazı bunu okura açıkça söyler.
   */
  updatedAt?: string;
  updateNote?: Localized<string>;
  /** Soru-cevap bloğu — sayfada açık metin, JSON-LD'de FAQPage. */
  faq?: Array<{ question: Localized<string>; answer: Localized<string> }>;
  category: Pillar | "industry";
  /**
   * Liste filtresinin ekseni (ADR-021). Zorunlu — her yazı tam bir konuya ait.
   * Konu → hedef hizmet sayfası eşlemesi `src/lib/content/topics.ts`'te.
   */
  topic: ArticleTopic;
  /**
   * Uzun kuyruk anahtar kelime sinyali. SEO değeri için kalır, filtre olarak
   * kullanılmaz (ADR-021: 44 etiketin 40'ı tek yazıda).
   */
  tags: string[];
  authorSlug: string;
  publishedAt: string;
  readingMinutes: number;
  /**
   * Arama yüzeyi — sayfada görünen `title`dan ayrı.
   *
   * Yazı başlıkları editoryaldır ve öyle kalır ("2026'da hâlâ yaptığınız
   * (muhtemelen 2027'de de yapacağınız) 7 performans pazarlama hatası").
   * Ama 61-109 karakterlik bir başlık SERP'te ortasından kesilir: ilk tam
   * denetimde 32 yazı URL'inin 29'u `title-length` kuralından düştü. H1
   * okur için, `<title>` arama için yazılır.
   *
   * Hedef kelime başa alınır (`docs/strateji/Keyword-Planner/`
   * keyword-hacim-birlesik.csv); EN çeviri değil, o dilin arama niyetidir.
   *
   * `title` ≤50 karakter — layout'un "%s — INDOLES" şablonu 10 karakter
   * ekler. `description` verilmezse `excerpt` 160 karakterde kırpılır;
   * verilirse 80-160 arasında olmalıdır.
   */
  seo?: {
    title?: Localized<string>;
    description?: Localized<string>;
  };
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

  /**
   * Aylık yönetim planları — hizmet sayfasındaki fiyat tablosu.
   *
   * Paketler'den ayrı bir satış modeli: paket sabit kapsam + sabit süre,
   * plan aylık yürütme aboneliğidir; adlandırmada "paket" bu yüzden
   * kullanılmaz. Alan opsiyoneldir — veri giren hizmette bölüm render olur
   * (Teslim listesi ile SSS arası), girmeyende hiç görünmez. Şimdilik yalnız
   * performans-pazarlama doldurur.
   *
   * Planlar merdivendir: `baseline` bir üst planın "alttakinin tamamı,
   * artı:" satırıdır ve Türkçe ek uyumu (Giriş'teki / Standart'taki)
   * üretilemeyeceği için interpolasyonsuz, tam metin olarak girilir.
   * Fiyat plan başına aylık TRY'dir; şemaya UnitPriceSpecification (MON)
   * olarak akar. KDV/fatura çerçevesi `note` satırında durur.
   */
  retainerPlans?: {
    title: Localized<string>;
    lede: Localized<string>;
    /** Tablo altı tek satır — "Fiyatlar aylıktır; KDV dahil değildir." */
    note: Localized<string>;
    plans: Array<{
      /** Kararlı kimlik — GA/test seçicileri için, locale'den bağımsız. */
      key: string;
      name: Localized<string>;
      monthlyTRY: number;
      /** "Önerilen plan" çipi — en fazla bir planda true. */
      featured?: boolean;
      /** Tek cümle kart özeti. */
      summary: Localized<string>;
      /** Kime göre olduğu — kartın teal vurgu satırı. */
      audience: Localized<string>;
      /** Merdiven satırı: "Giriş'teki her şey, artı:" — tam metin. */
      baseline?: Localized<string>;
      /**
       * Öne çıkan kalem — madde listesinde değil, kartta vurgulu blokta
       * basılır (örn. aylık çekim günü). Gün sayısı gibi farklar başlıkta
       * taşınır; her planda bulunması beklenir ama alan opsiyoneldir.
       */
      spotlight?: {
        title: Localized<string>;
        description: Localized<string>;
      };
      features: Array<Localized<string>>;
    }>;
  };

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
