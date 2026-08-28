import type { ConsultantContent } from "./types";

/**
 * INDOLES kadrosu.
 *
 * Kaynak: Claude Studio `INDOLES` tasarım projesi (components/Team.jsx) —
 * roller, biyografiler ve alıntılar oradan alınmıştır. Burak'ın unvanı
 * CLAUDE.md §2'deki kanonik tanımla hizalanmıştır.
 *
 * Fotoğraf yok: portre bloğu baş harf + `portraitTone` ile üretilir.
 * Gerçek portreler geldiğinde `photoPath` alanı eklenir (ayrı değişiklik).
 */
export const CONSULTANTS: ConsultantContent[] = [
  {
    slug: "burak-ozgul",
    name: "Burak Arda Özgül",
    order: 1,
    initials: "BA",
    portraitTone: "#D4A574",
    title: {
      tr: "Kurucu · Marka Stratejisti ve Kreatif Direktör",
      en: "Founder · Brand Strategist & Creative Director",
    },
    quote: {
      tr: "Bir markanın değeri, sattığı şeyde değil; var olma biçiminde saklıdır.",
      en: "A brand's value hides not in what it sells, but in how it exists.",
    },
    shortBio: {
      tr: "Marka stratejisi ve performans pazarlamayı aynı masada tutan nadir isimlerden. Kurumsal markaların büyüme mimarisini kuruyor; Türkiye, Avrupa ve MENA pazarlarında 40+ markaya eşlik etti.",
      en: "One of the rare people who keeps brand strategy and performance marketing at the same table. Builds the growth architecture of corporate brands; has worked alongside 40+ brands across Turkey, Europe and MENA.",
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
      "Marka stratejisi",
      "Performans pazarlama",
      "Büyüme mimarisi",
      "yapay zeka danışmanlığı",
    ],
    linkedinUrl: "https://www.linkedin.com/in/burakardaozgul",
  },
  {
    slug: "can-aydinlik",
    name: "Can Aydınlık",
    order: 2,
    initials: "CA",
    portraitTone: "#8B9A7B",
    title: { tr: "Stratejik Danışman", en: "Strategy Advisor" },
    quote: {
      tr: "Strateji, belirsizliği azaltmaktan çok, onunla nasıl dans edeceğini bilmektir.",
      en: "Strategy is less about reducing uncertainty than knowing how to dance with it.",
    },
    shortBio: {
      tr: "Dijital dönüşüm ve organizasyonel gelişim üzerine çalışıyor. Kararların arkasındaki karar mimarisini görünür kılmak için veri, kültür ve senaryo tasarımını bir araya getiriyor.",
      en: "Works on digital transformation and organisational development. Brings together data, culture and scenario design to make the decision architecture behind decisions visible.",
    },
    longBio: {
      tr: [
        "Dönüşüm programlarını teknoloji seçimiyle değil, karar haklarının yeniden dağıtımıyla başlatır.",
        "Veri, kültür ve senaryo tasarımını tek bir çerçevede birleştirerek üst yönetime karar destek modeli kurar.",
      ],
      en: [
        "Starts transformation programmes not with technology selection but with redistributing decision rights.",
        "Builds decision-support models for leadership by unifying data, culture and scenario design in a single frame.",
      ],
    },
    pillars: ["transform"],
    expertise: ["Dijital dönüşüm", "Organizasyonel gelişim", "Senaryo tasarımı"],
  },
  {
    slug: "cagri-erdogan",
    name: "Çağrı Erdoğan",
    order: 3,
    initials: "ÇE",
    portraitTone: "#A8856B",
    title: { tr: "Kreatif ve Strateji Uzmanı", en: "Creative & Strategy Lead" },
    quote: {
      tr: "Kelimeler bir markanın omurgasıdır; gözle görülmez ama her şeyi ayakta tutar.",
      en: "Words are a brand's spine: invisible, yet holding everything upright.",
    },
    shortBio: {
      tr: "Marka dili ve kurumsal iletişim tasarımında uzmanlaşmış bir yazar-stratejist. Büyük markaların sessiz ama yön belirleyen metinlerini yazıyor; hikâyeyi yapıya dönüştürüyor.",
      en: "A writer-strategist specialised in brand language and corporate communication design. Writes the quiet but direction-setting copy of large brands; turns story into structure.",
    },
    longBio: {
      tr: [
        "Marka sesini bir slogan olarak değil, tekrarlanabilir bir yazım sistemi olarak kurar.",
        "Kurumsal iletişimde tutarlılığı otoriteye çeviren metin mimarisiyle çalışır.",
      ],
      en: [
        "Builds brand voice not as a slogan but as a repeatable writing system.",
        "Works with a copy architecture that converts consistency into authority in corporate communication.",
      ],
    },
    pillars: ["growth"],
    expertise: ["Marka dili", "Kurumsal iletişim", "İçerik stratejisi"],
    linkedinUrl: "https://www.linkedin.com/in/cagrierdogan",
  },
  {
    slug: "renata-begasova",
    name: "Renata Begasova",
    order: 4,
    initials: "RB",
    portraitTone: "#7B8A9A",
    title: {
      tr: "Proje Yöneticisi · Müşteri İlişkileri (UK)",
      en: "Project Manager · Client Relations (UK)",
    },
    quote: {
      tr: "İyi bir proje, fark edilmeyen bir koreografi gibidir.",
      en: "A good project is like a choreography nobody notices.",
    },
    shortBio: {
      tr: "Uluslararası projelerin işletim sorumlusu. Çok dilli ekipler, farklı zaman dilimleri ve kültürler arasında akışı aksatmadan kurgulayan bir operasyon insanı.",
      en: "Runs international project operations. An operations person who keeps the flow intact across multilingual teams, time zones and cultures.",
    },
    longBio: {
      tr: [
        "Uluslararası projelerde teslim ritmini ve müşteri iletişimini tek elde toplar.",
        "Çok dilli ekiplerde bilgi kaybını önleyen operasyon disiplinini kurar.",
      ],
      en: [
        "Consolidates delivery cadence and client communication for international projects.",
        "Establishes the operational discipline that prevents information loss in multilingual teams.",
      ],
    },
    pillars: ["growth", "build"],
    expertise: ["Proje yönetimi", "Müşteri ilişkileri", "Uluslararası operasyon"],
    linkedinUrl: "https://www.linkedin.com/in/renata-begasova-344910333",
  },
  {
    slug: "mert-kaplan",
    name: "Mert Kaplan",
    order: 5,
    initials: "MK",
    portraitTone: "#6B7F7A",
    title: { tr: "Görüntü Yönetmeni", en: "Director of Photography" },
    quote: {
      tr: "Işık, sahnenin söylemediği her şeyi söyler.",
      en: "Light says everything the scene leaves unsaid.",
    },
    shortBio: {
      tr: "Sinematik bir gözle çalışan görüntü yönetmeni. Reklam filmi, kurumsal belgesel ve marka hikâyelerinde ışığı bir dile çeviriyor; her sahneyi atmosferiyle anlatıyor.",
      en: "A director of photography with a cinematic eye. Turns light into language across commercials, corporate documentaries and brand stories; tells each scene through its atmosphere.",
    },
    longBio: {
      tr: [
        "Reklam filmi ve kurumsal belgeselde görsel dili marka stratejisiyle hizalar.",
        "Işık kurgusunu anlatının bir parçası olarak tasarlar, dekoratif bir katman olarak değil.",
      ],
      en: [
        "Aligns visual language with brand strategy in commercials and corporate documentaries.",
        "Designs lighting as part of the narrative rather than as a decorative layer.",
      ],
    },
    pillars: ["growth"],
    expertise: ["Görüntü yönetmenliği", "Reklam filmi", "Kurumsal belgesel"],
  },
  {
    slug: "berk-bogaz",
    name: "Berk Boğaz",
    order: 6,
    initials: "BB",
    portraitTone: "#9A7B6B",
    title: { tr: "Video ve Fotoğraf", en: "Video & Photography" },
    quote: {
      tr: "Kadrajın içindekinden çok, dışında bıraktıkların belirler bir fotoğrafı.",
      en: "A photograph is defined less by what is in frame than by what you leave out.",
    },
    shortBio: {
      tr: "Hareket ve sabit görüntü arasında kalmayı reddeden bir üretici. Marka içerikleri, kampanya çekimleri ve dokümantasyonda ritmi yakalayan bir göz.",
      en: "A maker who refuses to stay between motion and still. An eye that catches rhythm in brand content, campaign shoots and documentation.",
    },
    longBio: {
      tr: [
        "Kampanya çekimlerinde içerik hacmini kaliteden ödün vermeden üretecek akışı kurar.",
        "Marka arşivini tek bir görsel dille dokümante eder.",
      ],
      en: [
        "Builds the workflow that produces campaign content at volume without trading away quality.",
        "Documents the brand archive in a single visual language.",
      ],
    },
    pillars: ["growth"],
    expertise: ["Video prodüksiyon", "Fotoğraf", "Marka içeriği"],
  },
  {
    slug: "sude-albayrak",
    name: "Sude Albayrak",
    order: 7,
    initials: "SA",
    portraitTone: "#B89478",
    title: { tr: "Sanat Yönetmeni · Görsel Tasarım", en: "Art Director · Visual Design" },
    quote: {
      tr: "Tasarım, boşluğu doldurmak değil; doğru boşluğu bırakmaktır.",
      en: "Design is not filling the space; it is leaving the right space empty.",
    },
    shortBio: {
      tr: "Marka kimliklerinin sanat yönetmenliğini üstleniyor. Tipografi, kompozisyon ve renk sistemlerini adeta müzikal bir notasyon gibi kurgulayan bir tasarımcı.",
      en: "Leads art direction for brand identities. A designer who composes typography, layout and colour systems almost like musical notation.",
    },
    longBio: {
      tr: [
        "Kurumsal kimlik sistemlerini tek tek görsellerle değil, tekrarlanabilir kurallarla kurar.",
        "Tipografi ve kompozisyon kararlarını marka sesiyle aynı çerçevede ele alır.",
      ],
      en: [
        "Builds corporate identity systems from repeatable rules rather than one-off visuals.",
        "Treats typography and composition decisions within the same frame as brand voice.",
      ],
    },
    pillars: ["growth"],
    expertise: ["Sanat yönetmenliği", "Kurumsal kimlik", "Tipografi"],
  },
  {
    slug: "dogan-kostu",
    name: "Doğan Koştu",
    order: 8,
    initials: "DK",
    portraitTone: "#7A8B9A",
    title: { tr: "Grafik Tasarımcı", en: "Graphic Designer" },
    quote: {
      tr: "Her detay bir karardır; kararsızlık tasarımın en büyük düşmanıdır.",
      en: "Every detail is a decision; indecision is design's greatest enemy.",
    },
    shortBio: {
      tr: "Detaya takıntılı, iterasyondan yılmayan bir zihin. Dijital ve basılı mecranın ayrımını ortadan kaldırmaya çalışan bir pratiğe sahip.",
      en: "A detail-obsessed mind that never tires of iteration. Practises in a way that dissolves the divide between digital and print.",
    },
    longBio: {
      tr: [
        "Kimlik sistemlerini dijital ve basılı mecrada aynı tutarlılıkla uygular.",
        "Yüksek iterasyon hızıyla tasarım kararlarını hızla test edilebilir hale getirir.",
      ],
      en: [
        "Applies identity systems with equal consistency across digital and print.",
        "Makes design decisions quickly testable through a high iteration rate.",
      ],
    },
    pillars: ["growth"],
    expertise: ["Grafik tasarım", "Basılı mecra", "Kimlik uygulaması"],
  },
  {
    slug: "hipnoz",
    name: "Hipnoz The Wisedog",
    order: 10,
    initials: "🐕",
    portraitTone: "#C4A57B",
    title: { tr: "Big Boss · Chief Mood Officer", en: "Big Boss · Chief Mood Officer" },
    quote: {
      tr: "Düşünmeden önce bir tur bahçede yürümek, çoğu probleminin yarısını çözer.",
      en: "A lap around the garden before thinking solves half of most problems.",
    },
    shortBio: {
      tr: "Ofisin ahlak pusulası, toplantıların en sakin üyesi. Sabah 09:00 ile akşam 18:00 arasında moralin yöneticisi; kararların arkasındaki sessiz onay makamı.",
      en: "The office's moral compass and the calmest member of any meeting. Manager of morale between 09:00 and 18:00; the silent approval authority behind decisions.",
    },
    longBio: {
      tr: [
        "Toplantı uzadığında ayağa kalkma sinyalini veren kıdemli üye.",
        "Ofis moralinin ölçülemeyen ama fark edilen kısmından sorumlu.",
      ],
      en: [
        "The senior member who signals when a meeting has run long enough.",
        "Responsible for the unmeasured but noticeable part of office morale.",
      ],
    },
    pillars: [],
    expertise: ["Moral", "Bahçe turu", "Sessiz onay"],
  },
];

/** Kadro, `order` alanına göre sıralı. */
export const CONSULTANTS_ORDERED = [...CONSULTANTS].sort(
  (a, b) => a.order - b.order,
);

export function getConsultantBySlug(slug: string): ConsultantContent | null {
  return CONSULTANTS.find((c) => c.slug === slug) ?? null;
}

/** Danışman listeleme sayfası — Chief Mood Officer profil sayfası almaz. */
export const BOOKABLE_CONSULTANTS = CONSULTANTS_ORDERED.filter(
  (c) => c.pillars.length > 0,
);
