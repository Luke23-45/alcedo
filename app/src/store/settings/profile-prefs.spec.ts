import { describe, expect, it } from "vitest";
import { DEFAULT_PROFILE_BIO, preferenceRegistry } from "./registry";
import { stringListCodec, stringUnionCodec } from "./codecs";
import { settingsReducer } from "./index";
import {
  setBlockedAccounts,
  setPrivacyShowHeartRate,
  setProfileVisibility,
  setRingGoalMove,
  setUnitWeight,
  setWeeklyVolumeGoalKg,
} from "./index";

describe("profile editor preferences - registry defaults", () => {
  it("seeds ring goals from the social contract", () => {
    const state = settingsReducer(undefined, { type: "@@init" });
    expect(state.ringGoalMove).toBe(650);
    expect(state.ringGoalExercise).toBe(60);
    expect(state.ringGoalStand).toBe(12);
    expect(state.weeklyVolumeGoalKg).toBe(35000);
  });

  it("seeds metric units, friends visibility, and the contract bio", () => {
    const state = settingsReducer(undefined, { type: "@@init" });
    expect(state.unitWeight).toBe("kg");
    expect(state.unitDistance).toBe("km");
    expect(state.unitHeight).toBe("cm");
    expect(state.profileVisibility).toBe("friends");
    expect(state.profileUsername).toBe("alexr");
    expect(state.profileBio).toBe(DEFAULT_PROFILE_BIO);
    // Contract: 37 + 1 + 30 = 68 chars.
    expect(DEFAULT_PROFILE_BIO.length).toBe(68);
  });

  it("seeds four privacy toggles on and heart-rate off (matches the share-card contract)", () => {
    const state = settingsReducer(undefined, { type: "@@init" });
    expect(state.privacyShareSessions).toBe(true);
    expect(state.privacyShowLeaderboards).toBe(true);
    expect(state.privacyShowPRs).toBe(true);
    expect(state.privacyAllowComments).toBe(true);
    expect(state.privacyShowHeartRate).toBe(false);
    expect(state.blockedAccounts).toEqual([]);
  });

  it("registers every new key with a codec so generic hydrate + persist pick them up", () => {
    for (const key of [
      "ringGoalMove",
      "ringGoalExercise",
      "ringGoalStand",
      "weeklyVolumeGoalKg",
      "unitWeight",
      "unitDistance",
      "unitHeight",
      "profileUsername",
      "profileBio",
      "profileVisibility",
      "privacyShareSessions",
      "privacyShowLeaderboards",
      "privacyShowPRs",
      "privacyAllowComments",
      "privacyShowHeartRate",
      "blockedAccounts",
    ] as const) {
      expect(preferenceRegistry[key].codec, key).toBeDefined();
      expect(preferenceRegistry[key].persist ?? true, key).toBe(true);
    }
  });
});

describe("profile editor preferences - generated setters", () => {
  it("applies ring-goal, volume-goal, unit, visibility, and privacy setters", () => {
    let state = settingsReducer(undefined, { type: "@@init" });
    state = settingsReducer(state, setRingGoalMove(700));
    state = settingsReducer(state, setWeeklyVolumeGoalKg(40000));
    state = settingsReducer(state, setUnitWeight("lb"));
    state = settingsReducer(state, setProfileVisibility("private"));
    state = settingsReducer(state, setPrivacyShowHeartRate(true));
    state = settingsReducer(state, setBlockedAccounts(["mia"]));
    expect(state.ringGoalMove).toBe(700);
    expect(state.weeklyVolumeGoalKg).toBe(40000);
    expect(state.unitWeight).toBe("lb");
    expect(state.profileVisibility).toBe("private");
    expect(state.privacyShowHeartRate).toBe(true);
    expect(state.blockedAccounts).toEqual(["mia"]);
  });
});

describe("stringUnionCodec", () => {
  const codec = stringUnionCodec(["kg", "lb"] as const);

  it("round-trips allowed values and rejects anything else", () => {
    expect(codec.deserialize(codec.serialize("lb"))).toBe("lb");
    expect(codec.deserialize("stone")).toBeUndefined();
    expect(codec.deserialize(undefined)).toBeUndefined();
  });
});

describe("stringListCodec", () => {
  it("round-trips string arrays and rejects non-arrays", () => {
    expect(stringListCodec.deserialize(stringListCodec.serialize(["a", "b"]))).toEqual(["a", "b"]);
    expect(stringListCodec.deserialize(stringListCodec.serialize([]))).toEqual([]);
    expect(stringListCodec.deserialize('{"x":1}')).toBeUndefined();
    expect(stringListCodec.deserialize("not json")).toBeUndefined();
    expect(stringListCodec.deserialize(undefined)).toBeUndefined();
  });
});
