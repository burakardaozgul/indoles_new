/**
 * İlk 3 programının para sorgu seti — yalnız veri, mantık yok.
 *
 * Otorite: `docs/strateji/Ilk-3-Programi-2026-10.md` §A.2 (15 sorgu ve
 * sırası), §A.3 (niyet katsayısı N ve kazanan sayfa önerisi), §A.4
 * (varyantlar ve izleme satırları), §B.2 (karar yazıları), §B.3 (kazanan
 * sayfa ve kanibalizasyon), §E.1 (haftalık log biçimi), §E.5 (bu dosyanın
 * tasarımı). Hesap `scripts/gsc-pull.mjs`'teki `paraSeti` / `paraSayfalari`
 * fonksiyonlarında; set değişince yalnız bu dosya değişir.
 *
 * Eşleme: sorgu metni küçük harfe çevrilir, boşluklar sadeleşir ve sondaki
 * `?`, `.`, `!` atılır (plan §A.2 #4: soru işaretli ve işaretsiz yazım tek
 * sorgudur). Başka yazım farkı otomatik birleşmez; birleşecekse `varyantlar`a
 * açıkça yazılır.
 */

/**
 * @typedef {object} ParaSorgusu
 * @property {number} no plan §A.2'deki sıra numarası
 * @property {string} sorgu GSC'deki sorgu metni
 * @property {string[]} varyantlar aynı sorgunun birleşik sayılan yazımları
 * @property {"GEO"|"CRO"|"AI"|"UX"|"ETICARET"|"DIJITAL"} hizmet N0 hizmet anahtarı (`NIYET_HIZMETLERI`)
 * @property {string} kazananSayfa sorgunun tek kazanan sayfası (yol)
 * @property {2|3} niyet plan §A.3 N katsayısı
 * @property {boolean} [konusma] konuşma biçimli sorgu — bant sayımı ayrıca onlarsız da raporlanır (§E.6)
 */

/**
 * 15 sorgu, plan §A.2 sırasıyla (9 Eki gösterimine göre).
 *
 * Kazanan sayfa §A.3 "Kazanan sayfa (öneri)" sütunundan:
 *  - #5 ux ajansı: kazanan yeni UX hizmet sayfası; bugün eski
 *    `/web-tasarim-ui-ux-tasarimi/` sıralanıyor (konsolidasyon bekliyor).
 *  - #7 cro ajansı ve #9 cro danışmanlığı: Seçenek A (§B.3, Burak kararı
 *    15 Eki). B seçilirse #9'un kazananı `/tr/yazilar/cro-danismanligi-fiyatlari`
 *    olur — tek satır değişir.
 *
 * @type {ParaSorgusu[]}
 */
