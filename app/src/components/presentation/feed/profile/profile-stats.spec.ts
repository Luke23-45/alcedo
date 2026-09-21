import { describe, expect, it } from "vitest";
import { calculateDayStreak } from "./profile-stats";

const TODAY = 20_000;

describe("calculateDayStreak", () => {
  it("counts consecutive trained days ending today", () => {
    expect(calculateDayStreak([TODAY, TODAY - 1, TODAY - 2], TODAY)).toBe(3);
  });

  it("stays alive through yesterday when today is not trained yet", () => {
    expect(calculateDayStreak([TODAY - 1, TODAY - 2], TODAY)).toBe(2);
  });

  it("breaks when the latest trained day is older than yesterday", () => {
    expect(calculateDayStreak([TODAY - 2, TODAY - 3], TODAY)).toBe(0);
  });

  it("ignores duplicate days and gaps reset the run", () => {
    expect(calculateDayStreak([TODAY, TODAY, TODAY - 1, TODAY - 3], TODAY)).toBe(2);
  });

  it("returns 0 with no sessions", () => {
    expect(calculateDayStreak([], TODAY)).toBe(0);
  });
});
