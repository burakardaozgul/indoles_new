# CI/CD Workflows

Yapı `docs/05-tech-architecture.md` §12.1'de tanımlı.

| Dosya | Durum | Ne yapar |
|---|---|---|
| `checks.yml` | **Aktif** | `main`'e push ve her PR'da: lint → typecheck → test → build → production sunucusu → robots smoke → `seo:audit` |
| `preview.yml` | Yazılmadı | Per-PR preview deploy + Playwright e2e |
| `production.yml` | Yazılmadı | `main` merge sonrası Sentry release + smoke |

## checks.yml — kritik ayrıntılar

**`NEXT_PUBLIC_APP_STAGE: production` job seviyesinde tanımlıdır.** `src/app/robots.ts`
bu değer `production` değilken `Disallow: /` basar ve `NEXT_PUBLIC_*` değişkenleri
build anında gömülür — yani yanlış env ile alınan bir build tüm siteyi indeks dışı
bırakır (denetim bulgusu LG-02). Denetim adımının production davranışını ölçmesi
için build de bu değerle alınır.

**`NEXT_PUBLIC_APP_URL` kasten set edilmez.** `src/lib/seo/site.ts` fallback'i devreye
girer, canonical/hreflang/sitemap gerçek production host'uyla üretilir. `seo:audit`
host'u değil path'i karşılaştırdığı için lokal sunucuya karşı koşmak sorun değil;
host'u da sabitlersek canonical'ın yanlış host'a düşmesi (LG-01) CI'da görünmez olur.

**robots smoke adımı** tek satırlık `grep -qx 'Disallow: /'` kontrolüdür. Production
robots.txt'inde yalnız `Disallow: /app/`, `/admin/`, `/studio/`, `/api/` gibi özgül
yollar bulunur; tam satır eşleşmesi bu yüzden yanlış pozitif üretmez.

**`seo:audit` kapsamını `/sitemap.xml`ten okur** (124 URL) ve profili URL kalıbından
çıkarır. Kural setleri `src/lib/seo/audit.ts` içindeki profil matrisinde, doğrulaması
`tests/unit/seo-audit.test.ts` fixture testlerinde. Hızlı koşu gerekirse:
`pnpm seo:audit --profile service,pillar` veya `--limit 20`.

## Bilerek dışarıda bırakılanlar

- **Playwright e2e** — `playwright.config.ts:10` `PLAYWRIGHT_BASE_URL` bekliyor, yani
  Vercel preview adresine ihtiyacı var. `checks.yml` içindeki lokal `next start`
  sunucusuna karşı koşturmak preview'ı değil CI'ın kendi build'ini test ederdi.
  Preview URL'i workflow'a taşıyan `preview.yml` yazılana kadar e2e elle koşulur
  (`pnpm test:e2e`).
- **`pnpm format:check`** — §12.1 prettier kontrolünü öngörüyor ama repo şu an
  formatlı değil (`.claude/`, `docs/` ve kaynak dosyalarda yüzlerce fark). Adımı
  eklemek CI'ı ilk günden ilgisiz nedenle kırmızıya çevirirdi. Önce repo genelinde
  bir `pnpm format` geçilmeli, sonra adım eklenmeli.
- **Lighthouse CI** — §12.1'de "opsiyonel, warn-only".

## Güvenlik

Workflow dosyalarını yazarken `github.event.*` gibi untrusted input'ları `env:`
bloğuna mapping'le — doğrudan `${{ ... }}` olarak shell'e gömmek injection riskidir.

Örnek güvenli pattern:
```yaml
env:
  TITLE: ${{ github.event.issue.title }}
run: echo "$TITLE"
```

`checks.yml` hiçbir `github.event.*` değeri kullanmaz; tek ifade `concurrency.group`
içindeki `github.ref`tir ve shell'e girmez.
