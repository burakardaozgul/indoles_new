import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EntryPopup } from "../EntryPopup";

vi.mock("next-intl", () => ({
  useTranslations: (ns?: string) => {
    const t = (k: string) => `${ns ?? ""}.${k}`;
    t.raw = (k: string) => {
      if (k.includes("descriptionPoints")) return ["point 1", "point 2", "point 3"];
      return [];
    };
    return t;
  },
  useLocale: () => "tr",
}));

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ ok: true, calComEmbedUrl: null }),
}) as unknown as typeof fetch;

/**
 * `EntryPopup`in turnstile effect'i Radix `Dialog.Portal`ın kendi (daha geç)
 * commit'ini bekliyor: ilk denemede `turnstileRef.current` henüz `null`
 * olduğu için widget hemen render edilmez, 100ms'lik bir `setTimeout` ile
 * tekrar dener ("poll up to 3s" — bkz. component içi yorum). Bu yüzden
 * mock'u isimli tutup `waitFor` ile gerçekten çağrıldığını bekliyoruz;
 * aksi halde `turnstileToken` boş kalır ve submit guard'ı sessizce döner.
 */
const turnstileRenderMock = vi.fn(
  (_el: Element, opts: { callback: (token: string) => void }) => {
    opts.callback("test-token");
    return "widget-1";
  },
);

beforeEach(() => {
  turnstileRenderMock.mockClear();
  (window as unknown as { turnstile: unknown }).turnstile = {
    render: turnstileRenderMock,
    remove: vi.fn(),
  };
});

describe("EntryPopup", () => {
  it("open=true ise dialog render olur", () => {
    render(<EntryPopup open onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("× butonu onClose'u çağırır", () => {
    const onClose = vi.fn();
    render(<EntryPopup open onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("Stage 1 başlangıç state'idir", () => {
    render(<EntryPopup open onClose={() => {}} />);
    const matches = screen.getAllByText(/stage1\.title/);
    expect(matches.length).toBeGreaterThan(0);
  });
});

describe("handleSubmitForm — brief_submitted", () => {
  const gtag = vi.fn();

  beforeEach(() => {
    gtag.mockClear();
    (window as unknown as { gtag?: unknown }).gtag = gtag;
  });

  afterEach(() => {
    delete (window as unknown as { gtag?: unknown }).gtag;
  });

  function briefEvents() {
    return gtag.mock.calls.filter((c) => c[1] === "brief_submitted");
  }

  async function fillAndSubmitContactForm() {
    // Turnstile widget'ının (yukarıdaki mock aracılığıyla) render edilip
    // token'ı yazmasını bekle — aksi halde `handleSubmitForm` guard'ı
    // (`!turnstileToken`) submit'i sessizce iptal eder.
    await waitFor(() => expect(turnstileRenderMock).toHaveBeenCalled());

    fireEvent.change(screen.getByLabelText(/firstName/i), { target: { value: "Ali" } });
    fireEvent.change(screen.getByLabelText(/lastName/i), { target: { value: "Veli" } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "+905551234567" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ali@veli.com" } });
    fireEvent.change(screen.getByLabelText(/company/i), { target: { value: "Test AŞ" } });
    // `{ selector: "input" }` zorunlu: sayfa genelindeki `Dialog.Title`
    // ("popup.stage1.title") her zaman DOM'da durur ve `aria-labelledby`
    // ile dialog kapsayıcısına bağlıdır — düz `/title/i` sorgusu onu da
    // eşleştirip "birden fazla eleman" hatası fırlatır.
    fireEvent.change(screen.getByLabelText(/title/i, { selector: "input" }), {
      target: { value: "CTO" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: /kvkk/i }));
    fireEvent.click(screen.getByRole("button", { name: /contactCta/i }));
    await screen.findByText(/success\.contactTitle/i);
  }

  it("başarılı gönderimde brief_submitted tam olarak bir kez yazılır, doğru payload ile", async () => {
    render(
      <EntryPopup
        open
        onClose={() => {}}
        initialStage="contact"
        initialPersona="donusum-teknoloji"
        initialProblems={["p1", "p2", "p3"]}
      />,
    );

    await fillAndSubmitContactForm();

    expect(briefEvents()).toHaveLength(1);
    expect(briefEvents()[0]?.[2]).toEqual({ briefId: expect.any(String) });
  });

  it("SuccessState'e geçtikten sonraki yeniden render'lar olayı tekrar tetiklemez", async () => {
    const { rerender } = render(
      <EntryPopup
        open
        onClose={() => {}}
        initialStage="contact"
        initialPersona="donusum-teknoloji"
        initialProblems={["p1", "p2", "p3"]}
      />,
    );

    await fillAndSubmitContactForm();
    expect(briefEvents()).toHaveLength(1);

    // Olay `SuccessState`in render'ına değil, submit handler'ına bağlı —
    // bu yüzden ebeveynden gelen ve `SuccessState`i yeniden render eden bir
    // güncelleme (StrictMode'un ikinci render'ı, ebeveyn state değişimi vb.)
    // ikinci bir `brief_submitted` üretmemeli.
    rerender(
      <EntryPopup
        open
        onClose={() => {}}
        initialStage="contact"
        initialPersona="donusum-teknoloji"
        initialProblems={["p1", "p2", "p3"]}
      />,
    );

    expect(briefEvents()).toHaveLength(1);
  });
});
