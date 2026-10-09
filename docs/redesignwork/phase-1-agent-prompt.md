# Phase 1 agent prompt — hard copy of the workout detail page

Paste everything below this line to the implementing agent.

---

## Your task

Implement **Phase 1** of the workout split in this repo: add a second screen that focuses on a
single exercise inside the workout being performed, as an exact working copy of what the active
session screen already does. Do **not** redesign anything yet. Do **not** change how the existing
session screen behaves or looks. This phase exists purely so that later phases have something to
refactor.

The plan and the item checklist live at:

- `docs/redesignwork/README.md` — the plan (read §2 decisions and §3 architecture; §4 describes the
  *final* design, which is explicitly **not** this phase)
- `docs/redesignwork/workout-split_ledger.md` — the checklist. Your items are **P1a–P1d**.

Read both before writing code. `README.md` §4 is the destination, not the scope — if you find
yourself building the focus card, the verdict chip, or the 2×2 stats grid, you have overreached.

## Repo facts you need (already verified — do not re-derive)

- **App:** Expo ~57 / RN 0.86 / React 19, expo-router file-based routes, Redux Toolkit, Tolgee i18n,
  styled-components 6, React Compiler enabled. All commands run from `app/`.
- **Agent guide (read it):** `AGENTS.md` at the repo root.
- **Design law:** `.agents/skills/apple-ios-frontend/SKILL.md`. The bar is Apple iOS quality. Zero
  compromise on spacing, radii, iconography, motion.
- **Polished baseline:** `docs/polish_ui/session/session_polish_ledger.md` — SX01–SX10 are already
  done in the code. You inherit them; you do not redo them.

### The active workout today

Route `app/src/app/(tabs)/(session)/session/index.tsx` is thin. All the UI lives in
`app/src/components/smart/session-component.tsx` (478 lines), which has two branches:

- `isActiveWorkout` → `ActiveSessionView` — the live workout screen. **This is what you extend.**
- otherwise → a legacy read-only "classic" list. **Frozen. Do not touch it.**

`ActiveSessionView`'s children are direct children of `FullHeightScrollView` and it depends on their
index positions:

```
0  nav        1  ElapsedCard        2  StatStrip        3  body        4  notes        5  footer
```

with `stickyHeaderIndices={[2]}`. **Index 2 is load-bearing** (see P1b step 4).

### The pieces you will compose

| Thing | Path |
| --- | --- |
| `SessionComponent` (active view lives here) | `app/src/components/smart/session-component.tsx` |
| Session `⋯` nav menu | `app/src/components/smart/session-more-menu-component.tsx` |
| Exercise card shell + its `⋯` menu + notes + remove confirm | `app/src/components/presentation/workout/exercise-section.tsx` |
| Exercise card styles (styled-components) | `app/src/components/presentation/workout/exercise-section.styles.ts` |
| Weighted set logger | `app/src/components/presentation/workout/weighted/weighted-exercise.tsx` |
| Cardio set logger | `app/src/components/presentation/workout/cardio/cardio-exercise.tsx` |
| Nav bar | `app/src/components/presentation/workout/session/session-nav/session-nav.tsx` |
| Elapsed clock card | `app/src/components/presentation/workout/session/elapsed-card/elapsed-card.tsx` |
| Finish footer | `app/src/components/presentation/workout/session/session-footer/session-footer.tsx` |
| Rest timer | `app/src/components/presentation/workout/rest-timer.tsx` |
| `useAddExercise` (insert-then-push) | `app/src/hooks/useAddExercise.ts` |
| `useFinishWorkout` | `app/src/hooks/useFinishWorkout.ts` |
| Scroll container | `app/src/components/layout/full-height-scroll-view.tsx` |

### Exact APIs (signatures verified)

```ts
// app/src/store/stored-sessions/index.ts — all exported
selectSession:      (state, id: string) => Session | undefined
selectActiveSession:(state)            => Session | undefined
updateStoredSession: PayloadAction<{ sessionId: string; update: (session: Session) => Session }>
sessionFinished:    ActionCreator<string>
awaitSessionFinished(id: string): Promise<void>

// app/src/store/index.ts
useAppSelector            = useSelector.withTypes<RootState>()
useAppSelectorWithArg<TArg, TRes>(selector: (s: RootState, arg: TArg) => TRes, arg: TArg)
selectRecentlyCompletedExercises = createSelector(...) // (state, excludeSessionId) => (movementKey) => RecordedExercise[]

// app/src/components/smart/session-exercise-editor/session-exercise-editor.tsx — the href convention to copy
export function getSessionExerciseEditorHref(sessionId: string, index: number, opts?: { isNew?: boolean }): Href

// app/src/hooks/useAddExercise.ts
useAddExercise(sessionId: string | undefined): () => void

// app/src/components/presentation/workout/exercise-section.tsx
interface ExerciseSectionProps<T extends RecordedExercise> {
  recordedExercise; previousRecordedExercises; toStartNext; isReadonly; showPreviousButton;
  variant?: 'active' | 'classic'; index?: number; onAddSet?: () => void;
  children; updateExercise; onEditExercise; onRemoveExercise;
}
```

