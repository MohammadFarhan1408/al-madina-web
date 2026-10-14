import { describe, expect, it } from "vitest";
import { statusDates } from "./timeline";

describe("statusDates", () => {
  it("falls back to placedAt when there is no history", () => {
    expect(statusDates({ placedAt: "2026-01-01" })).toEqual({
      processing: "2026-01-01",
    });
  });

  it("uses the latest entry per status", () => {
    const dates = statusDates({
      placedAt: "2026-01-01",
      statusHistory: [
        { status: "processing", at: "2026-01-01T10:00Z" },
        { status: "shipped", at: "2026-01-02" },
        { status: "shipped", at: "2026-01-03" },
      ],
    });
    expect(dates.processing).toBe("2026-01-01T10:00Z");
    expect(dates.shipped).toBe("2026-01-03");
    expect(dates.delivered).toBeUndefined();
  });
});
