/**
 * v2 (blob) anasayfasının tüm zamanlama, easing ve eşik sabitleri.
 *
 * Spec kuralı: hiçbir süre/easing/threshold component içine gömülmez —
 * tune edilecek her değer buradadır.
 */

export const LENIS = {
  lerp: 0.09,
  wheelMultiplier: 1.0,
  smoothWheel: true,
  /** prefers-reduced-motion altında Lenis tamamen kapatılır. */
  disableOnReducedMotion: true,
} as const;

export const CURSOR = {
  size: 14,
  hoverSize: 40,
  opacity: 0.7,
  hoverOpacity: 0.25,
  /** Konum takibi — düşük değer daha fazla gecikme. */
  lerp: 0.15,
  /** Boyut/opaklık geçişi. */
  transition: 0.25,
  /** Bu seçicilerin üstünde cursor büyür. */
  interactiveSelector:
    'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]',
} as const;

export const BLOB = {
  /**
   * IcosahedronGeometry subdivision.
   *
   * Spec 96 istiyordu; o değerde geometri 188.180 üçgen / 564.540 vertex
   * üretiyor ve normal yeniden hesabı deformasyonu vertex başına 3 kez
   * çağırdığı için frame başına ~5 milyon simplex noise çıkıyordu (60fps'te
   * saniyede 305 milyon). Hero'daki takılmanın kaynağı buydu.
   *
   * 32'de 21.780 üçgen kalıyor — 8.6× ucuz. Noise düşük frekanslı ve normal
   * küresele doğru harmanlandığı için silüet aynı derecede pürüzsüz.
   */
  detail: 32,
  detailMobile: 16,
  camera: { fov: 35, z: 6 },
  /**
   * Spec tavanı 2. Retina'da 2 → 1.75 geçişi fragment yükünü ~%23 düşürüyor,
   * fark gözle ayırt edilemiyor.
   */
  dpr: [1, 1.75] as [number, number],
  dprMobile: [1, 1.5] as [number, number],
  /**
   * Kare yöneticisi (BlobCanvas): etkileşim/tween sürerken activeFps tavanı,
   * activeWindowMs hareketsizlikten sonra idleFps. ProMotion'ın 120Hz'ine hiç
   * çıkılmaz — ısınmanın ana kaynağıydı.
   */
  governor: { activeFps: 60, idleFps: 30, activeWindowMs: 2500 },
  /**
   * Dar ekranda tüm keyframe ölçeklerine uygulanan çarpan.
   *
   * Ölçek viewport YÜKSEKLİĞİNE göre hesaplanıyor; portre telefonda yükseklik
   * genişliğin iki katından fazla. 0.5 blob'u hero'da ~275px'e indiriyordu —
   * köşede küçük bir leke gibi duruyordu. 0.72 hero blob'unu ekran genişliğine
   * yaklaştırır (0.65 × 0.72 × 844 ≈ 395px @ 390px viewport): gövde merkezde
   * ve baskın. Başlık okunurluğu artık gövdeyi küçültmeye bağlı değil —
   * mobilde üst katman tüm harfleri basıyor (v2.css `.v2-letter-ghost`).
   */
  mobileScaleFactor: 0.72,
  /**
   * Dar ekranda tüm keyframe'lere uygulanan dikey kaydırma (ekran oranı).
   *
   * 0.3'lük yukarı itme, blob'un başlığın siyah katmanını örtmesine karşı bir
   * geçici çözümdü; hayalet harfler mobilde görünür olduğundan gerek kalmadı.
   * 0: blob viewport merkezinde — mobil hero kurgusunun çapası.
   */
  mobileYOffset: 0,

  /** Vertex noise — düşük frekans: birkaç büyük lob, çakıl dokusu yok. */
  noiseFreq: 0.6,
  /**
   * Yüzey gerilimi salınımının genliği (l=2/l=3 harmonikler).
   * Bütün gövdeyi esnetir; "sıfır yerçekiminde su damlası" hissini bu verir.
   */
  wobbleAmp: 0.1,
  /**
   * Zaman ilerleme hızı.
   * 0.15'te yüzey donmuş bir cisim gibi okunuyordu — ağırlık hissinin asıl
   * kaynağı buydu. Sıvı his sürekli ve fark edilir devinim gerektiriyor.
   */
  timeScale: 0.5,
  /** prefers-reduced-motion: %70 yavaşlar (spec §6). */
  reducedMotionTimeScale: 0.5 * 0.3,
  /**
   * Gövdenin kendi ekseninde sürüklenmesi (rad/sn).
   *
   * Çok düşük tutuluyor: sıvı hissin asıl kaynağı yüzey gerilimi salınımı
   * (`wobbleAmp`), dönüş yalnızca parlamaları gezdiriyor. Yüksek değerde
   * obje uzayı hızla dönüyor ve cursor izinin yüzeydeki çapası kayıyor.
   */
  driftSpeed: { x: 0.008, y: 0.014 },

  /** Mouse etkileşimi */
  mouseRadius: 0.62,
  /** Cursor'ın açtığı çukurun derinliği (yarıçapa oran). */
  dentDepth: 0.42,
  /** Çukurun etrafındaki halka dalgasının genliği. */
  rippleAmp: 0.09,

  /**
   * Çukurun cursor'ı takip hızı — SANİYE başına, frame başına değil.
   *
   * Frame başına sabit lerp (0.07) iki sorun üretiyordu: 120Hz ekranda gerçek
   * zamanda yarı hızda çalışıyordu, ve hızlı hareket ettiğinde çukur cursor'a
   * hiç yetişemeyip kopuk görünüyordu.
   */
  mouseFollowRate: 10,
  /**
   * Uzaklığa bağlı yetişme kazancı. Çukur cursor'dan uzaklaştıkça takip hızı
   * artar; yavaş hareket yumuşak kalır, hızlı sweep'te iz kopmaz.
   *
   * 6 fazla agresifti: uzak mesafede kare başına %80 yol alıp ışınlanma gibi
   * görünüyordu. Cursor blob'dan çıkıp uzak bir noktadan geri girdiğinde de
   * çukur zıplıyordu.
   */
  mouseCatchUp: 2.2,
  /**
   * Kare başına alınabilecek azami yol. Yetişme ne kadar gerekirse gereksin
   * çukur bir karede bu oranın ötesine sıçramaz — atlama garantili engellenir.
   */
  mouseMaxStep: 0.32,
  /** Strength'in yükselme hızı (saniye başına). */
  strengthAttackRate: 10,
  /** Mouse blob'dan çıkınca strength'in sönümlenme süresi (sn). */
  mouseDecay: 0.8,
  /**
   * Hızın strength'e katkısı. Hız artık NDC birimi/saniye cinsinden ve frame
   * döngüsünde ölçülüyor — olay başına ölçüm frame hızına göre değişiyordu.
   */
  velocityGain: 0.16,
  /**
   * Hız katkısının tavanı. 0.9'da hızlı harekette çukur derinliği
   * yarıçapın %80'ine çıkıp krater gibi görünüyordu.
   */
  velocityClamp: 0.4,
  /** Taban strength (mouse blob üzerindeyken). */
  baseStrength: 1.0,

  /** Giriş animasyonu */
  intro: { fromScale: 0.6, duration: 1.2, ease: "power3.out" },

  /** Opacity bu değerin altındaysa draw call atlanır (spec §10). */
  cullOpacity: 0.02,
} as const;