Existing i18n keys you will need — **all of these already exist in `app/src/i18n/en.json`, so add no
new keys**: `exercise.add.title`, `workout.session.finish_workout.button`,
`workout.session.finish_disabled.hint`, `workout.finish.confirm.title`,
`workout.finish.incomplete.body`, `generic.finish.button`, `generic.back.button`,
`generic.more_options.label`, `workout.edit.button`, `workout.discard.*`.

### Route naming

`app/src/app/(tabs)/(session)/session/exercise.tsx` → URL **`/session/exercise`**. The `(tabs)` and
`(session)` groups are path-less, exactly like the sibling `post-workout.tsx`, which is pushed as
`/session/post-workout`. `/session` is a valid href (see `post-workout.tsx:23`).

---

## The one architectural decision

The ledger's P1b says "extract the shared timer wiring into one hook both pages call." **Do not do
that.** It would be an extraction with a single caller — premature, and it churns a file that
currently works.

Instead: **`SessionComponent` gains one optional prop, `focusExerciseIndex`.** When set, the active
view renders exactly one exercise and drops the session-wide chrome. The list screen and the detail
screen then render through *the same component with the same wiring*, so a copy of 300 lines cannot
drift from its original. That is a strictly better answer to "hard copy, then refactor": the
divergence risk is zero by construction rather than zero by discipline.

Record the deviation and its reason in the ledger's P1b row when you close it.

## What to build

### P1a — route + container

**New:** `app/src/components/smart/session-exercise/session-exercise.tsx`

```tsx
export function getSessionExerciseHref(sessionId: string, index: number): Href {
  return `/session/exercise?sessionId=${encodeURIComponent(sessionId)}&index=${index}` as Href;
}

export function SessionExercise({ sessionId, index }: { sessionId: string; index: number }) { … }
```

**New:** `app/src/components/smart/session-exercise/index.tsx` — a one-line barrel re-exporting
both, matching `session-exercise-editor/index.tsx`.

**New:** `app/src/app/(tabs)/(session)/session/exercise.tsx` — copy the param-guard shape of
`app/src/app/exercise-editor.tsx` exactly, including its `first()` helper for repeated query params:

```tsx
const sessionId = first(params.sessionId);
const index = Number(first(params.index));
if (!sessionId || !Number.isInteger(index) || index < 0) {
  return <Redirect href="/" />;
}
return <SessionExercise sessionId={sessionId} index={index} />;
```

### P1b — the focused view on `SessionComponent`

Add to `SessionComponent`'s props:

```tsx
/**
 * Active workout only: render just this one exercise, as the detail screen asks.
 * The session-wide chrome (stat strip, exercises header, add row, notes) is
 * omitted because each describes the whole session rather than this exercise.
 */
focusExerciseIndex?: number;
```

In `ActiveSessionView`, thread it through and:

1. **Nav title** — the exercise's `blueprint.name` when focused, else `session.blueprint.name`.
2. **Body** — when focused, render `props.renderItem(focusedExercise, focusExerciseIndex)` inside
   the same horizontal inset the list uses (`marginHorizontal: 16`), and render **nothing** for the
   empty state, `ExercisesHeader`, the dashed add-exercise row, or the notes card.
3. **Back** — the detail screen must go to the session list, so pass a handler from the container
   (`dismissTo('/session')`) rather than the list's own `back()`. `back()` has no target on a cold
   deep link; the exercise-editor route already guards for exactly that reason. Keep the list's
   `back()` unchanged.
4. **`stickyHeaderIndices`** — this is the trap. With the stat strip omitted, index 2 is the body,
   and `[2]` would pin the exercise card as the list screen pins the strip. Pass
   `stickyHeaderIndices={focused ? [] : [2]}` and leave a comment saying why.

Keep `ElapsedCard` on the detail screen — the brief keeps the clock at the top of this page.
Keep the timer slot and the finish footer.

Do **not** change the `renderItem` factory's behaviour. It must keep passing `index: index + 1`, so
the detail screen's index tile shows the exercise's true position in the session.

### P1b (cont.) — navigation affordance on the list

The list screen keeps its set logger in this phase, so an exercise card **cannot** become a single
press target — the weight, reps, check, and `⋯` controls inside it all have to keep working. Do not
try to wrap the card in a `Pressable`; it will swallow those taps.

Instead, add one explicit control to the exercise card header:

