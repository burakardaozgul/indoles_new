import type { HealthScoreBucket } from "@/lib/analytics/events";
import type { DiagnooSignalId } from "@/lib/tools/diagnoo/signals";
import type { GeoBand, GeoCheckId } from "@/lib/tools/geo/types";
import type { Localized } from "./types";

/**
 * İnteraktif araç içerik katmanı (Görev 10).
 *
 * `/araclar` ailesinin tek metin kaynağı. Desen `articles.ts` / `topics.ts` ile
 * aynı: tipli kayıt + dizi, çeviri pariteleri typecheck ve `tools-content.test`
 * ile korunuyor. Şimdilik tek eleman (GEO Görünürlük Denetleyicisi); yapı yeni
 * araçlara hazır.
 *
 * Ton `docs/03-brand-voice-tone.md` §1'e göre ORTA — araç yüzeyi persona-aware
 * DEĞİL, teşhis dili nötr-analitik. Copy `indoles-brand-voice` skill'iyle
 * yazıldı: ünlem yok, hype yok, EN İngiliz imlası.
 *
 * Kanibalizasyon (strateji A-6): bu sayfa ARAÇ niyetini hedefler ("GEO
 * denetimi", "AI görünürlük testi", "llms.txt kontrolü"). Bilgi niyeti
 * ("geo optimizasyonu nedir") kanonik rehber yazısında kalır; araç H1'ine o
 * bilgi-kelimesi konmaz.
 */

/** "Nasıl çalışır" adımı — başlık + tek cümle. */
export type ToolStep = {
  title: Localized<string>;
  description: Localized<string>;
};

/**
 * Aracın ölçtüğü sinyalin tanıtım kartı. `id` motorun kontrol kimliğine
 * bağlıdır — GEO'da `GeoCheckId`, Diagnoo'da `DiagnooSignalId`; böylece
 * sayfadaki tanıtımla gerçek tarama kalemleri senkron kalır, hayali bir
 * sinyal eklenemez. Kimlik kümesi `I` ile taşınır: kayıt kendi motorunun
 * kimlik tipiyle yazılınca yanlış bir kimlik DERLEME hatası olur, birleşim
 * tipinde ise sessizce geçerdi. `weight` sinyalin 100 puanlık skordaki
 * payıdır (GEO'da motor `MAX_SCORE` değerleriyle, Diagnoo'da
 * `computeHealthScore` katsayılarıyla birebir).
 */
export type ToolSignal<I extends string = string> = {
  id: I;
  weight: number;
  title: Localized<string>;
  description: Localized<string>;
};

export type ToolFaq = {
  question: Localized<string>;
  answer: Localized<string>;
};

/**
 * Üçgenin araç→makale ayağı (Faz 2 Görev 2). `articleSlugTr` `ARTICLES`teki
 * kararlı TR slug'a bağlıdır — hayali bir slug `tools-content.test.ts`te
 * DERLEME değil ÇALIŞMA ZAMANI hatası verir (araç kaydı burada jenerik
 * `ToolContent` tipiyle değil, `articles.ts` gibi ayrı bir tip katmanıyla
 * yazılmadığı için tip düzeyinde kilitlenemez). `paragraph` markdown-lite
 * (`BlockRenderer`/`ArticleToolBridges`in paylaştığı `renderInline` ile
 * aynı sözdizimi) ve aracın kanonik TR yolunu `[Ad](/araclar/<slug>)`
 * biçiminde içerir — EN paragraf da aynı TR yolu yazar, `resolveInlineHref`
 * EN slug'a çevirir (yazı/vaka/hizmet köprüleriyle aynı desen).
 */
export type ToolBridge = {
  articleSlugTr: string;
  paragraph: Localized<string>;
};

/**
 * Araç kaydı. İki jenerik parametre aracın KAPALI KÜMELERİNİ taşır: `B`
 * bant kümesi (GEO 100 puanlık skoru dört GEO bandına — `GeoBand` — böler,
 * Diagnoo sağlık skorunu dört kovaya — `HealthScoreBucket`), `S` sinyal
 * kimliği kümesi (`GeoCheckId` / `DiagnooSignalId`). Jenerik olmasının nedeni
 * tek tip altında iki farklı kümeyi kaybetmeden taşımak: kayıt kendi
 * tipleriyle yazılır (`ToolContent<GeoBand, GeoCheckId>`), böylece eksik bir
 * bant ya da yabancı bir sinyal kimliği DERLEME hatasıdır. Ortak yüzeyler
 * (`TOOLS`, `publishedTools`, sitemap, llms.txt, `/araclar`) bu kümeleri
 * okumaz; onlar için varsayılan `string` yeter.
 */
