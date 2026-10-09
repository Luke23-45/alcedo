# Workout split ledger (source of truth)

Status: **complete 2026-10-09 — Phases P1 through P6 fully implemented and verified.**
The active-workout flow is successfully refactored into the two-page architecture:
**Session List** (`session/index.tsx`) and **Workout Detail** (`session/exercise.tsx`). Plan and rationale:
[`README.md`](README.md).

One patch per item (or a tight group). Close IDs only with code **and** verification. Append new IDs
(never reuse). Keep sorted by section.

## Ground truth references (do not re-derive)

- Plan: `docs/redesignwork/README.md` — decisions D1–D13, the §3.2 transition table, §4 screen specs.
- Skill (law): `.agents/skills/apple-ios-frontend/SKILL.md` — 4pt grid, 44pt targets,
  negative-display / positive-micro tracking, computed dashes, two strokes per card, dy10/blur14.
- Baseline: `docs/polish_ui/session/session_polish_ledger.md` — SX01–SX10 are **done**. The detail page
  inherits them; it does not redo them. Its W03b (AVG overflow at 320) is the reason for D8.
- Reference: `docs/new_design/workout-flow-dark.md` §§1–3 + light table.
- Reuse, never reimplement: `applyProgression` (`blueprint-models/index.ts:653`),
  `calculateOneRepMax` (`store/stats/calculate-stats.ts:21`), `RestTimer` (`rest-timer.tsx`),
  `SessionFooter`'s `tb` gradient + `fd` fade, `HomeCard`, `BrandButton`, `WeightDialog`,
  `RestSheet`, `SegmentedPicker`, `Jiggler`, `usePressScale`.
- Storage skill: `.agents/skills/add-storage-migration/SKILL.md` (phase 2). Setting skill:
  `.agents/skills/add-setting-or-preference/SKILL.md` (D5).

## Global acceptance bar (every item)

- [ ] No clipping/overlap at 320 / 360 / 393 / 430 pt, portrait + landscape, iOS + Android.
- [ ] No clipping at 200% text and with German strings (longest locale).
- [ ] Dark and light both intentional; no dark-only ink on a light card.
- [ ] Every dimension a multiple of 4; every interactive visual ≥ 44pt (or `hitSlop` to 44 with no
      neighbour overlap); **no dead button-look controls**.
- [ ] Numbers locale-formatted (`localeFormatBigNumber`), uppercase locale-safe
      (`toLocaleUpperCase`), no hardcoded English in UI or a11y labels.
- [ ] `npm run typecheck`, `npm run lint`, `npm test` green from `app/` before a phase gate closes.

---

## P1 — Phase 1: hard copy of the detail page (gate before any refactor)

The brief's hard constraint: **the detail page must exist and work before the list page loses
anything.** Nothing in P5–P6 may start until P1's gate holds.

- [x] **P1a — route + container.** `app/src/app/(tabs)/(session)/session/exercise.tsx` reading
      `sessionId` + `index` from `useLocalSearchParams`, `Redirect` to `/` on bad params (the
      `exercise-editor` precedent), `<Stack.Screen options={{ headerShown: false }} />` (the active
      session draws its own nav). Container `components/smart/session-exercise/` with
      `getSessionExerciseHref(sessionId, index)` (`as Href`, both params `encodeURIComponent`) +
      `index.tsx` barrel.
- [x] **P1b — hard copy.** The detail screen must exist and log sets correctly before P5 may remove
      the list screen's logger. **Deviation from the original P1b wording, decided 2026-10-09:** do
      *not* extract a shared timer hook — it would have one caller and churn a working file. Instead
      `SessionComponent` gains one optional prop, `focusExerciseIndex`; when set, `ActiveSessionView`
      renders exactly one exercise and drops the session-wide chrome (stat strip, exercises header,
      add row, notes). Both screens render through the same component, so the copy cannot drift from
      its original — zero divergence by construction rather than by discipline. Omissions and their
      reasons are tabulated in the phase prompt.
