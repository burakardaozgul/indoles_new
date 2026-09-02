# ADR-031 — OG kartları derleme zamanında üretilir

- **Statü:** Kabul edildi
- **Tarih:** 2026-09-02
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** `docs/superpowers/specs/2026-09-02-geo-araci-yeniden-tasarim-design.md` §9
- **İlgili:** ADR-024 (Cloudflare Workers, 3 MB paket sınırı; `@vercel/og` kaldırıldı) · ADR-030 (`/araclar`)
- **Etkilenen dosyalar:** `scripts/generate-og-geo.ts`, `scripts/og/geo-card.tsx`, `public/og/geo/**`, `src/lib/seo/metadata.ts`, `src/lib/tools/geo/share-meta.ts`, `docs/08-seo-i18n-strategy.md`

## Bağlam

Paylaşılan GEO skoru PR hikâyesinin kendisidir; sosyal kartta skorun görünmesi gerekir. İstek başına üretim (`@vercel/og` + `fontkit`, ~2,2 MB) Worker paketini 3 MB plan sınırının üstüne taşıyordu (ADR-024).

## Karar

Kartlar derleme zamanında, geliştirme makinesinde Playwright ile (`pnpm og:geo`) üretilir ve `public/og/geo/{tr,en}/{0..100}.png` + `tool.png` olarak repoya girer. Statik varlıklar Worker paketine sayılmaz. Taranan adres kartta yoktur; `og:title` taşır — böylece skor başına tek kart yeter (202 + 2 dosya). Şablon (`scripts/og/geo-card.tsx`) sayfadaki `BandScale` bileşenini kullanır; eşikler ve renkler tek kaynaktan gelir.

## Sonuçlar

- Artı: Worker boyutu değişmez; kart üretim maliyeti sıfır; şablon sayfayla aynı geometriyi çizer.
- Eksi: Şablon değişince script yeniden çalıştırılıp çıktı commit edilmeli; ~6-8 MB statik varlık.
- Yeni araç veya yeni skor ölçeği geldiğinde aynı yol izlenir; istek başına üretim yalnız plan sınırı değişirse yeniden değerlendirilir.
