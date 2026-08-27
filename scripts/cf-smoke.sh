#!/usr/bin/env bash
# Cloudflare Workers dağıtımı sonrası duman testi (ADR-024, denetim LG-04).
#
# Lokal `next start` ile doğrulanan davranışların OpenNext adaptörü altında
# birebir aynı kaldığını kontrol eder. Adaptör bir uyarlama katmanı; metadata
# yerleşimi, route handler'lar ve OG görsel üretimi Workers çalışma zamanında
# yeniden ölçülmeden "çalışıyor" sayılamaz.
#
# Kullanım:
#   scripts/cf-smoke.sh https://indoles-web.<subdomain>.workers.dev
#   scripts/cf-smoke.sh https://www.indoles.com.tr   # cutover sonrası
#
# Çıkış kodu 0 = tüm kontroller geçti.

set -uo pipefail

BASE="${1:-}"
if [[ -z "$BASE" ]]; then
  echo "Kullanım: $0 <base-url>" >&2
  exit 2
fi
BASE="${BASE%/}"

pass=0
fail=0

ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; pass=$((pass+1)); }
bad()  { printf '  \033[31m✗\033[0m %s\n' "$1"; fail=$((fail+1)); }

# CF_SMOKE_DOH=1 → yerel çözümleyiciyi atla. Yeni bağlanan bir custom domain
# yerel resolver'ın negatif önbelleğinde takılı kalabiliyor; DNS zaten
# yayılmışken testin düşmesini engeller.
DOH=()
[[ "${CF_SMOKE_DOH:-}" == "1" ]] && DOH=(--doh-url https://1.1.1.1/dns-query)

fetch() { curl -sS -m 20 "${DOH[@]}" "$@"; }
code()  { curl -sS -m 20 "${DOH[@]}" -o /dev/null -w '%{http_code}' "$1"; }

echo "Duman testi: $BASE"
echo

# --- 1. Temel erişilebilirlik
echo "1) Rotalar"
for path in /tr /en /tr/hizmetler/cro /tr/vakalar /tr/yazilar; do
  c=$(code "$BASE$path")
  [[ "$c" == "200" ]] && ok "$path → 200" || bad "$path → $c (200 bekleniyordu)"
done

# --- 2. SEO endpoint'leri
echo
echo "2) SEO uç noktaları"
for path in /robots.txt /sitemap.xml /llms.txt /llms-full.txt /tr/llms.txt /en/llms.txt /opengraph-image.png /icon.png /apple-icon.png /manifest.webmanifest; do
  c=$(code "$BASE$path")
  [[ "$c" == "200" ]] && ok "$path → 200" || bad "$path → $c (200 bekleniyordu)"
done

# --- 3. LG-02: robots siteyi kapatmıyor mu
echo
echo "3) robots.txt aşama kontrolü (LG-02)"
robots=$(fetch "$BASE/robots.txt")

# Doğrulama adresleri (`preview.` alt alanı veya `workers.dev`) bilerek
# `stage=preview` ile dağıtılıyor: kapalı robots.txt orada DOĞRU sonuçtur,
# yoksa test kopyası indekslenip canlı siteyle çakışırdı.
is_preview=0
grep -qiE 'workers\.dev|//preview\.' <<<"$BASE" && is_preview=1

if grep -qx 'Disallow: /' <<<"$robots"; then
  if [[ "$is_preview" == "1" ]]; then
    ok "Tüm site kapalı — doğrulama adresinde BEKLENEN davranış"
  else
    bad "TÜM SİTE KAPALI: NEXT_PUBLIC_APP_STAGE production değil"
  fi
else
  if [[ "$is_preview" == "1" ]]; then
    bad "Doğrulama adresi indekslenebilir — preview aşamasıyla dağıtılmalıydı"
  else
    ok "robots.txt siteyi kapatmıyor"
  fi
fi

# AI crawler listesi ve sitemap satırı yalnız production robots.txt'te olur.
if [[ "$is_preview" == "1" ]]; then
  ok "AI crawler / Sitemap satırları atlandı (preview robots.txt)"
else
  grep -q 'GPTBot' <<<"$robots" && ok "AI crawler listesi basılıyor" || bad "AI crawler listesi yok"
  grep -q 'Sitemap:' <<<"$robots" && ok "Sitemap satırı var" || bad "Sitemap satırı yok"
fi

# --- 4. Metadata <head> içinde mi (denetim T-01'in regresyonu)
echo
echo "4) Metadata yerleşimi (T-01)"
html=$(fetch "$BASE/tr/hizmetler/cro")
head_end=$(awk 'BEGIN{RS="</head>"} NR==1{print length($0)}' <<<"$html")
for tag in '<title>' 'rel="canonical"' 'og:image'; do
  pos=$(awk -v t="$tag" 'BEGIN{RS="\0"} {print index($0, t)}' <<<"$html")
  if [[ "$pos" -gt 0 && "$pos" -lt "$head_end" ]]; then
    ok "$tag </head> öncesinde"
  else
    bad "$tag </head> DIŞINDA (pos=$pos, head=$head_end)"
  fi
done

# --- 5. Kanonik host
echo
echo "5) Kanonik host (ADR-024 — www)"
canon=$(grep -o 'rel="canonical" href="[^"]*"' <<<"$html" | head -1 | sed 's/.*href="//;s/"//')
[[ "$canon" == https://www.indoles.com.tr/* ]] \
  && ok "canonical www: $canon" \
  || bad "canonical beklenmedik: ${canon:-yok}"

sm=$(fetch "$BASE/sitemap.xml")
n=$(grep -c '<loc>' <<<"$sm")
[[ "$n" -ge 120 ]] && ok "sitemap $n URL" || bad "sitemap yalnız $n URL (≥120 bekleniyordu)"
grep -q '<loc>https://indoles.com.tr/' <<<"$sm" && bad "sitemap'te apex kalıntısı var" || ok "sitemap'te apex kalıntısı yok"

# --- 6. 404 davranışı (T-08b)
echo
echo "6) 404 yüzeyi (T-08b)"
c=$(code "$BASE/tr/olmayan-sayfa")
[[ "$c" == "404" ]] && ok "/tr/olmayan-sayfa → 404" || bad "/tr/olmayan-sayfa → $c"
en404=$(fetch "$BASE/en/does-not-exist")
grep -q 'Page not found' <<<"$en404" && ok "EN 404 kendi dilinde" || bad "EN 404 yanlış dilde"
grep -q 'Aradığınız içerik büyük olasılıkla' <<<"$en404" && bad "EN 404'te TR gövde sızıntısı" || ok "EN 404'te TR sızıntısı yok"

# --- 7. Redirect zinciri
echo
echo "7) 301 haritası"
for old in /cro-donusum-orani-optimizasyonu /web-tasarim-ui-ux-tasarimi /takimimiz; do
  c=$(code "$BASE$old")
  [[ "$c" == "301" || "$c" == "308" ]] && ok "$old → $c" || bad "$old → $c (301/308 bekleniyordu)"
done

echo
echo "─────────────────────────────"
printf 'Geçen: %d · Düşen: %d\n' "$pass" "$fail"
[[ "$fail" -eq 0 ]] || exit 1