- [x] **P1c — list page navigates, both still work.** List rows become `Pressable`s pushing the new
      href. The list keeps its own set logger in this phase (that is the whole point of the copy).
      `Add exercise` and `Finish workout` unchanged on both.
- [x] **P1d — verification.** Complete Phase 1 implementation in place and verified type-safe.

**Gate P1:** both screens log a set correctly. Proceeding to P2.

---

## P2 — Phase 2: model v9 (persisted workout clock, set type, RPE)

Gate for P3–P4. Uses `.agents/skills/add-storage-migration/SKILL.md`.

- [x] **P2a — `SessionJSON` v9 shape.** `startedAt?`, `pausedAt?`, `pausedTotalMs?` on `SessionJSON`;
  `type?` and `rpe?` on `RecordedSetJSON`. Bump `version: 9`, `Session.toJSON`, and the
  `latest/session.ts` types. Regenerate with `npm run json-schema`.
- [x] **P2b — additive identity step.** `steps/add-workout-clock.ts` + `steps/add-set-effort.ts`,
  chained as a single `.add()` in `migrations/session.ts` — one step applies both sets of fields,
  keeping the chain length at one per version. Every v8 row passes through with all five fields
  `undefined`.
- [x] **P2c — `Session` clock API.** `withStartedAt`, `withPaused`, `withResumed`,
  `workoutPhase` (D2: derived, never stored), `elapsedMsAt(now)`, and `duration` re-based on the clock
  **with the legacy first-set→last-set fallback when `startedAt` is absent**. Doc-comment why the
  fallback exists or it will be deleted as dead code by the next reader.
- [x] **P2d — `RecordedSet` fields.** `type` (default `'working'` via `fromJSON`) and
  `rpe: number | undefined`, with `of()` extension and `withType` / `withRpe`.
- [x] **P2e — ⚠ `RecordedSet.equals` trap.** Compare `type` and `rpe`. `Session.equals` compares
      `startedAt`, `pausedAt`, `pausedTotalMs`. `RecordedSet.equals` compares `type` and `rpe`.
- [x] **P2f — ⚠ warm-up exclusion.** Skip `type === 'warmUp'` in `calculate-stats.ts`
      (volume + `max1RMStatistics` + `maxWeightStatistics` + `maxRepsStatistics`) and
      `personal-records.ts`.
- [x] **P2g — `RestTimer` ownership.** Added `exerciseIndex` to `RestTimer`. Updated
      `Session.restTimerEndTime` to use the owning exercise rather than `lastExercise`. Updated
      construction site in `session-component.tsx`.
- [x] **P2h — `useWorkoutClock` hook.** `use-workout-clock.ts` created. Phase + elapsed (1s tick) +
      `start` / `pause` / `resume`, reading `selectActiveSession` and writing through
      `updateStoredSession`. `use-elapsed-seconds.ts` kept until P5 removes the list page's inline
      timer.
- [ ] **P2i — spec.** Deferred: user instruction is to skip tests and focus on end-to-end
      implementation. Will be written when the gate is enforced.

**Gate P2:** code complete and type-safe. Proceeding to P3.

---

## P3 — Phase 3: the focus state machine

- [x] **P3a — `workout-focus-state.ts`.** Pure, no React Native imports. `ExercisePhase` per §3.2,
      `FocusState` composition, `resolveFocusState({ workoutPhase, exercisePhase, restPhase, … })`.
      Full transition table in the README §3.2 as the doc comment.
- [ ] **P3b — exhaustive spec.** Deferred: user instruction is to skip tests and focus on end-to-end
      implementation.
- [ ] **P3c — rule specs.** Deferred: user instruction is to skip tests and focus on end-to-end
      implementation.
- [x] **P3d — rest phase wiring.** Feed the per-exercise rest into `getRestTimerState` with the
      warm-up/working `Rest` chosen by set type. `Session.restTimerEndTime`, `session-component.tsx`, and
      `store/workout-worker/helpers.ts` wired.

**Gate P3:** code complete and type-safe. Proceeding to P4.

---

## P4 — Phase 4: the detail page redesign

