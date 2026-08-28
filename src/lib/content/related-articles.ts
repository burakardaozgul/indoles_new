import { ARTICLES } from "./articles";
import { TOPICS } from "./topics";
import type { ArticleContent } from "./types";

/**
 * Vaka → yazı köprüsü (denetim C-09, vaka yönü).
 *
 * Yazı → hizmet yönü zaten okunuyordu (`relatedArticlesForService`,
 * `service-detail.tsx`) — `topics.ts`teki `serviceSlug` eşlemesini konudan
 * hizmete izliyor. Vaka detayının ihtiyacı ters yönde: künyedeki
 * `serviceSlugs`ten geriye, o hizmetleri hedefleyen konuların yazılarına.
 *
 * Bir vaka birden fazla hizmeti künyesinde taşıyabilir (ör. MKComputer
 * `e-ticaret` ve `is-otomasyonlari`yı birlikte taşır); eşleşen konuların
 * yazıları tek havuzda toplanır, en yeni üçü basılır — `relatedArticlesForService`
 * ile aynı disiplin (doldurma yok, alakasız yazı basılmaz).
 */
export function relatedArticlesForCase(
  serviceSlugsTr: string[] | undefined,
): ArticleContent[] {
  if (!serviceSlugsTr || serviceSlugsTr.length === 0) return [];

  const topicIds = TOPICS.filter(
    (t) => t.serviceSlug !== null && serviceSlugsTr.includes(t.serviceSlug),
  ).map((t) => t.id);
  if (topicIds.length === 0) return [];

  return ARTICLES.filter((a) => topicIds.includes(a.topic))
    .slice()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);
}
