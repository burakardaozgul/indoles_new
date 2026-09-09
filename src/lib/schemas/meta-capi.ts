import { z } from "zod";
import { SITE_URL } from "@/lib/seo/site";

/**
 * `/api/meta/capi` gövdesi.
 *
 * NEDEN HER ALAN KAPALI
 * ---------------------
 * Uç nokta herkese açık ve önündeki tek kapı rıza çerezi — ama çerezi
 * ziyaretçi kendisi yazabildiği için o bir kimlik doğrulaması DEĞİL, yalnız
 * rıza kaydı. Yani şemadan geçen her şey, doğrudan Meta veri kaynağına
 * yazılabilecek şey demektir. Bu yüzden burada "serbest metin" bırakılan her
 * alan bir suistimal yüzeyidir ve alanların tamamı kapalı kümeye çekildi
 * (güvenlik denetimi, 2026-09-09).
 *
 * `eventName` zaten kapalıydı; aynı gerekçe diğer üç alana uygulanmamıştı.
 */

/**
 * KİŞİSEL VERİ HİÇ KABUL EDİLMİYOR
 * --------------------------------
 * Şema önceden `email` ve `phone` kabul ediyordu; route bunları hash'leyip
 * ziyaretçinin IP ve User-Agent'ıyla birlikte Meta'ya iletiyordu. Ama
 * istemci bu alanları HİÇ göndermiyor (`meta-pixel.ts` → `sendToCapi`
 * yalnız `eventName`, `eventId`, `eventSourceUrl` ve `customData` yazar).
 * Yani yolu kullanabilecek tek taraf saldırgandı: üçüncü kişilerin
 * e-postalarını INDOLES'in Meta veri kaynağına `Lead` dönüşümü olarak
 * yazdırabilirdi. Alanlar kaldırıldı — işlevsel kayıp yok.
 *
 * `MetaUserData` (`lib/analytics/meta-capi.ts`) e-posta/telefonu taşımaya
 * devam ediyor: oradaki kullanım sunucu tarafında GÜVENİLİR bir kaynaktan
 * (form handler'ın kendi doğruladığı gönderim) beslenmek için duruyor.
 * Fark, verinin istemciden mi yoksa sunucunun kendi bildiği yerden mi
 * geldiğidir.
 */

/**
 * `custom_data` — `meta-events.ts`in ürettiği alanların tamamı, fazlası yok.
 *
 * Önceden `z.record(z.string(), z.unknown())` idi: herhangi bir anahtar,
 * herhangi bir derinlik, herhangi bir boyut Meta'ya olduğu gibi geçiyordu.
 * `.strict()` tanımadığı anahtarı reddeder, yani yeni bir parametre eklemek
 * isteyen önce buraya yazmak zorunda.
 */
const customDataSchema = z
  .object({
    content_type: z.enum(["service", "package", "case_study", "tool"]).optional(),
    content_ids: z.array(z.string().max(100)).max(10).optional(),
    content_category: z.string().max(100).optional(),
    value: z.number().finite().nonnegative().max(100_000_000).optional(),
    currency: z.enum(["TRY", "USD", "EUR"]).optional(),
  })
  .strict();

/**
 * Olayın gerçekleştiği sayfa — yalnız kendi sitemizden.
 *
 * Serbest bırakıldığında saldırgan Meta raporlarına başka alan adları
 * yazdırabilirdi; "hangi sayfa dönüştürüyor" verisi kirlenirdi.
 */
const eventSourceUrlSchema = z
  .string()
  .url()
  .max(500)
  .refine((raw) => {
    try {
      return new URL(raw).origin === new URL(SITE_URL).origin;
    } catch {
      return false;
    }
  }, "kendi origin'imiz dışında");

export const metaCapiSchema = z
  .object({
    /**
     * Olay adı serbest metin değil kapalı bir küme: doğrulanmazsa Meta veri
     * kaynağına keyfi olay adları yazılabilirdi. Liste `meta-events.ts`teki
     * eşlemenin ürettiği adlarla sınırlı.
     */
    eventName: z.enum(["Lead", "ViewContent"]),
    /** Pixel'deki `eventID` ile aynı olmalı — deduplication buna bağlı. */
    eventId: z.string().min(8).max(100),
    eventSourceUrl: eventSourceUrlSchema.optional(),
    customData: customDataSchema.optional(),
  })
  .strict();

export type MetaCapiInput = z.infer<typeof metaCapiSchema>;