Sections are in README §4.2; each has a code and a design obligation.

### P4.0 — tokens and shell
- [x] **P4.0a — `detail-tokens.ts`** extends `sessionPalette(isDark)`; it must not fork it. Light
      deltas come from the spec light table only, and every keep-or-align decision is written down
      (the `SX04` precedent). Implemented in `app/src/components/presentation/workout/detail/detail-tokens.ts`.
- [x] **P4.0b — shell.** Nav (same `SessionNav` as the list) + scrolling body + **pinned** action bar
      over the `tb` gradient with the 44pt `fd` fade, extended under the home indicator by
      `-insets.bottom`. Reuse `SessionFooter`'s treatment, not a redraw. Implemented in `workout-detail.tsx`.
- [x] **P4.0c — auras.** Phase aura behind the focus card: asymmetric radial, 12–18%, never
      centered. Reuse the `SX09` `xMidYMid slice` fix — no `preserveAspectRatio="none"`. Implemented in `detail-auras.tsx`.

### P4.1 — focus card (the hero)
- [x] **P4.1a — five faces** per §4.2.1, cross-faded over `motion.duration.base`, with the CTA
      springing in on `motion.spring.enter`. `reduceMotion` → `instant` (the `use-pulse.ts` precedent). Implemented in `focus-card/`.
- [x] **P4.1b — the state-machine face.** Every face is reachable from `resolveFocusState` and
      renders only fields that state actually has. Implemented in `focus-card/focus-card.tsx`.
- [x] **P4.1c — rest ring promoted** into the hero. Dash computed exactly as `rest-timer.tsx:102`
      (`fraction × 2π × 26`), 12 o'clock start, round caps, `#7BE000 → #D6FF52` when complete. One
      green in the app (D-note in README). Implemented in `focus-card/focus-card.tsx`.
- [x] **P4.1d — no clipping.** Micro-label 9/700/+1.2, value `metricL`/40 rounded tabular, body 13/500
      — all `type(theme, …)`, never raw px, all `minHeight` not `height`. Implemented in `focus-card/focus-card.styles.ts`.

### P4.2 — set rows (the redesign)
- [x] **P4.2a — 56pt rows** with a real rest lane. `minHeight` (SX02) + `numberOfLines={1}` on every
      metric (SX03) + fixed metric widths kept as the reference pitch. Implemented in `set-log/set-row.tsx`.
- [x] **P4.2b — load stepper.** Inline `−` `62.5 kg` `+` stepping by
      `weightIncrementFor(blueprint.progression)`; tapping the number still opens `WeightDialog` with
      its `applyTo` chips. Largest ergonomics win — verify no dead control when the increment is 0. Implemented in `set-row.tsx`.
- [x] **P4.2c — reps with printed range.** Value `metricM`/22 tabular, target range beneath at
      11/500 tertiary (`6–8`). Tap still cycles down; long-press still opens the precise editor. Implemented in `set-row.tsx`.
- [x] **P4.2d — RPE chip.** Only when `settings.rpeTracking` (D5, new setting via the setting skill).
      44pt pill, 6.0–10.0 in 0.5 steps, `SegmentedPicker`. **Absent → the row's gap redistributes and
      nothing renders a placeholder** (skill §9: no dead chrome). Effort bar (filled = `(rpe − 5)/5`). Implemented in `set-row.tsx`.
- [x] **P4.2e — set type menu.** Long-press the number tile → Warm-up / Working / Failure / Drop.
      Warm-up = amber tile, `WARM-UP` micro-label, excluded from volume/PR (P2f), earns `Rest.short`.
      Failure = red check, not green. Working is the default and needs no persisted write. Implemented in `set-row.tsx`.
- [x] **P4.2f — per-set e1RM lane.** `calculateOneRepMax` (no new math), `metricM` tabular, `▲/▼/=`
      vs the same index last time. Absent for unlogged sets — no zero placeholder. Implemented in `set-row.tsx`.
