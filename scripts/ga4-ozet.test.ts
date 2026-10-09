import { describe, expect, it } from "vitest";

import { SITE_KEY_EVENTS } from "@/lib/analytics/ga4-admin";
import { LEAD_EVENTS } from "@/lib/analytics/meta-events";

import {
  acilisSayfalari,
  aiMotoru,
  aiOzeti,
  aiSiniflandir,
  anahtarOlayDenetimi,
  apiHataMesaji,
  deltaMetni,
  dusukEtkilesim,
  ga4Tarih,
  gecerliTarih,
  gunEkle,
  gunListesi,
  haftaBasi,
  haftalikToplam,
  kaynakOzeti,
  kaynakSizintisi,
  kirliKesisim,
  LEAD_OLAYLARI,
  leadCsv,
  leadOzeti,
  niyetliSayfaTuru,
  ozetMetni,
  pencereler,
  varsayilanAralik,
} from "./ga4-pull.mjs";

/**
 * `ga4-pull.mjs`'in saf fonksiyonları — fixture'la, ağ yok.
 *
 * Neyi kilitliyor: AI kaynak listesinin kapsamı (arama motoru AI sayılmaz),
 * haftalık pencerenin takvimle kurulması (GA4 boş günü döndürmeyebilir),
 * lead tablosunda hiç gelmeyen olayın 0 yazılması, ve lead listesinin koddaki
 * iki otoriteyle (`SITE_KEY_EVENTS`, `LEAD_EVENTS`) birebir aynı kalması.
 */

type Satir = Record<string, string | number>;

function al<T>(o: Record<string, T>, key: string): T {
  const v = o[key];
  if (v === undefined) throw new Error(`anahtar bulunamadı: ${key}`);
  return v;
}

describe("aiMotoru", () => {
  it("bilinen AI asistanı host'larını motora eşler", () => {
    const beklenen: Array<[string, string]> = [
      ["chatgpt.com", "ChatGPT"],
      ["chat.openai.com", "ChatGPT"],
      ["openai.com", "ChatGPT"],
      ["chatgpt", "ChatGPT"],
      ["ChatGPT.com", "ChatGPT"],
      ["perplexity.ai", "Perplexity"],
      ["www.perplexity.ai", "Perplexity"],
      ["perplexity", "Perplexity"],
      ["gemini.google.com", "Gemini"],
      ["bard.google.com", "Gemini"],
      ["copilot.microsoft.com", "Copilot"],
      ["edgeservices.bing.com", "Copilot"],
      ["claude.ai", "Claude"],
      ["you.com", "You.com"],
      ["poe.com", "Poe"],
      ["chat.mistral.ai", "Mistral"],
      ["chat.deepseek.com", "DeepSeek"],
      ["duck.ai", "Duck.ai"],
      ["grok.com", "Grok"],
      ["meta.ai", "Meta AI"],
    ];
    for (const [kaynak, motor] of beklenen) {
      expect([kaynak, aiMotoru(kaynak)]).toEqual([kaynak, motor]);
    }
  });

  it("arama motorlarını ve benzer görünen host'ları AI saymaz", () => {
    for (const kaynak of [
      "google",
      "google.com",
      "bing",
      "bing.com",
      "duckduckgo",
      "duckduckgo.com",
      "(direct)",
      "(not set)",
      "email",
      "youtube.com",
      "notchatgpt.com",
      "openai.com.ornek.tr",
      "fyrluxury.com",
      "",
    ]) {
      expect([kaynak, aiMotoru(kaynak)]).toEqual([kaynak, null]);
    }
  });
});

