import { DayOfWeek } from "@js-joda/core";
import { describe, expect, it } from "vitest";
import { dayOfWeekListCodec, floatCodec } from "./codecs";
import { preferenceRegistry } from "./registry";
import {
  setPlannerAutoDeload,
  setPlannerDeloadWeek,
  setPlannerEnabled,
  setPlannerFocus,
  setPlannerTargetRpe,
  setPlannerTargetSessionMinutes,
  setPlannerTrainingDays,
  setPlannerWeeklyOverloadKg,
  settingsReducer,
} from "./index";

describe("planner preferences - registry defaults", () => {
  it("seeds the planner contract defaults", () => {
    const state = settingsReducer(undefined, { type: "@@init" });
    expect(state.plannerEnabled).toBe(true);
    expect(state.plannerTrainingDays).toEqual([
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ]);
    expect(state.plannerTargetSessionMinutes).toBe(45);
    expect(state.plannerTargetRpe).toBe(7.5);
    expect(state.plannerFocus).toBe("strength");
    expect(state.plannerWeeklyOverloadKg).toBe(2.5);
    expect(state.plannerAutoDeload).toBe(true);
    expect(state.plannerDeloadWeek).toBeUndefined();
  });

  it("registers every planner key with a codec so generic hydrate + persist pick them up", () => {
    for (const key of [
      "plannerEnabled",
      "plannerFocus",
      "plannerTrainingDays",
      "plannerTargetSessionMinutes",
      "plannerTargetRpe",
      "plannerWeeklyOverloadKg",
      "plannerAutoDeload",
      "plannerDeloadWeek",
    ] as const) {
      expect(preferenceRegistry[key].codec, key).toBeDefined();
      expect(preferenceRegistry[key].persist ?? true, key).toBe(true);
    }
  });
});

describe("planner preferences - generated setters", () => {
  it("round-trips training days through the generic setter", () => {
    const days = [DayOfWeek.MONDAY, DayOfWeek.THURSDAY];
    const state = settingsReducer(undefined, setPlannerTrainingDays(days));
    expect(state.plannerTrainingDays).toEqual(days);
  });

  it("round-trips the session shape settings", () => {
    let state = settingsReducer(undefined, setPlannerTargetSessionMinutes(60));
    expect(state.plannerTargetSessionMinutes).toBe(60);
    state = settingsReducer(state, setPlannerTargetRpe(8.5));
    expect(state.plannerTargetRpe).toBe(8.5);
    state = settingsReducer(state, setPlannerFocus("hypertrophy"));
    expect(state.plannerFocus).toBe("hypertrophy");
    state = settingsReducer(state, setPlannerWeeklyOverloadKg(5));
    expect(state.plannerWeeklyOverloadKg).toBe(5);
  });

  it("round-trips the master switch", () => {
    const state = settingsReducer(undefined, setPlannerEnabled(false));
    expect(state.plannerEnabled).toBe(false);
  });

  it("round-trips the deload settings", () => {
    let state = settingsReducer(undefined, setPlannerAutoDeload(false));
    expect(state.plannerAutoDeload).toBe(false);
    state = settingsReducer(state, setPlannerDeloadWeek("2026-06-30"));
    expect(state.plannerDeloadWeek).toBe("2026-06-30");
  });
});

describe("planner preference codecs", () => {
  it("floatCodec round-trips decimals", () => {
    expect(floatCodec.serialize(7.5)).toBe("7.5");
    expect(floatCodec.deserialize("7.5")).toBe(7.5);
    expect(floatCodec.deserialize("nope")).toBeUndefined();
    expect(floatCodec.deserialize(undefined)).toBeUndefined();
  });

  it("dayOfWeekListCodec round-trips day lists", () => {
    const days = [DayOfWeek.MONDAY, DayOfWeek.SATURDAY];
    const serialized = dayOfWeekListCodec.serialize(days);
    expect(serialized).toBe('["MONDAY","SATURDAY"]');
    expect(dayOfWeekListCodec.deserialize(serialized)).toEqual(days);
    expect(dayOfWeekListCodec.deserialize('["FUNDAY"]')).toBeUndefined();
    expect(dayOfWeekListCodec.deserialize("garbage")).toBeUndefined();
    expect(dayOfWeekListCodec.deserialize(undefined)).toBeUndefined();
  });
});
