---
name: orchestrate
description: >
  Use when Burak starts a multi-step feature, refactor, audit, migration veya içerik
  batch'i ve işin planlanıp alt ajanlara delege edilmesini istiyor; bir görev 3+ dosyaya
  veya birden fazla domain'e (UI + copy + SEO + docs) yayılıyorsa; ya da "orchestrate",
  "planla ve delege et", "ajanlarla yap", "alt ajan kullan", "token tasarruflu ilerle",
  "paralel yap" dediğinde. Tek dosyalık küçük fix, soru-cevap veya salt okuma görevlerinde
  KULLANILMAZ.
---

# INDOLES Orchestrate — Fable Kontrol, Alt Ajan İcra

## Amaç

Ana döngüdeki model (Fable) **yönetici**dir: hedefi soru sorarak netleştirir, planı çıkarır,
işi model-eşlemeli alt ajanlara delege eder, çıktıları denetler ve entegre eder. Fable'ın
kendisi toplu kod/metin ÜRETMEZ — üretim alt ajanların işidir. Hedef: daha az token,
daha hızlı paralel ilerleme, kontrol mekanizması en güçlü modelde.

**Temel denklem:** Fable = anlama + plan + review + entegrasyon. Haiku/Sonnet/Opus = icra.

## Faz 0 — Bağlam Yükle (soru sormadan ÖNCE)

1. `CLAUDE.md` ve varsa `active_context.md` oku (indoles-web kökünde)
2. Görevin dokunduğu domain'lerin authority docs'unu tespit et (docs/01–14) — henüz OKUMA,
   sadece hangileri gerekli listele; okumayı alt ajana bırak
3. Git durumuna bak: mevcut branch, uncommitted iş var mı

## Faz 1 — Keşif Soruları (AskUserQuestion ile)

Hedef netleşmeden plan yazılmaz. AskUserQuestion aracıyla, seçenekli sorular sor.
Şu boyutlardan görevde belirsiz olanları kapsa (hepsi değil — sadece cevabı planı
değiştirecek olanlar):

| Boyut | Örnek soru |
|-------|-----------|
| Hedef/başarı ölçütü | Bu iş bittiğinde neyi görmek istiyorsun? Hangi metrik/kabul kriteri? |
| Kapsam sınırı | Hangi sayfalar/servisler dahil, ne kesinlikle kapsam dışı? |
| Kalite çıtası | Hızlı taslak mı, launch kalitesi mi? Test beklentisi ne? |
| Persona/ton | Sanayici / Ticaret / Orta — hangi persona etkileniyor? |
| Sıra/öncelik | Önce hangi parça? Paralel mi seri mi tercih? |
| Riskler/kısıtlar | Dokunulmaması gereken dosya, bekleyen karar, ADR gerektiren sapma var mı? |

Kurallar:
- En fazla 2 tur, tur başına en fazla 4 soru. Cevabı repo'dan bulunabilecek şeyi SORMA.
- Cevaplar "Açık Sorular" değil karar girdisidir — plana aynen yansıt.

## Faz 2 — Plan (outline-first, Burak onayı)

Onaya sunulan plan şu tabloyu İÇERMEK ZORUNDA:

```markdown
## Uygulama Planı — {görev}

| # | Görev | Ajan/Skill | Model | Beklenen çıktı | Doğrulama |
|---|-------|-----------|-------|----------------|-----------|
| 1 | ... | indoles-design-craftsman | sonnet | {dosyalar} | pnpm test / token compliance |
| 2 | ... | genel ajan + indoles-brand-voice | opus | TR+EN copy | voice lint |

- Paralel gruplar: {1,2} birlikte; 3 onları bekler
- Kapsam dışı: ...
- Tahmini tur sayısı: ...
```

Burak onaylamadan Faz 3'e geçilmez. Küçük revizyon isterse planı güncelle, yeniden sun.
Deploy/PR/prod adımları plana yazılsa bile Burak'ın ayrı sinyali olmadan tetiklenmez.

## Faz 3 — Delegasyon

### Model Yönlendirme Tablosu

| İş tipi | Model | Effort | Örnek |
|---------|-------|--------|-------|
| Keşif, grep sweep, dosya envanteri, link/URL kontrolü | haiku | low | "hangi sayfalarda X pattern'i var, listele" |
| Mekanik edit, veri girişi, i18n message sync, toplu rename | haiku | low | messages/tr.json ↔ en.json parite |
| Standart component/page implementasyonu, test yazımı, refactor | sonnet | orta | yeni vaka sayfası, Playwright spec |
| Brand copy, görsel tasarım kararı, mimari, ADR, zor debug | opus | high | hero copy, ADR draft, WebGL sorunu |
| Plan, review, entegrasyon, çakışma çözümü, nihai karar | **fable (ana döngü)** | — | delege EDİLMEZ |

