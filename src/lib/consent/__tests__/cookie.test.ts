import { describe, it, expect, beforeEach } from "vitest";
import {
  CONSENT_COOKIE_NAME,
  REGION_COOKIE_NAME,
  readConsentCookie,
  writeConsentCookie,
  readRegionCookie,
} from "../cookie";

function clearCookies() {
  for (const pair of document.cookie.split(";")) {
    const name = pair.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

beforeEach(clearCookies);

describe("readConsentCookie", () => {
  it("çerez yokken null döner", () => {
    expect(readConsentCookie()).toBeNull();
  });

  it("iki kategoriyi ayrı ayrı okur", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=gd; path=/`;
    expect(readConsentCookie()).toEqual({ analytics: "granted", marketing: "denied" });
  });

  it("pazarlama açık analitik kapalı kombinasyonunu okur", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=dg; path=/`;
    expect(readConsentCookie()).toEqual({ analytics: "denied", marketing: "granted" });
  });

  it("ADR-033 öncesi 'granted' çerezini analitik onayı sayar, pazarlamayı reddedilmiş", () => {
    // Eski şema tek kelimeydi ve yalnız analitiği kapsıyordu. O ziyaretçilere
    // hiç sorulmamış bir pazarlama rızası atfedilemez.
    document.cookie = `${CONSENT_COOKIE_NAME}=granted; path=/`;
    expect(readConsentCookie()).toEqual({ analytics: "granted", marketing: "denied" });
  });

  it("ADR-033 öncesi 'denied' çerezini iki kategoride de ret sayar", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=denied; path=/`;
    expect(readConsentCookie()).toEqual({ analytics: "denied", marketing: "denied" });
  });

  it("tanımadığı değeri null sayar", () => {
    // Elle kurcalanmış çerez onay verilmiş sayılmamalı.
    document.cookie = `${CONSENT_COOKIE_NAME}=maybe; path=/`;
    expect(readConsentCookie()).toBeNull();
  });

  it("eksik ya da fazla haneli değeri null sayar", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=g; path=/`;
    expect(readConsentCookie()).toBeNull();
    clearCookies();
    document.cookie = `${CONSENT_COOKIE_NAME}=ggg; path=/`;
    expect(readConsentCookie()).toBeNull();
  });

  it("adı benzeyen başka çerezle karışmaz", () => {
    document.cookie = `not_${CONSENT_COOKIE_NAME}=gg; path=/`;
    expect(readConsentCookie()).toBeNull();
  });
});

describe("writeConsentCookie", () => {
  it("yazdığını aynen geri okur", () => {
    writeConsentCookie({ analytics: "granted", marketing: "granted" });
    expect(readConsentCookie()).toEqual({ analytics: "granted", marketing: "granted" });
  });

  it("karışık kararı bozmadan taşır", () => {
    writeConsentCookie({ analytics: "granted", marketing: "denied" });
    expect(readConsentCookie()).toEqual({ analytics: "granted", marketing: "denied" });
  });

  it("reddi de kalıcı kaydeder — banner her sayfada tekrar sorulmaz", () => {
    writeConsentCookie({ analytics: "denied", marketing: "denied" });
    expect(readConsentCookie()).not.toBeNull();
  });

  it("çerez değeri kaçış gerektiren karakter taşımaz", () => {
    // Biçim bilerek iki harf: JSON ya da virgüllü biçimler ara katmanlarda
    // kaçış bozulunca onayı sessizce okunamaz hâle getirir.
    writeConsentCookie({ analytics: "granted", marketing: "denied" });
    const raw = document.cookie.match(new RegExp(`${CONSENT_COOKIE_NAME}=([^;]*)`))?.[1];
    expect(raw).toMatch(/^[gd]{2}$/);
  });
});

describe("readRegionCookie", () => {
  it("çerez yokken null döner", () => {
    expect(readRegionCookie()).toBeNull();
  });

  it("middleware'in yazdığı eea değerini okur", () => {
    document.cookie = `${REGION_COOKIE_NAME}=eea; path=/`;
    expect(readRegionCookie()).toBe("eea");
  });

  it("other değerini okur", () => {
    document.cookie = `${REGION_COOKIE_NAME}=other; path=/`;
    expect(readRegionCookie()).toBe("other");
  });

  it("tanımadığı değeri null sayar", () => {
    document.cookie = `${REGION_COOKIE_NAME}=DE; path=/`;
    expect(readRegionCookie()).toBeNull();
  });
});
