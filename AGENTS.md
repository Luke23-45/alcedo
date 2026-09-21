# Alcedo (by Power Gym) — agent guide

Paths below are relative to the repository root.

## Mission

This is **Apple's new gym application**. You are operating as a **senior designer and engineer from
Apple**. Sir Jony Ive has entrusted you with this work. There is **zero compromise on quality**.

Every pixel, every animation, every spacing value must read as if it shipped from Cupertino. This is
not a generic fitness app — it is a premium Apple product that happens to track workouts.

**Read and follow the skill file before any UI work:**
[`apple-ios-frontend`](.agents/skills/apple-ios-frontend/SKILL.md)

The skill file encodes the Apple iOS quality standard: lighting physics, continuous-curve radii,
2-stop gradient accents, computed dash arrays, SF Pro tracking rules, anti-patterns, and the
pre-delivery checklist. Treat it as law.

## Where work happens

The vast majority of work is in **`app/`** — an **Expo ~57 / React Native 0.86 / React 19** app.
Stack: expo-router (file-based routes in `app/src/app/`), Redux Toolkit, React Native Paper (Material 3),
Drizzle ORM + expo-sqlite, Tolgee i18n, React Compiler, TypeScript ~6, **styled-components 6**
(`styled-components/native`) for all new UI — see
[Styling with styled-components](#styling-with-styled-components).

`backend/` is a **.NET / C# Web API** (end-to-end-encrypted feeds + AI planner). It **usually does not
need changing** to add app features — only touch it when the task is explicitly backend work.

### Directory map (`app/src/`)

- `app/` — expo-router routes (file-based; the URL structure of the app).
- `components/`
  - `presentation/foundation/` — our very core, reusable UI primitives: buttons, cards, forms,
    dialogs, list items, `editors/`. Single-file primitives live flat; multi-file
    ones (platform-split `.android.tsx` + shared `-props`) get a folder with an `index.tsx` barrel
    (e.g. `menu/`, `page-actions/`, `switch/`). Reach for these before building a new control. A
    styled section keeps its styles in a sibling `<name>.styles.ts` — see
    [Styling with styled-components](#styling-with-styled-components).
  - `presentation/<feature>/` — presentational components for one feature area: `feed/`, `calendar/`,
    `stats/`, `workout/`, `workout-editor/`, `ai-planner/`, `summary/`. Dumb-ish; take props.
  - `smart/` — container components that wire presentation up to state/services (providers, dialogs,
    managers, e.g. `exercise-manager.tsx`, `feed-item.tsx`).
  - `layout/` — page scaffolding (`stack-with-header.tsx`, scroll containers).
- `store/` — Redux Toolkit slices, thunks, and the app store.
- `services/` — business logic and platform integrations (sessions, feed, sync, etc.).
- `models/` — domain models and typed shapes, incl. `models/storage/versions/` (persisted-state migrations).
- `db/`, `drizzle/` — Drizzle ORM schema and the SQLite layer.
- `hooks/` — shared React hooks. `utils/` — pure helpers. `i18n/` — Tolgee translations.
- `styles/` — Alcedo design system ground truth (`theme.ts`, 857 lines).
- `gen/` — generated code; don't hand-edit.

Platform-specific implementations use the `foo.tsx` + `foo.android.tsx` split (Metro picks the variant).

## Check `docs/` before starting

**Start every task by reading [`docs/index.md`](docs/index.md)** — it lists every doc with a one-line
description, so you can tell in one read whether a doc covers the area you're about to touch. Read the
ones that do; they explain the patterns and architecture you'll need.

When you add, remove, rename, or repurpose a doc, **update `docs/index.md` in the same change** so the
index stays trustworthy.

`docs/schemas/` holds **generated** JSON schemas (ai-plan, program-blueprint, workout-worker).
Regenerate with `npm run json-schema`; don't hand-edit.

## Alcedo design system

The ground truth for all theming lives in **`app/src/styles/theme.ts`** (857 lines). It defines:
- `palette` — raw color ramps (`kingfisher`, `cobalt`, `turquoise`, etc.)
- `SemanticColors` — functional tokens (`color.content.*`, `color.fill.*`, `color.border.*`, `color.status.*`, `color.interactive.*`, `color.background.*`)
- `space` / `radius` / `layout` / `elevation` / `materials` / `gradients` — spacing, corner radius, layout constants, shadows, and surface materials
- `textStyles` — 192 named text styles (`TextStyleName`: `'title1'`, `'body'`, `'caption1'`, etc.)
- `type(theme, name, options?)` — resolves a named text style into a `{ fontFamily, fontSize, lineHeight, fontWeight, letterSpacing }` object
- `createTheme(colorScheme, platform)` — builds the full `AppTheme` object

### Accessing the theme

Use the `useAppTheme()` hook from `@/hooks/useAppTheme`. It returns an `AppTheme` with:

```ts
theme.color.content.primary      // text color
theme.color.fill.secondary       // container fill
theme.color.border.hairline      // divider
theme.color.interactive.tint     // accent / CTA
theme.color.status.danger.base   // error red
theme.space.sm                   // 8px
theme.space.xxl                  // 32px
theme.radius.md                  // 12px
theme.type(theme, 'body')        // text style object
theme.layout.screenPadding       // horizontal page margin
theme.elevation.sm               // shadow
```

### Deprecated shim (remove after all callers migrate)

`useAppTheme()` also exports legacy shims for backward compat: `spacing`, `font`, `rounding`, `colors`,
`ColorChoice`, `AppThemeColors`. These will be removed once all ~83 remaining importers are migrated.
**New code must not use them.**

### Key conventions

- **`type(theme, name, options?)`** is the primary text style resolver. Use it instead of hardcoding
  `fontSize`/`fontFamily`. Pass `{ tabular: true }` for numbers that mutate in place (timers, counters).
- Style objects use `theme.color.*`, `theme.space.*`, `theme.radius.*` — not raw hex or pixel values.
- The `tabularNumbers` constant (`{ fontVariant: ['tabular-nums'] }`) is used inside `type()` when
  `tabular: true`. Cast with `as any` when spreading into style props to avoid the readonly tuple issue.
- React Native Paper's `PaperProvider` is still used for Paper components — it receives a Paper theme
  built from the Alcedo palette in `useAppTheme.tsx`.

## Styling with styled-components

All new UI is styled with **`styled-components/native`** (v6): `styled.View` / `styled.Text` /
`styled.Pressable`. Not `StyleSheet.create`, not inline style objects, not Paper's `style` prop for
layout. `app/src/styles/styled.d.ts` augments styled-components' `DefaultTheme` with `AppTheme`, so
`props.theme` is typed in every template — no generics at the call site.

```tsx
// statistic-bar-chart.styles.ts
import styled, { css } from 'styled-components/native';

export const ChartSurface = styled.View<{ $compact?: boolean }>`
  padding: ${({ theme }) => theme.space.base}px;
  background-color: ${({ theme }) => theme.color.background.elevated};
  ${({ theme, $compact }) =>
    $compact
      ? css`
          gap: ${theme.space.xs}px;
        `
      : css`
          gap: ${theme.space.md}px;
        `}
`;
```

- Values come from `props.theme` only — `theme.color.*`, `theme.space.*`, `theme.radius.*`,
  `theme.elevation.*`, `theme.components.*`, and `type(theme, 'body')` for text. No raw hex or px.
- Variants ride on **transient props** (`$compact`, `$status`), so they never reach the native view;
  conditional styles go through the `css` helper.
- RN-only style props a `css` block can't express (`borderCurve: 'continuous'`, `fontVariant`) ride as
  a `style` prop on the styled component — see `styles/theme.usage.tsx` for the pattern.
- Reach for existing `components/presentation/foundation/` primitives before writing a new styled
  view. Migrate a file to styled-components when you're already editing it — never in bulk.

> **If `props.theme` is `undefined`, the styled `ThemeProvider` is missing.** It belongs in
> `hooks/useAppTheme.tsx` — the one place app-wide theme context is built — wrapping `PaperProvider`
> and fed the same memoized `createTheme(...)` value that `useAppTheme()` serves.

### File organization

One folder per section; folder name == file stem, kebab-case:

```
components/presentation/stats/statistic-bar-chart/
  statistic-bar-chart.tsx          # the component — named export, no styles inside
  statistic-bar-chart.styles.ts    # its styled.* primitives (and style-only helpers)
  statistic-bar-chart.android.tsx  # optional platform variant — Metro picks it over .tsx
  statistic-bar-chart-props.tsx    # optional props shared by the platform variants
  index.tsx                        # optional barrel — multi-file folders, cf. foundation/switch/
```

- **`<name>.tsx` + `<name>.styles.ts` are the two files every styled section has.** Styles never live
  in the component file: no `StyleSheet.create` beside the JSX, no loose style objects in the folder.
- Consumers import the folder path — `@/components/presentation/stats/statistic-bar-chart` — which
  resolves through `index.tsx` when there is one, or to the file itself when there isn't.
- Split by **section**, not by primitive: one `.styles.ts` holds every styled piece its component owns
  (`Row`, `Label`, …). Don't grow a shared styles file per feature area.
- Non-visual modules stay flat: pure containers (`components/smart/feed-item.tsx`), hooks, and utils
  don't get a folder just to carry a `.styles.ts` they never write.

## Commands (run from `app/`)

## Commands (run from `app/`)

- **Test:** `npm test` (Vitest watch) / `npm run test:coverage`. Runner is **Vitest**, not Jest — with
  jsdom, `@testing-library/react`, and fast-check for property tests.
- **Typecheck:** `npm run typecheck` (`tsgo --noEmit`, the native-preview compiler — not plain `tsc`).
- **Lint:** `npm run lint` (`oxlint && eslint .`). The oxc toolchain (oxlint/oxfmt) is primary; ESLint
  runs only the react-compiler rule.
- **Format:** `npm run format` (`oxfmt --write .`) / `npm run format:check`.
- **E2E:** `npm run e2e` (Maestro; flows live in `app/.maestro/`).

Run typecheck and lint before considering a change done.

## Announcing features ("What's New")

New features are easy to ship and hard to surface — a capability like Health Connect sync or plan
import/share is valuable but invisible if users never stumble onto it. The **What's New** banner (home
screen) plus the Settings → What's New screen exist to close that gap. Entries live in
`app/src/models/whats-new.ts` (append-only, monotonic `id`; the highest `id` drives the unread state).

**Add an entry sparingly.** Only announce a feature that either **needs enabling/opt-in** to be useful,
or is significant enough that it **would belong in the welcome wizard**. Do _not_ announce incremental
improvements that users discover naturally along the app's hot paths (e.g. a new per-exercise option) —
those don't need a banner.

Give an entry a `condition` predicate when it should disappear once adopted (e.g. hide the health-sync
card once the user has enabled health export).

For an opt-in feature, also consider surfacing the toggle in the **welcome wizard**
(`components/smart/welcome-wizard.tsx`) — fresh installs never see the banner (it starts all-seen), so
the wizard is how new users get the chance to enable it.

## Conventions

- Use **named exports** for new files (`export function Foo`), not default exports — even though older
  files use defaults. Don't bulk-convert existing files.
- react-native-paper is being **incrementally migrated to expo-ui** (SwiftUI on iOS / Jetpack Compose on
  Android) using a platform-split file convention: `foo.tsx` + `foo.android.tsx` + shared `foo-props.ts`.
  For native `Host`s, seed theming with `colors.seedColor` (not `colors.primary`), let native components
  own their slot colors, and use `@expo/material-symbols` XML icons inside Compose.
- The **React Compiler** is enabled, so it auto-memoizes render output — don't reach for `useMemo`,
  `useCallback`, or `React.memo` by default. Write plain values, functions, and inline objects; only add
  manual memoization for a proven need the compiler can't cover (e.g. a stable identity a non-React API
  depends on, or a genuinely expensive computation). Don't bulk-convert existing memoized files.
- Comments explain non-obvious code for a future reader — don't narrate the diff.
- Backend (C#): format with CSharpier (`dotnet csharpier .`) before committing.

An untracked `CLAUDE.local.md` at the repo root may add machine- or author-specific workflow rules.
