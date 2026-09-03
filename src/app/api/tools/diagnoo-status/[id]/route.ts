/**
 * `GET /api/tools/diagnoo-status/[id]` — Diagnoo teşhis durumu ve önizleme
 * uç noktası. Spec §9 "Durum sorgulama", Görev 12.
 *
 * KİLİT SUNUCU SÖZLEŞMESİ (ADR-030 carry-note 3 ile aynı ilke): tam rapor
 * (`report`) yalnız İSTEĞİN ÇEREZİNDEKİ kilit token'ı bu teşhisin bir lead
 * satırıyla eşleşirse döner. Eşleşme yoksa ziyaretçi yalnız `snapshot`'ı (üç
 * öncelikli boşluk + skor + kıyas — teaser) görür; tam yol haritası, finansal
 * ayrıntı ve semantik/vision bulguları unlock formunu doldurmadan İSTEMCİYE
 * HİÇ ULAŞMAZ.
 *
 * NEDEN `hasLead` DEĞİL (C1): teşhis satırı aynı URL için 24 saat yeniden
 * kullanılıyor. Kapı "bu teşhise bir lead düşmüş mü" diye sorsaydı, A'nın
 * açtığı kilit aynı adresi taratan B'ye de açılırdı. Kapı artık "bu
 * ziyaretçinin geçerli bir token'ı var mı" diye sorar.
 *
 * Kişiye özel rapor: lead kendi metrikleriyle yeniden hesaplanmış bir rapor
 * yazdırdıysa o döner, yoksa paylaşılan temel rapor.
 *
 * `[token]` route'undaki (`booking/[token]/route.ts`) `Ctx` deseni izleniyor.
 */
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDiagnostic, findLeadByToken } from "@/lib/tools/diagnoo/repository";
import { readUnlockToken } from "@/lib/tools/diagnoo/unlock-cookie";
import { toSnapshot, type SnapshotView, type DiagnooReport } from "@/lib/tools/diagnoo/schema";

export const runtime = "nodejs";

// GEO/booking rotalarındaki AYNI dar env tanımı.
type DiagnooRouteEnv = { BOOKINGS_DB: D1Database };

type Ctx = { params: Promise<{ id: string }> };

type StatusBody = {
  status: "queued" | "running" | "completed" | "failed";
  currentStep: string | null;
  progressPct: number;
  failReason: string | null;
  snapshot: SnapshotView | null;
  report: DiagnooReport | null;
  leadCaptured: boolean;
};

/**
 * Yanıt ziyaretçiye özel (kilit çerezine göre değişiyor) — ara katman ya da
 * tarayıcı önbelleği bir ziyaretçinin raporunu diğerine servis etmemeli.
 */
const NO_STORE = { "cache-control": "no-store" } as const;

export async function GET(req: Request, ctx: Ctx): Promise<Response> {
  const { id } = await ctx.params;

  const { env } = getCloudflareContext();
  const db = (env as unknown as DiagnooRouteEnv).BOOKINGS_DB;

  const row = await getDiagnostic(db, id);
  if (!row) {
    return NextResponse.json({ error: "not-found" }, { status: 404, headers: NO_STORE });
  }

  const token = readUnlockToken(req.headers.get("cookie"), id);
  const lead = token ? await findLeadByToken(db, id, token) : null;
  const leadCaptured = lead !== null;

  const body: StatusBody = {
    status: row.status,
    currentStep: row.currentStep,
    progressPct: row.progressPct,
    failReason: row.failReason,
    snapshot: row.report ? toSnapshot(row.report) : null,
    // Kilit: tam rapor yalnız bu ziyaretçinin token'ı geçerliyken taşınır —
    // ücretsiz önizleme yüzeyi (bu uç nokta) tam raporu asla önceden sızdırmaz.
    report: lead ? (lead.recomputedReport ?? row.report) : null,
    leadCaptured,
  };

  return NextResponse.json(body, { status: 200, headers: NO_STORE });
}
