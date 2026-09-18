# Runbook — Haftalık GSC çekimi ve küme raporu

> **Kime:** Burak · **Süre:** ~3 dakika · **Sıklık:** her Pazartesi
> **Karar dayanağı:** `docs/strateji/Keyword-Onceliklendirme-2026-08-27.md` §4 (ölçüm çerçevesi, G1-G5 kümeleri, A-1…A-7 alarm eşikleri)
> **Önkoşul:** Marketing klasörü erişilebilir olmalı (servis hesabı anahtarı ve `GSC-Data/` orada). Script'ler Mac'ten doğrudan çalışır.

## Beş adım

1. `pnpm gsc:weekly` — son 28 günü (bitiş bugün-3, GSC gecikmesi) `https://www.indoles.com.tr/` mülkünden çeker ve kilit URL listesini indeks taramasından geçirir.
2. Çıktı `Marketing/GSC-Data/haftalik-<bugün>/`: beş ham CSV + `kumeler.csv` + `ozet.txt` + `meta.txt`; indeks taraması `Marketing/GSC-Data/indeks-<bugün>.csv`.
3. `ozet.txt`'i aç — haftalık toplam, G1-G5 küme tablosu, A-3 adayları, konsolidasyon (eski URL payı) ve mekanik alarm satırları hazır gelir.
4. `Marketing/GSC-Data/haftalik-log.md`'ye yeni bir `## <tarih> (çekim aralığı ...)` bölümü ekle: **haftalık toplam → G1-G5 küme → indeks durumu → A-3 adayları → konsolidasyon → alarm durumu** sırası (10 ve 18 Eylül kayıtlarındaki biçim). `ozet.txt` bu sıraya birebir uyar; üstüne yalnız yorum ve aksiyon yazılır.
5. Tetiklenen alarm varsa aksiyonu §4'ün alarm tablosundan al (A-3 → title/description revizyonu, A-2 → dizine ekleme isteği + `pnpm seo:audit`, A-6 → hedeften düşürme).

## Komut varyantları

| Amaç                                       | Komut                                                                       |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| Yalnız veri çekimi                         | `pnpm gsc:pull`                                                             |
| Yalnız indeks taraması                     | `pnpm gsc:inspect`                                                          |
| Başka tarih aralığı                        | `node scripts/gsc-pull.mjs --start 2026-08-01 --end 2026-08-28`             |
| Başka mülk                                 | `node scripts/gsc-pull.mjs --site "sc-domain:simlimited.net"`               |
| Deneme çekimi (gerçek klasörü kirletmeden) | `node scripts/gsc-pull.mjs --out /tmp/gsc-test`                             |
| Mevcut CSV'lerden küme hesabı (API'siz)    | `node scripts/gsc-pull.mjs --from-dir "<.../GSC-Data/haftalik-2026-09-18>"` |
| Tek tek URL taraması                       | `node scripts/gsc-inspect.mjs https://www.indoles.com.tr/tr/hizmetler/cro`  |
| Başka URL listesi                          | `node scripts/gsc-inspect.mjs --urls-file liste.txt`                        |

Kilit URL listesi `scripts/gsc-kilit-urller.txt` (52 URL). Yeni hizmet/vaka/yazı yayına girdiğinde bu dosyaya eklenir.

## Bilinmesi gerekenler

- **Mülk seçimi sabittir.** Varsayılan `https://www.indoles.com.tr/`. Servis hesabı dört mülke erişiyor; 18 Eylül'de otomatik seçim `sc-domain:meccanotecnica.com.tr`'yi alıp yanlış veriyi klasöre yazdı. Otomatik seçim artık yalnız `--site auto` ile çalışır. Her koşuda erişilebilir mülk listesi loglanır — çekim sonrası `meta.txt`'in `site:` satırı kontrol edilir.
- **Anahtar ve çıktı yolu kendi kendini bulur.** Sıra: `--key` → `~/Desktop/AA - INDOLES Creative & Marketing/Marketing/` → `~/mnt/Marketing/` → `GSC_KEY_PATH` env.
- **Haftalık pencere.** `ozet.txt` "son 7 gün" olarak çekim aralığının son yedi gününü, "önceki 7 gün" olarak ondan önceki yediyi alır ve iki pencerenin tarihlerini tabloya yazar. Log'daki önceki kayıtla hizalamak istersen pencereyi elle düzelt.
- **Küme kuralları.** G1-G5 desenleri §4 tablosundan gelir; tablodan türetilmeyen üç kural (`ai optimizasyon` → G3, G2'nin G3 ile kesişmemesi, G2'nin `arama motoru` sorgularını saymaması) ve G4'ün `business building` eklemesi `scripts/gsc-pull.mjs`'in küme bloğunda gerekçesiyle yazılıdır. Bu kural seti 18 Eylül'ün elle hesabını birebir yeniden üretir (G3 248/17 sorgu/1 tık, G1 60/13, G2 53/14, G4 20/4, eski URL payı %31,2, A-3 11 sayfa).
- **Kota.** URL Inspection günde 2.000, dakikada 600 istek. Tarama 3 eşzamanlı istek koşar; 52 URL ~1 dakika sürer.
