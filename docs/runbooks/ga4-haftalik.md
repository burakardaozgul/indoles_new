# Runbook — Haftalık GA4 çekimi ve ölçüm özeti

> **Kime:** Burak · **Süre:** ~2 dakika (+5 dakika log) · **Sıklık:** her Pazartesi, GSC çekiminin hemen ardından
> **Karar dayanağı:** `docs/12-analytics-measurement.md` (olay sözlüğü §2.0, anahtar olaylar §2.8) · `docs/strateji/Yol-Haritasi-Satin-Alma-Niyeti-2026-09.md` §5 (form/brief ölçüsü) · `docs/strateji/GEO-Olcum-Rutini.md` (AI yönlendirmesi GEO turunun tamamlayıcısı) · ADR-034 / ADR-035 / ADR-038 (GA4'ün neyi görüp neyi görmediği)
> **Önkoşul:** Marketing klasörü erişilebilir olmalı (servis hesabı anahtarı GSC ile aynı dosya). Servis hesabı GA4 mülkü `553152492`'de en az **Görüntüleyici** (bugün Düzenleyici; script yalnız okur). Servis hesabının Google Cloud projesinde **Google Analytics Data API** ve **Google Analytics Admin API** etkin. Script Mac'ten doğrudan çalışır.

## Beş adım

1. `pnpm olcum:weekly` — önce GSC rutinini (`gsc:weekly`), sonra GA4 çekimini koşar. Yalnız GA4 için `pnpm ga4:pull`. Varsayılan pencere 28 gün, bitiş bugün-2 (GA4 işleme gecikmesi); AI serisi cutover'dan (2026-08-29) bitişe.
2. Çıktı `Marketing/GA4-Data/haftalik-<bugün>/`: dokuz CSV + `ozet.txt` + `meta.txt` (dosya listesi aşağıda).
3. `ozet.txt`'i aç — yedi bölüm hazır gelir: **haftalık toplam → kaynak dağılımı → AI yönlendirmeleri → form/brief → açılış sayfaları → anahtar olaylar → kapsam notu**. Mekanik uyarılar (olay `source`'u sızıntısı, düşük etkileşimli kaynak, işaretsiz lead olayı, ADR'lerde kayıtlı kusurlu günlerle kesişim) ilgili bölümün altında satır olarak çıkar.
4. `Marketing/GSC-Data/haftalik-log.md`'deki o günün kaydına **GA4 alt bölümünü** ekle (şablon aşağıda). Rakamlar `ozet.txt`'ten kopyalanır; üstüne yalnız yorum ve aksiyon yazılır.
5. Form/brief sayısını e-posta kutusuyla karşılaştır. GA4 gönderimi sayar, niteliği bilmez; **nitelikli** sayı log'a elle yazılır. Yol haritası hedefi ayda 5+ nitelikli.

## Komut varyantları

| Amaç                                       | Komut                                                           |
| ------------------------------------------ | --------------------------------------------------------------- |
| GSC + GA4 birlikte                         | `pnpm olcum:weekly`                                             |
| Yalnız GA4                                 | `pnpm ga4:pull`                                                 |
| Başka tarih aralığı                        | `node scripts/ga4-pull.mjs --start 2026-09-15 --end 2026-10-12` |
| AI serisini başka günden başlat            | `node scripts/ga4-pull.mjs --ai-start 2026-09-08`               |
| Deneme çekimi (gerçek klasörü kirletmeden) | `node scripts/ga4-pull.mjs --out /tmp/ga4-test`                 |
| Başka anahtar dosyası                      | `node scripts/ga4-pull.mjs --key "/yol/servis-hesabi.json"`     |
| Başka mülk                                 | `node scripts/ga4-pull.mjs --property 123456789`                |
| Saf fonksiyon testleri (ağ yok)            | `pnpm vitest run scripts/ga4-ozet.test.ts`                      |

## Çıktı dosyaları

| Dosya                | İçerik                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `gunluk.csv`         | Takvimin her günü: oturum, kullanıcı, yeni kullanıcı, etkileşimli oturum, etkileşim oranı, anahtar olay (oturumsuz gün 0 ile yazılır) |
| `kaynaklar.csv`      | Kaynak × ortam × kanal grubu × kampanya; `aiReferral` (E/H) ve `aiMotor` türetilmiş kolonları                                         |
| `kanallar.csv`       | GA4 varsayılan kanal grubu bazında oturum / kullanıcı / etkileşimli / anahtar olay                                                    |
| `kampanyalar.csv`    | utm_campaign × utm_source/medium × utm_content × utm_term (yalnız gerçek kampanya satırları)                                          |
| `ai-yonlendirme.csv` | AI serisi aralığında gün × kaynak × açılış sayfası; yalnız AI satırları                                                               |
| `sayfalar.csv`       | Açılış sayfası (sorgu dizesiyle) × oturum, etkileşimli, ort. süre, anahtar olay, kullanıcı; `niyetliTur` (hizmet / karar)             |
| `goruntuleme.csv`    | `pagePath` bazında sayfa görüntüleme                                                                                                  |
| `olaylar.csv`        | Olay × anahtar olay mı (E/H) × sayım, olayın geçtiği oturum, olay/oturum                                                              |
| `lead.csv`           | Geniş biçim: her gün bir satır, her lead olayı bir kolon, sonda `toplam` ve `anahtar_olay` satırları; hiç gelmeyen olay 0             |
| `ozet.txt`           | Haftalık log'a kopyalanacak özet                                                                                                      |
| `meta.txt`           | Mülk, aralık, veri akışları, anahtar olay kaynağı (Admin API / veri), GA4 örnekleme-eşikleme uyarıları, oluşturma zamanı              |

## Bilinmesi gerekenler

- **Yalnız okuma.** Kapsam `analytics.readonly`; Admin API'ye yalnız GET atılır (anahtar olay ve veri akışı listesi). Anahtar olay işaretlemek, kanal grubu kurmak gibi her yapılandırma değişikliği `pnpm ga4:setup`'ın (OAuth, `docs/runbooks/diagnoo-ga4-kurulum.md`) işidir ve Burak onayı ister.
- **Anahtar ve çıktı yolu kendi kendini bulur.** Sıra GSC ile aynı: `--key` → `~/Desktop/AA - INDOLES Creative & Marketing/Marketing/` → `~/mnt/Marketing/` → `GSC_KEY_PATH` env. Çıktı `GA4-Data/`, Marketing klasörünün altında; yoksa oluşturulur.
- **Gecikme.** GA4 veriyi 24-48 saatte işler; bitiş bu yüzden bugün-2. Daha yakın bir gün seçilirse son günler kısmi gelir ve sonraki çekimde değişir. `meta.txt` "dataState" satırına bunu yazar — GSC'deki `final` burada yok.
- **Haftalık pencere takvimle kurulur:** son 7 gün = bitiş-6…bitiş, önceki 7 gün = bitiş-13…bitiş-7. Kullanıcı sayısı günler arası toplanamaz (aynı kişi iki gün gelirse iki sayılır); haftalık kullanıcı GA4'ün pencere başına tekilleştirdiği ayrı sorgudan gelir. `kaynaklar` bölümündeki "Kullanıcı\*" ise kampanya satırlarının toplamıdır, tekil değildir.
- **`(not set)` ne demek.** Açılış sayfası `(not set)`: oturumda `page_view` yok (yalnız `user_engagement` gibi bir olay geldi). `utm_term (not set)`: bağlantı o parametreyi taşımıyor. `isKeyEvent (not set)`: olay anahtar olay değil — CSV'de `H` yazılır.
- **Onay etkisi (ADR-035).** Türkiye'de ve EEA/UK dışındaki bölgelerde dört onay sinyali varsayılan açık; TR trafiği şerit kararını beklemeden ölçülür. EEA/UK'de varsayılan kapalı: onay vermeyen ziyaretçi raporda yok ve bu hacimde Google'ın davranış modellemesi devreye girmez. Yani EEA/UK trafiği eksik yönde sayılır.
- **GTM bağımlılığı (ADR-034).** GA4 GTM'den yüklenir; reklam engelleyici GTM'i keserse oturum hiç ölçülmez. Hata yönü her zaman **az** ölçümdür. Lead'in Meta tarafı yalnız sunucudan gider (ADR-036), dolayısıyla GA4 ile Meta'daki lead sayıları birebir tutmak zorunda değil.
- **Kusurlu günler.** 2026-09-08 → 09-09 olay sayıları şişkin ve kırılımların yarısı `(not set)` (ADR-034); 09-09 12:00 UTC → 09-10 13:00 UTC `page_view` yok (ADR-037/038); 09-08 → 09-10 gelişmiş ölçüm yok (ADR-038). Pencere bunlarla kesişirse kapsam notu söyler — karşılaştırmada o günler dışlanır. Mülk 2026-09-08'de kuruldu: cutover (08-29) ile 09-07 arası GA4'te veri yok, "cutover'dan beri" fiilen 09-08'den beri demektir; özet bunu ilk veri gününden kendisi hesaplar.
- **Küçük hacim okuma kuralı.** Haftalık oturum iki haneli; tek bir ziyaret yüzdeleri oynatır. İki pencerede de 10'un altındaki sayılardan trend çıkarılmaz — özet bu deltaları "(küçük hacim)" diye işaretler. Log'a yüzde değil sayı yazılır ("AI payı %12,8" değil "6 / 47 oturum").
- **E-posta trafiği.** Bülten gönderildiği hafta `email / eposta` kaynağı oturum olarak şişer: e-posta güvenlik tarayıcıları bağlantıların hepsini (logo, alt bilgi dahil) önceden tıklar — her bağlantıya benzer sayıda tık, oturum = kullanıcı, etkileşim yok. Özet bu imzayı "düşük etkileşim" uyarısıyla gösterir (≥20 oturum ve etkileşim < %10). Kampanyanın insan karşılığı **etkileşimli oturum** ve anahtar olaydır; `utm_content` kırılımı hangi bağlantının gerçekten çalıştığını gösterir (EP-01 UTM şeması: `Marketing/E-Posta-Kampanyasi-01-AI-Donusumu.md` §2.5).
- **AI yönlendirmesi iki kaynaktan sınıflanır.** (1) `AI_KAYNAKLARI` listesi (`scripts/ga4-pull.mjs`; ChatGPT, Perplexity, Gemini, Copilot, Claude, You.com, Poe, Mistral, DeepSeek, Duck.ai, Grok, Meta AI). (2) GA4'ün kendi "AI Assistant" kanalı (ortam `ai-assistant`). Özet ikisinin farkını yazar: "yalnız GA4 kanalında" görünen bir kaynak listeye eklenmeli (test ile birlikte), "yalnız listede" görünen ise GA4'ün henüz AI saymadığı bir motordur. `bing.com`, `duckduckgo.com` ve `google` arama motorudur, AI sayılmaz — test bunu kilitliyor. Bu bölüm GEO turunun yerini tutmaz: tur cevapta görünüp görünmediğimizi, bu bölüm cevaptan tıklayıp gelen ziyareti ölçer.
- **Lead tanımı.** "Form" = Meta'ya `Lead` giden beş olay (`contact_form_submitted`, `contact_booking_submitted`, `popup_booking_submitted`, `popup_contact_submitted`, `tool_report_requested`); yol haritasının form/brief ölçüsü bunların toplamıdır. `phone_clicked` / `email_clicked` anahtar olaydır ama form değildir; `booking_cta_clicked` bilinçli olarak anahtar olay değildir (huni adımı). Liste koddaki iki otoriteye bağlı: `SITE_KEY_EVENTS` (`src/lib/analytics/ga4-admin.ts`) ve `LEAD_EVENTS` (`src/lib/analytics/meta-events.ts`). Biri değişir de script'teki `LEAD_OLAYLARI` güncellenmezse `ga4-ozet.test.ts` kırılır.
- **Olay `source` parametresi sızıntısı.** `booking_cta_clicked` (`source = nav` …) ve GTM'in `phone_clicked` / `email_clicked`'i (`tel-link` / `mailto-link`) `source` adlı bir parametre taşıyor; GA4 bu adı trafik kaynağı olarak da okuyabiliyor. Bu değerler `sessionSource` olarak görünürse özet uyarır — o oturumların gerçek kaynağı kaybolmuştur. Kalıcı çözüm parametre adını değiştirmek (kod + GTM + özel boyut); karar Burak'ta.
- **Kota.** Bir koşu 12 Data API (11 rapor + metadata) ve 2 Admin API isteği atar; mülkün günlük token kotasının çok altında. Kota ya da yetki hatasında script açık mesajla ve çıkış kodu 1 ile durur, klasöre yarım veri yazmaz.

## Haftalık log'a GA4 alt bölümü (öneri)

`Marketing/GSC-Data/haftalik-log.md` organik aramanın haftalık kaydı; GA4 aynı kaydın sonuna, **alarm durumundan önce** ayrı bir alt bölüm olarak girer. Böylece GSC'nin niyet bölümündeki "form/brief sayısı GA4'ten elle eklenir" satırı da buradan beslenir. Biçim:

```markdown
### GA4 (çekim aralığı <start> → <end>)

| Metrik             | Son 7 gün (<aralık>) | Önceki 7 gün (<aralık>) | Delta |
| ------------------ | -------------------- | ----------------------- | ----- |
| Oturum             |                      |                         |       |
| Etkileşimli oturum |                      |                         |       |
| Anahtar olay       |                      |                         |       |

- **Form/brief (28 gün):** GA4 <n> gönderim (olay adıyla) · nitelikli <m> (e-posta kutusu) — hedef 5+/ay.
- **AI yönlendirmesi:** dönem <n> oturum (<motor> <n>, …) · cutover'dan beri <n> · anahtar olay <n> · açılış sayfaları: <yol> (<n>), …
- **Niyetli içerik:** hizmet + karar sayfaları <n> oturum / <n> etkileşimli; öne çıkan sayfa.
- **Kampanya:** <kampanya> <n> oturum / <n> etkileşimli / <n> anahtar olay (`utm_content` ile öne çıkan bağlantı).
- **Uyarılar:** `ozet.txt`'teki mekanik uyarılar, tek satır (sızıntı, düşük etkileşim, işaretsiz lead olayı, kusurlu gün).
```

Kayıt kuralı: sayılar `ozet.txt`'ten birebir; 10'un altındaki değerler için "artış/düşüş" yazılmaz, yalnız sayı yazılır.
