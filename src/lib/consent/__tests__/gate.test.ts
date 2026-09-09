import { describe, it, expect, vi, beforeEach } from "vitest";
import { isConsentPending, whenConsentResolved, CONSENT_RESOLVED_EVENT } from "../gate";
import { CONSENT_COOKIE_NAME, REGION_COOKIE_NAME } from "../cookie";

function clearCookies() {
  for (const pair of document.cookie.split(";")) {
    const name = pair.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

beforeEach(clearCookies);

describe("isConsentPending", () => {
  it("EEA'da karar verilmemişken beklemede sayar", () => {
    document.cookie = `${REGION_COOKIE_NAME}=eea; path=/`;
    expect(isConsentPending()).toBe(true);
  });

  it("EEA'da karar verilmişse beklemede değildir", () => {
    document.cookie = `${REGION_COOKIE_NAME}=eea; path=/`;
    document.cookie = `${CONSENT_COOKIE_NAME}=dd; path=/`;
    expect(isConsentPending()).toBe(false);
  });

  it("EEA dışında da karar verilmemişse bekler", () => {
    // ADR-033: pazarlama rızası her bölgede sorulduğu için şerit artık
    // bölgeye göre gizlenmiyor. Önceden burada `false` bekleniyordu.
    document.cookie = `${REGION_COOKIE_NAME}=other; path=/`;
    expect(isConsentPending()).toBe(true);
  });

  it("bölge bilinmiyorsa da bekler", () => {
    // Coğrafi başlık gelmezse rıza sorulmadan geçilmemeli.
    expect(isConsentPending()).toBe(true);
  });

  it("karar verilmişse bölge ne olursa olsun beklemez", () => {
    document.cookie = `${REGION_COOKIE_NAME}=other; path=/`;
    document.cookie = `${CONSENT_COOKIE_NAME}=gd; path=/`;
    expect(isConsentPending()).toBe(false);
  });
});

describe("whenConsentResolved", () => {
  it("karar zaten verilmişse işi hemen çalıştırır", () => {
    // Belirleyici artık bölge değil, kararın verilmiş olması.
    document.cookie = `${CONSENT_COOKIE_NAME}=gd; path=/`;
    const run = vi.fn();
    whenConsentResolved(run);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("beklemedeyken işi geciktirir", () => {
    // Çerez şeridi açıkken giriş popup'ı tetiklenmemeli — iki katmanlı
    // engel ziyaretçiyi kaybettirir.
    document.cookie = `${REGION_COOKIE_NAME}=eea; path=/`;
    const run = vi.fn();
    whenConsentResolved(run);
    expect(run).not.toHaveBeenCalled();
  });

  it("karar verilince işi çalıştırır", () => {
    document.cookie = `${REGION_COOKIE_NAME}=eea; path=/`;
    const run = vi.fn();
    whenConsentResolved(run);

    window.dispatchEvent(new CustomEvent(CONSENT_RESOLVED_EVENT));
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("işi yalnız bir kez çalıştırır", () => {
    document.cookie = `${REGION_COOKIE_NAME}=eea; path=/`;
    const run = vi.fn();
    whenConsentResolved(run);

    window.dispatchEvent(new CustomEvent(CONSENT_RESOLVED_EVENT));
    window.dispatchEvent(new CustomEvent(CONSENT_RESOLVED_EVENT));
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("temizlik çağrıldıktan sonra iş çalışmaz", () => {
    // React effect sökülürken dinleyici kalmamalı; kalırsa sayfa
    // değiştikten sonra popup beklenmedik anda açılır.
    document.cookie = `${REGION_COOKIE_NAME}=eea; path=/`;
    const run = vi.fn();
    const cleanup = whenConsentResolved(run);
    cleanup();

    window.dispatchEvent(new CustomEvent(CONSENT_RESOLVED_EVENT));
    expect(run).not.toHaveBeenCalled();
  });

  it("hemen çalışan durumda da temizlik güvenlidir", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=gd; path=/`;
    const cleanup = whenConsentResolved(vi.fn());
    expect(() => cleanup()).not.toThrow();
  });
});
