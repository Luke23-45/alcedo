
---
name: apple-ios-frontend
description: >
  Build frontend interfaces with Apple iOS-level polish. Use when asked to design
  or build UI for mobile/web apps, dashboards, cards, or components where the user
  expects premium, HIG-faithful, "no compromise" quality. Covers design tokens,
  material treatment, typography, iconography, motion, and a pre-delivery checklist.
---

# Apple iOS Frontend Quality Standard

This skill encodes the design decisions that make an interface read as "Apple-grade"
rather than "generic." Follow every section. Do not skip the checklist at the end.

## 1. Core Philosophy

Apple quality comes from **restraint + physics + consistency**, not from adding features.

Three rules above all else:
1. **Light from above.** Every surface must look lit by a light source overhead.
   This is the single biggest differentiator between "flat design" and "premium."
2. **Real numbers.** Spacing, radii, timing, and dash values are computed, not guessed.
   If a ring is 80% full, the dash array must be exactly `0.8 × circumference`.
3. **No dead black.** Pure `#000` backgrounds feel dead. Layer subtle colored auras
   beneath content so darkness has atmosphere.

If you find yourself decorating, stop. Apple removes until only the essential remains,
then perfects what's left.

## 2. Design Tokens

### Spacing & Grid
- Side margin: **16pt** (cards), **24pt** (section titles / page headers).
- Gutters between cards: **12pt**.
- Internal card padding: **16pt** (20pt for hero cards).
- Vertical rhythm: alternate **12pt** (card-to-card) and **16pt** (internal).
- Base unit: **4pt**. Every dimension is a multiple of 4.

### Corner Radii (continuous-curve feel)
| Element | Radius |
|---|---|
| Large card / sheet | 28–32 |
| Tile / button container | 20–24 |
| Button / chip | 10–12 (or full pill = height/2) |
| Track / bar | height/2 |
| Screen (device frame) | ~54 |

### Typography (SF Pro)
Font stack:
```
-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text',
'Helvetica Neue', Helvetica, Arial, sans-serif
```

| Role | Size | Weight | Letter-spacing |
|---|---|---|---|
| Large title / greeting | 24–28 | 700 | **-0.55** (negative) |
| Section title | 15–17 | 600 | -0.3 |
| Body | 13–15 | 400–500 | 0 |
| Stat value | 20–22 | 700 | **-0.6** |
| Uppercase micro-label | 9–11 | 700 | **+0.9 to +1.4** |
| Tab label | 10 | 500–600 | -0.1 |

**Rule:** display sizes get *negative* tracking; uppercase labels get *positive* tracking.
Never the reverse.

### Color — Dark Mode
| Token | Hex | Use |
|---|---|---|
| Background | `#050507` → `#0B0B0E` gradient | Screen base |
| Card surface | `#1F1F23 → #131316` (diagonal) | Card body |
| Text primary | `#F5F5F7` / `#FFFFFF` | Headlines |
| Text secondary | `#98989F` / `#86868B` | Captions, labels |
| Text tertiary | `#6C6C70` | Units, hints |
| Border / edge | white @ 2–17% | Card edge stroke |

### Semantic Accents (iOS system colors)
| Name | Hex |
|---|---|
| Red / Move | `#FF2D55` / `#FF0A47` |
| Green / Success | `#30D158` / `#A6FF00` |
| Cyan / Stand | `#00D9E9` / `#17A9FF` |
| Orange | `#FF9F0A` |
| System Blue | `#0A84FF` |

**Always use a 2-stop gradient within a hue** (e.g. `#FF0A47 → #FF7A96`), never a flat
single color, for any ring/bar/accent that should feel energetic.

## 3. Material / Surface Treatment (CRITICAL)

Every card needs **two strokes** to feel lit:

1. **The body** — a diagonal 3-stop gradient, lighter top-left, darker bottom-right:
   ```svg
   <linearGradient id="card" x1="0" y1="0" x2="0.45" y2="1">
     <stop offset="0"   stop-color="#1F1F23"/>
     <stop offset="0.55" stop-color="#17171A"/>
     <stop offset="1"   stop-color="#131316"/>
   </linearGradient>
   ```
2. **The edge** — a separate 1pt stroke gradient, white fading downward:
   ```svg
   <linearGradient id="edge" x1="0" y1="0" x2="0" y2="1">
     <stop offset="0"   stop-color="#FFFFFF" stop-opacity="0.17"/>
     <stop offset="0.35" stop-color="#FFFFFF" stop-opacity="0.06"/>
     <stop offset="1"   stop-color="#FFFFFF" stop-opacity="0.025"/>
   </linearGradient>
   ```
   Inset it by 0.5pt so it hugs the corner radius.

