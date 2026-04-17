/**
 * React 19 encodes apostrophes and some chars in text nodes as HTML entities.
 * Email clients render entities identically to literal chars, but tests
 * comparing against source strings (TR/EN with apostrophes) need to decode.
 */
export function decodeEntities(html: string): string {
  return html
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
