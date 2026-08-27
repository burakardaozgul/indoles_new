# ADR-012: Deploy Platformu SST/AWS → Vercel

**Durum:** **Superseded by ADR-024** (2026-08-27) — dağıtım Cloudflare Workers'a (OpenNext) taşındı, kanonik host `www.indoles.com.tr` oldu. Aşağıdaki karar tarihsel kayıttır; Vercel'e hiç deploy edilmedi.
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül

## Bağlam

`docs/05-tech-architecture.md` SST Ion + OpenNext + eu-central-1 AWS deploy'unu önerdi. Neden: tam kontrol, IaC disiplini, çok servisli stack yönetimi.

Sadeleştirme sonrası stack:
- 1 Next.js app, 2 API route, statik içerik
- Ayrı VPC/RDS/SQS gereksinimi yok
- Preview environment disiplini kritik

Bu profile Vercel tam uyuyor. AWS'ten kazanılan kontrol, ek operasyon maliyetine değmez.

## Karar

Vercel'e geçilir. SST config, CloudWatch entegrasyonu, Axiom log kaldırılır. Vercel built-in log + Sentry + PostHog yeter.

## Sonuç

**Olumlu:**
- Preview per-PR otomatik (`vercel.app` URL)
- Env management tek UI
- Edge + ISR built-in
- `sst`, `@axiomhq/js` dependency'leri kalkar
- AWS kurulum-bakım yükü sıfırlanır

**Olumsuz:**
- Lock-in riski (ayrı ADR gerektirmeden geri dönülebilir — codebase standard Next.js)
- Vercel maliyeti volume arttıkça artar (launch trafiğinde önemsiz)

## Yeniden değerlendirme tetikleyicileri

- Aylık maliyet >$500
- Data residency EU gereksinimi Vercel fra1 region'un dışına taşarsa
- Vercel platform değişikliği/fiyatlandırma düşmanca olursa
