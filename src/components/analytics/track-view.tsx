"use client";

import * as React from "react";
import { track } from "@/lib/analytics/ga";
import type { AnalyticsEvent } from "@/lib/analytics/events";

/**
 * Görüntüleme olayını yazan, hiçbir şey render etmeyen istemci adası.
 *
 * NEDEN AYRI BİR BİLEŞEN
 * ----------------------
 * Sayfalar RSC ve öyle kalmalı — `"use client"` koymak SSG'yi bozmaz ama
 * sayfanın tamamını istemci paketine taşır. Bu ada yalnız bir `useEffect`
 * taşır; sayfa sunucuda kalır, olay istemcide yazılır.
 *
 * NEDEN GA4'ÜN `page_view`İ YETMİYOR
 * ----------------------------------
 * `page_view` yolu bilir, **boyutu** bilmez: bir vakanın hangi pillar'a ve
 * hangi problem tipine ait olduğunu, bir paketin fiyatını GA4 kendiliğinden
 * bilemez. Strateji §9'un KPI'ları bu kırılımları istiyor. Sayfa kimliği
 * zaten `page_location` ile geldiği için burada yalnız boyutlar taşınır.
 *
 * Olay bir kez yazılır: `useEffect`in bağımlılık dizisi boş. Aynı sayfada
 * ikinci kez sayılan görüntüleme funnel oranlarını sessizce şişirir.
 */
export function TrackView({ event }: { event: AnalyticsEvent }) {
  // Olay nesnesi her render'da yeniden kurulduğu için bağımlılığa konamaz;
  // ref ilk değeri sabitler ve effect boş dizi ile bir kez çalışır.
  const first = React.useRef(event);

  React.useEffect(() => {
    track(first.current);
  }, []);

  return null;
}
