import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressIndicator } from "../ProgressIndicator";

describe("ProgressIndicator", () => {
  it("current/total'ı render eder", () => {
    render(<ProgressIndicator current={2} total={3} />);
    expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
  });

  it("doğru sayıda nokta render eder", () => {
    const { container } = render(<ProgressIndicator current={1} total={3} />);
    expect(container.querySelectorAll("[data-dot]").length).toBe(3);
  });
});