export const SCROLL = {
  /** Koreografi tween'lerinin scrub gecikmesi. */
  scrub: 1,
  ease: "power2.inOut",
  /** Resize debounce (spec §10). */
  resizeDebounce: 150,
} as const;

/**
 * İç sayfa blobu — koreografi yok, sessiz eşlikçi.
 *
 * Anasayfada blob anlatının kendisidir; iç sayfada okumanın arkasında durur.
 * Bu yüzden konum sabit, opaklık düşük ve tek hareket scroll'a bağlı hafif bir
 * dikey kayma. Canvas aynı canvas: sayfalar arası geçişte unmount edilmediği
 * için süreklilik hissi korunuyor (ADR-016 §Sürekli sahne).
 */
export const BLOB_PAGE = {
  /** Sağ üstte, içeriğin okuma kolonundan uzak.
      İlk deneme (0.52 ölçek / 0.42 opaklık) sayfa başlığının lede kolonunu
      örtüyordu — "sessiz eşlikçi" olması gereken katman sayfanın konusu
      hâline geliyordu. Küçültüldü ve sağa itildi. */
  /* İkinci tur: 0.74/0.30 paket sayfasında fiyat kolonunun üstüne biniyordu.
     Gövdenin çoğu ekranın dışına taşacak şekilde sağa itildi — geriye köşede
     yumuşak bir ışık kalıyor, okuma kolonlarına hiç girmiyor. */
  x: 0.88,
  y: -0.3,
  scale: 0.4,
  noiseAmp: 0.07,
  opacity: 0.26,
  /** Dar ekranda daha da geri çekilir — okuma alanı zaten dar */
  mobile: { x: 0.6, scale: 0.3, opacity: 0.18 },
  /** Scroll boyunca `y` bu kadar aşağı kayar (oran) */
  scrollDrift: 0.34,
} as const;

/**
 * Araç sayfası hero blobu — merkezî ve belirgin, ama koreografisiz.
 *
 * Araç sayfası üçüncü bir sayfa tipidir (docs/04 §12.10 "Bilinçli istisna"):
 * hizmet/vaka/yazı sayfası OKUNUR, araç sayfası KULLANILIR — ilk ekranı bir
 * metin bloğu değil bir giriş alanıdır. Sessiz eşlikçi blob orada ilk ekranı
 * boş bir formla baş başa bırakıyordu.
 *
 * Anasayfanın 7 duraklı koreografisi KOPYALANMAZ: o koreografi bir scroll
 * anlatısıdır, araç sayfasının anlatısı yok. Burada tek bir durum var —
 * hero'da büyük ve merkezî — ve scroll ettikçe `BLOB_PAGE` hâline çekilir.
 * Böylece "blob okuma kolonuna girmez" kuralı okuma bölümlerinde aynen
 * yürürlükte kalır; istisna yalnız ilk ekranı kapsar.
 */
