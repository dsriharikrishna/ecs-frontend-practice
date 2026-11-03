import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("Cloudscape dashboard", () => {
  it("renders the dashboard with mock infrastructure metrics", async () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    expect(screen.getByRole("heading", { name: "Infrastructure overview" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "ECS services" })).toBeInTheDocument();
    expect(screen.getByText("web-frontend")).toBeInTheDocument();
  });

  it("supports direct navigation to a client-side route", async () => {
    window.history.pushState({}, "", "/services");
    render(<App />);

    expect(screen.getByRole("heading", { name: "ECS Services" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("row").some((row) => row.textContent?.includes("orders-api")),
    ).toBe(true);
  });
});
