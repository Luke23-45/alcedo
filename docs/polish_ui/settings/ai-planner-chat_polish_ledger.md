# AI planner chat polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430,
large text, DE + RTL, landscape, Reduce Motion ON, keyboard rotation) still required
before closing the acceptance bar.** Per instruction no test files were written or run.
Scope: page 24 — AI planner chat (`(tabs)/settings/ai/planner-chat.tsx` →
bubbles, day dividers, composer, share button, plan/shared/pro/update
messages, typing dots, out-of-date banner) against
`docs/new_design/planner-chat-dark.svg` + the skill. The .NET AI API and
the chat service state machine are boundaries — app-side UI only.

Read method: route + every ai-planner presentation file fully, in render
order. Nothing inferred.

## What is already good (not touched by this ledger)

- Styles are modern: `type()` resolver, hairline token, screenPadding,
  `space.sm` mirrored in `COMPOSER_GAP` with a comment.
- All four actions are 44pt with exact disabled wiring + named labels
  (send gate = dispatch condition; share/send/stop/restart).
- Keyboard geometry frozen at rest (multiline growth + translation can't
  corrupt it); inverted list; DST-safe day arithmetic; RTL arrow flip.
- Bubbles: 78% max-width (responsive), grouped corner tightening, tail
  side full; plans/shared are full-width material, never bubbles;
  exhaustive message match.
- Typing dots freeze under reduced motion with a named progressbar role;
  out-of-date banner blocks input honestly; price uses the store's
  localized `priceString`.
- Whitespace sends trimmed; double-send window closed by derived state.

The problems below: one motion-source defect, one hardcoded English
plural, one device-locale date, continuous curves, and micro-details.

## Batch 1 — correctness + locale (AC01–AC04)

- [x] **AC01 — typing dots read the OS setting only.**
  `typing-dots.tsx` uses reanimated's `useReducedMotion`; the in-app
  toggle is ignored (WN01 class — and this screen even hosts users who
  turned it on). Fix: `useAppReducedMotion`.
- [x] **AC02 — shared-program count is hardcoded English.**
  `shared-program-message.tsx`: `{sessionCount} session/sessions` with
  no i18n at all. Genuine defect. Fix: ICU plural key (en + fallback,
  per the fragment pattern) — check for an existing sessions-count key
  before inventing one.
- [x] **AC03 — day divider date uses the device locale.**
  `dayDividerLabel`: `toLocaleDateString(undefined, …)` (BK03 class).
  Fix: thread `preferredLanguage` from the route (it already selects
  from the store elsewhere on this screen).
- [x] **AC04 — bubbles lack continuous curves.** `UserBubble` /
  `AgentBubble` carry per-corner radii with no `borderCurve`. Fix:
  `style={{ borderCurve: 'continuous' }}` at both usages (the pattern
  exercise-search rows already use).

## Batch 2 — verify-only (no code expected)

- [ ] **L01 — pill at 200%.** `max-height: 132` caps the composer; the
  field scrolls internally past it. Verify the capped field stays
  usable at 200% DE before changing the cap.
- [ ] **L02 — placeholder grey.** Single `#8E8E93` both modes on the
  tertiary fill — verify contrast dark + light on device.
- [ ] **L03 — keyboard/rest-gap.** Device-only behavior the verification
  loop explicitly didn't claim — verify on device, don't rework blind.
- [ ] **L04 — gradient id safety.** `SEND_BLUE`/bubble colors are const
  arrays spread per use (no shared defs ids) — recorded keep.

## Implementation notes (2026-09-23 — read before device pass)

- **AC02 reuses, not invents.** `exercise.history.session_count.one/other`
  carry exactly the needed shapes; same meaning, translators already
  covered them. Count now locale-formatted with `preferredLanguage`.
- **AC03 optional param.** `dayDividerLabel` gains trailing optional
  `locale` — existing callers (and the simulation spec, which never calls
  it directly) compile untouched; `undefined` keeps device-default.
- **Gates:** `typecheck` clean on all touched files (remaining errors
  pre-exist in untouched files).

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Motion hook, ICU plural, divider locale, continuous bubbles | AC01–AC04 | typecheck (touched files clean) |

## Verification (owed before close)

- 320/393/430 × dark/light, 200% text + DE + RTL layout, landscape;
  Reduce Motion ON dots; keyboard open/close + rotation; all five
  message types incl. multi-session shared program; VoiceOver on
  bubbles/composer/actions; `npm run typecheck`.