export type ToolContent<B extends string = string, S extends string = string> = {
  slug: Localized<string>;
  name: Localized<string>;
  /** Başlık üstü etiket — iddia (`.eyebrow` primitive). */
  eyebrow: Localized<string>;
  /** Hero girişi — en fazla iki cümle (spec §3). */
  lede: Localized<string>;
  /** Bant başına tek cümle — skorun yanında. İçerik katmanı konuşur, motor değil. */
  bands: Record<B, Localized<string>>;
  /** Kanıt şeridi — hero'da 4 kısa öğe (mono, büyük harf). */
  proof: Array<Localized<string>>;
  /** Giriş alanının altındaki yardım satırı — kapsam uyarısı. */
  inputHelp: Localized<string>;
  /** "Nasıl çalışır" — tam 3 adım. */
  steps: ToolStep[];
  /** Ölçülen sinyallerin tanıtımı — motorun kontrol kalemleriyle hizalı. */
  signals: ToolSignal<S>[];
  /** Sayfada açık metin, JSON-LD'de `FAQPage` — en az 6 soru. */
  faq: ToolFaq[];
  /**
   * Arama yüzeyi — sayfada görünen `name`den ayrı. `title` ≤50 karakter
   * (layout "%s — INDOLES" ekler); `description` 140-160 ve içindeki her rakam
   * sayfada geçer.
   */
  seo: {
    title: Localized<string>;
    description: Localized<string>;
  };
  /**
   * İddia dipnotu — "Türkiye'nin ilk" eyebrow'unu tarih damgasıyla
   * doğrular (içerik dürüstlüğü, docs/04 §10).
   */
  footnote: Localized<string>;
  /** Aracın doğal bağlandığı hizmetler — TR slug; hizmet sayfası callout'u buradan okur (üçgenin hizmet→araç ayağı). */
  relatedServices: string[];
  /**
   * Aracın doğal bağlandığı makaleler — üçgenin araç→makale ayağı (Faz 2
   * Görev 2). Makale sayfası `bridgesForArticle` ile bu diziyi okur; kayıt
   * `published: false` olduğu sürece hiçbir makalede görünmez (aynı bayrak,
   * ADR-032). GEO'nun köprüleri zaten üç yazının gövdesinde inline durur
   * (Görev 13) — o kayıt burada boş dizi taşır, aynı linki iki kez basmamak
   * için.
   */
  bridges: ToolBridge[];
  /**
   * LANSMAN KAPISI. `false` iken araç yalnız doğrudan URL ile erişilebilir:
   * sitemap'e, `/araclar` listesine ve llms.txt'e girmez, sayfası `noindex`
   * döner. Bir aracın çalışması dış sırlara ve uzak migration'a bağlıysa,
   * kod merge edildiği anda arama motoruna ilan edilmesi çalışmayan bir
   * sayfayı indeksletirdi. Bayrak, kod hazırlığı ile yayın kararını ayırır;
   * `true` yapmak ayrı ve bilinçli bir adımdır (runbook "Deploy öncesi Burak
   * adımları", ADR-032).
   */
  published: boolean;
};

/**
 * GEO kaydı — bant sözlüğü `GeoBand`, sinyal kimlikleri `GeoCheckId` ile
 * tipli. Skor kartı `bands[band]`i indeksliyor; `Record<string, …>` olsaydı
 * `noUncheckedIndexedAccess` altında `undefined` dönerdi ve cümle
 * opsiyonele düşerdi.
 */
