import { describe, it, expect } from "vitest";
import { validateTargetUrl, fetchScanTargets, SCANNER_USER_AGENT } from "@/lib/tools/geo/safe-fetch";

describe("validateTargetUrl", () => {
  it.each([
    "ftp://x.com",
    "http://127.0.0.1/a",
    "http://[::1]/",
    "http://localhost:3000",
    "http://10.0.0.5/x",
    "http://gizli.internal/",
  ])("reddedilir: %s", (u) => expect(validateTargetUrl(u).ok).toBe(false));

  it("kendi API'miz reddedilir, kökümüz serbest", () => {
    expect(validateTargetUrl("https://www.indoles.com.tr/api/contact").ok).toBe(false);
    expect(validateTargetUrl("https://www.indoles.com.tr/tr").ok).toBe(true);
  });

  it("reddedilen her sonuç Localized reason taşır (tr+en, boş değil)", () => {
    const r = validateTargetUrl("http://localhost:3000");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason.tr.length).toBeGreaterThan(0);
      expect(r.reason.en.length).toBeGreaterThan(0);
      expect(r.reason.tr).not.toMatch(/[!]|[\u{1F300}-\u{1FAFF}]/u);
      expect(r.reason.en).not.toMatch(/[!]|[\u{1F300}-\u{1FAFF}]/u);
    }
  });

  it("ayrıştırılamayan dizge reddedilir", () => {
    expect(validateTargetUrl("bu bir url değil").ok).toBe(false);
  });

  it("*.local ve *.internal alt alan adları da reddedilir", () => {
    expect(validateTargetUrl("http://svc.local/").ok).toBe(false);
    expect(validateTargetUrl("http://a.b.internal/").ok).toBe(false);
  });

  it("IPv6 eşlemeli IPv4 (bracket içi) de IP-literal sayılır", () => {
    expect(validateTargetUrl("http://[::ffff:127.0.0.1]/").ok).toBe(false);
  });

  it("gerçek bir genel alan adı kabul edilir", () => {
    const r = validateTargetUrl("https://example.com/blog/yazi");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.url.href).toBe("https://example.com/blog/yazi");
  });
});

describe("fetchScanTargets", () => {
  it("2 MB sınırı: dev yanıt kesilir", async () => {
    const fake = ((input: RequestInfo | URL) =>
      Promise.resolve(
        new Response("x".repeat(3_000_000), { headers: { "content-type": "text/html" } })
      )) as typeof fetch;
    const out = await fetchScanTargets(new URL("https://x.com/a"), fake);
    expect(out.pageHtml.length).toBeLessThanOrEqual(2_000_000);
  });

  it("robots 404 → null, tarama düşmez", async () => {
    const fake = ((input: RequestInfo | URL) => {
      const u = String(input instanceof Request ? input.url : input);
      return Promise.resolve(
        u.endsWith("robots.txt") || u.endsWith("llms.txt")
          ? new Response("", { status: 404 })
          : new Response('<html lang="tr"></html>', { headers: { "content-type": "text/html" } })
      );
    }) as typeof fetch;
    const out = await fetchScanTargets(new URL("https://x.com/a"), fake);
    expect(out.robotsTxt).toBeNull();
    expect(out.pageHtml).toContain("<html");
  });

  it("robots ve llms 200 ise içerik döner", async () => {
    const fake = ((input: RequestInfo | URL) => {
      const u = String(input instanceof Request ? input.url : input);
      if (u.endsWith("robots.txt")) return Promise.resolve(new Response("User-agent: *\nAllow: /"));
      if (u.endsWith("llms.txt")) return Promise.resolve(new Response("# llms"));
      return Promise.resolve(
        new Response('<html lang="tr"></html>', { headers: { "content-type": "text/html" } })
      );
    }) as typeof fetch;
    const out = await fetchScanTargets(new URL("https://x.com/a"), fake);
    expect(out.robotsTxt).toContain("User-agent");
    expect(out.llmsTxt).toContain("llms");
  });

  it("sayfa 200 değilse target-unreachable fırlatılır", async () => {
    const fake = (() =>
      Promise.resolve(new Response("yok", { status: 500 }))) as typeof fetch;
    await expect(fetchScanTargets(new URL("https://x.com/a"), fake)).rejects.toThrow(
      "target-unreachable"
    );
  });

  it("sayfa content-type text/html değilse target-unreachable fırlatılır", async () => {
    const fake = (() =>
      Promise.resolve(
        new Response("{}", { headers: { "content-type": "application/json" } })
      )) as typeof fetch;
    await expect(fetchScanTargets(new URL("https://x.com/a"), fake)).rejects.toThrow(
      "target-unreachable"
    );
  });

  it("redirect sonrası hedef reddedilirse tarama düşer (SSRF: res.url yeniden doğrulanır)", async () => {
    const fake = (() => {
      const res = new Response('<html lang="tr"></html>', {
        headers: { "content-type": "text/html" },
      });
      Object.defineProperty(res, "url", { value: "http://127.0.0.1/internal", configurable: true });
      return Promise.resolve(res);
    }) as typeof fetch;
    await expect(fetchScanTargets(new URL("https://x.com/a"), fake)).rejects.toThrow(
      "target-unreachable"
    );
  });

  it("sayfa isteği ağ hatasıyla reddedilirse target-unreachable fırlatılır (ham hata sızmaz)", async () => {
    const fake = (() => Promise.reject(new TypeError("fetch failed"))) as typeof fetch;
    await expect(fetchScanTargets(new URL("https://x.com/a"), fake)).rejects.toThrow(
      "target-unreachable"
    );
  });

  it("robots.txt isteği ağ hatası verirse null'a düşer, tarama düşmez", async () => {
    const fake = ((input: RequestInfo | URL) => {
      const u = String(input instanceof Request ? input.url : input);
      if (u.endsWith("robots.txt")) return Promise.reject(new Error("ECONNRESET"));
      if (u.endsWith("llms.txt")) return Promise.resolve(new Response("", { status: 404 }));
      return Promise.resolve(
        new Response('<html lang="tr"></html>', { headers: { "content-type": "text/html" } })
      );
    }) as typeof fetch;
    const out = await fetchScanTargets(new URL("https://x.com/a"), fake);
    expect(out.robotsTxt).toBeNull();
    expect(out.pageHtml).toContain("<html");
  });

  it("her istek AbortSignal.timeout, redirect:follow ve doğru User-Agent taşır", async () => {
    const calls: Array<{ input: RequestInfo | URL; init: RequestInit | undefined }> = [];
    const fake = ((input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ input, init });
      return Promise.resolve(
        new Response('<html lang="tr"></html>', { headers: { "content-type": "text/html" } })
      );
    }) as typeof fetch;

    await fetchScanTargets(new URL("https://x.com/a"), fake);

    expect(calls.length).toBe(3);
    for (const { init } of calls) {
      expect(init?.redirect).toBe("follow");
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      const headers = init?.headers as Record<string, string>;
      expect(headers["User-Agent"]).toBe(SCANNER_USER_AGENT);
    }
    expect(SCANNER_USER_AGENT).toBe(
      "INDOLES-GEO-Denetleyici/1.0 (+https://www.indoles.com.tr/tr/araclar/geo-gorunurluk-denetleyicisi)"
    );
  });
});
