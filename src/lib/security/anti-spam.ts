/**
 * Turnstile'sız spam savunması (ADR-028).
 *
 * Turnstile bayrakla devre dışı: 2026-08-28'de Cloudflare'in challenge sunucusu
 * `brunhild.challenges.cloudflare.com` DNS'te A kaydını kaybetti (yalnız AAAA
 * kaldı) ve IPv4-only ağlardaki ziyaretçiler — Türkiye'de çoğunluk — widget'ı
 * hiç yükleyemez oldu. Ölçüldü: servis IPv4 edge'de sağlıklı (SNI zorlaması ile
 * HTTP 200), eksik olan yalnız DNS kaydı. Yani arıza bizim değil; ama launch
 * bir üçüncü tarafın düzeltme takvimine bağlanamaz.
 *
 * Bayrağın tek kaynağı `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: build'de yoksa istemci
 * widget render etmez, sunucu doğrulama istemez. Geri açmak = anahtarı
 * `.env.local`'e geri koyup yeniden build almak.
 */
export function turnstileEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

/**
 * Bir insanın sekiz zorunlu alanı doldurup KVKK kutusunu işaretlemesi otomatik
 * doldurmayla bile bu sürenin altına inmiyor; botlar ise ya anında gönderiyor
 * ya sayfayı hiç yüklemeden doğrudan API'ye vuruyor (elapsedMs hiç gelmiyor).
 */
const MIN_FILL_MS = 2000;

/**
 * Bot işareti döndürür; temizse null.
 *
 * Çağıran taraf işaret durumunda 4xx DEĞİL sahte başarı (200 ok) döndürmeli:
 * açık bir hata, bota hangi alanın yakalandığını söyleyip formunu düzeltmeyi
 * öğretir. Sahte başarıda bot işinin bittiğini sanır, kimse mail almaz.
 */
export function spamSignal(input: {
  website?: string | undefined;
  elapsedMs?: number | undefined;
}): 'honeypot' | 'no_timing' | 'too_fast' | null {
  // Bal küpü: alan görsel olarak gizli, insanlar dolduramaz.
  if (input.website) return 'honeypot';
  // JS çalıştırmadan doğrudan API'ye POST — formu hiç görmemiş.
  if (input.elapsedMs === undefined) return 'no_timing';
  if (input.elapsedMs < MIN_FILL_MS) return 'too_fast';
  return null;
}
