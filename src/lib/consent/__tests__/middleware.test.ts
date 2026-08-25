import { describe, it, expect } from "vitest";
import { NextResponse } from "next/server";
import { COUNTRY_HEADER, applyRegionCookie } from "../middleware";
import { REGION_COOKIE_NAME } from "../cookie";

function run(country: string | null): string | undefined {
  const headers = new Headers();
  if (country !== null) headers.set(COUNTRY_HEADER, country);
  const response = applyRegionCookie(headers, NextResponse.next());
  return response.cookies.get(REGION_COOKIE_NAME)?.value;
}

describe("applyRegionCookie", () => {
  it("EEA ülkesinde bölgeyi eea olarak işaretler", () => {
    expect(run("DE")).toBe("eea");
  });

  it("Birleşik Krallık'ta eea olarak işaretler", () => {
    expect(run("GB")).toBe("eea");
  });

  it("Türkiye'de other olarak işaretler", () => {
    expect(run("TR")).toBe("other");
  });

  it("coğrafi başlık yoksa other'a düşer", () => {
    // Lokal geliştirme ve Vercel dışı ortamlar. Kayıp yönü güvenli:
    // gtag'in kendi bölgesel varsayılanı IP'den bağımsız çalıştığı için
    // EEA ziyaretçisinin ölçümü yine açılmaz; yalnız banner görünmez.
    expect(run(null)).toBe("other");
  });

  it("çerezi tüm site için yazar", () => {
    const response = applyRegionCookie(
      new Headers({ [COUNTRY_HEADER]: "FR" }),
      NextResponse.next(),
    );
    expect(response.cookies.get(REGION_COOKIE_NAME)?.path).toBe("/");
  });

  it("gelen yanıtı korur — yeni yanıt üretmez", () => {
    // next-intl'in ürettiği yanıt (locale yönlendirmesi, başlıklar)
    // kaybolursa dil yönlendirmesi sessizce bozulur.
    const original = NextResponse.next();
    original.headers.set("x-test-marker", "kept");
    const result = applyRegionCookie(new Headers({ [COUNTRY_HEADER]: "TR" }), original);
    expect(result).toBe(original);
    expect(result.headers.get("x-test-marker")).toBe("kept");
  });
});