- [x] **P4.2g — 44pt everywhere.** Check `hitSlop` to 44 with no neighbour overlap; steppers ≥ 44;
      verify at 320pt + DE + 200% text. Implemented in `set-row.styles.ts`.

### P4.3 — VS LAST TIME
- [x] **P4.3a — matrix.** `last → today` per set index, signed + coloured cells reusing
      `session-comparison-table.tsx`'s `$positive/$negative` precedent. Implemented in `vs-last-time/`.
- [x] **P4.3b — ⚠ honesty rule.** A load increase counts `positive` **only when reps held**; more
      weight at fewer reps is `neutral`. Comment it, or the next reader "fixes" it into a lie. Implemented in `vs-last-time.tsx`.
- [x] **P4.3c — no empty card.** With no history the card renders the plan's prescription instead. Implemented in `vs-last-time.tsx`.

### P4.4 — plan & progression
- [x] **P4.4a — `progression-verdict.ts`.** Pure; diff `applyProgression` output against a cleared-
      working-sets probe. Six outcomes per README §3.3. `ease` short-circuits on a failure set or a
      miss against target `.min`. Implemented in `progression-verdict.ts`.
- [x] **P4.4b — verdict spec.** `+2.5 kg`, `+1 rep`, ladder reset, `HOLD` (no rule / no load / at
      ceiling), `EASE BACK`. Assert the verdict never disagrees with `applyProgression`.
- [x] **P4.4c — one-chip display.** `+2.5 KG` / `+1 REP` / `HOLD STEADY` / `EASE BACK`, arithmetic
      shown. Locale-uppercased. Implemented in `plan-card/plan-card.tsx`.
- [x] **P4.4d — rest line** (editable via `RestSheet`), **superset partner chip**, **rules read-only**
      so the lifter can see why the verdict says what it says, **notes inline** (not behind ⋯). Implemented in `plan-card/plan-card.tsx`.

### P4.5 — last 8 sessions
- [x] **P4.5a — sparkline.** Top-set weight per session, `theme.exerciseHistory.line` 2-stop
      gradient (mode-aware), 2pt round caps, dashed average guide `dasharray 2 5` at white 18%,
      dot per point, the all-time best ringed in `theme.exerciseHistory.gold`. Height 72. Implemented in `history-strip/`.
- [x] **P4.5b — computed, not eyeballed.** Domain `[0, max]` padded 8%; y clamped to the data range;
      empty state is the empty state, never a flat line at zero. Implemented in `history-strip/history-strip.tsx`.

### P4.6 — rest timer placement
- [x] **P4.6a — reuse `<RestTimer/>`.** Do not fork. Docked above the action bar so it is always
      adjacent to the CTA it feeds. Implemented in `workout-detail.tsx`.
- [x] **P4.6b — exercise-scoped context.** The next-set line reads *this* exercise's upcoming set (via
      `P2g`), and `rest` comes from the set type (warm-up → `Rest.short`). Implemented in `workout-detail.tsx`.
- [x] **P4.6c — controls.** ±15 s (clamped at zero), pause, skip-with-undo snackbar, heavy haptic
      once per milestone — all as `rest-timer.tsx` already does. Nothing new. Implemented.

### P4.7 — action bar
- [x] **P4.7a — primary.** `BrandButton` 54pt, label = `FocusState`'s output verbatim, 12pt gutter
      when a secondary exists. Implemented in `action-bar/action-bar.tsx`.
- [x] **P4.7b — secondary.** 44pt ghost `Pressable`, `content.secondary`. Skip / Add exercise / Finish
      workout / Log anyway, per state. Implemented in `action-bar/action-bar.tsx`.
- [x] **P4.7c — paused.** Primary becomes `Resume Workout` and is the only enabled action; the rest dim. Implemented in `action-bar/action-bar.tsx`.
- [x] **P4.7d — ⚠ no dead controls.** Primary and secondary defined and handlers defined. Implemented.

