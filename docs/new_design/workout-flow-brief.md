# Workout Flow — Design Brief for SVG References

Companion to the home screen mockups in this folder (`home_page_screen1.svg`,
`home_screen_light_mode.svg`). The designer should produce one SVG per screen below,
in **both dark and light mode**, on a **393 × 852 pt** canvas (iPhone 16 Pro), using the
exact same visual language as the home mockups: card gradients + 1pt edge strokes,
30/24/22pt radii, 16pt side margins, SF Pro type with negative tracking on display
sizes and positive tracking on uppercase micro-labels, single brand-gradient accent
reserved for the primary action, 44×44 pt minimum touch targets, honest numbers,
no shaming empty states.

## Screen 1 — Active Session (in-workout)

**Goal:** the mid-workout screen. Used one-handed, sweating, between sets. The single
most important information (current exercise, next set, rest timer) must be readable
in a 1.5-second glance.

**Sections, top to bottom:**
1. **Header** — workout name (tappable to rename), live elapsed timer in tabular
   numerals, overflow menu (⋯): rename, workout settings, discard workout.
2. **Session stat strip** — small tiles or a single row: elapsed time, total volume
   lifted (kg), sets completed (n/m), exercises count. Live-updating.
3. **Exercise cards** (scrollable list, one card per exercise):
   - Card header: exercise name, muscle-group chip, notes indicator, "history" link,
     reorder handle, remove button.
   - "Last time" hint line: previous best performance for context (e.g. "Last: 100 kg × 8").
   - **Set rows**: set number, weight input, reps input, complete toggle (check).
     Completing a set starts the rest timer.
   - "Add set" row at the bottom of the card.
   - Cardio variant: duration/distance/intensity inputs + live cardio timer instead
     of set rows.
4. **Add exercise** — full-width button at the end of the list.
5. **Rest timer** — appears after a set is completed: circular countdown ring,
   time remaining (large, tabular), +30s, skip, pause/resume. Collapsible to a
   compact banner so the user can keep logging.
6. **Footer** — sticky "Finish workout" primary button (brand gradient); secondary
   "Cancel" / discard with confirmation.

**States to draw:** empty session (no exercises yet — neutral, forward-looking
empty state), set row being edited, rest timer running, rest timer paused.

## Screen 2 — Workout Editor (plan building, not live)

**Goal:** build or edit a planned workout outside of a live session.

**Sections, top to bottom:**
1. **Header** — plan/workout name (editable), Save (primary) and discard actions.
2. **Plan meta** — scheduled day, estimated duration, difficulty chip.
3. **Exercise list** — same card structure as the session screen but showing
   *targets* (e.g. "4 sets × 8–10 reps") instead of live inputs; reorder handles,
   remove buttons, per-exercise notes.
4. **Add exercise** button.
5. **Footer** — Save plan (primary).

## Screen 3 — Add Exercise / Exercise Search

**Goal:** find an exercise and add it to the session or plan, fast.

**Sections, top to bottom:**
1. **Search bar** — sticky, with clear button.
2. **Filter chips** — horizontally scrollable: All, Favorites, muscle groups
   (Chest, Back, Legs, Shoulders, Arms, Core), equipment.
3. **Exercise rows** — thumbnail/icon tile, exercise name, muscle + equipment
   subtitle, favorite star toggle, quick-add (+) button.
4. **Recent exercises** section header + rows (same row design).
5. **Create custom exercise** — tappable row at the end.

## Screen 4 — Exercise History (from within a session)

**Goal:** answer "what did I do last time?" without leaving the workout.

**Sections, top to bottom:**
1. **Header** — exercise name, personal-record banner if one exists.
2. **Progress mini-chart** — best set (weight × reps) over recent sessions.
3. **History list** — rows per past session: date, sets performed (weight × reps
   each), session name. Most recent first.
4. Notes from past sessions, if any.

## Screen 5 — Post-Workout Summary

**Goal:** review and celebrate the finished workout; the emotional payoff.

**Sections, top to bottom:**
1. **Header** — "Workout complete", date and start time, duration hero number.
2. **Headline stats** — duration, total volume, sets completed, PRs earned
   (2×2 tile grid or single row, matching home screen tile language).
3. **Comparison table** — this session vs. previous comparable session, per
   exercise: best set then vs. now, with improvement deltas.
4. **PR badges** — horizontal row of earned record badges (gold gradient, shine).
5. **Streak card** — current training streak with flame motif.
6. **Notes** — free-text field ("How did it feel?"), neutral prompt.
7. **Social** — "who else trained" / kudos and reactions row.
8. **Actions** — Share (primary), Edit session, Done.

---

**Delivery:** one SVG per screen per mode (10 files), dropped in this folder with
names like `workout_session_dark.svg` / `workout_session_light.svg`. Keep every
number internally consistent within a screen (weights, set counts, timer values
must agree with each other).
