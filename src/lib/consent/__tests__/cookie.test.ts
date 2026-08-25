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

  it("granted değerini okur", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=granted; path=/`;
    expect(readConsentCookie()).toBe("granted");
  });

  it("denied değerini okur", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=denied; path=/`;
    expect(readConsentCookie()).toBe("denied");
  });

  it("tanımadığı değeri null sayar", () => {
    // Elle kurcalanmış ya da eski şemadan kalmış çerez, onay verilmiş
    // sayılmamalı — bilinmeyen değer "onay yok" demektir.
    document.cookie = `${CONSENT_COOKIE_NAME}=maybe; path=/`;
    expect(readConsentCookie()).toBeNull();
  });

  it("adı benzeyen başka çerezle karışmaz", () => {
    document.cookie = `not_${CONSENT_COOKIE_NAME}=granted; path=/`;
    expect(readConsentCookie()).toBeNull();
  });
});

describe("writeConsentCookie", () => {
  it("granted yazar ve geri okunur", () => {
    writeConsentCookie("granted");
    expect(readConsentCookie()).toBe("granted");
  });

  it("denied yazar ve geri okunur", () => {
    writeConsentCookie("denied");
    expect(readConsentCookie()).toBe("denied");
  });

  it("reddi de kalıcı kaydeder — banner her sayfada tekrar sorulmaz", () => {
    writeConsentCookie("denied");
    expect(readConsentCookie()).not.toBeNull();
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
