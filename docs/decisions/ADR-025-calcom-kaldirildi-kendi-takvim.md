# ADR-025 — Cal.com kaldırıldı; rezervasyon kendi takvim sistemine taşınıyor

- **Durum:** Kabul edildi
- **Tarih:** 2026-08-27
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** İletişim sayfası UX denetimi (docs/13 ek bölüm) · canlıda Cal.com embed'i "Error Code: 404" gösteriyordu
- **İlgili:** docs/11 (funnel — orta taahhüt kanalı), ADR-021 (analytics sadeleşmesi)
- **Etkilenen dosyalar:** `src/app/(marketing)/[locale]/iletisim/page.tsx`, `src/components/marketing/CalcomEmbed.tsx` (silindi), `src/lib/calcom/` (silindi), `src/components/marketing/entry-popup/SuccessState.tsx`, `package.json` (`@calcom/embed-react` çıktı), `.env.example`, `messages/{tr,en}.json`, `CLAUDE.md` §4, `docs/05`, `docs/11`

---

## Bağlam

Orta taahhüt funnel kanalı (ön görüşme rezervasyonu) Cal.com Cloud embed'ine
bağlıydı. İki gerçek değişti:

1. **Cal.com hesabı kullanımdan kalktı.** `cal.com/indoles/gorusme` etkinliği
   yok; canlı sayfa ziyaretçiye çıplak İngilizce 404 hatası gösteriyordu —
   nav'daki "Görüşme rezerve et" CTA'sının hedefi ölüydü.
2. **INDOLES kendi takvim sistemini kurdu.** Entegrasyon yüzeyi (embed URL /
   harici link) henüz siteye bağlanmadı.

Ayrıca görüşme süresi vaadi tutarsızdı: sayfa "30 dakika", funnel dokümanı ve
saha gerçeği "1 saat" diyordu.

## Karar

1. Cal.com bütün izleriyle kaldırıldı: bileşen, prefill kütüphanesi, npm
   bağımlılığı, env değişkenleri, popup'taki ölü "Cal.com" dalı ve
   dokümantasyon referansları.
2. Kendi takvim sistemi hazır olana kadar **geçiş kurgusu form + doğrudan
   iletişimdir**: iletişim sayfası form-odaklı yeniden kuruldu; popup'ın
   "görüşme" yolu talep olarak düşer, slot daveti e-postayla gider.
3. Takvim entegrasyonu geldiğinde iletişim sayfasındaki form kolonunun yanına
   tek bileşenle eklenir (embed veya harici link — Burak'ın vereceği URL ile).
4. Görüşme süresi site genelinde **1 saat** olarak eşitlendi (sayfa
   title/H1/meta, ana sayfa finalCta, v2 outro, popup copy'si).
5. Kamuya açık e-posta `hello@indoles.com.tr` → `digital@indoles.com.tr`
   (COMPANY.email tek kaynak; llms, global-error, posta default'ları dahil).

## Sonuçlar

- Ziyaretçi hiçbir yüzeyde ölü takvim veya çıplak hata görmez; her CTA çalışan
  bir yola (form, e-posta, telefon) düşer.
- Rezervasyonun "kendisi slot seçer" konforu geçici olarak kayboldu — slot
  eşleştirme e-posta turuna döndü. Takvim entegrasyonu bu ADR'nin doğal devamı
  olarak ayrı bir değişiklikle gelecek.
- `docs/05`teki Cal.com akış şemaları tarihsel kaldı; tablo satırları ve
  external servis listesi güncellendi.