describe("aiSiniflandir", () => {
  it("listeyi ve GA4'ün AI Assistant kanalını birleştirir", () => {
    expect(
      aiSiniflandir({
        sessionSource: "chatgpt.com",
        sessionMedium: "ai-assistant",
        sessionDefaultChannelGroup: "AI Assistant",
      })
    ).toEqual({ ai: true, motor: "ChatGPT", liste: true, kanal: true });

    // Liste bilmiyor, GA4 biliyor: motor adı kaynağın kendisi.
    expect(
      aiSiniflandir({
        sessionSource: "yeni-motor.ai",
        sessionMedium: "ai-assistant",
        sessionDefaultChannelGroup: "AI Assistant",
      })
    ).toEqual({
      ai: true,
      motor: "Diğer · yeni-motor.ai",
      liste: false,
      kanal: true,
    });

    // GA4 referral sanıyor, liste yakalıyor.
    expect(
      aiSiniflandir({
        sessionSource: "perplexity.ai",
        sessionMedium: "referral",
        sessionDefaultChannelGroup: "Referral",
      })
    ).toEqual({ ai: true, motor: "Perplexity", liste: true, kanal: false });

    expect(
      aiSiniflandir({
        sessionSource: "google",
        sessionMedium: "organic",
        sessionDefaultChannelGroup: "Organic Search",
      }).ai
    ).toBe(false);
  });
});

describe("tarih ve pencereler", () => {
  it("varsayılan aralık: bitiş bugün-2, başlangıç bitiş-27 (28 gün)", () => {
    expect(varsayilanAralik("2026-10-09")).toEqual({
      start: "2026-09-10",
      end: "2026-10-07",
    });
    const { start, end } = varsayilanAralik("2026-03-02");
    expect(end).toBe("2026-02-28");
    expect(gunListesi(start, end)).toHaveLength(28);
  });

  it("haftalık pencereleri takvimle kurar", () => {
    expect(pencereler("2026-10-07")).toEqual({
      son7: { ilk: "2026-10-01", son: "2026-10-07" },
      onceki7: { ilk: "2026-09-24", son: "2026-09-30" },
    });
  });

  it("biçimi doğru ama takvimde olmayan tarihi reddeder", () => {
    expect(gecerliTarih("2026-10-07")).toBe(true);
    expect(gecerliTarih("2028-02-29")).toBe(true);
    expect(gecerliTarih("2026-13-01")).toBe(false);
    expect(gecerliTarih("2026-02-30")).toBe(false);
    expect(gecerliTarih("2026-9-1")).toBe(false);
    expect(gecerliTarih("")).toBe(false);
  });

  it("ay sınırını ve ISO hafta başını doğru hesaplar", () => {
    expect(gunEkle("2026-09-30", 1)).toBe("2026-10-01");
    expect(gunEkle("2026-03-01", -1)).toBe("2026-02-28");
    expect(haftaBasi("2026-08-29")).toBe("2026-08-24"); // Cumartesi → Pzt
    expect(haftaBasi("2026-08-31")).toBe("2026-08-31"); // Pazartesi
    expect(haftaBasi("2026-09-06")).toBe("2026-08-31"); // Pazar
    expect(ga4Tarih("20261007")).toBe("2026-10-07");
    expect(ga4Tarih("2026-10-07")).toBe("2026-10-07");
  });
});

describe("haftalikToplam ve deltaMetni", () => {
  it("dateRange satırlarını pencerelere yazar, eksik pencere 0 kalır", () => {
    const araliklar = {
      son7: { ilk: "2026-10-01", son: "2026-10-07" },
      onceki7: { ilk: "2026-09-24", son: "2026-09-30" },
      donem: { ilk: "2026-09-10", son: "2026-10-07" },
    };
    const h = haftalikToplam(
      [
        {
          dateRange: "son7",
          sessions: 59,
          totalUsers: 49,
          newUsers: 45,
          engagedSessions: 30,
          keyEvents: 1,
        },
        {
          dateRange: "onceki7",
          sessions: 49,
          totalUsers: 44,
          newUsers: 40,
          engagedSessions: 20,
          keyEvents: 0,
        },
      ],
      araliklar
    );
    expect(al(h, "son7")).toMatchObject({
      oturum: 59,
      kullanici: 49,
      yeni: 45,
      etkilesimli: 30,
      anahtar: 1,
      ilk: "2026-10-01",
    });
    expect(al(h, "donem").oturum).toBe(0);
  });

  it("iki değer de 10'un altındaysa deltayı küçük hacim diye işaretler", () => {
    expect(deltaMetni(59, 49)).toBe("+10");
    expect(deltaMetni(1, 0)).toBe("+1 (küçük hacim)");
    expect(deltaMetni(9, 12)).toBe("-3");
    expect(deltaMetni(0, 0)).toBe("+0 (küçük hacim)");
  });
});

