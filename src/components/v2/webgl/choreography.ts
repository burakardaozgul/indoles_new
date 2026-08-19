/**
 * BLOB_CHOREOGRAPHY — blob'un sayfa boyunca izlediği yol.
 *
 * `x` / `y`: ekran merkezine göre oran (-1 … +1). +x sağ, +y yukarı.
 *            Dünya koordinatına `visibleSizeAtDepth` ile çevrilir.
 * `scale`  : viewport yüksekliğine oranla çap.
 * `noiseAmp`: yüzey deformasyon genliği — büyürken artar (daha sıvı).
 *            Değerler spec tablosunun yarısı: tablodaki 0.15-0.35 aralığı
 *            silüeti "yumru" gösteriyordu, referanstaki his neredeyse küresel
 *            bir gövde üzerinde birkaç yumuşak lob.
 * `opacity`: materyal opaklığı.
 *
 * ZAMANLAMA
 * ---------
 * Her keyframe'in geçişi, `anchor` bölümünün üstünden BİR SONRAKİ bölümün
 * üstüne kadar olan scroll aralığında scrub'lanır. Aralıklar bu tanımla
 * kendiliğinden ardışıktır ve çakışmaz.
 *
 * Her segment kendi ScrollTrigger'ını taşır ama start/end **fonksiyon**
 * olarak verilir: `() => anchorTop(...)`. Fonksiyonlar her `refresh`'te
 * yeniden değerlendiği için bölüm eklendiğinde veya görseller yüklenip sayfa
 * uzadığında aralıklar kendiliğinden güncellenir.
 *
 * İki önceki deneme neden bırakıldı:
 *   1. `start: "top bottom"` / `end: "bottom center"` — aralıklar birbirine
 *      biniyordu, sonraki tween öncekini eziyor ve blob bazı hedeflere
 *      (özellikle `work`) hiç ulaşmıyordu.
 *   2. Tek timeline + sayfa yüksekliğine normalize konumlar — konumlar mount
 *      anındaki yüksekliğe göre hesaplandığı için sayfa sonradan uzayınca
 *      (bölüm eklenmesi, görsel yüklenmesi) son segment sayfa bitmeden
 *      tamamlanıyor ve blob geri kalan scroll boyunca duruyordu.
 */
export type BlobKeyframe = {
  id: string;
  /** Geçişin başladığı bölümün DOM id'si (`#` olmadan). */
  anchor: string;
  x: number;
  y: number;
  scale: number;
  noiseAmp: number;
  opacity: number;
  note: string;
};

/** Sayfa yüklendiğinde blob'un durduğu başlangıç hâli. */
export const BLOB_INITIAL = {
  x: 0.0,
  y: 0.0,
  scale: 0.65,
  noiseAmp: 0.09,
  opacity: 1.0,
} as const;

export const BLOB_CHOREOGRAPHY: BlobKeyframe[] = [
  {
    id: "hero-scroll",
    anchor: "v2-hero",
    x: 0.15,
    y: 0.05,
    scale: 1.1,
    noiseAmp: 0.12,
    opacity: 1.0,
    note: "Büyüyerek sağa süzülür, harfleri iter",
  },
  {
    id: "statement",
    anchor: "v2-statement",
    x: 0.55,
    y: 0.1,
    scale: 1.6,
    noiseAmp: 0.14,
    opacity: 1.0,
    note: "Sağ kenara yapışık, yarısı ekran dışında, dev",
  },
  {
    id: "about",
    anchor: "v2-about",
    x: 0.5,
    y: -0.15,
    scale: 1.4,
    noiseAmp: 0.11,
    opacity: 0.85,
    note: "Sağda, hafif yukarıda, biraz soluk",
  },
  {
    id: "whynow",
    anchor: "v2-whynow",
    x: 0.72,
    y: 0.3,
    scale: 0.8,
    noiseAmp: 0.13,
    opacity: 0.45,
    note: "Sağ üste çekilip küçülür ve solar — iki kolonun ikisini de boş bırakır, pillar'daki sola geçişe hazırlanır",
  },
  {
    id: "pillars",
    anchor: "v2-pillars",
    x: -0.52,
    y: -0.08,
    scale: 0.9,
    noiseAmp: 0.12,
    opacity: 0.5,
    note: "Sol kenara çekilir ve solar — üç kolon okunur kalmalı",
  },
  {
    id: "services",
    anchor: "v2-services",
    x: 0.62,
    y: -0.34,
    scale: 0.5,
    noiseAmp: 0.16,
    opacity: 0.6,
    note: "Sağ üst köşeye çıkar; yatay track'in önünü kapatmaz",
  },
  {
    id: "work",
    anchor: "v2-work",
    x: -0.45,
    y: 0.2,
    scale: 0.35,
    noiseAmp: 0.17,
    opacity: 0.9,
    note: "Sol marjda küçük damlacık, kartların arkasında",
  },
  {
    id: "outro",
    anchor: "v2-outro",
    x: -0.3,
    y: 0.5,
    scale: 0.5,
    noiseAmp: 0.11,
    opacity: 0.7,
    note: "Aşağı süzülerek çıkar",
  },
];

/**
 * Blob'un uniform'larını taşıyan mutable state.
 * GSAP doğrudan bu objeyi tween'ler; render döngüsü her frame okur.
 * React state kullanılmaz — 60fps'te re-render maliyeti kabul edilemez.
 */
export type BlobState = {
  x: number;
  y: number;
  scale: number;
  noiseAmp: number;
  opacity: number;
};

export function createBlobState(): BlobState {
  return { ...BLOB_INITIAL };
}

/** Bir bölümün sayfa başından itibaren mutlak scroll konumu. */
export function anchorTop(id: string): number | null {
  const el = document.getElementById(id);
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY;
}

export function maxScroll(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

/** DOM'da karşılığı olan keyframe'ler, tanım sırasıyla. */
export function resolvedKeyframes(): BlobKeyframe[] {
  return BLOB_CHOREOGRAPHY.filter((kf) => document.getElementById(kf.anchor));
}

/** Son segmentin ihtiyaç duyduğu asgari scroll payı. */
const LAST_SEGMENT_MIN_VH = 0.6;

/**
 * Segmentlerin mutlak scroll aralıkları — her refresh'te yeniden hesaplanır.
 *
 * Segment i, kendi çapasının üstünden bir sonrakinin üstüne kadar sürer.
 * Tek istisna sonuncusudur: son bölüm sayfanın en altındaysa çapası
 * `maxScroll`'un ötesine düşebiliyor (827px'lik outro, 829px'lik viewport'ta
 * tam olarak bunu yapıyordu) ve segmente hiç scroll kalmıyor — blob son
 * hedefine ulaşmadan donuyordu. Son segmentin başlangıcı bu yüzden yukarı
 * çekilir, ama bir önceki çapanın gerisine düşmez.
 */
export function segmentRanges(): Array<{ start: number; end: number }> {
  const kfs = resolvedKeyframes();
  if (kfs.length === 0) return [];

  const max = maxScroll();
  const tops = kfs.map((kf) => anchorTop(kf.anchor) ?? 0);

  const last = tops.length - 1;
  if (last > 0) {
    const floor = tops[last - 1] ?? 0;
    const room = max - window.innerHeight * LAST_SEGMENT_MIN_VH;
    tops[last] = Math.min(tops[last] ?? 0, Math.max(floor, room));
  }

  return tops.map((start, i) => ({
    start,
    end: i + 1 < tops.length ? (tops[i + 1] ?? max) : max,
  }));
}
