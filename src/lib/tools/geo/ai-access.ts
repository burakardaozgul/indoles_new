/**
 * GEO kontrolü — AI erişimi: robots.txt üzerinden bilinen AI botlarının
 * taranabilirliğini ölçer. Spec §2, Görev 2.
 *
 * Çözüm kuralı (basitleştirilmiş-deterministik, tam robots.txt standardı
 * değil): satır satır ayrıştırılır → ardışık `User-agent` satırları tek grup
 * oluşturur. Her bot için adı birebir (case-insensitive) geçen grup
 * kullanılır; yoksa `*` grubuna düşülür. Grup içinde hedef path için en uzun
 * eşleşen Allow/Disallow kuralı kazanır (uzunluk eşitse Allow); hiçbir kural
 * eşleşmezse izinli sayılır. `$` (satır sonu) ve `*` (joker) desteklenir.
 */

import { Localized } from "@/lib/content/types";
import { GeoCheckResult, statusFor } from "@/lib/tools/geo/types";

export const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
] as const;

const MAX_SCORE = 25;

type RuleType = "allow" | "disallow";

type Rule = {
  type: RuleType;
  pattern: string;
  regex: RegExp;
};

type Group = {
  agents: string[];
  rules: Rule[];
};

/** Regex özel karakterlerini escape eder (joker `*` zaten ayrıca ele alınır). */
function escapeRegexLiteral(segment: string): string {
  return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * robots.txt path kalıbını regex'e çevirir: `*` → herhangi bir dizi,
 * sondaki `$` → satır sonu çıpası, diğer her şey literal.
 */
function ruleToRegex(pattern: string): RegExp {
  const hasEndAnchor = pattern.endsWith("$");
  const body = hasEndAnchor ? pattern.slice(0, -1) : pattern;
  const escaped = body.split("*").map(escapeRegexLiteral).join(".*");
  return new RegExp(`^${escaped}${hasEndAnchor ? "$" : ""}`);
}

/** robots.txt metnini User-agent gruplarına ayrıştırır. */
function parseRobots(robotsTxt: string): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  // Geçerli grup için bir Allow/Disallow satırı görüldü mü — değeri boş olsa
  // bile grup sınırını belirlemek için kullanılır (bkz. aşağıdaki not).
  let currentHasDirective = false;

  for (const rawLine of robotsTxt.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const field = line.slice(0, colonIndex).trim().toLowerCase();
    const value = line.slice(colonIndex + 1).trim();

    if (field === "user-agent") {
      // Ardışık User-agent satırları tek grup oluşturur; bir önceki grup
      // zaten bir yönerge gördüyse yeni bir grup başlar.
      if (!current || currentHasDirective) {
        current = { agents: [], rules: [] };
        groups.push(current);
        currentHasDirective = false;
      }
      current.agents.push(value);
    } else if (field === "allow" || field === "disallow") {
      if (!current) continue; // gruptan önceki başıboş kural yok sayılır
      currentHasDirective = true;
      // Değeri boş olan Allow/Disallow satırı ("Disallow:") robots.txt
      // konvansiyonunda "bu grup için kısıt yok" anlamına gelir — eşleşme
      // kuralı listesine girmez. Aksi halde boş desen `^` regex'ine dönüşüp
      // her path'i eşleştirir ve "Disallow:" yanlışlıkla tüm siteyi engeller.
      if (value === "") continue;
      current.rules.push({ type: field, pattern: value, regex: ruleToRegex(value) });
    }
  }

  return groups;
}

/** Bot adına en uygun grubu bulur: birebir eşleşme, yoksa `*`. */
function selectGroup(crawler: string, groups: Group[]): Group | undefined {
  const named = groups.find((g) =>
    g.agents.some((agent) => agent.toLowerCase() === crawler.toLowerCase())
  );
  if (named) return named;
  return groups.find((g) => g.agents.some((agent) => agent === "*"));
}

/** Grup kuralları içinde hedef path için en uzun eşleşen kuralı uygular. */
function isAllowed(group: Group | undefined, urlPath: string): boolean {
  if (!group) return true;

  let best: Rule | undefined;
  for (const rule of group.rules) {
    if (!rule.regex.test(urlPath)) continue;
    const isLonger = !best || rule.pattern.length > best.pattern.length;
    const isTieWonByAllow =
      best && rule.pattern.length === best.pattern.length && rule.type === "allow" && best.type !== "allow";
    if (isLonger || isTieWonByAllow) {
      best = rule;
    }
  }

  return !best || best.type === "allow";
}

export function checkAiAccess(robotsTxt: string | null, urlPath: string): GeoCheckResult {
  if (robotsTxt === null) {
    const summary: Localized<string> = {
      tr: "robots.txt bulunamadı; bu, tüm AI botlarına varsayılan olarak açık erişim anlamına gelir.",
      en: "No robots.txt was found; this defaults to open access for all AI bots.",
    };
    const findings: Array<Localized<string>> = [
      {
        tr: "Erişim izinli ama beyansız: robots.txt yok, botlara yönelik niyet belgelenmemiş.",
        en: "Access is allowed but undeclared: no robots.txt exists to state that intent.",
      },
    ];
    return {
      id: "ai-access",
      score: MAX_SCORE,
      max: MAX_SCORE,
      status: statusFor(MAX_SCORE, MAX_SCORE),
      summary,
      findings,
    };
  }

  const groups = parseRobots(robotsTxt);
  const blocked = AI_CRAWLERS.filter((crawler) => !isAllowed(selectGroup(crawler, groups), urlPath));
  const allowedCount = AI_CRAWLERS.length - blocked.length;
  const score = Math.round((MAX_SCORE * allowedCount) / AI_CRAWLERS.length);

  const blockedSuffixTr = blocked.length > 0 ? `; ${blocked.join(", ")} engelli` : "";
  const blockedSuffixEn = blocked.length > 0 ? `; ${blocked.join(", ")} blocked` : "";
  const summary: Localized<string> = {
    // "${allowedCount}'i" gibi ek-bitişik bir kalıp 0-10 aralığının çoğunda
    // yanlış ünlü uyumu üretir (ör. 9 için doğrusu "9'u", "9'i" değil).
    // Rakama ek eklemeyen, değişmez bir kalıp kullanılır.
    tr: `${AI_CRAWLERS.length} bilinen AI botundan ${allowedCount} tanesi bu sayfaya erişebiliyor${blockedSuffixTr}.`,
    en: `${allowedCount} of ${AI_CRAWLERS.length} known AI bots can access this page${blockedSuffixEn}.`,
  };

  const findings: Array<Localized<string>> = [];
  if (blocked.length > 0) {
    findings.push({
      tr: `Engelli botlar: ${blocked.join(", ")}.`,
      en: `Blocked bots: ${blocked.join(", ")}.`,
    });
  }

  return {
    id: "ai-access",
    score,
    max: MAX_SCORE,
    status: statusFor(score, MAX_SCORE),
    summary,
    findings,
  };
}
