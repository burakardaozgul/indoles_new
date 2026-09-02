import * as React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScanBar, normalizeUrlInput } from "@/components/tools/scan-bar";
import { MIN_FILL_MS } from "@/lib/security/anti-spam";

describe("normalizeUrlInput", () => {
  it("şema yoksa https:// ekler, boşlukları kırpar, mevcut şemayı korur", () => {
    expect(normalizeUrlInput("  migros.com.tr ")).toBe("https://migros.com.tr");
    expect(normalizeUrlInput("http://ornek.com")).toBe("http://ornek.com");
    expect(normalizeUrlInput("HTTPS://Ornek.com/yol")).toBe("HTTPS://Ornek.com/yol");
    expect(normalizeUrlInput("")).toBe("");
  });
});

function Harness({ onSubmit, error = null, busy = false }: { onSubmit: (s: unknown) => void; error?: null | "unreachable"; busy?: boolean }) {
  const [v, setV] = React.useState("");
  return <ScanBar locale="tr" value={v} onChange={setV} onSubmit={onSubmit} busy={busy} error={error} />;
}

describe("ScanBar", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("boş gönderimde onSubmit çağrılmaz, uyarı basılır", () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    fireEvent.submit(screen.getByRole("form"));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Denetlemek istediğiniz adresi yazın.");
  });

  it("süre tuzağı: 2 sn dolmadan gönderim kalan süreyi bekler, sonra normalize URL ile gider", () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Site adresi"), { target: { value: "migros.com.tr" } });
    act(() => { vi.advanceTimersByTime(500); });
    fireEvent.submit(screen.getByRole("form"));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Taranıyor…" })).toHaveAttribute("aria-busy", "true");
    act(() => { vi.advanceTimersByTime(MIN_FILL_MS); });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const sub = onSubmit.mock.calls[0]![0] as { url: string; website: string; elapsedMs: number };
    expect(sub.url).toBe("https://migros.com.tr");
    expect(sub.website).toBe("");
    expect(sub.elapsedMs).toBeGreaterThanOrEqual(MIN_FILL_MS);
  });

  it("2 sn geçmişse hemen gönderir", () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    act(() => { vi.advanceTimersByTime(MIN_FILL_MS + 10); });
    fireEvent.change(screen.getByLabelText("Site adresi"), { target: { value: "https://ornek.com" } });
    fireEvent.submit(screen.getByRole("form"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("hata prop'u çubuğu geçersiz işaretler ve mesajı basar", () => {
    render(<Harness onSubmit={vi.fn()} error="unreachable" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Bu adrese ulaşılamadı.");
    expect(screen.getByLabelText("Site adresi")).toHaveAttribute("aria-invalid", "true");
  });

  it("busy iken düğme 'Taranıyor…' ve alan kilitli", () => {
    render(<Harness onSubmit={vi.fn()} busy />);
    expect(screen.getByRole("button", { name: "Taranıyor…" })).toBeDisabled();
    expect(screen.getByLabelText("Site adresi")).toBeDisabled();
  });
});