export const PARA_SETI = [
  {
    no: 1,
    sorgu: "geo danışmanlığı",
    varyantlar: [],
    hizmet: "GEO",
    kazananSayfa: "/tr/hizmetler/geo-danismanligi",
    niyet: 3,
  },
  {
    no: 2,
    sorgu: "yapay zeka danışmanlığı",
    varyantlar: [],
    hizmet: "AI",
    kazananSayfa: "/tr/hizmetler/ai-danismanlik",
    niyet: 3,
  },
  {
    no: 3,
    sorgu: "geo ajansı",
    varyantlar: [],
    hizmet: "GEO",
    kazananSayfa: "/tr/yazilar/geo-ajansi-nasil-secilir",
    niyet: 3,
  },
  {
    no: 4,
    sorgu:
      "şirketimi yapay zeka motorlarında görünür kılacak bir danışman ya da ajans önerir misin",
    // Soru işaretli yazım normalizasyonla zaten birleşir; plan §A.2 #4 açıkça
    // birleşik saydığı için burada da yazılı.
    varyantlar: [
      "şirketimi yapay zeka motorlarında görünür kılacak bir danışman ya da ajans önerir misin?",
    ],
    hizmet: "GEO",
    kazananSayfa: "/tr/yazilar/ai-danismani-secerken-sorulacak-12-soru",
    niyet: 2,
    konusma: true,
  },
  {
    no: 5,
    sorgu: "ux ajansı",
    varyantlar: [],
    hizmet: "UX",
    kazananSayfa: "/tr/hizmetler/ui-ux-tasarim",
    niyet: 3,
  },
  {
    no: 6,
    sorgu: "ai danışmanlığı",
    varyantlar: [],
    hizmet: "AI",
    kazananSayfa: "/tr/hizmetler/ai-danismanlik",
    niyet: 3,
  },
  {
    no: 7,
    sorgu: "cro ajansı",
    varyantlar: [],
    hizmet: "CRO",
    kazananSayfa: "/tr/yazilar/cro-ajansi-nasil-secilir",
    niyet: 3,
  },
  {
    no: 8,
    sorgu: "yapay zeka görünürlük danışmanlığı",
    varyantlar: [],
    hizmet: "GEO",
    kazananSayfa: "/tr/hizmetler/geo-danismanligi",
    niyet: 3,
  },
  {
    no: 9,
    sorgu: "cro danışmanlığı",
    varyantlar: [],
    hizmet: "CRO",
    kazananSayfa: "/tr/hizmetler/cro",
    niyet: 3,
  },
  {
    no: 10,
    sorgu:
      "yapay zeka kullanılan danışmanlık paketleri ile klasik hizmetler arasında fiyat farkı var mı",
    varyantlar: [],
    hizmet: "AI",
    kazananSayfa: "/tr/hizmetler/ai-danismanlik",
    niyet: 2,
  },
  {
    no: 11,
    sorgu: "yapay zeka danışmanı",
    varyantlar: [],
    hizmet: "AI",
    kazananSayfa: "/tr/hizmetler/ai-danismanlik",
    niyet: 2,
  },
  {
    no: 12,
    sorgu:
      "dönüşüm oranlarını artırmak için türkiye'deki en iyi cro uzmanları kimlerdir",
    varyantlar: [],
    hizmet: "CRO",
    kazananSayfa: "/tr/yazilar/cro-ajansi-nasil-secilir",
    niyet: 2,
    konusma: true,
  },
  {
    no: 13,
    sorgu: "e ticaret ajansı",
    varyantlar: [],
    hizmet: "ETICARET",
    kazananSayfa: "/tr/yazilar/gercek-e-ticaret-ajansinin-etkisi",
    niyet: 3,
  },
  {
    no: 14,
    sorgu: "e ticaret danışmanlığı",
    varyantlar: [],
    hizmet: "ETICARET",
    kazananSayfa: "/tr/hizmetler/e-ticaret",
    niyet: 3,
  },
  {
    no: 15,
    sorgu: "dijital dönüşüm firmaları",
    varyantlar: [],
    hizmet: "DIJITAL",
    kazananSayfa: "/tr/hizmetler/dijital-donusum",
    niyet: 2,
  },
];

/**
 * Plan §A.4 — varyantlar ve izleme satırları. PUANLANMAZ: para setinin
 * toplamına, bantlara ve birleşik pozisyona girmez (§A.1 "yazım varyantları
 * ayrı puanlanmaz"; §A.2'nin 286 gösterimi bunları içermez). `ozet.txt`'te
 * ayrı listede, bağlı olduğu sorguyla birlikte görünür.
 *
 * `bagli`: bağlı olduğu para sorgusunun `no`'su; bağımsız izleme satırında
 * `null`.
 *
 * @type {{ sorgu: string, bagli: number | null, not?: string }[]}
 */
