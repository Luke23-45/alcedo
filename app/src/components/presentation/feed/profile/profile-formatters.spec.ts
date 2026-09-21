import { describe, expect, it } from "vitest";
import {
  formatBodyweightValue,
  formatCompactVolume,
  formatGoalPercent,
  formatGrouped,
  sliderValueForX,
  sliderXForNow,
  sliderXForValue,
} from "./profile-formatters";

describe("formatCompactVolume", () => {
  it("renders the contract lifetime volume as 1.28M", () => {
    expect(formatCompactVolume(1_284_600)).toBe("1.28M");
  });

  it("compacts thousands with one decimal and leaves small values whole", () => {
    expect(formatCompactVolume(8_420)).toBe("8.4K");
    expect(formatCompactVolume(999)).toBe("999");
    expect(formatCompactVolume(0)).toBe("0");
  });
});

describe("slider geometry", () => {
  it("places the thumb at x=196.5 for the 35,000 contract goal", () => {
    expect(sliderXForValue(35_000)).toBeCloseTo(196.5, 5);
  });

  it('places the "now" tick at x=189.4 for the 34,340 contract week', () => {
    // 189.4 is the reference's one-decimal measurement; the exact linear
    // mapping yields 189.438, which agrees to that precision.
    expect(sliderXForNow(34_340)).toBeCloseTo(189.4, 1);
  });

  it("round-trips values through x, clamped and snapped to 500", () => {
    expect(sliderValueForX(196.5)).toBe(35_000);
    expect(sliderValueForX(36)).toBe(20_000);
    expect(sliderValueForX(357)).toBe(50_000);
    expect(sliderValueForX(0)).toBe(20_000);
    expect(sliderValueForX(9999)).toBe(50_000);
    // 100 px right of the 20k origin = 20,000 + (100/321)*30,000 ≈ 29,346 → 29,500.
    expect(sliderValueForX(136)).toBe(29_500);
  });
});

describe("formatGoalPercent", () => {
  it("renders the contract 98% (34,340 / 35,000 = 98.1%)", () => {
    expect(formatGoalPercent(34_340, 35_000)).toBe(98);
  });

  it("guards against a zero goal", () => {
    expect(formatGoalPercent(100, 0)).toBe(0);
  });
});

describe("formatBodyweightValue", () => {
  it("renders the contract 80.6 kg and converts honestly to lb", () => {
    expect(formatBodyweightValue(80.6, "kg")).toBe("80.6");
    // 80.6 × 2.20462 = 177.69 → 177.7.
    expect(formatBodyweightValue(80.6, "lb")).toBe("177.7");
  });
});

describe("formatGrouped", () => {
  it("groups thousands", () => {
    expect(formatGrouped(34_340)).toBe("34,340");
    expect(formatGrouped(35_000)).toBe("35,000");
  });
});
