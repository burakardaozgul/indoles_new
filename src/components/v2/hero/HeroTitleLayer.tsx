import type { TitleRow } from "./title-content";

/**
 * Başlığın tek bir kopyası. Aynı komponent iki kez render edilir.
 *
 * KATMAN SIRASI — spec'ten bilinçli sapma
 * ---------------------------------------
 * Spec §2 renkli kopyayı z-0'a (canvas'ın ALTINA), siyah kopyayı z-20'ye
 * (ÜSTÜNE) koyuyor. Bu sıralama opak bir blob'la görünür bir etki üretmiyor:
 * blob renkli katmanı tamamen kapatıyor, siyah katman ise blob'un üstünde
 * kaldığı için hiçbir harf renklenmiyor. İki katman da kayboluyor.
 *
 * Spec'in teslim kriteri #3 ("top metnin üzerinden geçerken arkadaki renkli
 * harfler görünüyor mu") ancak şu düzenle sağlanıyor:
 *
 *   z-0   `ink`    → TÜM harfler siyah, blob'un ARKASINDA
 *   z-10  blob
 *   z-20  `accent` → YALNIZCA vurgu harfleri, blob'un ÖNÜNDE
 *
 * Sonuç: blob bir harfin üstünden geçtiğinde o harfin siyah kopyasını gizler;
 * accent harfleri blob'un üzerinde renkli olarak durmaya devam eder. Vurgu
 * dışındaki harfler `visibility: hidden` ile saklanır — kaldırılmaz, çünkü
 * iki katmanın piksel hizası harf genişliklerinin birebir aynı kalmasına
 * bağlı.
 *
 * BAŞLIK SEMANTİĞİ
 * ----------------
 * Metin iki kez basıldığı için `h1` de iki kez basılıyordu: ana sayfada iki
 * `<h1>`, ikisi de birebir aynı metin. `accent` katmanı zaten `aria-hidden`
 * (ekran okuyucu iki kez okumuyor), ama `aria-hidden` DOM'daki etiketi
 * kaldırmaz — HTML doğrulayıcılar ve başlık ağacını `aria-hidden`e bakmadan
 * çıkaran tarayıcılar/botlar iki `h1` görüyordu. Çözüm: yalnız `ink` katmanı
 * `h1` basar, `accent` katmanı aynı sınıfla `div` basar. `.v2-title`
 * `font-weight`, `margin` ve `font-size`ı kendisi tanımladığı için (v2.css
 * §.v2-title) iki katman piksel piksel aynı kalır; GSAP `.v2-title-row` ve
 * `.v2-letter[data-i]` üzerinden çalıştığı için koreografi de etkilenmez.
 */
export function HeroTitleLayer({
  rows,
  variant,
  /** Harf indekslerinin satırlar arası sürekli sayacı — scatter seed'i buna bağlı. */
  indexOffsets,
}: {
  rows: TitleRow[];
  variant: "ink" | "accent";
  indexOffsets: number[];
}) {
  /** Sayfadaki tek `h1` `ink` katmanınındır; görsel ikizi semantiksizdir. */
  const Title = variant === "ink" ? "h1" : "div";

  return (
    <div
      className={variant === "ink" ? "v2-layer-under" : "v2-layer-over"}
      aria-hidden={variant === "accent" ? true : undefined}
      data-title-layer={variant}
    >
      <Title className="v2-title">
        {rows.map((r, ri) => (
          <span key={r.row} className="v2-title-row" data-row={r.row}>
            {Array.from(r.text).map((ch, ci) => {
              const globalIndex = (indexOffsets[ri] ?? 0) + ci;
              const inAccentRange =
                ci >= r.accentRange[0] && ci < r.accentRange[1] && ch !== " ";

              const style: React.CSSProperties | undefined =
                variant === "accent"
                  ? inAccentRange
                    ? { color: `var(${r.accentVar})` }
                    : { visibility: "hidden" }
                  : undefined;

              return (
                <span
                  key={`${r.row}-${ci}`}
                  className="v2-letter"
                  data-i={globalIndex}
                  style={style}
                >
                  {ch === " " ? " " : ch}
                </span>
              );
            })}
          </span>
        ))}
      </Title>
    </div>
  );
}