describe("lead listesi — koddaki otoritelerle birebir", () => {
  it("anahtar olay beklenenleri SITE_KEY_EVENTS ile aynı", () => {
    const beklenen = LEAD_OLAYLARI.filter((o) => o.anahtar)
      .map((o) => o.ad)
      .sort();
    expect(beklenen).toEqual(SITE_KEY_EVENTS.map((k) => k.eventName).sort());
  });

  it("form türündekiler Meta LEAD_EVENTS ile aynı", () => {
    const form = LEAD_OLAYLARI.filter((o) => o.tur === "form")
      .map((o) => o.ad)
      .sort();
    expect(form).toEqual([...LEAD_EVENTS].sort());
  });

  it("booking_cta_clicked huni adımıdır, anahtar olay beklenmez", () => {
    const cta = LEAD_OLAYLARI.find((o) => o.ad === "booking_cta_clicked");
    expect(cta).toMatchObject({ tur: "huni", anahtar: false });
  });
});

describe("leadOzeti", () => {
  const rows: Satir[] = [
    {
      date: "20260923",
      eventName: "tool_report_requested",
      eventCount: 1,
      keyEvents: 1,
    },
    {
      date: "20261003",
      eventName: "phone_clicked",
      eventCount: 1,
      keyEvents: 1,
    },
    {
      date: "20261004",
      eventName: "booking_cta_clicked",
      eventCount: 1,
      keyEvents: 0,
    },
    {
      date: "20261005",
      eventName: "popup_contact_submitted",
      eventCount: 2,
      keyEvents: 1,
    },
    // Aralık dışı — sayılmaz.
    {
      date: "20260909",
      eventName: "contact_booking_submitted",
      eventCount: 1,
      keyEvents: 1,
    },
    // Lead listesinde olmayan olay — sayılmaz.
    { date: "20261005", eventName: "page_view", eventCount: 40, keyEvents: 0 },
  ];
  const lead = leadOzeti(rows, { start: "2026-09-10", end: "2026-10-07" });

  it("hiç gelmeyen olay 0 yazılır, takvimin her günü satırdır", () => {
    expect(lead.gunSayisi).toBe(28);
    expect(al(lead.toplam, "contact_form_submitted")).toEqual({
      olay: 0,
      anahtar: 0,
      son7: 0,
    });
    expect(al(lead.toplam, "contact_booking_submitted").olay).toBe(0);
  });

  it("form toplamı yalnız beş form olayını sayar (tıklama ve CTA hariç)", () => {
    expect(lead.formToplam).toBe(3); // tool_report_requested 1 + popup_contact 2
    expect(lead.formSon7).toBe(2); // 10-05 son 7 günde, 09-23 değil
    expect(al(lead.toplam, "popup_contact_submitted").anahtar).toBe(1);
    expect(al(lead.toplam, "phone_clicked").son7).toBe(1);
  });

  it("lead.csv geniş biçim: kolon her olay, sonda toplam ve anahtar_olay", () => {
    const satirlar = leadCsv(lead).trimEnd().split("\n");
    expect(satirlar[0]).toBe(
      "date,contact_form_submitted,contact_booking_submitted,popup_booking_submitted,popup_contact_submitted,tool_report_requested,phone_clicked,email_clicked,booking_cta_clicked,form_brief_toplam"
    );
    expect(satirlar).toHaveLength(1 + 28 + 2);
    expect(satirlar.at(-2)).toBe("toplam,0,0,0,2,1,1,0,1,3");
    expect(satirlar.at(-1)).toBe("anahtar_olay,0,0,0,1,1,1,0,0,2");
    expect(satirlar).toContain("2026-09-23,0,0,0,0,1,0,0,0,1");
  });
});

