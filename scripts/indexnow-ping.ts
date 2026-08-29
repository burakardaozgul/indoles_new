/**
 * IndexNow ping — sitemap'teki tüm URL'leri api.indexnow.org'a bildirir.
 *
 * Neden: ChatGPT'nin arama indeksi Bing'dir ve Bing IndexNow'u birincil
 * keşif kanalı olarak kullanır — GEO görünürlüğünün yarısı bu kanala bağlı
 * (strateji §5, T-11/S-02). Site SSG olduğu için "değişen URL" kavramı
 * deploy anında bilinmez; 136 URL'lik tam liste gönderilir — IndexNow
 * için idempotenttir ve limitlerin (10.000 URL/istek) çok altındadır.
 *
 * Anahtar dosyası `public/<KEY>.txt` olarak barındırılır (protokol gereği
 * herkese açıktır, sır değildir). Anahtar değişirse iki yer birlikte
 * güncellenir: aşağıdaki sabit + public'teki dosya adı ve içeriği.
 *
 * Kullanım: `pnpm seo:indexnow` (cf:deploy zincirinin sonunda otomatik) ·
 * `pnpm seo:indexnow --base https://preview.indoles.com.tr` yalnız sitemap
 * kaynağını değiştirir, bildirim yine kanonik host adına yapılır.
 */

const HOST = "www.indoles.com.tr";
const KEY = "3ca954102189ce68ac53510ae6a35b09";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

function baseFromArgs(): string {
  const i = process.argv.indexOf("--base");
  const value = i >= 0 ? process.argv[i + 1] : undefined;
  return value ? value.replace(/\/$/, "") : `https://${HOST}`;
}

async function main(): Promise<void> {
  const base = baseFromArgs();
  const res = await fetch(`${base}/sitemap.xml`);
  if (!res.ok) {
    throw new Error(`sitemap alınamadı: ${res.status} ${base}/sitemap.xml`);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error("sitemap boş — hiç <loc> yok");

  // Anahtar dosyasının canlıda erişilebilir olduğunu bildirimden önce doğrula;
  // dosya 404 ise motorlar tüm listeyi sessizce çöpe atar.
  const keyRes = await fetch(KEY_LOCATION);
  const keyBody = (await keyRes.text()).trim();
  if (!keyRes.ok || keyBody !== KEY) {
    throw new Error(
      `anahtar dosyası doğrulanamadı: ${KEY_LOCATION} → ${keyRes.status} (deploy edilmiş mi?)`
    );
  }

  const ping = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  });
  // Protokol: 200 = işlendi, 202 = alındı (anahtar doğrulaması beklemede).
  if (ping.status === 200 || ping.status === 202) {
    console.log(`IndexNow: ${urls.length} URL bildirildi — HTTP ${ping.status}`);
  } else {
    throw new Error(`IndexNow reddetti: HTTP ${ping.status} ${await ping.text()}`);
  }
}

main().catch((err) => {
  console.error(`[indexnow] ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