export const BLOB_TOOL_HERO = {
  /** Merkezî: `.tool-hero` tek sütunlu ve ortalanmış, blob da öyle. */
  x: 0,
  /**
   * Hafif aşağı (-y = aşağı). Gövdenin en yoğun/en parlak bölgesi h1'in
   * tepesine değil, lede + giriş kartı hizasına düşsün diye: kart zaten
   * yarı saydam beyaz (`.v2-surface`), blob'un çekirdeği onun arkasında
   * buzlu cam gibi okunuyor, başlığın üstüne ise yumuşak üst kenarı geliyor.
   */
  y: -0.12,
  /**
   * Anasayfa hero'su 0.65 ile başlayıp 1.1'e büyür. 0.78 o aralığın içinde
   * ama tepesinde değil: "anasayfadaki gibi büyük", "anasayfanın kopyası"
   * değil.
   */
  scale: 0.78,
  noiseAmp: 0.1,
  /**
   * 0.26 (iç sayfa) belirgin değil, 1.0 (anasayfa) metnin altında gürültü.
   * 0.55'te krem üstündeki en koyu bölge bile açık kalıyor: 4 viewport'ta
   * ölçülen en düşük kontrast teal-700 eyebrow'da 6.5:1, gövde 10.2:1
   * (AA sınırı 4.5). Ölçüm yöntemi docs/04 §12.10'da.
   */
  opacity: 0.55,
  /**
   * Dar ekranda okuma kolonu = ekranın tamamı; gövde küçülür ve solar.
   * Ölçek ayrıca `BLOB.mobileScaleFactor` (0.72) ile çarpılır: 0.62 → 0.45,
   * anasayfa mobil hero'sunun (0.65 → 0.47) hemen altında.
   */
  mobile: { x: 0, y: -0.05, scale: 0.62, opacity: 0.4 },
  /**
   * Hero durumundan `BLOB_PAGE` durumuna geçişin süreceği scroll payı
   * (viewport yüksekliğine oran). Bir ekran boyu: kullanıcı ilk bölüme
   * ("Nasıl çalışır") vardığında blob çoktan sessiz eşlikçi olmuştur.
   */
  settleVh: 0.9,
} as const;

/**
 * Chrome (siyah şerit + nav) — hero'ya değil layout'a ait olduğu için kendi
 * bloğunda tutulur; hero kaldırılsa bile nav zamanlaması burada kalır.
 */
export const NAV = {
  /** Giriş: logo → linkler → aksiyonlar sırayla düşer */
  entryDuration: 0.7,
  entryStagger: 0.05,
  entryFrom: { y: -14, opacity: 0 },
  entryEase: "power2.out",
  /** Bu kaydırmadan sonra nav krem yüzeyini kazanır (px) */
  surfaceAfter: 24,
} as const;

export const HERO = {
  /** Giriş: başlık satırları */
  titleFrom: { y: 60, opacity: 0 },
  titleDuration: 0.9,
  titleStagger: 0.15,
  titleEase: "power3.out",

  /** Harf saçılması — deterministik seed'li dağılım aralıkları */
  scatter: {
    xRange: [40, 120] as [number, number],
    yRange: [20, 60] as [number, number],
    rotateRange: 8,
    /** Saçılma bu scroll aralığında olur (hero yüksekliğine oranla). */
    scrub: true,
    /** Mobilde saçılma kapalı, yalnız fade. */
    disableBelow: 768,
  },

  /**
   * Yörünge halkalarının tur süreleri (sn).
   * Kesik çizgili bir çemberde dönüş yalnızca kesiklerin kayışıyla okunur;
   * 120-240 sn'de hareket fark edilmiyordu.
   */
  dashedCircleDurations: [22, 30, 38] as const,
} as const;

export const SECTIONS = {
  revealFrom: { y: 80, opacity: 0 },
  revealDuration: 0.9,
  revealStagger: 0.1,
  revealStart: "top 75%",
  /** Maskeli satır reveal (statement) */
  lineStagger: 0.08,
  lineDuration: 0.9,
} as const;

export const GRID = {
  /** Logo hücrelerinin giriş stagger'ı. */
  cellStagger: 0.03,
  /** Hover senkron süresi — pill zemin, sönme, etiket değişimi. */
  hoverDuration: 0.3,
  labelSwapDuration: 0.25,
  dimmedOpacity: 0.2,
} as const;

export const WORK = {
  /** Sağ kolonun sol kolona göre hız farkı (yüzde). */
  parallaxDelta: 13,
  /** Kart görselinin iç parallax genliği (yüzde). */
  imageParallax: 15,
  /** Sağ kolonun dikey offset'i (px). */
  columnOffset: 180,
  cardHoverScale: 1.04,
  cardHoverLift: -4,
  cardHoverDuration: 0.6,
  iconMorphDuration: 0.3,
  tagStagger: 0.04,
} as const;

export const BREAKPOINT = {
  mobile: 768,
  /** Yatay/parallax mekanizmalarının kapandığı eşik. */
  reducedLayout: 900,
} as const;