describe("niyetli içerik ve açılış sayfaları", () => {
  it("hizmet sayfası ve karar içeriğini ayırır", () => {
    expect(niyetliSayfaTuru("/tr/hizmetler/cro")).toBe("hizmet");
    expect(
      niyetliSayfaTuru("/tr/hizmetler/geo-danismanligi?utm_source=email")
    ).toBe("hizmet");
    expect(niyetliSayfaTuru("/en/services/ai-consulting")).toBe("hizmet");
    expect(niyetliSayfaTuru("/tr/yazilar/cro-ajansi-nasil-secilir")).toBe(
      "karar"
    );
    expect(niyetliSayfaTuru("/en/articles/how-to-choose-a-geo-agency")).toBe(
      "karar"
    );
    expect(
      niyetliSayfaTuru("/tr/yazilar/e-ticaret-platform-danismanligi")
    ).toBe("karar");
    expect(
      niyetliSayfaTuru(
        "/tr/yazilar/buyuk-danismanlik-mi-butik-yapay-zeka-ajansi-mi"
      )
    ).toBe("karar");
    expect(niyetliSayfaTuru("/en/articles/ai-consulting-pricing")).toBe(
      "karar"
    );
    expect(niyetliSayfaTuru("/tr/hizmetler")).toBeNull();
    expect(niyetliSayfaTuru("/tr/yazilar/cro-nedir")).toBeNull();
    expect(niyetliSayfaTuru("(not set)")).toBeNull();
  });

  it("sorgu dizesi farklı satırları tek yolda toplar, süreyi oturumla ağırlıklandırır", () => {
    const s = acilisSayfalari([
      {
        landingPagePlusQueryString: "/tr?utm_source=email&utm_content=logo",
        sessions: 3,
        engagedSessions: 1,
        averageSessionDuration: 10,
        keyEvents: 0,
      },
      {
        landingPagePlusQueryString: "/tr",
        sessions: 1,
        engagedSessions: 1,
        averageSessionDuration: 50,
        keyEvents: 1,
      },
      {
        landingPagePlusQueryString: "/tr/hizmetler/cro",
        sessions: 2,
        engagedSessions: 2,
        averageSessionDuration: 30,
        keyEvents: 0,
      },
    ]);
    expect(s.map((x) => x.yol)).toEqual(["/tr", "/tr/hizmetler/cro"]);
    const tr = s[0];
    if (!tr) throw new Error("satır yok");
    expect(tr).toMatchObject({
      oturum: 4,
      etkilesimli: 2,
      anahtar: 1,
      tur: null,
    });
    expect(tr.sureToplam / tr.oturum).toBeCloseTo((3 * 10 + 50) / 4, 6);
    expect(s[1]?.tur).toBe("hizmet");
  });
});

