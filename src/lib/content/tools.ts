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
 * (`GeoCheckId`) bağlıdır — böylece sayfadaki tanıtımla gerçek tarama kalemleri
 * senkron kalır; hayali bir sinyal eklenemez. `weight` sinyalin 100 puanlık
 * skordaki payıdır (motor `MAX_SCORE` değerleriyle birebir).
 */
export type ToolSignal = {
  id: GeoCheckId;
  weight: number;
  title: Localized<string>;
  description: Localized<string>;
};

export type ToolFaq = {
  question: Localized<string>;
  answer: Localized<string>;
};

export type ToolContent = {
  slug: Localized<string>;
  name: Localized<string>;
  /** Başlık üstü etiket — iddia (`.eyebrow` primitive). */
  eyebrow: Localized<string>;
  /** Hero girişi — TEK cümle. */
  lede: Localized<string>;
  /** Bant başına tek cümle — skor kartında sayının yanında. İçerik katmanı konuşur, motor değil. */
  bands: Record<GeoBand, Localized<string>>;
  /** Kanıt şeridi — hero'da 4 kısa öğe (mono, büyük harf). */
  proof: Array<Localized<string>>;
  /** Giriş çubuğunun altındaki yardım satırı — kapsam uyarısı. */
  inputHelp: Localized<string>;
  /** "Nasıl çalışır" — tam 3 adım. */
  steps: ToolStep[];
  /** Ölçülen 5 sinyalin tanıtımı — motorun kontrol kalemleriyle hizalı. */
  signals: ToolSignal[];
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
};

export const TOOLS: ToolContent[] = [
  {
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
      tr: "GEO denetimi, cevap motorlarının sitenizi okuyup okuyamadığını beş sinyalde ölçer ve her sinyalde ne düzelteceğinizi söyler.",
      en: "The GEO audit measures, across five signals, whether answer engines can read your site, and tells you what to fix in each one.",
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
  },
];

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
