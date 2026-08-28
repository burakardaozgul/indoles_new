# ADR-028 — Turnstile bayrakla devre dışı; savunma bal küpü + süre tuzağı

- **Tarih:** 2026-08-28
- **Statü:** Kabul edildi (geçici olması umuduyla — geri açma tetikleyicisi aşağıda)
- **Bağlam:** ADR-024 (Cloudflare Workers), `docs/runbooks/cutover-www-indoles.md`
- **Tetikleyen:** İletişim formu üç farklı ağda (masaüstü, mobil Wi-Fi, 5G) gönderilemedi

## Teşhis — kimin arızası olduğu ölçülerek bulundu

Belirtiler widget'ın hiç token üretmemesiydi. Şüpheliler tek tek elendi:

| Hipotez | Test | Sonuç |
|---|---|---|
| Hostname listesi eksik | Burak panelden doğruladı | Liste doğru — değil |
| Headless tarayıcı reddi | Gerçek Chrome ile denendi | Aynı hata — değil |
| Türkiye SNI/IP engeli | IPv4 edge'e `brunhild` SNI'sı ile TLS | **Geçerli sertifika döndü** — engel yok |
| Bizim widget yapılandırması | Cloudflare'in kendi dashboard girişi | **Aynı hatayla düşüyor** — değil |
| **Cloudflare DNS eksiği** | `brunhild.challenges.cloudflare.com` A kaydı: 1.1.1.1, 8.8.8.8, iki DoH | **A kaydı yok, yalnız AAAA** ✓ |

Kesin kanıt: asıl düşen challenge URL'si `--resolve` ile IPv4 edge'e zorlanınca
**HTTP 200 / 73 ms** döndü. Servis tamamen sağlıklı; eksik olan yalnız DNS'teki
A kaydı. Challenge platformu iki shard'la çalışıyor — `brunhild` (yalnız AAAA)
ve `hagen` (yalnız A) — ve widget bizi IPv6-only shard'a yönlendiriyor.

Sonuç: **IPv4-only ağlardaki ziyaretçiler** — Türkiye'de ev/ofis hatlarının
çoğunluğu — challenge sunucusunu çözemiyor ve form süresiz kilitli kalıyor.
Cloudflare Community'de birebir aynı hata başlığı mevcut; bir gün önce de
"Turnstile Challenge Issues" olayı yaşanıp "çözüldü" işaretlenmişti.

## Karar

Turnstile **kaldırılmadı, bayraklandı.** Tek kaynak `NEXT_PUBLIC_TURNSTILE_SITE_KEY`:

- Build'de anahtar yoksa: istemci widget'ı ve `challenges.cloudflare.com`
  script'ini hiç yüklemez, gönder düğmesi token beklemez, sunucu doğrulama
  istemez.
- Anahtar geri konunca: tüm Turnstile yolu aynen geri gelir. Kod silinmedi.

Launch bu bayrak **kapalı** yapılır. Bir üçüncü tarafın arıza takvimi launch
tarihini belirleyemez.

## Yerine geçen savunma

1. **Bal küpü** (`website` alanı): görsel olarak gizli, `tabIndex=-1`,
   `aria-hidden` — insan dolduramaz. Dolduran bot **sahte başarıya** düşer.
2. **Süre tuzağı** (`elapsedMs`): form yüklenmeden gönderilen (sinyal hiç yok)
   veya 2 saniyenin altında gönderilen istekler sahte başarıya düşer. Sekiz
   zorunlu alan + KVKK kutusu otomatik doldurmayla bile bu eşiğin altına
   inmiyor.
3. **Sahte başarı ilkesi:** bot işareti 4xx ile DEĞİL `200 {ok:true}` ile
   yanıtlanır ve mail gönderilmez. Açık hata, bota hangi alanın yakalandığını
   söyleyip formunu düzeltmeyi öğretir; sahte başarıda bot işinin bittiğini
   sanır.
4. **Cloudflare zone katmanı:** Bot Fight Mode ve WAF zaten önde duruyor;
   istenirse `/api/*` için hız sınırı kuralı eklenebilir (panel işi, ücretsiz
   planda 1 kural hakkı var).

Kabul edilen ödün: bal küpü + süre tuzağı, Turnstile'ın davranış analizinin
yerini tutmaz; hedefli/insan spam'i geçebilir. Karşılığında form **herkes
için çalışıyor** — bugünkü durumda Turnstile'lı form kimse için çalışmıyordu.

## Geri açma tetikleyicisi

Şu komut A kaydı döndürmeye başladığında bayrak geri açılabilir:

```bash
dig +short A brunhild.challenges.cloudflare.com @1.1.1.1
```

Geri açma: `.env.local`'de yorumlanan `NEXT_PUBLIC_TURNSTILE_SITE_KEY` satırını
aç → deploy → üç ağda (masaüstü, mobil, 5G) formun token ürettiğini doğrula.
Sunucu sırrı (`TURNSTILE_SECRET_KEY`) Cloudflare'de tanımlı bırakıldı.

## Sonuçlar

- `lib/security/anti-spam.ts` eklendi; iki rota önce spam sinyaline bakıyor
- Şemalarda `turnstileToken` artık opsiyonel; `website` + `elapsedMs` eklendi
- `ContactForm`, `EntryPopup` ve kök layout script'i bayrakla korunuyor
- Ana bileşen testleri bayrağı açık kurar (`vi.hoisted`); kapalı mod
  `contact-form.disabled.test.tsx`'te ayrıca test edilir