describe("aiOzeti", () => {
  const aiRows: Satir[] = [
    {
      date: "2026-09-17",
      sessionSource: "chatgpt.com",
      sessionMedium: "ai-assistant",
      sessionDefaultChannelGroup: "AI Assistant",
      landingPagePlusQueryString: "/en",
      sessions: 1,
      engagedSessions: 1,
      keyEvents: 0,
    },
    {
      date: "2026-10-03",
      sessionSource: "chatgpt.com",
      sessionMedium: "ai-assistant",
      sessionDefaultChannelGroup: "AI Assistant",
      landingPagePlusQueryString: "/tr?utm_source=chatgpt.com",
      sessions: 2,
      engagedSessions: 1,
      keyEvents: 1,
    },
    {
      date: "2026-09-21",
      sessionSource: "gemini.google.com",
      sessionMedium: "ai-assistant",
      sessionDefaultChannelGroup: "AI Assistant",
      landingPagePlusQueryString: "/tr/yazilar/chatgpt-reklamlari-turkiye",
      sessions: 2,
      engagedSessions: 1,
      keyEvents: 0,
    },
    {
      date: "2026-09-25",
      sessionSource: "yeni-motor.ai",
      sessionMedium: "ai-assistant",
      sessionDefaultChannelGroup: "AI Assistant",
      landingPagePlusQueryString: "/tr",
      sessions: 1,
      engagedSessions: 0,
      keyEvents: 0,
    },
    {
      date: "2026-09-25",
      sessionSource: "google",
      sessionMedium: "organic",
      sessionDefaultChannelGroup: "Organic Search",
      landingPagePlusQueryString: "/tr",
      sessions: 9,
      engagedSessions: 5,
      keyEvents: 0,
    },
  ];
  const toplamGunluk: Satir[] = [
    { date: "2026-09-08", sessions: 39 },
    { date: "2026-09-17", sessions: 4 },
    { date: "2026-09-21", sessions: 12 },
    { date: "2026-09-25", sessions: 9 },
    { date: "2026-10-03", sessions: 6 },
  ];
  const ai = aiOzeti({
    aiRows,
    toplamGunluk,
    aiStart: "2026-08-29",
    donemStart: "2026-09-20",
    end: "2026-10-07",
  });

  it("yalnız AI satırlarını alır, motor ve dönem kırılımını hesaplar", () => {
    expect(ai.satirlar).toHaveLength(4);
    expect(ai.toplam).toEqual({
      oturum: 6,
      donemOturum: 5,
      etkilesimli: 3,
      anahtar: 1,
    });
    const chatgpt = ai.motorlar.find((m) => m.motor === "ChatGPT");
    expect(chatgpt).toMatchObject({ oturum: 3, donemOturum: 2, anahtar: 1 });
    expect(ai.motorlar[0]?.motor).toBe("ChatGPT");
  });

  it("açılış sayfasını yola indirger ve motorları listeler", () => {
    const tr = ai.sayfalar.find((p) => p.yol === "/tr");
    expect(tr).toMatchObject({
      oturum: 3,
      motorlar: ["ChatGPT", "Diğer · yeni-motor.ai"],
    });
  });

  it("ilk veri gününü ve haftalık seriyi (ilk hafta kısmi) üretir", () => {
    expect(ai.ilkVeriGunu).toBe("2026-09-08");
    expect(ai.tumOturum).toBe(70);
    expect(ai.donemTumOturum).toBe(27);
    const ilk = ai.haftalar[0];
    expect(ilk).toMatchObject({
      hafta: "2026-08-24",
      ilk: "2026-08-29",
      son: "2026-08-30",
      ai: 0,
    });
    const son = ai.haftalar.at(-1);
    expect(son).toMatchObject({ hafta: "2026-10-05", son: "2026-10-07" });
    const h0915 = ai.haftalar.find((h) => h.hafta === "2026-09-14");
    expect(h0915).toMatchObject({ ai: 1, toplam: 4 });
  });

  it("liste ile GA4 kanalı arasındaki farkı raporlar", () => {
    expect(ai.uyum.listeOturum).toBe(5);
    expect(ai.uyum.kanalOturum).toBe(6);
    expect(ai.uyum.yalnizKanal).toEqual(["yeni-motor.ai"]);
    expect(ai.uyum.yalnizListe).toEqual([]);
  });
});

describe("anahtarOlayDenetimi", () => {
  const olaylar: Satir[] = [
    { eventName: "page_view", isKeyEvent: "(not set)", eventCount: 246 },
    { eventName: "phone_clicked", isKeyEvent: "true", eventCount: 1 },
    { eventName: "tool_report_requested", isKeyEvent: "true", eventCount: 1 },
  ];

  it("Admin listesinde olmayan beklenen olayı eksik, purchase'ı bilinen fazla sayar", () => {
    const d = anahtarOlayDenetimi({
      admin: [
        { eventName: "purchase", countingMethod: "ONCE_PER_EVENT" },
        { eventName: "phone_clicked", countingMethod: "ONCE_PER_SESSION" },
        {
          eventName: "tool_report_requested",
          countingMethod: "ONCE_PER_SESSION",
        },
        { eventName: "email_clicked", countingMethod: "ONCE_PER_SESSION" },
        {
          eventName: "popup_contact_submitted",
          countingMethod: "ONCE_PER_SESSION",
        },
        {
          eventName: "popup_booking_submitted",
          countingMethod: "ONCE_PER_SESSION",
        },
        {
          eventName: "contact_booking_submitted",
          countingMethod: "ONCE_PER_SESSION",
        },
      ],
      olaylar,
    });
    expect(d.kaynak).toBe("admin");
    expect(d.eksik).toEqual(["contact_form_submitted"]);
    expect(d.fazla.map((f) => f.ad)).toEqual(["purchase"]);
    expect(d.fazla[0]?.not).toContain("silinemeyen");
    expect(d.sessiz).toEqual([
      "contact_booking_submitted",
      "popup_booking_submitted",
      "popup_contact_submitted",
      "email_clicked",
    ]);
    expect(d.bilincliIsaretsiz).toEqual(["booking_cta_clicked"]);
  });

  it("Admin API yoksa veriden kurar ve eksik iddiasında bulunmaz", () => {
    const d = anahtarOlayDenetimi({ admin: null, olaylar });
    expect(d.kaynak).toBe("veri");
    expect(d.isaretli.map((k) => k.ad)).toEqual([
      "phone_clicked",
      "tool_report_requested",
    ]);
    expect(d.eksik).toEqual([]);
  });
});