export const IZLEME_SATIRLARI = [
  { sorgu: "geo danışmanlık", bagli: 1 },
  { sorgu: "ai danışmanlık", bagli: 6 },
  { sorgu: "yapay zekâ danışmanlığı", bagli: 2 },
  { sorgu: "yapay zeka danışmanlık", bagli: 2 },
  { sorgu: "yapay zeka otomasyon danışmanlığı", bagli: 2 },
  { sorgu: "eticaret ajansı", bagli: 13 },
  {
    sorgu: "chatgpt gemini görünürlüğü ajans türkiye",
    bagli: null,
    not: "zaten ilk 3 — korunur",
  },
  {
    sorgu: "ai görünürlük danışmanlığı paket fiyatları",
    bagli: null,
    not: "GEO sorgusu; GEO fiyat halkası (§B.4)",
  },
  {
    sorgu: "dönüşüm danışmanlığı",
    bagli: null,
    not: "belirsiz (CRO mu, dijital dönüşüm mü)",
  },
];

/**
 * Para sayfaları — plan §A, §B.1, §B.2: 6 hizmet sayfası + eski UX adresi +
 * 10 karar yazısı = 17 URL. Sayfa düzeyi gösterim / tık (anonim sorgular
 * dahil) bu listeden toplanır (§E.2 tık ölçüsü).
 */
export const PARA_SAYFALARI = [
  // Hizmet sayfaları (§B.1)
  "/tr/hizmetler/ai-danismanlik",
  "/tr/hizmetler/geo-danismanligi",
  "/tr/hizmetler/cro",
  "/tr/hizmetler/e-ticaret",
  "/tr/hizmetler/ui-ux-tasarim",
  "/tr/hizmetler/dijital-donusum",
  // Eski UX adresi — "ux ajansı" bugün burada sıralanıyor (§A.2 #5)
  "/web-tasarim-ui-ux-tasarimi/",
  // Karar yazıları (§B.2'nin dokuzu + e-ticaret fiyat yazısı)
  "/tr/yazilar/cro-ajansi-nasil-secilir",
  "/tr/yazilar/cro-danismanligi-fiyatlari",
  "/tr/yazilar/geo-ajansi-nasil-secilir",
  "/tr/yazilar/ai-danismani-secerken-sorulacak-12-soru",
  "/tr/yazilar/yapay-zeka-danismanligi-fiyatlari",
  "/tr/yazilar/buyuk-danismanlik-mi-butik-yapay-zeka-ajansi-mi",
  "/tr/yazilar/gercek-e-ticaret-ajansinin-etkisi",
  "/tr/yazilar/e-ticaret-danismani-nasil-secilir",
  "/tr/yazilar/e-ticaret-danismanligi-fiyatlari",
  "/tr/yazilar/dogru-pazarlama-ajansi-secmek-icin-8-onemli-soru",
];

/**
 * 9 Eki bazı (çekim `haftalik-2026-10-09`, pencere 8 Eyl – 6 Eki) — §E.1
 * satırlarının parantezindeki kıyas değerleri. `scripts/gsc-kumeler.test.ts`
 * bu değerleri 9 Eki fikstüründen yeniden hesaplayıp sabitler.
 *
 * Para sayfaları: plan (Özet, §E.3, Ek) 551 / 1 yazıyor; yukarıdaki 17
 * URL'nin `haftalik-2026-10-09/sayfalar.csv` toplamı 574 / 1. Fark 23 göst;
 * listenin 10 yazılık hiçbir alt kümesi 551 vermiyor — en olası açıklama
 * 2 Eki yazıları `e-ticaret-danismani-nasil-secilir` (12) ve
 * `yapay-zeka-danismanligi-fiyatlari` (11) plan hesabında sayılmamış.
 * Baz bu listeyle hesaplanan 574'tür.
 */
export const PARA_SETI_BAZ = {
  tarih: "2026-10-09",
  etiket: "9 Eki",
  bant: { ilk3: 0, "4-10": 6, "11-20": 5, "20+": 4 },
  konusmaHaricBant: { ilk3: 0, "4-10": 5, "11-20": 5, "20+": 3 },
  gosterim: 286,
  tiklama: 1,
  paraSayfalari: { gosterim: 574, tiklama: 1 },
};