- `ExerciseSection` gains an optional `onOpenDetail?: () => void`, rendered **only** in the
  `variant === 'active'` branch and **only** when provided, positioned **after** the existing `⋯`
  menu trigger.
- Render it as a chevron-right glyph: a `styled.Pressable` in `exercise-section.styles.ts`
  (that file is styled-components — keep it that way), 24pt visual width, `hitSlop` to reach 44pt
  (`hitSlopFor(24)` is exported from `app/src/styles/theme.ts` if you want it), tinted
  `sessionPalette(theme.isDark).nav.chevron` (`#8E8E93` both modes — the disclosure chevron needs
  more contrast than `card.addChevron`, which is a dimmed `#48484A` on dark). Mirror
  `HeaderMenuTrigger` in `exercise-section.tsx` for the geometry, and match `SessionNav`'s
  `BackButton` SVG idiom: stroke 2, `strokeLinecap`/`strokeLinejoin` round, `fill="none"`.
- `testID="open-exercise-detail"`, `accessibilityRole="button"`, and a localized
  `accessibilityLabel` built from `exercise.add.title`-style keys — check what exists; if nothing
  fits, use `t('workout.session.view_history.button')` is WRONG, so instead reuse
  `t('generic.more_options.label')` only if that is also wrong — **preferred**: add nothing new and
  label it with the exercise name plus an existing "open" sense; if no existing key is honest, add
  exactly one new key `workout.session.open_exercise.button` to `en.json` only (other locales fall
  back to English) and say so in your report.
- Thread `onOpenDetail` through `WeightedExercise` and `CardioExercise` (both pass it to
  `ExerciseSection`) and supply it from `SessionComponent`'s `renderItem` — **only** when not
  focused, so the detail screen's own card does not offer to open itself.
- Pass `push(getSessionExerciseHref(session.id, index))` from the container. The list screen's
  `SessionComponent` needs that href, so the href helper must be importable there.

**Known trade-off to record, not to fix now:** the header is index tile + name + status chip (93pt
min-width) + `⋯` + chevron. At 320pt the name lane shrinks to roughly 105pt and long names
ellipsize. `ExerciseName` already has `numberOfLines={1}` so it degrades correctly. Verify at 320pt
and write the measurement into the ledger. This control disappears entirely in P5, when the whole
row becomes the target.

### P1b (cont.) — share the finish flow

The detail screen needs a Finish action, and that flow is async and durability-critical (it must be
awaited before navigating, or an app kill resurrects the workout — see the load-bearing comment at
`app/src/app/(tabs)/(session)/session/index.tsx:35`). Do not copy it.

**New:** `app/src/hooks/useFinishSessionFlow.ts` taking
`{ sessionId: string | undefined; isComplete: boolean }` and returning
`{ save: (force?: boolean) => Promise<void>; confirmDialog: ReactNode }`.

Move the logic verbatim out of `session/index.tsx:22-41`: gate on `!force && !isComplete` → open
the confirmation; otherwise honour `settings.showPostWorkoutSummary` by pushing
`/session/post-workout?sessionId=…&source=finished`, else `await finishWorkout()`, `dismissTo('/')`,
and `push('/diff-save')` when it returned a diff. `confirmDialog` is the `ConfirmationDialog`
with today's exact props (`okText={t('generic.finish.button')}`, `textContent`, `headline`, `open`;
note it is **not** `destructive` — finishing is not deleting).

Then have both `session/index.tsx` and `SessionExercise` call the hook and render `confirmDialog`.
This is a pure move: verify with `git diff` that the list screen's finish behaviour is unchanged.

### P1c — wire the detail screen up

`SessionExercise` composes:

- `session = useAppSelectorWithArg(selectSession, sessionId)` — **not** `selectActiveSession`.
  `post-workout.tsx` uses `selectSession`, and it is the right call: finishing clears
  `activeSessionId`, so the active selector would go null mid-dismiss and blank the screen.
- All hooks run before any early return.
- `if (!session || !session.recordedExercises[index]) return <Redirect href="/session" />`. The
  exercise can vanish while this screen is open (removed from the list screen underneath, or the
  session finished), which otherwise leaves a permanently blank screen with a back button.
- `{keepAwake && <KeepAwake />}` reading `settings.keepScreenAwakeDuringWorkout`, with the same
  local `KeepAwake` helper the list route defines (hooks cannot be called conditionally). Include it
  for cold-deep-link correctness even though the list screen also holds it.
- `<Stack.Screen options={{ headerShown: false }} />` — the active session draws its own nav, same
  as the list route.
- `<SessionComponent session={session} isActiveWorkout focusExerciseIndex={index}
   updateSession={(update) => dispatch(updateStoredSession({ sessionId, update }))}
   onFinishWorkout={save} />`