describe("kaynakSizintisi ve kirliKesisim", () => {
  it("olay `source` değerlerini oturum kaynağı olarak görünce işaretler", () => {
    expect(
      kaynakSizintisi([
        { sessionSource: "nav", sessions: 1 },
        { sessionSource: "tel-link", sessions: 1 },
        { sessionSource: "google", sessions: 59 },
        { sessionSource: "nav", sessions: 2 },
      ])
    ).toEqual([
      { kaynak: "nav", oturum: 3 },
      { kaynak: "tel-link", oturum: 1 },
    ]);
  });

  it("pencerenin ADR'lerde kayıtlı kusurlu günlerle kesişimini bulur", () => {
    expect(kirliKesisim("2026-09-10", "2026-10-07")).toHaveLength(2);
    expect(kirliKesisim("2026-08-29", "2026-10-07")).toHaveLength(3);
    expect(kirliKesisim("2026-09-11", "2026-10-07")).toHaveLength(0);
  });
});

describe("dusukEtkilesim", () => {
  it("hacmi olan ama etkileşim üretmeyen kaynağı işaretler, küçük hacmi atlar", () => {
    const k = kaynakOzeti([
      {
        sessionSource: "email",
        sessionMedium: "eposta",
        sessionCampaignName: "ep-01-ai",
        sessions: 40,
        totalUsers: 40,
        engagedSessions: 2,
        keyEvents: 0,
      },
      {
        sessionSource: "email",
        sessionMedium: "eposta",
        sessionCampaignName: "ep-02",
        sessions: 31,
        totalUsers: 31,
        engagedSessions: 2,
        keyEvents: 1,
      },
      {
        sessionSource: "google",
        sessionMedium: "organic",
        sessionCampaignName: "(organic)",
        sessions: 59,
        totalUsers: 52,
        engagedSessions: 41,
        keyEvents: 0,
      },
      {
        sessionSource: "fyrluxury.com",
        sessionMedium: "referral",
        sessionCampaignName: "(referral)",
        sessions: 9,
        totalUsers: 1,
        engagedSessions: 0,
        keyEvents: 0,
      },
    ]);
    const email = k.find((x) => x.ad === "email / eposta");
    expect(email).toMatchObject({
      oturum: 71,
      etkilesimli: 4,
      kampanyalar: ["ep-01-ai", "ep-02"],
    });
    expect(dusukEtkilesim(k).map((x) => x.ad)).toEqual(["email / eposta"]);
  });
});

describe("apiHataMesaji", () => {
  it("yetki ve kota hatalarını açık mesaja çevirir", () => {
    const govde = JSON.stringify({
      error: {
        code: 403,
        status: "PERMISSION_DENIED",
        message: "User does not have sufficient permissions for this property.",
      },
    });
    const m403 = apiHataMesaji("runReport gunluk", 403, govde);
    expect(m403).toContain("Yetki hatası");
    expect(m403).toContain("sufficient permissions");
    expect(m403).toContain("Görüntüleyici");
    expect(apiHataMesaji("runReport", 429, "{}")).toContain("Kota aşıldı");
    expect(apiHataMesaji("runReport", 500, "düz metin")).toContain("düz metin");
  });
});

