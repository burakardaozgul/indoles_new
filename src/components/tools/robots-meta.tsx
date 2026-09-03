"use client";

import { useEffect } from "react";

/**
 * `<meta name="robots">` senkronu — Diagnoo ve GEO araçları TEK sayfada bir
 * durum makinesiyle ilerler (`history.replaceState`, sayfa geçişi YOK). URL
 * çubuğu tarama bitince rapor/sonuç adresine döner ama DOM'daki `<meta
 * name="robots">` sunucunun İLK render'da bastığı değerde kalır: doğrudan o
 * rapor/sonuç adresini ziyaret eden bir bot `noindex, follow` görürken, aynı
 * sayfada aracı kullanıp oraya "akan" bir bot hâlâ araç sayfasının
 * (indekslenebilir) etiketini görür — iki yol AYNI adrese farklı robots
 * direktifiyle ulaşmış olur.
 *
 * Bu bileşen o farkı kapatır: mount'ta etiketi (yoksa oluşturup) `content`e
 * günceller, unmount'ta (aşama idle'a dönünce) eski değeri geri yazar — ya da
 * etiketi kendisi oluşturduysa tamamen kaldırır. Sunucunun
 * `generateMetadata`si BURADAN etkilenmez: bu yalnız istemci tarafında, aynı
 * sayfa ömrü içindeki geçişler için bir DOM yaması.
 */
export function RobotsMeta({ content }: { content: string }): null {
  useEffect(() => {
    let tag = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const created = tag === null;
    const previous = tag?.content;

    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "robots";
      document.head.appendChild(tag);
    }
    tag.content = content;

    return () => {
      if (created) {
        tag?.remove();
      } else if (tag && previous !== undefined) {
        tag.content = previous;
      }
    };
  }, [content]);

  return null;
}