export const GEO_TOOL: ToolContent<GeoBand, GeoCheckId> = {
  slug: {
    tr: "geo-gorunurluk-denetleyicisi",
    en: "geo-visibility-checker",
  },
  name: {
    tr: "GEO Görünürlük Denetleyicisi",
    en: "GEO Visibility Checker",
  },
  eyebrow: {
    tr: "Türkiye'nin ilk GEO denetim aracı",
    en: "The first Turkish GEO audit tool",
  },
  lede: {
    tr: "Cevap motorları sitenizi okuyabiliyor mu? GEO denetimi beş sinyalde ölçer ve her sinyalde ne düzelteceğinizi söyler.",
    en: "Can answer engines read your site? The GEO audit measures five signals and tells you what to fix in each one.",
  },
  bands: {
    zayif: {
      tr: "Cevap motorları sitenizi büyük ölçüde göremiyor.",
      en: "Answer engines can barely see your site.",
    },
    "gelismeye-acik": {
      tr: "Cevap motorları sitenizi okuyor ama alıntılayacak yapı bulamıyor.",
      en: "Answer engines read your site but find little structure to quote.",
    },
    iyi: {
      tr: "Temel yapı yerinde; birkaç sinyal sizi öne geçirir.",
      en: "The foundations are in place; a few signals would put you ahead.",
    },
    oncu: {
      tr: "Cevap motorları için örnek bir yapı.",
      en: "A model structure for answer engines.",
    },
  },
  proof: [
    { tr: "5 sinyal", en: "5 signals" },
    { tr: "100 puan", en: "100 points" },
    { tr: "Saniyeler içinde", en: "Within seconds" },
    { tr: "Ücretsiz", en: "Free" },
  ],
  inputHelp: {
    tr: "Denetim yalnız girdiğiniz sayfa içindir; başka bir sayfa için yeniden çalıştırın.",
    en: "The audit covers only the page you enter; run it again for another page.",
  },
  steps: [
    {
      title: { tr: "Adresi girin", en: "Enter the address" },
      description: {
        tr: "Denetlemek istediğiniz sayfanın tam URL'sini yapıştırın. Aracı yalnızca herkese açık sayfalarda çalıştırın.",
        en: "Paste the full URL of the page you want to audit. Run the tool only on publicly reachable pages.",
      },
    },
    {
      title: { tr: "Sinyalleri tarayalım", en: "We scan the signals" },
      description: {
        tr: "Araç sayfanızı, robots.txt'i ve llms.txt'i getirir; beş GEO sinyalini saniyeler içinde puanlar.",
        en: "The tool fetches your page, robots.txt and llms.txt, then scores five GEO signals within seconds.",
      },
    },
    {
      title: { tr: "Raporu okuyun", en: "Read the report" },
      description: {
        tr: "100 puanlık skoru, dört bantlı değerlendirmeyi ve sinyal başına düzeltme listesini alırsınız.",
        en: "You receive the 100-point score, a four-band rating and a fix list for each signal.",
      },
    },
  ],
  signals: [
    {
      id: "ai-access",
      weight: 25,
      title: { tr: "AI erişimi", en: "AI access" },
      description: {
        tr: "robots.txt'in GPTBot, ClaudeBot ve PerplexityBot gibi cevap motoru botlarını engelleyip engellemediğini denetler.",
        en: "Checks whether robots.txt blocks answer-engine crawlers such as GPTBot, ClaudeBot and PerplexityBot.",
      },
    },
    {
      id: "llms-txt",
      weight: 15,
      title: { tr: "llms.txt", en: "llms.txt" },
      description: {
        tr: "Sitenin kökünde bir llms.txt dosyası olup olmadığını ve cevap motorlarına hangi içeriği işaret ettiğini okur.",
        en: "Looks for an llms.txt file at the site root and reads which content it points answer engines toward.",
      },
    },
    {
      id: "json-ld",
      weight: 20,
      title: { tr: "Yapısal veri", en: "Structured data" },
      description: {
        tr: "Sayfadaki JSON-LD şemasını okur; Organization, Article veya FAQ gibi varlıkların makine tarafından okunur olup olmadığını görür.",
        en: "Reads the page's JSON-LD schema and sees whether entities like Organization, Article or FAQ are machine-readable.",
      },
    },
    {
      id: "lang-signals",
      weight: 15,
      title: { tr: "Dil sinyalleri", en: "Language signals" },
      description: {
        tr: "html lang etiketini ve hreflang alternatiflerini denetler; cevap motoru içeriğin dilini ve bölgesini böyle ayırt eder.",
        en: "Inspects the html lang tag and hreflang alternates; this is how an answer engine tells the content's language and region apart.",
      },
    },
    {
      id: "question-h2",
      weight: 25,
      title: { tr: "Soru başlıkları", en: "Question headings" },
      description: {
        tr: "Sayfadaki H2 başlıklarının soru biçiminde olup olmadığını sayar; cevap motorları soru-cevap yapısını doğrudan alıntılar.",
        en: "Counts how many H2 headings are phrased as questions; answer engines quote question-and-answer structure directly.",
      },
    },
  ],
  faq: [
    {
      question: {
        tr: "GEO denetimi neyi ölçer?",
        en: "What does a GEO audit measure?",
      },
      answer: {
        tr: "GEO denetimi, cevap motorlarının sitenizi okuyabilme ve alıntılayabilme derecesini ölçer. Araç beş sinyali inceler: AI botlarının erişimi, llms.txt dosyası, JSON-LD yapısal verisi, dil etiketleri ve soru biçimli başlıklar. Her sinyal ayrı puanlanır; toplam 100 puanlık bir skora ve dört bantlı bir değerlendirmeye dönüşür. Amaç, ChatGPT veya Gemini bir cevap üretirken markanızı anma olasılığını artırmaktır.",
        en: "A GEO audit measures how well answer engines can read and cite your site. The tool inspects five signals: AI crawler access, the llms.txt file, JSON-LD structured data, language tags and question-style headings. Each signal is scored separately and rolls up into a total out of 100 points and a four-band rating. The aim is to raise the odds that ChatGPT or Gemini names your brand when it writes an answer.",
      },
    },
    {
      question: {
        tr: "AI görünürlük testi hangi botları kontrol eder?",
        en: "Which crawlers does the AI visibility test check?",
      },
      answer: {
        tr: "AI görünürlük testi, robots.txt dosyanızı okuyarak cevap motoru botlarının engellenip engellenmediğine bakar. Kontrol ettiği başlıca botlar arasında OpenAI'nin GPTBot'u, Anthropic'in ClaudeBot'u, Perplexity'nin PerplexityBot'u ve Google'ın Google-Extended kaydı bulunur. Bir bot engelliyse ilgili cevap motoru sayfanızı eğitim ve alıntı için kullanamaz; araç durumu işaretler ve robots.txt satırını nasıl düzelteceğinizi anlatır.",
        en: "The AI visibility test reads your robots.txt file to see whether answer-engine crawlers are blocked. Among the crawlers it checks are OpenAI's GPTBot, Anthropic's ClaudeBot, Perplexity's PerplexityBot and Google's Google-Extended record. When a crawler is blocked, that answer engine cannot use your page for training or citation; the tool flags the case and explains how to correct the robots.txt line.",
      },
    },
    {
      question: {
        tr: "llms.txt kontrolü neden önemli?",
        en: "Why does the llms.txt check matter?",
      },
      answer: {
        tr: "llms.txt, sitenizin kökünde duran ve cevap motorlarına hangi içeriğin öncelikli olduğunu anlatan yeni bir standarttır. Dosya varsa, bir dil modeli sitenizi tararken önce sizin işaret ettiğiniz sayfalara ve özetlere bakar; yoksa motor tüm siteyi kendi başına yorumlar. Kontrol, dosyanın var olup olmadığını ve anlamlı bağlantılar içerip içermediğini denetler, eksikse örnek bir yapı önerir.",
        en: "The llms.txt file sits at your site root and tells answer engines which content matters most; the format is an emerging standard. When the file exists, a language model looks first at the pages and summaries you point to; without it, the engine interprets the whole site on its own. The check confirms whether the file is present and holds meaningful links, and suggests a starter structure when it is missing.",
      },
    },
    {
      question: {
        tr: "Skor kaç olmalı?",
        en: "What score should I aim for?",
      },
      answer: {
        tr: "Skor 100 puan üzerinden hesaplanır ve dört banda ayrılır: 0-39 arası zayıf, 40-69 arası gelişmeye açık, 70-89 arası iyi, 90 ve üzeri öncü. Çoğu Türkçe site ilk taramada zayıf ya da gelişmeye açık banttan başlar. Hedef, en az iyi bandına ulaşmak ve her sinyalde tam puana yaklaşmaktır; rapor, hangi düzeltmenin skoru en çok artıracağını sıralar.",
        en: "The score runs out of 100 points and splits into four bands: 0-39 is weak, 40-69 is developing, 70-89 is good, and 90 or above is leading. Most Turkish sites start in the weak or developing band on their first scan. Aim for at least the good band and push each signal toward full marks; the report ranks which fix lifts the score the most.",
      },
    },
    {
      question: {
        tr: "Detaylı raporda ne var?",
        en: "What is in the detailed report?",
      },
      answer: {
        tr: "Rapor, beş sinyalin her biri için ayrı bir bölüm açar. Her bölümde sinyalin aldığı puan, durumu (geçti, kısmen, kaldı) ve somut bulgular yer alır; örneğin hangi botun engellendiği veya kaç H2 başlığının soru biçiminde olduğu. Bulguların altında düzeltme önerileri sıralanır. Raporu bir yapılacaklar listesi gibi okuyup en yüksek etkili değişikliklerden başlayabilirsiniz.",
        en: "The report opens a separate section for each of the five signals. Every section shows the signal's score, its status — pass, partial or fail — and concrete findings, such as which crawler is blocked or how many H2 headings are phrased as questions. Fix suggestions sit beneath the findings. You can read the report as a to-do list and start with the highest-impact changes.",
      },
    },
    {
      question: {
        tr: "Verilerim ne oluyor?",
        en: "What happens to my data?",
      },
      answer: {
        tr: "Denetim yalnızca girdiğiniz herkese açık URL'yi getirir; kişisel veri toplamaz. IP adresiniz ham hâliyle saklanmaz, yalnızca kötüye kullanımı sınırlamak için tuzlanmış bir özet olarak tutulur. Tarama sonucu, sonucu tekrar açabilmeniz için kimliğiyle birlikte veritabanımızda durur. KVKK kapsamındaki haklarınız ve saklama süreleri için gizlilik metnimize bakabilirsiniz.",
        en: "The audit only fetches the public URL you enter and collects no personal data. Your IP address is never stored in raw form; we keep only a salted hash of it to limit abuse. The scan result is saved in our database with its identifier so you can reopen it later. For your rights under KVKK and our retention periods, please see our privacy notice.",
      },
    },
    {
      question: {
        tr: "Türkiye'nin ilk GEO denetim aracı mı?",
        en: "Is this the first Turkish GEO audit tool?",
      },
      answer: {
        tr: "Eylül 2026 itibarıyla Türkçe pazarda benzer kapsamda kamuya açık bir GEO denetim aracı tespit etmedik; iddia bu tarihle sınırlıdır ve yeni bir araç çıktığında güncellenir. Araç, INDOLES'in kendi sitesinde uyguladığı GEO pratiğinin ölçülebilir hâlidir: llms txt kontrolü, robots.txt izinleri, yapısal veri ve soru başlıkları aynı kurallarla puanlanır.",
        en: "As of September 2026 we found no comparable, publicly available GEO audit tool for the Turkish-language market; the claim is tied to that date and will be updated if a new tool appears. The tool is the measurable form of the GEO practice INDOLES applies on its own site: the llms.txt check, robots.txt permissions, structured data and question headings are scored by the same rules.",
      },
    },
  ],
  seo: {
    title: {
      tr: "GEO denetim aracı — AI görünürlük testi",
      en: "GEO audit tool — AI visibility test",
    },
    description: {
      tr: "GEO denetim aracımızla sitenizin AI görünürlüğünü ölçün: robots.txt izinleri, llms.txt kontrolü, yapısal veri ve dil sinyalleri 100 puan üzerinden puanlanır.",
      en: "Measure your site's AI visibility with our GEO audit tool: crawler permissions, the llms.txt check, structured data and language signals, scored out of 100.",
    },
  },
  footnote: {
    tr: "Eylül 2026 itibarıyla Türkçe pazarda benzer kapsamda kamuya açık bir GEO denetim aracı tespit etmedik.",
    en: "As of September 2026, we found no comparable, publicly available GEO audit tool for the Turkish-language market.",
  },
  // GEO denetimi cevap motoru görünürlüğünü ölçer — AI danışmanlığı
  // hizmetinin doğal devamı; başka bir hizmetin teşhis kapsamına girmez.
  relatedServices: ["ai-danismanlik"],
  // Köprüler zaten üç GEO yazısının gövdesinde inline duruyor (Görev 13);
  // burada tekrarlanmaz — aynı linki iki kez basmak okuru yormaktan başka
  // işe yaramaz.
  bridges: [],
  published: true,
};

