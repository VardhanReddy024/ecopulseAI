import { describe, it, expect } from "vitest";
import { calculateFootprint, generateRecommendations } from "./carbonEngine";
import type { FootprintInput } from "../types";

const baseline: FootprintInput = {
  transport: { primary: "car", weeklyKm: 100, flightHours: 0 },
  electricity: { monthlyKwh: 200, renewable: false },
  diet: "mixed",
  shopping: { fashion: "low", electronics: "low", general: "low" },
  waste: { plasticLevel: "low", recycles: true },
};

describe("calculateFootprint", () => {
  it("returns numeric results", () => {
    const r = calculateFootprint(baseline);
    expect(typeof r.monthly).toBe("number");
    expect(typeof r.annual).toBe("number");
    expect(r.monthly).toBeGreaterThan(0);
  });

  it("vegan diet has lower footprint than meat-heavy", () => {
    const vegan = calculateFootprint({ ...baseline, diet: "vegan" });
    const meat = calculateFootprint({ ...baseline, diet: "meat-heavy" });
    expect(vegan.breakdown.diet).toBeLessThan(meat.breakdown.diet);
  });

  it("renewable electricity reduces emissions", () => {
    const dirty = calculateFootprint(baseline);
    const clean = calculateFootprint({ ...baseline, electricity: { ...baseline.electricity, renewable: true } });
    expect(clean.breakdown.electricity).toBeLessThan(dirty.breakdown.electricity);
  });

  it("annual is 12x monthly", () => {
    const r = calculateFootprint(baseline);
    expect(Math.abs(r.annual - r.monthly * 12)).toBeLessThan(20);
  });
});

describe("generateRecommendations", () => {
  it("returns recommendations sorted by impact desc", () => {
    const r = calculateFootprint(baseline);
    const recs = generateRecommendations(baseline, r);
    for (let i = 0; i < recs.length - 1; i++) {
      expect(recs[i].impact).toBeGreaterThanOrEqual(recs[i + 1].impact);
    }
  });

  it("has unique ids", () => {
    const r = calculateFootprint(baseline);
    const recs = generateRecommendations(baseline, r);
    const ids = new Set(recs.map((x) => x.id));
    expect(ids.size).toBe(recs.length);
  });
});
