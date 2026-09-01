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

  it.each([
    "http://indoles.com.tr./api/contact",
    "http://localhost./",
    "http://svc.local./",
    "http://a.b.internal./",
  ])("trailing-dot FQDN bypass'ı reddedilir: %s", (u) => expect(validateTargetUrl(u).ok).toBe(false));

  // I1 (final review, deferred Görev 7 notu): `/\.$/` yalnız TEK bir sonek
  // noktası kırpıyordu — `http://localhost../` gibi ÇOK-nokta biçimleri
  // `localhost.` olarak normalize olup dört predicate'in hiçbirine uymadan
  // sızıyordu. `/\.+$/` ile bu sınıfın tamamı kapanır.
  it.each([
    "http://localhost../",
    "http://localhost.../",
    "http://svc.local../",
    "http://a.b.internal../",
    "http://indoles.com.tr../api/contact",
  ])("çok-nokta trailing FQDN bypass'ı reddedilir: %s", (u) => expect(validateTargetUrl(u).ok).toBe(false));

  it("çift öncü slash ile /api/ bypass edilemez", () => {
    expect(validateTargetUrl("https://www.indoles.com.tr//api/contact").ok).toBe(false);
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

  it("redirect: public→public tek hop izlenir", async () => {
    const fake = ((input: RequestInfo | URL) => {
      const u = String(input instanceof Request ? input.url : input);
      if (u === "https://x.com/a") {
        return Promise.resolve(
          new Response(null, { status: 302, headers: { location: "https://x.com/b" } })
        );
      }
      if (u === "https://x.com/b") {
        return Promise.resolve(
          new Response('<html lang="tr"></html>', { headers: { "content-type": "text/html" } })
        );
      }
      return Promise.resolve(new Response("", { status: 404 })); // robots/llms
    }) as typeof fetch;
    const out = await fetchScanTargets(new URL("https://x.com/a"), fake);
    expect(out.pageHtml).toContain("<html");
  });

  it("redirect: public→localhost hop'u reddedilir (ara sekme, son URL değil)", async () => {
    const fake = ((input: RequestInfo | URL) => {
      const u = String(input instanceof Request ? input.url : input);
      if (u === "https://x.com/a") {
        return Promise.resolve(
          new Response(null, { status: 302, headers: { location: "http://127.0.0.1/secret" } })
        );
      }
      return Promise.resolve(new Response("", { status: 404 }));
    }) as typeof fetch;
    await expect(fetchScanTargets(new URL("https://x.com/a"), fake)).rejects.toThrow(
      "target-unreachable"
    );
  });

  it("redirect: tam 3 hop izlenir, 4. hop gerekmeden başarı", async () => {
    const hopMap: Record<string, string> = {
      "https://x.com/a": "https://x.com/b",
      "https://x.com/b": "https://x.com/c",
      "https://x.com/c": "https://x.com/d",
    };
    const fake = ((input: RequestInfo | URL) => {
      const u = String(input instanceof Request ? input.url : input);
      if (u in hopMap) {
        return Promise.resolve(
          new Response(null, { status: 302, headers: { location: hopMap[u] as string } })
        );
      }
      if (u === "https://x.com/d") {
        return Promise.resolve(
          new Response('<html lang="tr"></html>', { headers: { "content-type": "text/html" } })
        );
      }
      return Promise.resolve(new Response("", { status: 404 }));
    }) as typeof fetch;
    const out = await fetchScanTargets(new URL("https://x.com/a"), fake);
    expect(out.pageHtml).toContain("<html");
  });

  it("redirect: 4 hop zinciri reddedilir (en fazla 3 hop izin verilir)", async () => {
    const hopMap: Record<string, string> = {
      "https://x.com/a": "https://x.com/b",
      "https://x.com/b": "https://x.com/c",
      "https://x.com/c": "https://x.com/d",
      "https://x.com/d": "https://x.com/e",
    };
    const fake = ((input: RequestInfo | URL) => {
      const u = String(input instanceof Request ? input.url : input);
      if (u in hopMap) {
        return Promise.resolve(
          new Response(null, { status: 302, headers: { location: hopMap[u] as string } })
        );
      }
      if (u === "https://x.com/e") {
        return Promise.resolve(
          new Response('<html lang="tr"></html>', { headers: { "content-type": "text/html" } })
        );
      }
      return Promise.resolve(new Response("", { status: 404 }));
    }) as typeof fetch;
    await expect(fetchScanTargets(new URL("https://x.com/a"), fake)).rejects.toThrow(
      "target-unreachable"
    );
  });

  it("sayfa gövdesi okunurken hata verirse target-unreachable fırlatılır (ham hata sızmaz)", async () => {
    const brokenBody = new ReadableStream<Uint8Array>({
      pull() {
        return Promise.reject(new DOMException("The operation was aborted.", "AbortError"));
      },
    });
    const fake = (() =>
      Promise.resolve(new Response(brokenBody, { headers: { "content-type": "text/html" } }))) as typeof fetch;
    await expect(fetchScanTargets(new URL("https://x.com/a"), fake)).rejects.toThrow(
      "target-unreachable"
    );
  });

  it("robots.txt gövdesi okunurken hata verirse null'a düşer, tarama düşmez", async () => {
    const brokenBody = new ReadableStream<Uint8Array>({
      pull() {
        return Promise.reject(new DOMException("The operation was aborted.", "AbortError"));
      },
    });
    const fake = ((input: RequestInfo | URL) => {
      const u = String(input instanceof Request ? input.url : input);
      if (u.endsWith("robots.txt")) return Promise.resolve(new Response(brokenBody));
      if (u.endsWith("llms.txt")) return Promise.resolve(new Response("", { status: 404 }));
      return Promise.resolve(
        new Response('<html lang="tr"></html>', { headers: { "content-type": "text/html" } })
      );
    }) as typeof fetch;
    const out = await fetchScanTargets(new URL("https://x.com/a"), fake);
    expect(out.robotsTxt).toBeNull();
    expect(out.pageHtml).toContain("<html");
  });

  it("robots.txt 2 MB sınırı: aşırı büyük dosya kesilir (sınırsız buffer yok)", async () => {
    const fake = ((input: RequestInfo | URL) => {
      const u = String(input instanceof Request ? input.url : input);
      if (u.endsWith("robots.txt")) return Promise.resolve(new Response("x".repeat(3_000_000)));
      if (u.endsWith("llms.txt")) return Promise.resolve(new Response("", { status: 404 }));
      return Promise.resolve(
        new Response('<html lang="tr"></html>', { headers: { "content-type": "text/html" } })
      );
    }) as typeof fetch;
    const out = await fetchScanTargets(new URL("https://x.com/a"), fake);
    expect(out.robotsTxt).not.toBeNull();
    expect((out.robotsTxt as string).length).toBeLessThanOrEqual(2_000_000);
  });

  it("content-type büyük/karışık harfle de text/html sayılır", async () => {
    const fake = (() =>
      Promise.resolve(
        new Response('<html lang="tr"></html>', {
          headers: { "content-type": "TEXT/HTML; charset=utf-8" },
        })
      )) as typeof fetch;
    const out = await fetchScanTargets(new URL("https://x.com/a"), fake);
    expect(out.pageHtml).toContain("<html");
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

  it("her istek AbortSignal.timeout, redirect:manual (per-hop doğrulama) ve doğru User-Agent taşır", async () => {
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
      // "manual": ara yönlendirme hop'larının kendi tarafımızda tek tek
      // validateTargetUrl'den geçmesi için — fetch'in "follow" modu ara
      // adımları asla dışarı vermez (fix round 1, per-hop SSRF sertleştirme).
      expect(init?.redirect).toBe("manual");
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      const headers = init?.headers as Record<string, string>;
      expect(headers["User-Agent"]).toBe(SCANNER_USER_AGENT);
    }
    expect(SCANNER_USER_AGENT).toBe(
      "INDOLES-GEO-Denetleyici/1.0 (+https://www.indoles.com.tr/tr/araclar/geo-gorunurluk-denetleyicisi)"
    );
  });
});
