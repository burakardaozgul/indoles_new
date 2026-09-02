/**
 * `GET /api/tools/diagnoo-status/[id]` — Diagnoo teşhis durumu ve önizleme
 * uç noktası. Spec §9 "Durum sorgulama", Görev 12.
 *
 * KİLİT SUNUCU SÖZLEŞMESİ (ADR-030 carry-note 3 ile aynı ilke): tam rapor
 * (`report`) yalnız bir lead zaten yazılmışken (`hasLead`) döner. Lead yoksa
 * ziyaretçi yalnız `snapshot`'ı (üç öncelikli boşluk + skor + kıyas — teaser)
 * görür; tam yol haritası, finansal ayrıntı ve semantik/vision bulguları
 * unlock formunu doldurmadan İSTEMCİYE HİÇ ULAŞMAZ.
 *
 * `[token]` route'undaki (`booking/[token]/route.ts`) `Ctx` deseni izleniyor.
 */
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDiagnostic, hasLead } from "@/lib/tools/diagnoo/repository";
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

export async function GET(_req: Request, ctx: Ctx): Promise<Response> {
  const { id } = await ctx.params;

  const { env } = getCloudflareContext();
  const db = (env as unknown as DiagnooRouteEnv).BOOKINGS_DB;

  const row = await getDiagnostic(db, id);
  if (!row) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  const leadCaptured = await hasLead(db, id);

  const body: StatusBody = {
    status: row.status,
    currentStep: row.currentStep,
    progressPct: row.progressPct,
    failReason: row.failReason,
    snapshot: row.report ? toSnapshot(row.report) : null,
    // Kilit: tam rapor yalnız lead zaten yazılmışken taşınır — ücretsiz
    // önizleme yüzeyi (bu uç nokta) tam raporu asla önceden sızdırmaz.
    report: leadCaptured ? row.report : null,
    leadCaptured,
  };

  return NextResponse.json(body, { status: 200 });
}
