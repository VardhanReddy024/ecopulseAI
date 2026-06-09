import { describe, it, expect } from "vitest";
import { cn, formatCO2, getEcoRating } from "./cn";

describe("cn", () => {
  it("merges classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });
  it("dedupes with tailwind-merge", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("formatCO2", () => {
  it("formats kg under 1000", () => {
    expect(formatCO2(500)).toBe("500 kg");
  });
  it("formats tonnes over 1000", () => {
    expect(formatCO2(1500)).toMatch(/t/);
  });
});

describe("getEcoRating", () => {
  it("returns champion for low footprint", () => {
    const r = getEcoRating(100);
    expect(r.label).toBe("Eco Champion");
  });
  it("returns critical for very high", () => {
    const r = getEcoRating(2000);
    expect(r.label).toBe("Critical");
  });
});