**Shadow** — drop shadow with **dy ≈ 10, blur ≈ 14, black at 0.5** for cards;
**dy ≈ 6, blur ≈ 8** for smaller tiles. Primary action buttons get a **colored**
shadow matching their own hue (e.g. `#FF2D55` at 0.5).

**Gloss** — for hero icons / play buttons, overlay a top-half white gradient
(`white 0.30 → 0.0`) clipped to the shape. Instant physicality.

**Ambient auras** — 2–3 radial gradients in brand hues at **7–20% opacity** placed
asymmetrically behind content. Never centered, never uniform.

## 4. Iconography

- Draw in a **24×24 box**, center at `(0,0)`, stroke width **1.8–2.0** for outlined
  icons, rounded caps + rounded joins.
- Filled icons use the same geometry with `fill`.
- Optical centering: triangles/play buttons shift **+1.5px right**; circles shift as
  needed so they *look* centered, not measure centered.
- Use `currentColor` so icons inherit tint from parent `<g>`.
- Every icon you draw must be **reused via `<defs>` + `<use>`**, never duplicated inline.

## 5. Motion & Timing

- Standard deceleration curve: **cubic-bezier(0.16, 0.84, 0.24, 1)**.
- Load-in draw animations: **1.2–1.4s**, stagger siblings by **~0.12s**.
- Breathing/pulse loops: **2.0–2.4s**, ease-in-out, opacity `1 → 0.35 → 1`.
- Heart pulse: two quick beats then rest (`keyTimes 0;0.12;0.26;0.6;1`).
- Set the **final state as the base attribute** so the design degrades gracefully if
  animation isn't supported. `fill="freeze"`.
- Motion is for *delight and state*, never decoration. If it doesn't communicate, cut it.

## 6. Data Visualization

- Progress/ring dash = `percent × (2 × π × r)`. Compute it; do not eyeball.
- Rotate rings/bars `-90°` so they start at 12 o'clock.
- Tracks sit *behind* fills at **5–17% of the accent hue**.
- Bar charts: rounded caps (`rx = min(8, h/2)`), inactive bars in muted grey
  (`#4A4A50`), active bar gets gradient + glow + gloss cap + marker dot.
- Add a dashed **average guide line** (`dasharray 2 5`, white 18%) for context.
- Labels in tertiary grey; today/selected label promoted to white 700.

## 7. Composition

- One **hero card** anchors the screen; everything else supports it.
- Every section earns its own micro-detail (sparkline, delta chip, micro-histogram)
  so no two cards feel templated.
- Indicate scroll by **clipping content at the tab-bar boundary** with a fade-to-black
  gradient (last ~40pt), not with a fake arrow.
- Status bar, Dynamic Island, and home indicator must be pixel-faithful to iOS.

## 8. Quality Checklist (run before delivering)

- [ ] Every spacing value is a multiple of 4pt.
- [ ] Every card has the body gradient **and** the edge-stroke gradient.
- [ ] Every card has a shadow; primary actions have a *colored* shadow.
- [ ] Typography tracking is negative for display, positive for uppercase labels.
- [ ] All accents use 2-stop gradients, not flat fills.
- [ ] Background has ambient auras; no unbroken pure black.
- [ ] Icons use rounded joins/caps and are reused via `<use>`.
- [ ] Ring/bar dash or heights are mathematically computed.
- [ ] Motion uses the standard curve, final state is the base attribute.
- [ ] Scroll continuation is clipped + faded at the tab bar.
- [ ] No centered auras, no default-looking elements, no placeholder-feeling spacing.

## 9. Anti-Patterns (never do these)

- Flat single-color cards with a uniform grey border.
- Pure `#000` background with no atmosphere.
- Default `box-shadow` values / shadows on every element equally.
- All text the same weight; no tracking contrast.
- Icons with sharp joins or inconsistent stroke width.
- Animation on everything; motion that communicates nothing.
- Eyeballed progress rings that don't match the stated percentage.
- Generic-looking spacing (random padding, inconsistent radii).

## 10. Delivery

Deliver a single, self-contained artifact (SVG file or component) that renders
correctly when opened directly. Include `<title>` and `<desc>` for accessibility.
Comment each major section. After delivering, offer 2–3 logical next screens or a
light-mode variant.
```

