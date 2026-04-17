import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LeadFieldsForm } from "../LeadFieldsForm";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("LeadFieldsForm", () => {
  it("6 alan + KVKK checkbox render eder", () => {
    render(<LeadFieldsForm onSubmit={() => {}} onBack={() => {}} loading={false} submitLabel="submit" />);
    expect(screen.getByLabelText(/firstName/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lastName/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /kvkk/i })).toBeInTheDocument();
  });

  it("KVKK işaretlenmeden submit çalışmaz", () => {
    const onSubmit = vi.fn();
    render(<LeadFieldsForm onSubmit={onSubmit} onBack={() => {}} loading={false} submitLabel="submit" />);
    fireEvent.change(screen.getByLabelText(/firstName/i), { target: { value: "Ali" } });
    fireEvent.change(screen.getByLabelText(/lastName/i), { target: { value: "Veli" } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "+905551234567" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/company/i), { target: { value: "T" } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "CTO" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("tüm alanlar + KVKK ile submit", () => {
    const onSubmit = vi.fn();
    render(<LeadFieldsForm onSubmit={onSubmit} onBack={() => {}} loading={false} submitLabel="submit" />);
    fireEvent.change(screen.getByLabelText(/firstName/i), { target: { value: "Ali" } });
    fireEvent.change(screen.getByLabelText(/lastName/i), { target: { value: "Veli" } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "+905551234567" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/company/i), { target: { value: "Test AŞ" } });
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "CTO" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /kvkk/i }));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ kvkkConsent: true }));
  });
});