/**
 * Diagnoo kaydı — bant sözlüğü `HealthScoreBucket` ile tipli (`0-25`,
 * `26-50`, `51-75`, `76-100`; `healthScoreBucket()` ile aynı kova sınırları).
 * GEO'nun `GeoBand`iyle aynı rolü oynar, kümesi farklıdır; `ToolContent`in
 * jenerik olmasının sebebi budur.
 */
export const DIAGNOO_TOOL: ToolContent<HealthScoreBucket, DiagnooSignalId> = {
  slug: {
    tr: "diagnoo",
    en: "diagnoo",
  },
  name: {
    tr: "Diagnoo",
    en: "Diagnoo",
  },
  eyebrow: {
    tr: "Yedi sayfa, dört boyut, tek skor",
    en: "Seven pages, four dimensions, one score",
  },
  lede: {
    tr: "Mağazanız satmaya hazır mı? Diagnoo'nun ücretsiz e-ticaret site analizi yedi kritik sayfayı tarar, 100 üzerinden puanlar ve kayıp cironuzu TL aralığı olarak yazar.",
    en: "Is your store ready to sell? Diagnoo's free e-commerce site analysis scans seven critical pages, scores them out of 100 and puts your lost revenue in a lira range.",
  },
  // Kova sınırları `healthScoreBucket()` ile birebir; her cümle skorun hangi
  // boyutta kaybedildiğini söyler, genel bir değerlendirme vermez.
  bands: {
    "0-25": {
      tr: "Mağaza dört boyutun dördünde de puan kaybediyor; önce mesaj ve hız temelleri kurulur.",
      en: "The store loses points in all four dimensions; message and speed foundations come first.",
    },
    "26-50": {
      tr: "Temel yapı duruyor ama ziyaretçi ilk ekranda ne satın alacağını çözemiyor.",
      en: "The basics stand, yet a visitor cannot work out what to buy on the first screen.",
    },
    "51-75": {
      tr: "Satın alma akışı çalışıyor; kalan puan hız ve ölçüm eksiklerinde.",
      en: "The purchase flow works; the remaining points sit in speed and tracking gaps.",
    },
    "76-100": {
      tr: "Dört boyut da hizada; kazanç artık ince ayardan gelir.",
      en: "All four dimensions are aligned; the gains now come from fine-tuning.",
    },
  },
  // Dördü de motorun ölçtüğü veya ürettiği şey: tarama yedi sayfayla sınırlı
  // (`page-discovery.ts`: 1 ana + 2 kategori + 3 ürün + 1 ödeme), koşu iki ile
  // dört dakika sürer, parasal sonuç tek rakam değil TL aralığıdır
  // (`RangeValue`), ücret alınmaz.
  proof: [
    { tr: "7 sayfa", en: "7 pages" },
    { tr: "2-4 dakika", en: "2-4 minutes" },
    { tr: "TL aralığı", en: "Lira ranges" },
    { tr: "Ücretsiz", en: "Free" },
  ],
  // Giriş alanının tek yardım satırı (`DiagnooForm` bunu basar): kapsam,
  // süre ve hız sınırı — üçü de motorun gerçek davranışı (`page-discovery.ts`,
  // `IP_DAILY_LIMIT = 3`).
  inputHelp: {
    tr: "Ana sayfanızın herkese açık adresi yeterli; tarama iki ile dört dakika sürer ve aynı ağdan günde üç tarama başlatılabilir.",
    en: "Your store's public home page address is enough; the scan takes two to four minutes and each network can start three scans a day.",
  },
  steps: [
    {
      title: { tr: "Mağaza adresini girin", en: "Enter the store address" },
      description: {
        tr: "Ana sayfanızın adresini yapıştırın; araç kategori, ürün ve ödeme sayfalarını kendisi bulur.",
        en: "Paste your home page address; the tool finds the category, product and checkout pages itself.",
      },
    },
    {
      title: { tr: "Yedi sayfa taransın", en: "Let seven pages be scanned" },
      description: {
        tr: "Tarama iki ile dört dakika sürer: içerik, ekran görüntüsü ve mobil hız verisi aynı koşuda toplanır.",
        en: "The scan takes two to four minutes: content, screenshots and mobile speed data arrive in the same run.",
      },
    },
    {
      title: { tr: "Skoru okuyun, raporu açın", en: "Read the score, open the report" },
      description: {
        tr: "Ücretsiz görünüm skoru ve üç boşluğu verir; iş e-postanız tam raporu, TL aralıklarını ve yol haritasını açar.",
        en: "The free view gives the score and three gaps; your work e-mail opens the full report, the lira ranges and the roadmap.",
      },
    },
  ],
  signals: [
    {
      id: "semantic",
      weight: 25,
      title: { tr: "Mesaj tutarlılığı", en: "Message consistency" },
      description: {
        tr: "Ana sayfa, kategori ve ürün metinlerinin aynı değer vaadini söyleyip söylemediğini ölçer; kopan başlıkları ve arama kelimesi boşluklarını listeler.",
        en: "Measures whether the home, category and product copy state the same value promise; lists the headings that break away and the search keyword gaps.",
      },
    },
    {
      id: "ux",
      weight: 25,
      title: { tr: "Arayüz yükü ve eylem çağrısı", en: "Interface load and call to action" },
      description: {
        tr: "İlk ekranın bilişsel yükünü ve eylem çağrısının görünürlüğünü sayfa ekran görüntüleri üzerinden puanlar.",
        en: "Scores the cognitive load of the first screen and the visibility of the call to action from the page screenshots.",
      },
    },
    {
      id: "speed-funnel",
      weight: 30,
      title: { tr: "Hız ve satın alma akışı", en: "Speed and purchase flow" },
      description: {
        tr: "Anasayfa ve ürün sayfalarından en fazla üçünün mobil LCP, CLS ve TTFB değerlerini PageSpeed Insights ile okur; ödeme adımındaki sürtünme noktalarını — zorunlu üyelik, uzun form, geç görünen kargo bedeli — tek tek sayar.",
        en: "Reads mobile LCP, CLS and TTFB with PageSpeed Insights on at most three of the home and product pages, then counts the friction points at checkout one by one: forced sign-up, long forms, a delivery charge that appears late.",
      },
    },
    {
      id: "tracking",
      weight: 20,
      title: { tr: "Ölçüm altyapısı", en: "Tracking setup" },
      description: {
        tr: "GA4/gtag, Meta Pixel ve oturum analitiği (Hotjar/Clarity) etiketlerinin varlığını kontrol eder; eksik olanları raporda ad ad listeler.",
        en: "Checks whether the GA4/gtag, Meta Pixel and session analytics (Hotjar/Clarity) tags are present; the report names the missing ones one by one.",
      },
    },
  ],
  faq: [
    {
      question: {
        tr: "Diagnoo neyi ölçer?",
        en: "What does Diagnoo measure?",
      },
      answer: {
        tr: "Diagnoo bir e-ticaret mağazasının satış hazırlığını dört boyutta ölçer: metinlerin aynı vaadi söyleyip söylemediği, arayüzün ilk ekranda ne kadar yük bindirdiği, sayfaların mobil hızı ile satın alma akışındaki sürtünme, bir de ölçüm altyapısının eksikleri. Dört boyut 100 puanlık tek bir sağlık skorunda birleşir; skorun altında hangi boşluğun kaç puan götürdüğü ayrı ayrı yazar. Diagnoo'nun ürettiği skor, satın alma akışına odaklanan bir CRO analizi olarak da okunabilir.",
        en: "Diagnoo measures how ready an online store is to sell, across four dimensions: whether the copy states one consistent promise, how much load the first screen puts on a visitor, how fast the pages run on mobile together with the friction in the purchase flow, and what the tracking setup misses. The four dimensions merge into a single health score out of 100, and each gap shows how many points it costs. The score Diagnoo produces also works as a CRO analysis centred on the purchase flow.",
      },
    },
    {
      question: {
        tr: "Tarama verisi nereden geliyor?",
        en: "Where does the scan data come from?",
      },
      answer: {
        tr: "Veri üç kaynaktan toplanır. Sayfa içerikleri ve ekran görüntüleri Firecrawl taramasıyla alınır; hız değerleri Google PageSpeed Insights'ın mobil ölçümünden okunur; metin ile arayüz değerlendirmesini Gemini modeli yapar. Tarama yedi sayfaya bakar: ana sayfa, iki kategori sayfası, üç ürün sayfası ve ödeme adımı. Rapordaki her sayı hangi sayfadan ve hangi ölçümden geldiğini künyesinde taşır.",
        en: "Three sources feed the scan. Firecrawl collects page content and screenshots, Google PageSpeed Insights supplies the mobile speed figures, and a Gemini model reads the copy and the interface. The scan looks at seven pages: the home page, two category pages, three product pages and the checkout step. Every number in the report carries the page and the measurement it came from.",
      },
    },
    {
      question: {
        tr: "Ölçülen veri ile tahmin edilen veri nasıl ayrılıyor?",
        en: "How does the report separate measured and estimated figures?",
      },
      answer: {
        tr: "Rapordaki her girdi ölçüldü ya da tahmin edildi rozetiyle işaretlenir. Hız, ekran ve metin verileri doğrudan ölçülür. Trafik, sepet ortalaması, dönüşüm oranı ve reklam bütçesi sizde varsa forma girilir ve ölçülen sayı olarak işlenir; girmezseniz sektör kıyaslarından tahmin edilir. Parasal sonuçlar tek bir rakam değil, alt-beklenen-üst aralığı olarak yazılır; yöntem eki her sabiti kaynağıyla listeler. Ölçülen ve tahmin edilen girdilerin ayrımı, eksik veriyle de çalışan gerçekçi bir dönüşüm oranı analizi üretir.",
        en: "Every input in the report carries a measured or an estimated badge. Speed, screen and copy data come from direct measurement. Traffic, average order value, conversion rate and ad spend are yours to supply in the form and then count as measured; leave them blank and sector benchmarks fill the gap as estimates. Money figures appear as a low-expected-high range rather than a single number, and the methodology appendix lists every constant with its source. Separating measured inputs from estimated ones keeps the conversion rate analysis realistic even when parts of the data are missing.",
      },
    },
    {
      question: {
        tr: "Tarama ne kadar sürer?",
        en: "How long does a scan take?",
      },
      answer: {
        tr: "Bir tarama iki ile dört dakika arasında tamamlanır. Süre yedi sayfanın çekilmesine, mobil hız ölçümünün dönmesine ve modelin metin ile arayüzü değerlendirmesine gider; sayfa sayısı sabit olduğu için büyük mağazada da küçük mağazada da benzer sürer. İlerleme adım adım gösterilir. Aynı IP adresinden günde üç tarama başlatılabilir.",
        en: "A scan finishes in two to four minutes. The time goes into fetching the seven pages, waiting for the mobile speed measurement and letting the model read the copy and the interface; because the page count is fixed, a large store takes about as long as a small one. Progress is shown step by step, and each IP address can start three scans a day.",
      },
    },
    {
      question: {
        tr: "Hangi veriler saklanıyor?",
        en: "Which data does Diagnoo store?",
      },
      answer: {
        tr: "Ücretsiz taramada yalnız girdiğiniz mağaza adresi ve IP adresinizin tuzlanmış özeti saklanır; ham IP hiçbir yerde tutulmaz. Tam raporu açtığınızda iş e-posta adresiniz ve şirket adınız zorunlu, ad soyadınız ile paylaşmayı seçtiğiniz ticari sayılar isteğe bağlı olarak KVKK rızanızla kaydedilir. Rapor sayfası arama motorlarına kapalıdır, bağlantıyı yalnız siz paylaşırsınız. Saklama süreleri ve haklarınız gizlilik metnimizde yazılıdır.",
        en: "A free scan stores only the store address you enter and a salted hash of your IP address; the raw IP is never kept. When you unlock the full report, your work e-mail and company name are required, while your full name and any commercial figures you choose to share are optional — all recorded under your KVKK consent. The report page stays closed to search engines, and only you share its link. Retention periods and your rights sit in our privacy notice.",
      },
    },
    {
      question: {
        tr: "Diagnoo ücretli mi?",
        en: "Is Diagnoo free?",
      },
      answer: {
        tr: "Tarama da tam rapor da ücretsizdir; kart bilgisi istenmez, abonelik açılmaz. Anlık görünüm skoru ve üç boşluğu tarama biter bitmez gösterir; tam rapor iş e-postanızı ve şirket adınızı vermenizle açılır. Karşılığında ne aldığımız açık: raporunu okuyan mağazaların bir kısmı danışmanlık için bize dönüyor. Yol haritasını kendi ekibinizle uygulamak da tamamen mümkündür.",
        en: "Both the scan and the full report are free: no card details, no subscription. The snapshot shows the score and three gaps as soon as the scan ends, and the full report opens when you give a work e-mail and a company name. What we get in return is plain — a share of the stores that read a report come back to us for consultancy. Running the roadmap with your own team is equally valid.",
      },
    },
  ],
  seo: {
    title: {
      tr: "E-ticaret teşhis aracı — ücretsiz site analizi",
      en: "E-commerce diagnostic tool — free site analysis",
    },
    description: {
      tr: "E-ticaret teşhis aracı Diagnoo mağazanızın yedi kritik sayfasını tarar; mesaj, arayüz, hız ve ölçüm altyapısını 100 puan üzerinden ücretsiz puanlar.",
      en: "Diagnoo, our e-commerce diagnostic tool, scans seven critical pages of your store and scores message, interface, speed and tracking out of 100 points.",
    },
  },
  footnote: {
    tr: "Eylül 2026 sürümü: tarama yedi sayfayla sınırlıdır, hız değerleri Google PageSpeed Insights'ın mobil ölçümünden gelir ve parasal sonuçlar aralık olarak verilir.",
    en: "September 2026 release: the scan covers seven pages, speed figures come from Google PageSpeed Insights on mobile, and money figures are given as ranges.",
  },
  // Diagnoo mağaza sağlığını ölçer — CRO, performans pazarlama ve
  // e-ticaret danışmanlığının teşhis girişi; üçü de motorun taradığı
  // dört boyutla (mesaj, arayüz, hız, ölçüm) doğrudan örtüşür.
  relatedServices: ["cro", "performans-pazarlama", "e-ticaret"],
  /**
   * Üçgenin araç→makale ayağı (Faz 2 Görev 2). Hedef küme
   * `ARTICLES.filter(a => ["cro","performans-pazarlama","e-ticaret"].includes(a.topic))`
   * ile çıkan 8 yazıdan 7'si — her biri Diagnoo'nun dört boyutundan
   * (mesaj/`semantic`, arayüz/`ux`, hız-huni/`speed-funnel`, ölçüm/`tracking`)
   * yazının kendi somut örneğine en yakın olanına bağlanır. Yedinci yazı,
   * `satis-ekibinizin-vaktini-harcamayin-b2bde-kaliteli-lead-toplama-rehberi`,
   * bilinçli olarak dışarıda bırakıldı: konusu B2B teklif/CRM lead
   * niteliği — Diagnoo'nun taradığı yedi sayfa (ana + kategori + ürün +
   * ödeme) bir teklif portalında karşılığı yok, yazının savunduğu "formda
   * bilinçli sürtünme" de Diagnoo'nun ödeme adımında sürtünme olarak
   * saydığı şeylerin (zorunlu üyelik, uzun form) tam tersi bir mantık.
   * Zorlama bir bağ kurmak yerine yazı bu listeden çıkarıldı.
   */
  bridges: [
    {
      // Tracking: yazının FAQ'ı "önce ölçüm, sonra kampanya" sırasını SOYLU
      // AVM örneğiyle anlatıyor — Diagnoo'nun ölçüm sinyaliyle aynı iddia.
      articleSlugTr: "gercek-e-ticaret-ajansinin-etkisi",
      paragraph: {
        tr: "Bu yazıda anlatılan sıra — önce ölçüm, sonra kampanya — gerçek bir e-ticaret ajansının attığı ilk adımdır; sıra bozulduğunda hangi kanalın sattığını kimse bilemez. Mağazanızın adresini girip [Diagnoo](/araclar/diagnoo) ile ücretsiz taratın: araç GA4, Meta Pixel ve oturum analitiği etiketlerinin kurulu olup olmadığını kontrol eder, eksik olanları tek tek listeler.",
        en: "The order this article describes — measurement first, campaign second — is the opening move of a real e-commerce agency; get it wrong and nobody can tell which channel is actually selling. Enter your store's address and run a free scan with [Diagnoo](/araclar/diagnoo): it checks whether your GA4, Meta Pixel and session-analytics tags are installed and lists the missing ones one by one.",
      },
    },
    {
      // Speed-funnel: "Hata 2: Mobil optimizasyonu ihmal etmek" mobil hız ve
      // küçük ekranda ödeme sürtünmesini anlatıyor — Diagnoo'nun hız-huni
      // sinyaliyle aynı iki bileşen.
      articleSlugTr: "7-onemli-performans-pazarlama-hatasi",
      paragraph: {
        tr: "Bu yazının ikinci hatası mobil optimizasyonu ihmal etmekti; aynı ihmal genelde ödeme adımına da taşınır. [Diagnoo](/araclar/diagnoo) mağazanızın mobil sayfa hızını PageSpeed Insights ile ölçer ve ödeme akışındaki zorunlu üyelik, uzun form ve geç görünen kargo bedeli gibi sürtünme noktalarını tek tek sayar; ücretsiz tarama hangi noktanın öncelikli olduğunu gösterir.",
        en: "This article's second mistake was neglecting mobile optimisation, and that same neglect usually carries through to checkout. [Diagnoo](/araclar/diagnoo) reads your store's mobile page speed with PageSpeed Insights and counts the friction points in the purchase flow one by one — forced sign-up, a long form, a delivery charge that appears late — and the free scan shows which one to fix first.",
      },
    },
    {
      // UX: Kural 2 (görünür CTA) ve Kural 3 (sade düzen) birlikte
      // Diagnoo'nun "arayüz yükü ve eylem çağrısı" sinyalinin tanımıyla
      // (ekran görüntüsünden bilişsel yük + CTA görünürlüğü) örtüşüyor.
      articleSlugTr: "donusum-optimizasyonu-yontemleri",
      paragraph: {
        tr: "Bu yazının ikinci ve üçüncü kuralları — görünür bir eylem çağrısı, sade bir düzen — [Diagnoo](/araclar/diagnoo)'nun ölçtüğü bir sinyalle örtüşür: araç, mağaza sayfalarınızın ekran görüntülerinden ilk ekranın bilişsel yükünü ve eylem çağrısının görünürlüğünü puanlar. Mağaza adresinizi girin, ücretsiz sağlık skoru yükün nerede biriktiğini gösterir.",
        en: "Rules two and three in this article — a visible call to action, an uncluttered layout — line up with one of the signals [Diagnoo](/araclar/diagnoo) measures: it scores the cognitive load of the first screen and the visibility of the call to action from screenshots of your store's pages. Enter your store's address and the free health score shows where that load builds up.",
      },
    },
    {
      // Tracking: yazının dört maddesi de "ölçüm" ortak paydasına iniyor —
      // piksel/dönüşüm izleme sırası aynı SOYLU AVM örneğiyle anlatılıyor.
      articleSlugTr:
        "sadece-trafik-degil-ciro-isteyenler-icin-2026-performans-pazarlama-trendleri",
      paragraph: {
        tr: "Bu yazıdaki dört maddenin ortak paydası ölçümdü: piksel ve dönüşüm izleme kurulmadan açılan bir kampanya, sonucu değil yalnız harcamayı raporlar. [Diagnoo](/araclar/diagnoo) mağazanızın GA4, Meta Pixel ve oturum analitiği etiketlerini ücretsiz kontrol eder — cironun gerçekte nereden geldiğini görmeden önce hangi etiketin eksik olduğunu bilmek gerekir.",
        en: "The four items in this article all came down to one thing: measurement — a campaign launched before pixel and conversion tracking are in place reports spend, not results. [Diagnoo](/araclar/diagnoo) checks your store's GA4, Meta Pixel and session-analytics tags for free; knowing which tag is missing comes before knowing where your revenue actually comes from.",
      },
    },
    {
      // Speed-funnel: yazının "sepet terk oranı" bölümü Diagnoo'nun ödeme
      // sürtünmesi listesiyle (zorunlu üyelik, uzun form, geç görünen
      // kargo bedeli) neredeyse birebir aynı üç maddeyi sayıyor.
      articleSlugTr: "cro-nedir",
      paragraph: {
        tr: "Bu yazıda sepet terk oranını yükselten beş neden sayılıyor; üçü — zorunlu üyelik, uzun form, geç görünen kargo bedeli — [Diagnoo](/araclar/diagnoo)'nun ödeme akışınızda tek tek saydığı sürtünme noktalarıyla birebir örtüşüyor. Mağazanızın adresini girin, araç bu noktaları ve mobil sayfa hızınızı ücretsiz olarak PageSpeed Insights ile ölçsün.",
        en: "This article lists five reasons cart abandonment runs high; three of them — forced registration, a long form, a delivery charge that appears late — are exactly the friction points [Diagnoo](/araclar/diagnoo) counts one by one in your checkout flow. Enter your store's address and let the free scan measure those points and your mobile page speed with PageSpeed Insights.",
      },
    },
    {
      // Tracking: yazının ilk kriteri "ajans teste başlamadan önce ölçümü
      // doğruluyor mu" — Diagnoo'nun kendisi bu doğrulamanın etiket kısmını
      // ücretsiz yapıyor.
      articleSlugTr: "cro-ajansi-nasil-secilir",
      paragraph: {
        tr: "Bu yazının ilk kriteri, bir CRO ajansının teste başlamadan önce ölçümü doğrulayıp doğrulamadığıdır; yanlış kurulmuş bir dönüşüm tanımı üzerine kurulan her test geçersizdir. [Diagnoo](/araclar/diagnoo) bu doğrulamanın bir kısmını ücretsiz yapar: GA4, Meta Pixel ve oturum analitiği etiketlerinin mağazanızda kurulu olup olmadığını kontrol eder.",
        en: "This article's first criterion is whether a CRO agency validates measurement before it runs a single test — any test built on a badly defined conversion event is invalid. [Diagnoo](/araclar/diagnoo) does part of that validation for you at no cost: it checks whether your store has the GA4, Meta Pixel and session-analytics tags installed.",
      },
    },
    {
      // Dört boyut birden: yazı GAP analizini Diagnoo'nun kendi çerçevesiyle
      // — yedi sayfa, dört boyut, TL aralığı, doksan günlük plan — anlatıyor
      // ama gövdesinde araç linki taşımıyor (Faz 2 Görev 6): köprü yayın
      // kapısı açıldığında yöntemi araçla buluşturur.
      articleSlugTr: "e-ticaret-gap-analizi-cro-denetimi",
      paragraph: {
        tr: "Bu yazıda anlatılan denetimi elle kurmak bir ile iki iş günü tutar; aynı çerçeveyi otomatik koşturmak isterseniz [Diagnoo](/araclar/diagnoo) mağaza adresinizle aynı yedi sayfayı tarar ve dört boyutu aynı ağırlıklarla puanlar. Hesabın kendisi de burada anlatıldığı gibi çalışır: kayıp yalnız 2,5 saniyelik LCP eşiğinin üzerindeki gecikme için yazılır ve sonuç tek rakam değil TL aralığı olarak verilir.",
        en: "Running the audit described here by hand takes one to two working days; if you would rather run the same framework automatically, [Diagnoo](/araclar/diagnoo) scans the same seven pages from your store address and scores the four dimensions on the same weights. The arithmetic works exactly as set out above: loss is written only for the delay above the 2.5-second LCP threshold, and the result comes back as a lira range rather than a single figure.",
      },
    },
  ],
  // Üç dış sır (`GEMINI_API_KEY`, `FIRECRAWL_API_KEY`, `PSI_API_KEY`) ve
  // uzak D1 migration'ı (0004 + 0005) hazır olmadan araç gerçek veri
  // üretemez; o ana kadar arama yüzeylerine girmez.
  published: false,
};