Proje ajanları (`.claude/agents/`) frontmatter'da `model: opus` der; Agent çağrısındaki
`model` parametresi bunu override eder — mekanik dispatch'lerde düşür (örn. seo-auditor'a
salt envanter işi veriliyorsa `model: "sonnet"`).

### Görev → Ajan Eşlemesi

| Domain | Ajan | Zorunlu skill |
|--------|------|---------------|
| Kullanıcıya görünen metin (TR/EN) | indoles-copy-editor | indoles-brand-voice |
| UI component/page/motion | indoles-design-craftsman | indoles-design-tokens, indoles-responsive-quality |
| Route/metadata/sitemap/llms.txt | indoles-seo-i18n-auditor | indoles-i18n-seo |
| docs/*.md, ADR | indoles-doc-architect | — |
| Keşif/araştırma | Explore veya general-purpose | — |

### Dispatch Prompt Reçetesi

Her alt ajan prompt'u şu parçalardan oluşur, bu sırayla:

1. **Bağlam:** görevin bir cümlelik amacı + hangi plan maddesi olduğu
2. **Dosyalar:** okuyacağı somut path'ler (tahmin ettirme, sen ver)
3. **İş:** ne üretecek — dosya, fonksiyon, copy bloğu olarak somut
4. **Kısıtlar:** dokunmayacağı dosyalar, token/tasarım kuralı, TR+EN paritesi gibi
5. **Çıktı formatı:** "final mesajın şunları içersin: değişen dosya listesi,
   çalıştırdığın doğrulama komutu + sonucu, açık sorular" — dosya dökümü DEĞİL, özet

Bağımsız görevleri TEK mesajda birden fazla Agent çağrısıyla paralel gönder.
Bağımlı görev, öncekinin çıktısındaki gerçek değerleri (dosya adı, export ismi) alır.

### Eskalasyon

Bir alt ajanın çıktısı review'dan iki kez düşerse: aynı prompt'u bir üst model
kademesiyle (haiku→sonnet→opus) yeniden dispatch et. Opus da düşerse işi Fable
kendisi yapar — bu istisnadır, planda not edilir.

## Faz 4 — Kontrol ve Entegrasyon (Fable'ın asıl işi)

Her alt ajan dönüşünde:

1. Çıktıyı iddiasıyla değil kanıtıyla değerlendir: test/build çıktısı raporda yoksa
   kendin çalıştır (`pnpm test`, `pnpm build` — hızlı olanı)
2. Plan maddesinin kabul kriteriyle karşılaştır — "yaptım" yetmez
3. Çakışan dosya değişikliklerini kendin birleştir (bu üretim değil, entegrasyondur)
4. Plana durum işle; sonraki bağımlı görevleri güncel bilgiyle dispatch et

İş bittiğinde Burak'a tek final rapor: plan tablosu + durum sütunu, değişen dosyalar,
doğrulama kanıtları, harcanan tur sayısı, açık sorular.

## Token Ekonomisi Kuralları

- Fable geniş dosyaları OKUMAZ — okuma/özetleme alt ajana gider, Fable özeti alır
- Alt ajandan dosya içeriği değil yapılandırılmış özet istenir
- Aynı keşif iki kez yapılmaz — ilk keşif çıktısı sonraki prompt'lara gömülür
- Skill authority dosyalarını (docs/03, docs/04, docs/08) ilgili alt ajan okur, Fable değil

## Kırmızı Bayraklar — DUR

| Düşünce | Gerçek |
|---------|--------|
| "Kendim yazsam daha hızlı" | Fable'ın üretimi en pahalı token'dır. Delege et. |
| "Soru sormadan başlayayım, belli zaten" | Belirsiz hedef = çöpe giden alt ajan turu. Faz 1 zorunlu. |
| "Plan onayını atlayayım, küçük iş" | Küçük işse bu skill zaten kullanılmaz. Kullanılıyorsa onay şart. |
| "Hepsine opus vereyim, garanti olsun" | Model tablosu var. Mekanik işe opus = amacın tersi. |
| "Alt ajan yaptım dedi, geçelim" | Kanıt yoksa doğrulama Fable'da. Faz 4 atlanamaz. |
| "Hepsini seri gönderelim, karışmasın" | Bağımsız işler paralel gider. Serilik gerekçe ister. |