- Nav menu slot: `SessionMoreMenuComponent session={session} isActiveWorkout` — this is where Add
  exercise, Edit workout, and Discard live on the detail screen. The exercise's own `⋯` menu
  (Edit / View history / Notes / Stats / Remove) already lives inside its card, so there is no
  duplication.

### Deliberate omissions from the detail screen, each with a reason

Do not "fix" these by adding the missing section:

| Omitted | Why |
| --- | --- |
| `StatStrip` | Session-wide totals; misleading on a one-exercise page. It stays on the list. |
| `ExercisesHeader` | "3 of 6" only makes sense in the list. |
| Dashed add-exercise row | Adding from here would leave you focused on the old exercise. Add lives in the nav `⋯` menu, which is a working path today. |
| Session notes card | Session-level, not exercise-level. It stays on the list. |
| `openPostWorkoutSummary` | `SessionComponent` only reads it in the frozen classic branch; passing it to the active view would be dead. Do not propagate dead props — and do not delete it either, that is out of scope. Note the finding. |

### P1d — verification

All from `app/`:

```
npm run typecheck     # tsgo --noEmit — not plain tsc
npm run lint          # oxlint && eslint .
npm test              # Vitest watch — run once and exit, don't leave it watching
```

Then reason explicitly about:

1. The list screen is unchanged. `git diff` on `session-component.tsx` should touch only the
   `focused` branches and the prop. Anything else is a bug.
2. `completing-a-session.yaml` (a Maestro flow) drives the **list** screen through
   `repcount` → `repcount-weight` → `increment-weight` ×3 → `save` → `finish-session-button` →
   `action-ok`. It must still pass. Do not rename or remove any of those testIDs, and do not change
   `rest-timer`'s.
3. The detail screen renders with a weighted exercise and with a cardio exercise.
4. Remove an exercise from the list while the detail screen is open → the detail screen redirects,
   it does not go blank.
5. Start with an empty session, add an exercise, tap the chevron, log sets, go back: the list
   reflects everything.

## Hard constraints — do not break these

- **No model changes.** Nothing under `app/src/models/`, no storage version, no migration, no
  `SessionJSON` bump. The persisted workout clock, set type, and RPE are Phase 2.
- **No settings changes.** No new `settings` keys. (Phase 2 adds `rpeTracking`.)
- **No new Redux state.** Read `selectSession`, write `updateStoredSession`. There must be exactly
  one source of truth for the session, which is why the two screens cannot disagree.
- **Do not restyle anything.** Same cards, same radii, same tokens, same motion, same haptics. The
  only new visual is the chevron. If you find yourself adjusting a colour, a radius, or a spacing
  value to make room, you are redesigning — find another way.
- **Do not touch the classic read-only branch** of `session-component.tsx`.
- **React Compiler is enabled.** Do not add `useMemo`, `useCallback`, or `React.memo` — write plain
  values and inline objects.
- **Named exports** for new files, never default exports. (`session-component.tsx` uses a default
  export; do not propagate that to new code, and do not bulk-convert existing files.)
- **New UI goes in styled-components**, in a `<name>.styles.ts` beside its component — not
  `StyleSheet.create`, not inline style objects. Values from `props.theme` only.
- **Every interactive target is ≥ 44pt**, or reaches it with `hitSlop`, without overlapping a
  neighbour's target. The chevron sits next to the `⋯` trigger, which is already 30×22 with
  `hitSlop={{ top: 11, bottom: 11, left: 8, right: 6 }}` — make sure the two hit areas do not
  overlap.
- **No new i18n keys** unless you have a genuinely honest need, in which case add exactly one to
  `en.json` and report it. Uppercase labels use `toLocaleUpperCase()` — React Native ignores
  `text-transform`. Numbers use `localeFormatBigNumber`. No English in accessibility labels.
- **Comments explain non-obvious reasoning for a future reader; they do not narrate the diff.** This
  repo is heavily and deliberately commented — match that. In particular, leave a comment on every
  non-obvious thing you had to work out (the sticky-index shift, the `selectSession` choice, the
  320pt trade-off).
- **Do not run `npm run e2e`.** Maestro needs a device.

## Definition of done

- `/session/exercise?sessionId=<id>&index=<n>` opens and is fully usable for both weighted and
  cardio exercises: log sets, edit weight, add sets, notes, remove, view history, edit exercise.
- The rest and cardio timers work there, and the Finish action finishes the workout from there.
- Add exercise, Edit workout, and Discard are reachable from the detail screen's nav menu.
- A cold deep link with bad params redirects home; a stale index redirects to `/session`.
- `typecheck`, `lint`, and `npm test` are green.
- The list screen renders and behaves exactly as it did before you started.
- The ledger's P1a–P1d rows are updated with what you closed, what you verified, and the P1b
  deviation note.

Report back: the files you created and changed, the verification output, the 320pt measurement,
anything you deliberately left out, and anything you found that Phase 2–6 should know.