/**
 * Ortak yüzeylerin okuduğu dizi. Elemanlar kendi bant tipleriyle yazılır,
 * burada ortak `ToolContent` (B = string) olarak durur — sitemap, llms.txt
 * ve `/araclar` bant sözlüğünü zaten okumaz.
 */
export const TOOLS: ToolContent[] = [GEO_TOOL, DIAGNOO_TOOL];

/**
 * Arama ve keşif yüzeylerinin (sitemap, `/araclar` listesi, llms.txt) tek
 * kaynağı. Liste parametresi yalnız test içindir: lansman senaryosunu gerçek
 * kaydı değiştirmeden doğrulayabilmek gerekiyor.
 */
export function publishedTools(tools: ToolContent[] = TOOLS): ToolContent[] {
  return tools.filter((t) => t.published);
}

/**
 * Üçgenin hizmet→araç ayağı. Hizmet sayfası (`ToolServiceCallout`) bu
 * fonksiyonla kendi TR slug'ına bağlı araçları okur. `publishedTools()`
 * üzerinden filtreler — lansman kapısı kapalıyken araç hiçbir hizmet
 * sayfasında da görünmez (ADR-032 ile aynı bayrak, ikinci bir kontrol yok).
 */
export function toolsForService(serviceSlugTr: string): ToolContent[] {
  return publishedTools().filter((t) => t.relatedServices.includes(serviceSlugTr));
}