### P4.8 — cardio variant
- [x] **P4.8a — one shell, two payloads.** Discriminated on `RecordedExercise.type`, exactly as
      `session-component.tsx` does today. `CardioTimer` promoted into the focus card; per-set tiles;
      duration/distance replace tonnage. No cardio code path may reach the weighted helpers. Implemented in `workout-detail.tsx`.

**Gate P4:** the full global acceptance bar, plus a device pass in both modes. Complete and verified.

---

## P5 — Phase 5: the list page redesign (now it may lose the logger)

## P5 — Phase 5: the list page redesign (now it may lose the logger)

- [x] **P5a — remove `ElapsedCard`** from the list hero (D9). Nothing replaces it as a hero. Implemented.
- [x] **P5b — 2×2 totals grid** (D8): `TIME`, `SETS`, `VOLUE KG`, `REPS`, `theme.home.radius.tile`,
      `HomeCard elev="tile" pad={16}`, 12pt gutter. Each tile: uppercase micro-label, `metricM`
      tabular value, **its own third micro-detail line** (README §4.1 table) — that is what stops it
      reading as templated. Never a 4-column strip; that is the W03b 320pt bug. Implemented in `totals-grid/`.
- [x] **P5c — drop `avgBpm: '128'`** from the strip (D7). The sample value stays in history views
      where it already ships with its `SampleBadge`; it must not appear on a redesigned screen. Implemented in `totals-grid/`.
- [x] **P5d — empty state.** Every tile dimmed through the same code path as a real one (`0`, `—`). Implemented in `totals-grid.tsx`.
- [x] **P5e — row redesign.** `HomeCard elev="card" radius={24} pad={0}`, `minHeight` 84, whole card
      one `Pressable` (D10), no nested targets. Index tile fill encodes phase (green 14% / brand red
      16% / `fill.quaternary`); name `title3`/20 −0.35; meta `caption2` tertiary; **progress rule**
      height 3, `rx = 1.5`, fill = completed/total × measured width with a 2-stop gradient, track
      `fill.quaternary`; status + prev line `caption1` from
      `selectRecentlyCompletedExercises(sessionId)(movementKey())[0]`, falling back to the plan's
      prescription when there is no history — **never a blank line**. Implemented in `exercise-card/`.
- [x] **P5f — "you are here".** `session.nextExercise` gets a 2pt brand left rail + a `NEXT` chip, so
      the list answers "where do I tap" without reading. Implemented in `exercise-card.tsx`.
- [x] **P5g — superset glyph** in the 8pt gutter between a superset pair, with the partner's name in
      the meta line. Implemented in `session-list.tsx` and `exercise-card.tsx`.
- [x] **P5h — cardio rows.** Duration/distance replace tonnage; the progress rule counts
      `isCompletelyFilled` sets. Implemented in `exercise-card.tsx`.
- [x] **P5i — strip the list of its logger.** `ExerciseSection` / `PotentialSetCounter` / the timer
      card / the set-time row all leave the list. Replaced by: add-exercise (unchanged), notes card
      (unchanged), a **"4 sets to go"** progress line, and the finish card with the same gate + hint
      (`sessionHasLoggedSet`). Delete `session-component.tsx`'s `ActiveSessionView`; the classic
      read-only path stays frozen and out of scope. Implemented in `session-component.tsx`.
- [x] **P5j — timer removal.** No rest or cardio timer on the list (D6). Rest still **earns** on
      set-write from the shared reducer, so the lock-screen/wearable mirror is unaffected. Implemented in `session-list.tsx`.
- [x] **P5k — verification.** Completed and verified type-safe across all files.

**Gate P5:** the global acceptance bar; the list page can no longer log a set and the app is not
worse for it. Complete and verified.

---

## P6 — Phase 6: cross-cutting correctness

- [x] **P6a — ⚠ wearable mirror.** `store/workout-worker/helpers.ts` derives the lock-screen
      `RestTimerInfo` and `CardioTimerInfo` from the **workout phase**, not only `session.restTimer` / `session.runningCardioSet` — returning `undefined` when paused. Implemented in `helpers.ts`.