describe("ozetMetni", () => {
  const start = "2026-09-10";
  const end = "2026-10-07";
  const lead = leadOzeti(
    [
      {
        date: "20260923",
        eventName: "tool_report_requested",
        eventCount: 1,
        keyEvents: 1,
      },
      {
        date: "20261003",
        eventName: "phone_clicked",
        eventCount: 1,
        keyEvents: 1,
      },
    ],
    { start, end }
  );
  const ai = aiOzeti({
    aiRows: [
      {
        date: "2026-10-03",
        sessionSource: "chatgpt.com",
        sessionMedium: "ai-assistant",
        sessionDefaultChannelGroup: "AI Assistant",
        landingPagePlusQueryString: "/tr",
        sessions: 2,
        engagedSessions: 1,
        keyEvents: 1,
      },
    ],
    toplamGunluk: [
      { date: "2026-09-08", sessions: 39 },
      { date: "2026-10-03", sessions: 6 },
    ],
    aiStart: "2026-08-29",
    donemStart: start,
    end,
  });
  const metin = ozetMetni({
    property: "553152492",
    start,
    end,
    aiStart: "2026-08-29",
    hafta: {
      son7: {
        oturum: 59,
        kullanici: 49,
        yeni: 45,
        etkilesimli: 30,
        anahtar: 1,
        ilk: "2026-10-01",
        son: end,
      },
      onceki7: {
        oturum: 49,
        kullanici: 44,
        yeni: 40,
        etkilesimli: 20,
        anahtar: 0,
        ilk: "2026-09-24",
        son: "2026-09-30",
      },
      donem: {
        oturum: 214,
        kullanici: 190,
        yeni: 180,
        etkilesimli: 100,
        anahtar: 3,
        ilk: start,
        son: end,
      },
    },
    kanallar: [
      {
        sessionDefaultChannelGroup: "Email",
        sessions: 71,
        totalUsers: 71,
        engagedSessions: 20,
        keyEvents: 1,
      },
    ],
    kaynaklar: [
      {
        sessionSource: "email",
        sessionMedium: "eposta",
        sessionDefaultChannelGroup: "Email",
        sessionCampaignName: "ep-01-ai",
        sessions: 71,
        totalUsers: 71,
        engagedSessions: 20,
        keyEvents: 1,
      },
      {
        sessionSource: "tel-link",
        sessionMedium: "(not set)",
        sessionDefaultChannelGroup: "Unassigned",
        sessionCampaignName: "(not set)",
        sessions: 1,
        totalUsers: 1,
        engagedSessions: 0,
        keyEvents: 0,
      },
    ],
    kampanyalar: [],
    ai,
    lead,
    sayfalar: acilisSayfalari([
      {
        landingPagePlusQueryString: "/tr/hizmetler/cro",
        sessions: 2,
        engagedSessions: 2,
        averageSessionDuration: 30,
        keyEvents: 0,
      },
    ]),
    denetim: anahtarOlayDenetimi({
      admin: [
        { eventName: "phone_clicked", countingMethod: "ONCE_PER_SESSION" },
      ],
      olaylar: [],
    }),
    akislar: [{ olcumKimligi: "G-KWT8HCXJT6", ad: "www.indoles.com.tr" }],
    uyarilar: [],
  });

  it("yedi bölümü (a-g) sırayla üretir", () => {
    const basliklar = metin
      .split("\n")
      .filter((s) => s.startsWith("## "))
      .map((s) => s.slice(3));
    expect(basliklar).toEqual([
      "Haftalık toplam",
      "Kaynak dağılımı",
      "AI yönlendirmeleri",
      "Form / brief — yol haritası ölçüsü",
      "Açılış sayfaları",
      "Anahtar olaylar",
      "Kapsam notu — GA4 neyi görmüyor",
    ]);
  });

  it("rakamları ve uyarıları API'den geldiği gibi yazar", () => {
    expect(metin).toContain("| Oturum | 59 | 49 | +10 |");
    expect(metin).toContain("| Anahtar olay | 1 | 0 | +1 (küçük hacim) |");
    expect(metin).toContain("**Form/brief toplamı: 1**");
    expect(metin).toContain("ALTINDA");
    expect(metin).toContain(
      "contact_form_submitted — İletişim formu | form | beklenir | 0 | 0 | 0 |"
    );
    expect(metin).toContain("| ChatGPT | 2 | 2 | 1 | 1 | chatgpt.com |");
    expect(metin).toContain("ilk veri günü 2026-09-08");
    expect(metin).toContain("tel-link (1 oturum)");
    expect(metin).toContain("UYARI — beklenen ama işaretsiz");
    expect(metin).toContain("| /tr/hizmetler/cro | hizmet | 2 |");
    expect(metin).toContain("ADR-035");
    expect(metin).toContain(
      "Pencere bilinen kusurla kesişiyor (2026-09-09→2026-09-10)"
    );
  });
});
