import { describe, it, expect } from "vitest";
import { PACKAGES } from "@/lib/content/packages";

const LOCALES = ["tr", "en"] as const;

/**
 * Paket SSS kalite kuralları.
 *
 * Hizmet sayfalarında (`services-content.test.ts`) kodlanmış iki kural —
 * anafora yasağı ve 40 kelime alt sınırı — burada da uygulanır; SSS pasajları
 * site genelinde aynı disipline tabi.
 *
 * ADR-022 ile persona ekseni bu alandan kalktı: `FAQPage` şeması tek varyant
 * basıyordu ve ticaret merceğindeki ziyaretçinin ekranda okuduğu cevapla
 * Google'a giden cevap ayrışıyordu. Cevaplar orta tonda tek metne indi.
 * Buranın yeni kuralı, o orta tonun ölçülebilir tanımı: **doğrudan hitap
 * yok** — hizmet sayfalarının SSS kaydında da (ölçüldü) ne "siz/sen" ne
 * "you/your/we/our" geçiyor; özne INDOLES.
 */
describe("PACKAGES SSS", () => {
  it("her pakette en az 10 soru var", () => {
    for (const p of PACKAGES) {
      expect(p.faq.length, p.slug.tr).toBeGreaterThanOrEqual(10);
    }
  });

  it("sorular paket içinde tekrar etmiyor", () => {
    for (const p of PACKAGES) {
      for (const loc of LOCALES) {
        const questions = p.faq.map((f) => f.question[loc]);
        expect(
          new Set(questions).size,
          `${p.slug.tr}/${loc} soru tekrarı`
        ).toBe(questions.length);
      }
    }
  });

  it("her sorunun iki dili de dolu", () => {
    for (const p of PACKAGES) {
      for (const f of p.faq) {
        for (const loc of LOCALES) {
          expect(f.question[loc], `${p.slug.tr}/${loc} soru`).toBeTruthy();
          expect(
            f.answer[loc],
            `${p.slug.tr}/${loc}: "${f.question.tr}"`
          ).toBeTruthy();
        }
      }
    }
  });

  it("cevaplar anafora ile başlamıyor", () => {
    // Alıntılandığında kendine yetmeli (docs/08 §8.1): AI motoru pasajı
    // bağlamından kopardığında "Bu" neyin yerine geçtiği kaybolur.
    const anaphora = /^(Bu|Bunlar|Bunu|Şu|O |Onlar|It |This |That |These |Those )/;
    for (const p of PACKAGES) {
      for (const f of p.faq) {
        for (const loc of LOCALES) {
          expect(
            anaphora.test(f.answer[loc].trim()),
            `${p.slug.tr}/${loc}: "${f.question[loc]}"`
          ).toBe(false);
        }
      }
    }
  });

  it("cevaplar en az 40 kelime", () => {
    for (const p of PACKAGES) {
      for (const f of p.faq) {
        for (const loc of LOCALES) {
          const words = f.answer[loc].trim().split(/\s+/).length;
          expect(
            words,
            `${p.slug.tr}/${loc}: "${f.question[loc]}"`
          ).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });

  it("cevaplarda doğrudan hitap yok — orta ton (ADR-022)", () => {
    // Persona-aware dönemde sanayi varyantı "siz", ticaret varyantı "sen"
    // kullanıyordu. Orta ton ikisini de bırakır; hizmet sayfalarının SSS
    // kaydı da böyle (o dosyalarda sıfır hitap ölçüldü).
    const banned = {
      tr: /\b(siz|size|sizin|sizi|sizde|sizden|sen|sana|senin|seni|sende|senden)\b/i,
      en: /\b(you|your|yours|we|our|ours|us)\b/i,
    } as const;

    for (const p of PACKAGES) {
      for (const f of p.faq) {
        for (const loc of LOCALES) {
          const hit = f.answer[loc].match(banned[loc]);
          expect(
            hit?.[0] ?? null,
            `${p.slug.tr}/${loc}: "${f.question[loc]}"`
          ).toBeNull();
        }
      }
    }
  });

  it("aynı soru iki pakette geçse bile cevaplar ayrışıyor", () => {
    /**
     * Üç soru metni birden fazla pakette birebir aynı ("Fiyata neler dahil
     * değil?", "Fiyat sabit mi…", "Bu paket kimler için uygun değil?").
     * Birleştirme sırasında bir paketin cevabı yanlışlıkla diğerine
     * yazılmıştı; bu test o hatayı yakalar. Aynı soruya aynı cevap, iki
     * paketin kapsamının aynı olduğu anlamına gelir — ki değil.
     */
    const byQuestion = new Map<string, Array<{ pkg: string; answer: string }>>();
    for (const p of PACKAGES) {
      for (const f of p.faq) {
        const key = `${f.question.tr}`;
        byQuestion.set(key, [
          ...(byQuestion.get(key) ?? []),
          { pkg: p.slug.tr, answer: f.answer.tr },
        ]);
      }
    }

    for (const [question, entries] of byQuestion) {
      if (entries.length < 2) continue;
      const answers = new Set(entries.map((e) => e.answer));
      expect(
        answers.size,
        `"${question}" — ${entries.map((e) => e.pkg).join(", ")} aynı cevabı taşıyor`
      ).toBe(entries.length);
    }
  });
});