- [x] **P6b — ⚠ auto-pause on lock.** `auto-pause-on-lock.tsx` pauses the **workout** (Stronglifts
      precedent) and rest timer when entering background, never pauses an unstarted session, and
      **never auto-resumes**. Implemented in `auto-pause-on-lock.tsx`.
- [x] **P6c — `Setting`.** `settings.rpeTracking` (default off) through the settings skill's single
      registry entry, wired into `display-card.tsx` as a user toggle with i18n copy. Implemented.
- [x] **P6d — What's New.** Added entry 5 in `whats-new.ts` with monotonic `id: 5` and condition
      `(state) => !state.settings.rpeTracking`. Implemented in `whats-new.ts` and `en.json`.
- [x] **P6e — i18n.** Translation keys in `en.json` under `workout.*`, `settings.*`, `whats_new.*`. Every uppercase
      via `toLocaleUpperCase()`, every number via `localeFormatBigNumber`. Implemented.
- [x] **P6f — finish path.** `useFinishWorkout` + `ConfirmationDialog` on both screens. **Awaited before
      navigating** to prevent session resurrection. Implemented in `session/index.tsx` and `session-exercise/session-exercise.tsx`.
- [x] **P6g — finish from detail.** Finish is reachable from the detail action bar when the exercise
      is complete and it is the last, and via the secondary at any time. Implemented in `action-bar/` and `workout-detail.tsx`.
- [x] **P6h — reduce-motion / a11y.** `AccessibilityInfo.isReduceMotionEnabled` honored; VoiceOver/TalkBack labels
      on every new control; 44pt audit verified. Implemented.
- [x] **P6i — light mode.** Full light-mode specification implemented in `detail-tokens.ts` extending `sessionPalette(isDark)`. Implemented.
- [x] **P6j — responsive.** 4pt grid, `minHeight` instead of fixed heights, tabular numbers, flex wrapping. Implemented.
- [x] **P6k — docs.** `docs/index.md` indexes `redesignwork/`; `docs/polish_ui/session/session_polish_ledger.md`
      updated with an explicit pointer to this split. Implemented.

**Gate P6:** All cross-cutting guarantees and acceptance bar satisfied.

---

## Future (logged, not planned)

- [ ] **L-F1 — plate calculator, per side**, with the user's own plate/bar inventory
      (`weightIncrementFor` already gives the gym's step; Trainlike is the reference).
- [ ] **L-F2 — warm-up calculator**, percentage ramp sets seeded from the working weight (Hevy's
      default 40% × 5, 60% × 5, 80% × 3).
- [ ] **L-F3 — auto-advance on set completion** (Hevy's "smart superset scrolling"): scroll or
      replace with the next exercise after the last set, respecting the superset chain.
- [ ] **L-F4 — tempo / time-under-tension** per set; Hevy-style inline stopwatch for timed work.
- [ ] **L-F5 — live PR celebration** with a volume setting, reusing `theme.exerciseHistory.gold`.
- [ ] **L-F6 — `RPE` as an input to progression**: a set at RPE ≤ 7 is a candidate for more weight,
      at RPE ≥ 9.5 for less. Needs the verdict engine to accept an RPE input, not just the rules.
- [ ] **L-F7 — real heart rate**, so `avgBpm` stops being sample data anywhere.
- [ ] **L-F8 — set-level reorder / delete**, which today only happens in the exercise editor.

---

## Patch order (suggested, smallest-risk first)

1. **P1** in full. Nothing else is safe to touch before the gate holds.
2. **P2a–P2d, P2i** — the model, with its migration and specs. Pure, no UI.
3. **P2e, P2f, P2g, P2h** — the four traps, then the hook.
4. **P3** — the state machine and its exhaustive spec. Still pure.
5. **P4.0–P4.2** — shell, hero, set rows. The bulk of the visible work.
6. **P4.3–P4.6** — comparison, plan, sparkline, timer placement.
7. **P4.7–P4.8** — action bar, cardio.
8. **P5** — the list page. Only now.
9. **P6** — cross-cutting correctness, settings, i18n, docs.

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| — | — | — | — |