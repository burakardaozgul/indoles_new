/**
 * JSON-LD basıcı.
 *
 * Tüm düğümler tek `@graph` altında toplanır: sayfada birden çok
 * `<script type="application/ld+json">` bulunması geçerli olsa da, `@id`
 * referanslarının (ör. Organization) çözülmesi tek grafikte garanti.
 *
 * `null` düğümler elenir — `faqLd` soru yoksa null dönüyor ve boş bir
 * FAQPage şeması Search Console'da uyarı üretiyor.
 */
export function JsonLd({ graph }: { graph: Array<object | null> }) {
  const nodes = graph.filter((node): node is object => node !== null);
  if (nodes.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(nodes) }}
    />
  );
}

/**
 * `<` karakterini unicode kaçışına çevirir.
 *
 * `JSON.stringify` `/` karakterini escape etmez: içeriğinde `</script>`
 * geçen bir metin script etiketinden çıkar ve kalanı HTML olarak parse
 * edilir. İçeriğimiz yazar denetiminde statik TS olduğu için bugün böyle
 * bir dizi yok, ama gömme noktasının kendisi bu garantiye dayanmamalı —
 * ileride bir SSS cevabına HTML örneği girmesi yeterli.
 *
 * Kaçış JSON dizesi içinde geçerli olduğundan şema anlamı değişmez.
 */
function serialize(nodes: object[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": nodes,
  }).replace(/</g, "\\u003c");
}
