import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

export async function POST(req: NextRequest) {
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  const body = await req.text();
  const secret = process.env.SANITY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }
  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body) as {
    _type?: string;
    slug?: { tr?: string; en?: string };
  };
  const paths = mapDocTypeToPaths(payload._type, payload.slug);
  for (const p of paths) revalidatePath(p);
  if (payload._type) revalidateTag(`sanity:${payload._type}`);

  return NextResponse.json({ revalidated: true, paths });
}

function mapDocTypeToPaths(
  type: string | undefined,
  slug: { tr?: string; en?: string } | undefined
): string[] {
  if (!type) return [];
  const tr = slug?.tr ?? "";
  const en = slug?.en ?? "";
  switch (type) {
    case "pillar":
      return [`/tr/hizmetler/${tr}`, `/en/services/${en}`, "/tr", "/en"];
    case "package":
      return [
        `/tr/paketler/${tr}`,
        `/en/packages/${en}`,
        "/tr/paketler",
        "/en/packages",
      ];
    case "caseStudy":
      return [
        `/tr/vakalar/${tr}`,
        `/en/case-studies/${en}`,
        "/tr/vakalar",
        "/en/case-studies",
      ];
    case "article":
      return [
        `/tr/yazilar/${tr}`,
        `/en/articles/${en}`,
        "/tr/yazilar",
        "/en/articles",
      ];
    case "consultantProfile":
      return [
        `/tr/danismanlar/${tr}`,
        `/en/consultants/${en}`,
        "/tr/danismanlar",
        "/en/consultants",
      ];
    case "homepageConfig":
    case "siteSettings":
    case "navigation":
      return ["/tr", "/en"];
    default:
      return [];
  }
}