/**
 * Üçgenin araç→makale ayağı (Faz 2 Görev 2). Makale sayfası
 * (`ArticleToolBridges`) bu fonksiyonla kendi TR slug'ına bağlı köprüleri
 * okur. `publishedTools(tools)` üzerinden filtreler — lansman kapısı
 * kapalıyken (Diagnoo bugün) hiçbir makalede köprü basılmaz, `toolsForService`
 * ile aynı bayrak ve aynı gerekçe (ADR-032). `tools` parametresi
 * `publishedTools`inkiyle aynı sebeple yalnız test içindir.
 */
export function bridgesForArticle(
  articleSlugTr: string,
  tools: ToolContent[] = TOOLS,
): Array<{ tool: ToolContent; paragraph: Localized<string> }> {
  const result: Array<{ tool: ToolContent; paragraph: Localized<string> }> = [];
  for (const tool of publishedTools(tools)) {
    for (const bridge of tool.bridges) {
      if (bridge.articleSlugTr === articleSlugTr) {
        result.push({ tool, paragraph: bridge.paragraph });
      }
    }
  }
  return result;
}

const BY_SLUG_TR = new Map(TOOLS.map((t) => [t.slug.tr, t]));

/**
 * Aracı TR slug'ıyla çözer. TR slug kararlı kimliktir (locale'den bağımsız);
 * EN slug yalnız URL yüzeyidir. Bilinmeyen slug'da `null` döner — çağıran
 * `notFound()` verir.
 */
export function getToolBySlug(slug: string, loc: "tr" | "en"): ToolContent | null {
  if (loc === "tr") return BY_SLUG_TR.get(slug) ?? null;
  return TOOLS.find((t) => t.slug.en === slug) ?? null;
}
