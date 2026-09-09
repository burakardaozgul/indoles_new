/**
 * @vitest-environment jsdom
 *
 * `document.cookie` ve `location` gerekiyor.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  visitorId,
  captureFbclid,
  ensureMarketingIdentifiers,
  VISITOR_ID_COOKIE,
  FBCLID_COOKIE,
} from "../visitor-id";

function clearCookies() {
  for (const pair of document.cookie.split(";")) {
    const name = pair.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

function read(name: string): string | undefined {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m?.[1] ? decodeURIComponent(m[1]) : undefined;
}

function setSearch(search: string) {
  // jsdom'da `location.search` yazilamaz; URL'i tumden degistiriyoruz.
  window.history.replaceState({}, "", `/tr/hizmetler/cro${search}`);
}

beforeEach(() => {
  clearCookies();
  setSearch("");
});

afterEach(() => {
  clearCookies();
  vi.unstubAllGlobals();
});

describe("visitorId — kalici ziyaretci kimligi", () => {
  it("yokken uretir ve cereze yazar", () => {
    const id = visitorId();
    expect(id).toMatch(/^v1\./);
    expect(read(VISITOR_ID_COOKIE)).toBe(id);
  });

  it("varsa AYNI degeri dondurur — her cagrida yeni kimlik uretmez", () => {
    // Kritik: her cagrida yenilenirse `external_id` oturumlar arasi
    // eslestirme yapamaz ve alanin tum amaci kaybolur.
    const first = visitorId();
    const second = visitorId();
    expect(second).toBe(first);
  });

  it("var olan cerezi EZMEZ", () => {
    document.cookie = `${VISITOR_ID_COOKIE}=v1.onceden-var; path=/`;
    expect(visitorId()).toBe("v1.onceden-var");
  });
});

describe("captureFbclid — reklam tiklama kimligi", () => {
  it("URL'de fbclid varsa zaman damgasiyla saklar", () => {
    setSearch("?fbclid=ABC123");
    captureFbclid();
    const raw = read(FBCLID_COOKIE)!;
    const [ts, id] = raw.split(".");
    expect(id).toBe("ABC123");
    expect(Number(ts)).toBeGreaterThan(0);
  });

  it("fbclid yoksa hicbir sey yazmaz", () => {
    captureFbclid();
    expect(read(FBCLID_COOKIE)).toBeUndefined();
  });

  it("ikinci reklam tiklamasinda GUNCELLENIR — son tiklama kazanir", () => {
    // Meta'nin atif modeliyle ayni yonde.
    setSearch("?fbclid=ILK");
    captureFbclid();
    setSearch("?fbclid=IKINCI");
    captureFbclid();
    expect(read(FBCLID_COOKIE)).toMatch(/\.IKINCI$/);
  });

  it("organik ziyarette onceki tiklama kimligini SILMEZ", () => {
    // Ziyaretci reklamdan gelip sonra organik donerse atif kaybolmamali.
    setSearch("?fbclid=REKLAMDAN");
    captureFbclid();
    setSearch("");
    captureFbclid();
    expect(read(FBCLID_COOKIE)).toMatch(/\.REKLAMDAN$/);
  });

  it("Meta'nin _fbc cerezine DOKUNMAZ", () => {
    // Ayni cereze iki taraf yazarsa biri digerini bozar; Pixel onu yonetiyor.
    document.cookie = "_fbc=fb.1.111.PIXELIN; path=/";
    setSearch("?fbclid=BIZIM");
    captureFbclid();
    expect(read("_fbc")).toBe("fb.1.111.PIXELIN");
  });
});

describe("ensureMarketingIdentifiers", () => {
  it("ikisini birden hazirlar", () => {
    setSearch("?fbclid=XYZ");
    ensureMarketingIdentifiers();
    expect(read(VISITOR_ID_COOKIE)).toMatch(/^v1\./);
    expect(read(FBCLID_COOKIE)).toMatch(/\.XYZ$/);
  });

  it("tekrar cagrilmasi guvenli — kimlik degismez", () => {
    ensureMarketingIdentifiers();
    const id = read(VISITOR_ID_COOKIE);
    ensureMarketingIdentifiers();
    expect(read(VISITOR_ID_COOKIE)).toBe(id);
  });
});
