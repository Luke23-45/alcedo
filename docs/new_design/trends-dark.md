# PHASE 3 · KINETIC TRENDS
### Three screens · Dark · All values derived from one verified dataset

---

## ⚠️ Continuity patches required on the delivered home page

Law III audit found **two** errors in `home` that must be corrected before Trends can be consistent with it:

| Location | Was | Must be | Why |
|---|---|---|---|
| Weekly chart day labels | `M T W T F S S`, Thursday highlighted | **`T W T F S S M`**, **last** bar highlighted | Header says "MONDAY, JUNE 9". The card is a **rolling 7-day window** ending today, so today is the final bar, not the 4th. |
| Weekly chart caption | `24,380 kg lifted · 4 sessions` | **`34,340 kg lifted · 5 sessions`** | Recomputed from the authoritative daily ledger below. `+18%` stays correct (vs. 29,100 kg prior window). |

Bar heights in that card also need remapping — exact values in the ledger below.

---

## 📐 TRENDS DATA CONTRACT

```
TODAY = Monday, June 9, 2025.  Anchor: Jun 9 − 84 days = Mar 17 (also a Monday). ✓

── DAILY LEDGER, Jun 3 → Jun 9 (rolling 7-day window on home) ──
 Tue Jun 3  Pull Day          6,940 kg   L3
 Wed Jun 4  Legs              9,540 kg   L4   ← Back Squat PR 145 kg
 Thu Jun 5  Rest                   0
 Fri Jun 6  Upper Accessory   5,180 kg   L2
 Sat Jun 7  Legs (light)      4,260 kg   L2
 Sun Jun 8  Rest                   0
 Mon Jun 9  Push Day          8,420 kg   L3   ← today (Phase 2 session)
                      TOTAL 34,340 kg · 5 sessions
 Bar heights @60pt max (max = 9,540): 43.65 / 60.00 / 0 / 32.58 / 26.81 / 0 / 52.97
 AVG line y=736 = 7-day mean 4,905.7 kg → h 30.85 → y 735.15 ≈ 736 ✓ (no patch needed)

── PRIOR WINDOW, May 27 → Jun 2 = 29,100 kg ──
 (34,340 − 29,100) / 29,100 = +18.007% → "+18.0%" ✓  home chip is correct

── VOLUME TREND · trailing-7d sampled each Monday, 8 points ──
 Apr 21: 26,180   Apr 28: 27,940   May 5: 29,300   May 12: 28,120 (deload)
 May 19: 30,480   May 26: 27,650   Jun 2: 29,100   Jun 9: 34,340
 8-week mean = 233,110 / 8 = 29,138.75 → 29,139 kg
 8-week gain = (34,340 − 26,180) / 26,180 = +31.17% → +31.2%

── BENCH e1RM (Epley: w × (1 + r/30)), top set 90→100 kg × 5 ──
 Apr 21 90×5 = 105.0   Apr 28 90×5 = 105.0   May 5 92.5×5 = 107.9
 May 13 92.5×5 = 107.9 May 20 95×5 = 110.8   May 27 97.5×5 = 113.8
 Jun 2 102.5×5 = 119.6 Jun 9 100×5 = 116.7
 Gain 105.0 → 116.7 = +11.7 kg = +11.14% → "+11.1%" ✓ (identical to working-weight
 delta because rep count is constant — mathematically necessary, not a coincidence)

── BODYWEIGHT, 8 weekly samples ──
 82.4 · 82.1 · 81.8 · 81.9 · 81.4 · 81.2 · 80.9 · 80.6
 Δ = −1.8 kg = −2.18% → "−2.2%"
 Strength ratio = 116.7 / 80.6 = 1.4479 → 1.45× bodyweight

── MUSCLE-GROUP SET COUNT, Jun 3 → Jun 9 (87 sets) ──
 Jun 3 Pull 18 (Back 12, Biceps 6)          Jun 4 Legs 20 (Quads 8, Hams 6, Glutes 4, Calves 2)
 Jun 6 Upper 16 (Shoulders 6, Arms 6, Chest 4)   Jun 7 Legs 14 (Quads 6, Hams 4, Glutes 4)
 Jun 9 Push 19 (Chest 10, Shoulders 5, Triceps 4)
 Chest 14 · Back 12 · Shoulders 11 · Quads 14 · Hams 10 · Glutes 8 · Biceps 6 · Triceps 10 · Calves 2
 Σ = 14+12+11+14+10+8+6+10+2 = 87 ✓
 Session set-count cross-check: 18+20+16+14+19 = 87 ✓

── CONSISTENCY HEATMAP · 13 weeks, Mar 17 → Jun 9 ──
 Cells 91 = 13 × 7.  Elapsed = 84 + 1 = 85 days.  Trained = 55 → 55/85 = 64.7% → 65%
 Per-column trained: 5,5,3,4,5,4,5,4,5,4,5,5,1 = 55 ✓
 Level fills: L0=30 · L1=6 · L2=18 · L3=21 · L4=10 · future=6 → Σ 91 ✓
 Week 8 (May 5) is the deload — all cells L1/L2 — matching the 28,120 dip ✓
 Avg per week = 55 / 13 = 4.23 → 4.2

── STREAKS & TOTALS ──
 Current 13 days (12 on home pre-session + 1 today ✓) · Longest 21 days (Mar 4 – Mar 24)
 Total sessions 214 · Sessions in 2025 = 96
 Cross-check: Jan 1 → Jun 9 = 160 days = 22.9 weeks; 96 / 22.9 = 4.19 → 4.2/wk ✓ consistent

── PERSONAL BESTS (e1RM verified) ──
 Bench Press    102.5 × 5  → 102.5 × 1.16667 = 119.58 → 119.6   Jun 2
 Deadlift       180   × 3  → 180   × 1.10000 = 198.0             Jun 3
 Back Squat     145   × 5  → 145   × 1.16667 = 169.17 → 169.2    Jun 4
 Shoulder Press  60   × 10 →  60   × 1.33333 =  80.0             Jun 9
 Barbell Row     90   × 8  →  90   × 1.26667 = 114.0             May 28
 Home PR deltas already agree: Bench 97.5 → 102.5 = "+5.0 kg" ✓
```

---

## SCREEN 1 · TRENDS OVERVIEW — 393 × 2382

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="2382" viewBox="0 0 393 2382" role="img" aria-labelledby="T1" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="T1">Kinetic — Trends overview</title>
<defs>
  <clipPath id="fr"><rect width="393" height="2382"/></clipPath>
  <clipPath id="cHero"><rect x="16" y="180" width="361" height="276" rx="30"/></clipPath>
  <clipPath id="cMus"><rect x="16" y="908" width="361" height="400" rx="30"/></clipPath>
  <clipPath id="cIns"><rect x="16" y="2070" width="361" height="152" rx="30"/></clipPath>
  <clipPath id="cStr"><rect x="16" y="1632" width="361" height="152" rx="30"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="60" cy="220" r="300"><stop offset="0" stop-color="#FF2D55" stop-opacity=".18"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <radialGradient id="A2" gradientUnits="userSpaceOnUse" cx="375" cy="1000" r="320"><stop offset="0" stop-color="#0A84FF" stop-opacity=".12"/><stop offset="1" stop-color="#0A84FF" stop-opacity="0"/></radialGradient>
  <radialGradient id="A3" gradientUnits="userSpaceOnUse" cx="30" cy="1500" r="300"><stop offset="0" stop-color="#A6FF00" stop-opacity=".07"/><stop offset="1" stop-color="#A6FF00" stop-opacity="0"/></radialGradient>
  <radialGradient id="A4" gradientUnits="userSpaceOnUse" cx="380" cy="2100" r="300"><stop offset="0" stop-color="#BF5AF2" stop-opacity=".12"/><stop offset="1" stop-color="#BF5AF2" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="ln" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF9F0A"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="ar" gradientUnits="userSpaceOnUse" x1="0" y1="328" x2="0" y2="412"><stop offset="0" stop-color="#FF6A3D" stop-opacity=".36"/><stop offset="1" stop-color="#FF6A3D" stop-opacity="0"/></linearGradient>
  <linearGradient id="gd" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FFF0BE"/><stop offset="1" stop-color="#D9A441"/></linearGradient>
  <linearGradient id="am" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FFC24A"/><stop offset="1" stop-color="#FF6A2D"/></linearGradient>
  <linearGradient id="co" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E7BFF"/><stop offset="1" stop-color="#FF5AC8"/></linearGradient>
  <linearGradient id="cb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A78BFA" stop-opacity=".55"/><stop offset=".5" stop-color="#2CE9F7" stop-opacity=".22"/><stop offset="1" stop-color="#FF5AC8" stop-opacity=".10"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <linearGradient id="tl" x1="0" y1="0" x2=".5" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".075"/><stop offset="1" stop-color="#FFF" stop-opacity=".028"/></linearGradient>
  <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D1D21" stop-opacity=".92"/><stop offset="1" stop-color="#0E0E11" stop-opacity=".99"/></linearGradient>
  <radialGradient id="mV" gradientUnits="userSpaceOnUse" cx="330" cy="2095" r="155"><stop offset="0" stop-color="#8E7BFF" stop-opacity=".26"/><stop offset="1" stop-color="#8E7BFF" stop-opacity="0"/></radialGradient>
  <radialGradient id="mC" gradientUnits="userSpaceOnUse" cx="50" cy="2215" r="130"><stop offset="0" stop-color="#2CE9F7" stop-opacity=".14"/><stop offset="1" stop-color="#2CE9F7" stop-opacity="0"/></radialGradient>
  <radialGradient id="mG" gradientUnits="userSpaceOnUse" cx="330" cy="1660" r="150"><stop offset="0" stop-color="#FF9F0A" stop-opacity=".20"/><stop offset="1" stop-color="#FF9F0A" stop-opacity="0"/></radialGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="fg" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#FFD84D" flood-opacity=".45"/></filter>
  <filter id="fa" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="5" stdDeviation="9" flood-color="#FF9F0A" flood-opacity=".45"/></filter>
  <filter id="fv" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#8E7BFF" flood-opacity=".55"/></filter>
  <filter id="fp" x="-40%" y="-60%" width="180%" height="240%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fd" x="-90%" y="-60%" width="280%" height="240%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#FF2D55" flood-opacity=".7"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <path id="st" d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"/>
  <path id="fl" d="M0 -8.2 C2.9 -4.6 5.9 -1.7 5.9 1.9 C5.9 5.4 3.3 7.9 0 7.9 C-3.3 7.9 -5.9 5.4 -5.9 1.9 C-5.9 -.2 -4.6 -1.9 -3.3 -3.4 C-3.2 -1.7 -2.4 -.9 -1.3 -.7 C-1.7 -3.5 -1.1 -5.9 0 -8.2 Z"/>
  <path id="sp" d="M0 -5.2 L1.35 -1.35 L5.2 0 L1.35 1.35 L0 5.2 L-1.35 1.35 L-5.2 0 L-1.35 -1.35 Z"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="ic-house" ><path d="M0 -10.8 L10.6 -1.95 L10.6 10.4 L3.5 10.4 L3.5 2.7 L-3.5 2.7 L-3.5 10.4 L-10.6 10.4 L-10.6 -1.95 Z"/></g>
  <g id="ic-db"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
  <g id="ic-trend" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M-10.2 -10.6 L-10.2 10.2 L10.4 10.2"/><path d="M-6.6 4.8 L-1.6 -1.4 L2.2 1.6 L8.2 -6.4"/></g>
  <g id="ic-person"><circle r="11.1" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cy="-3.4" r="3.4" fill="currentColor"/><path d="M-9.4 12.6 Q-9.4 3 0 3 Q9.4 3 9.4 12.6 Z" fill="currentColor" clip-path="url(#pc)"/></g>
  <clipPath id="pc"><circle r="10.2"/></clipPath>
  <g id="ic-cal" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="-9" y="-7.4" width="18" height="16" rx="3.6"/><path d="M-9 -2.4 H9"/><path d="M-4.4 -10.4 V-5.2"/><path d="M4.4 -10.4 V-5.2"/></g>
  <g id="ic-share" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M-6.4 -1.4 H-7.6 A1.8 1.8 0 0 0 -9.4 .4 V7 A1.8 1.8 0 0 0 -7.6 8.8 H7.6 A1.8 1.8 0 0 0 9.4 7 V.4 A1.8 1.8 0 0 0 7.6 -1.4 H6.4"/><path d="M0 -9.6 V3.4"/><path d="M-4.2 -5.4 L0 -9.6 L4.2 -5.4"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="2382" fill="url(#bg)"/><rect width="393" height="2382" fill="url(#A1)"/><rect width="393" height="2382" fill="url(#A2)"/><rect width="393" height="2382" fill="url(#A3)"/><rect width="393" height="2382" fill="url(#A4)"/>

<!-- status bar 10:34 -->
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:34</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<circle cx="245.5" cy="29.5" r="6.2" fill="#0A0C10"/><circle cx="245.5" cy="29.5" r="3.1" fill="#121A24"/><circle cx="244.2" cy="28.2" r="1.05" fill="#3E6E9E" opacity=".75"/>

<!-- header -->
<text x="24" y="98" font-size="32" font-weight="700" letter-spacing="-.95" fill="#FFF">Trends</text>
<text x="24" y="118" font-size="11.5" font-weight="500" fill="#86868B">Rolling 7 days · Jun 3 – Jun 9</text>
<g filter="url(#fs)"><rect x="338" y="71" width="34" height="34" rx="17" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"/></g>
<use xlink:href="#ic-cal" href="#ic-cal" transform="translate(355,88) scale(.82)" color="#C7C7CC"/>

<!-- range segmented control -->
<rect x="16" y="132" width="361" height="36" rx="18" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#fp)"><rect x="18" y="134" width="68.2" height="32" rx="16" fill="#FFF" fill-opacity=".13"/></g>
<rect x="18" y="134" width="68.2" height="32" rx="16" fill="none" stroke="#FFF" stroke-opacity=".12" stroke-width=".8"/>
<g text-anchor="middle" font-size="12" font-weight="600" letter-spacing="-.15">
  <text x="52.1" y="154.5" fill="#FFF">7D</text><text x="124.3" y="154.5" fill="#98989F">4W</text>
  <text x="196.5" y="154.5" fill="#98989F">6M</text><text x="268.7" y="154.5" fill="#98989F">1Y</text>
  <text x="340.9" y="154.5" fill="#98989F">ALL</text></g>

<!-- ══ HERO METRIC CHART ══ -->
<g filter="url(#fc)"><rect x="16" y="180" width="361" height="276" rx="30" fill="url(#cd)"/></g>
<g clip-path="url(#cHero)"><rect x="16" y="180" width="361" height="276" fill="url(#A1)" opacity=".55"/></g>
<rect x="16.5" y="180.5" width="360" height="275" rx="29.5" fill="none" stroke="url(#ce)"/>
<!-- metric switcher -->
<g filter="url(#fp)"><rect x="36" y="198" width="66" height="26" rx="13" fill="#FFF" fill-opacity=".14"/></g>
<rect x="36.5" y="198.5" width="65" height="25" rx="12.5" fill="none" stroke="#FFF" stroke-opacity=".14" stroke-width=".8"/>
<text x="69" y="215" font-size="11.5" font-weight="650" letter-spacing="-.15" fill="#FFF" text-anchor="middle">Volume</text>
<text x="134.5" y="215" font-size="11.5" font-weight="500" letter-spacing="-.15" fill="#86868B" text-anchor="middle">e1RM</text>
<text x="211" y="215" font-size="11.5" font-weight="500" letter-spacing="-.15" fill="#86868B" text-anchor="middle">Bodyweight</text>
<rect x="301" y="198" width="56" height="26" rx="13" fill="#30D158" fill-opacity=".15"/>
<text x="329" y="215" font-size="11" font-weight="700" letter-spacing="-.15" fill="#4ADE80" text-anchor="middle">+18.0%</text>
<!-- value -->
<text x="36" y="272" font-size="36" font-weight="700" letter-spacing="-1.4" fill="#FFF">34,340</text>
<text x="161" y="272" font-size="15" font-weight="600" fill="#86868B">kg</text>
<text x="36" y="294" font-size="11.5" font-weight="500" fill="#86868B">Rolling 7 days · 8-week avg 29,139 kg</text>
<!-- chart -->
<g stroke="#FFF" stroke-opacity=".05"><line x1="36" y1="328" x2="357" y2="328"/><line x1="36" y1="370" x2="357" y2="370"/><line x1="36" y1="412" x2="357" y2="412"/></g>
<path d="M40 402.6 L62.35 395.55 Q84.7 388.5 107.05 383.05 Q129.4 377.6 151.75 382.3 Q174.1 387 196.5 377.6 Q218.9 368.2 241.25 379.5 Q263.6 390.8 285.95 385 Q308.3 379.2 330.65 358.25 L353 337.3 L353 412 L40 412 Z" fill="url(#ar)"/>
<path d="M40 402.6 L62.35 395.55 Q84.7 388.5 107.05 383.05 Q129.4 377.6 151.75 382.3 Q174.1 387 196.5 377.6 Q218.9 368.2 241.25 379.5 Q263.6 390.8 285.95 385 Q308.3 379.2 330.65 358.25 L353 337.3" fill="none" stroke="url(#ln)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
<g fill="#131316" stroke="#FF6A3D" stroke-width="2"><circle cx="40" cy="402.6" r="3.4"/><circle cx="84.7" cy="388.5" r="3.4"/><circle cx="129.4" cy="377.6" r="3.4"/><circle cx="174.1" cy="387" r="3.4"/><circle cx="218.9" cy="368.2" r="3.4"/><circle cx="263.6" cy="390.8" r="3.4"/><circle cx="308.3" cy="379.2" r="3.4"/></g>
<g filter="url(#fd)"><circle cx="353" cy="337.3" r="5.6" fill="#FF2D55" stroke="#131316" stroke-width="2.4"/></g>
<text x="353" y="326" font-size="9.5" font-weight="700" letter-spacing="-.1" fill="#FF6A88" text-anchor="end">34,340</text>
<g font-size="9" font-weight="600" letter-spacing=".2" fill="#6C6C70"><text x="40" y="432">Apr 21</text><text x="308.3" y="432" text-anchor="middle">Jun 2</text><text x="353" y="432" text-anchor="end" fill="#98989F">Today</text></g>
<text x="36" y="450" font-size="10" font-weight="500" fill="#48484A">+31.2% over 8 weeks</text>

<!-- ══ THREE METRIC TILES ══ -->
<g filter="url(#ft)"><rect x="16" y="468" width="112" height="104" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="468.5" width="111" height="103" rx="23.5" fill="none" stroke="url(#ce)"/>
<text x="30" y="490" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#86868B">VOLUME · 7D</text>
<text x="30" y="520" font-size="19" font-weight="700" letter-spacing="-.6" fill="#FFF">34,340</text>
<text x="30" y="540" font-size="10" font-weight="700" fill="#30D158">+18.0%</text>
<path d="M30 560.7 L42 558.6 L54 557.1 L66 558.4 L78 555.7 L90 559 L102 557.3 L114 551.3" fill="none" stroke="#FF6A88" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>

<g filter="url(#ft)"><rect x="140" y="468" width="112" height="104" rx="24" fill="url(#cd)"/></g>
<rect x="140.5" y="468.5" width="111" height="103" rx="23.5" fill="none" stroke="url(#ce)"/>
<text x="154" y="490" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#86868B">BENCH E1RM</text>
<text x="154" y="520" font-size="19" font-weight="700" letter-spacing="-.6" fill="#FFF">116.7</text>
<text x="200" y="520" font-size="10.5" font-weight="600" fill="#6C6C70">kg</text>
<text x="154" y="540" font-size="10" font-weight="700" fill="#30D158">+11.7 kg</text>
<path d="M154 560.7 L166 560.7 L178 558.7 L190 558.7 L202 556.8 L214 554.8 L226 550.9 L238 552.9" fill="none" stroke="#FFB84D" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>

<g filter="url(#ft)"><rect x="264" y="468" width="113" height="104" rx="24" fill="url(#cd)"/></g>
<rect x="264.5" y="468.5" width="112" height="103" rx="23.5" fill="none" stroke="url(#ce)"/>
<text x="278" y="490" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#86868B">BODYWEIGHT</text>
<text x="278" y="520" font-size="19" font-weight="700" letter-spacing="-.6" fill="#FFF">80.6</text>
<text x="322" y="520" font-size="10.5" font-weight="600" fill="#6C6C70">kg</text>
<text x="278" y="540" font-size="10" font-weight="700" fill="#5EDCF0">−1.8 kg · 8 wk</text>
<path d="M278 551.9 L290 553.2 L302 554.6 L314 554.2 L326 556.5 L338 557.4 L350 558.8 L362 560.2" fill="none" stroke="#5EDCF0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>

<!-- ══ PERSONAL BESTS ══ -->
<text x="24" y="602" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">PERSONAL BESTS</text>
<text x="359" y="602" font-size="11.5" font-weight="600" letter-spacing="-.1" fill="#FF9F0A" text-anchor="end">See All</text>
<path d="M362 598 L365.6 601.6 L362 605.2" fill="none" stroke="#FF9F0A" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
<g filter="url(#fc)"><rect x="16" y="614" width="361" height="252" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="614.5" width="360" height="251" rx="29.5" fill="none" stroke="url(#ce)"/>
<g font-size="8" font-weight="700" letter-spacing=".8" fill="#6C6C70"><text x="36" y="642">LIFT</text><text x="210" y="642" text-anchor="end">BEST SET</text><text x="280" y="642" text-anchor="end">E1RM</text><text x="357" y="642" text-anchor="end">DATE</text></g>
<line x1="36" y1="650" x2="357" y2="650" stroke="#FFF" stroke-opacity=".08"/>
<g stroke="#FFF" stroke-opacity=".05"><line x1="36" y1="694" x2="357" y2="694"/><line x1="36" y1="736" x2="357" y2="736"/><line x1="36" y1="778" x2="357" y2="778"/><line x1="36" y1="820" x2="357" y2="820"/></g>
<g font-size="12.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="36" y="680">Bench Press</text><text x="36" y="722">Deadlift</text><text x="36" y="764">Back Squat</text><text x="36" y="806">Shoulder Press</text><text x="36" y="848">Barbell Row</text></g>
<g font-size="12" font-weight="500" fill="#98989F" text-anchor="end"><text x="210" y="680">102.5 × 5</text><text x="210" y="722">180 × 3</text><text x="210" y="764">145 × 5</text><text x="210" y="806">60 × 10</text><text x="210" y="848">90 × 8</text></g>
<g font-size="12.5" font-weight="700" letter-spacing="-.25" fill="#FFF" text-anchor="end"><text x="280" y="680">119.6</text><text x="280" y="722">198.0</text><text x="280" y="764">169.2</text><text x="280" y="806">80.0</text><text x="280" y="848">114.0</text></g>
<g font-size="10.5" font-weight="500" fill="#6C6C70" text-anchor="end"><text x="357" y="680">Jun 2</text><text x="357" y="722">Jun 3</text><text x="357" y="764">Jun 4</text><text x="357" y="806">Jun 9</text><text x="357" y="848">May 28</text></g>

<!-- ══ MUSCLE GROUP LOAD (new) ══ -->
<text x="24" y="896" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">MUSCLE GROUP LOAD</text>
<g filter="url(#fc)"><rect x="16" y="908" width="361" height="400" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="908.5" width="360" height="399" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="938" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Muscle Group Load</text>
<rect x="281" y="924" width="76" height="21" rx="10.5" fill="#FFF" fill-opacity=".07"/>
<text x="319" y="938" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#98989F" text-anchor="middle">LAST 7 DAYS</text>
<rect x="36" y="956" width="14" height="6" rx="3" fill="#30D158"/>
<text x="56" y="963.5" font-size="9.5" font-weight="500" fill="#86868B">Sets performed</text>
<rect x="150" y="955" width="14" height="8" rx="3" fill="#FFF" fill-opacity=".12"/>
<text x="170" y="963.5" font-size="9.5" font-weight="500" fill="#86868B">Target range</text>
<!-- scale: 0–24 sets over 321pt = 13.375 pt/set -->
<g font-size="12" font-weight="600" letter-spacing="-.15" fill="#F5F5F7"><text x="36" y="995">Chest</text><text x="36" y="1039">Back</text><text x="36" y="1083">Shoulders</text><text x="36" y="1127">Quads</text><text x="36" y="1171">Hamstrings</text><text x="36" y="1215">Calves</text></g>
<g font-size="11" font-weight="600" fill="#98989F" text-anchor="end"><text x="357" y="995">14 sets</text><text x="357" y="1039">12 sets</text><text x="357" y="1083">11 sets</text><text x="357" y="1127">14 sets</text><text x="357" y="1171">10 sets</text><text x="357" y="1215" fill="#FFB84D">2 sets</text></g>
<g fill="#FFF" fill-opacity=".07"><rect x="36" y="1004" width="321" height="6" rx="3"/><rect x="36" y="1048" width="321" height="6" rx="3"/><rect x="36" y="1092" width="321" height="6" rx="3"/><rect x="36" y="1136" width="321" height="6" rx="3"/><rect x="36" y="1180" width="321" height="6" rx="3"/><rect x="36" y="1224" width="321" height="6" rx="3"/></g>
<g fill="#FFF" fill-opacity=".11"><rect x="170.25" y="1004" width="133.75" height="6" rx="3"/><rect x="170.25" y="1048" width="133.75" height="6" rx="3"/><rect x="143" y="1092" width="107" height="6" rx="3"/><rect x="143" y="1136" width="133.75" height="6" rx="3"/><rect x="116.25" y="1180" width="107" height="6" rx="3"/><rect x="116.25" y="1224" width="107" height="6" rx="3"/></g>
<g fill="#30D158"><rect x="36" y="1004" width="187.25" height="6" rx="3"/><rect x="36" y="1048" width="160.5" height="6" rx="3"/><rect x="36" y="1092" width="147.13" height="6" rx="3"/><rect x="36" y="1136" width="187.25" height="6" rx="3"/><rect x="36" y="1180" width="133.75" height="6" rx="3"/></g>
<rect x="36" y="1224" width="26.75" height="6" rx="3" fill="#FF9F0A"/>
<g fill="#FFF" fill-opacity=".55"><circle cx="170.25" cy="1007" r="1.6"/><circle cx="304" cy="1007" r="1.6"/><circle cx="170.25" cy="1051" r="1.6"/><circle cx="304" cy="1051" r="1.6"/><circle cx="143" cy="1095" r="1.6"/><circle cx="250" cy="1095" r="1.6"/><circle cx="143" cy="1139" r="1.6"/><circle cx="276.75" cy="1139" r="1.6"/><circle cx="116.25" cy="1183" r="1.6"/><circle cx="223.25" cy="1183" r="1.6"/><circle cx="116.25" cy="1227" r="1.6"/><circle cx="223.25" cy="1227" r="1.6"/></g>
<g clip-path="url(#cMus)">
  <rect x="32" y="1252" width="329" height="44" rx="16" fill="#FF9F0A" fill-opacity=".10"/>
  <rect x="32.5" y="1252.5" width="328" height="43" rx="15.5" fill="none" stroke="#FF9F0A" stroke-opacity=".22" stroke-width=".9"/>
</g>
<circle cx="54" cy="1274" r="9" fill="#FF9F0A" fill-opacity=".18"/>
<text x="54" y="1278.5" font-size="11" font-weight="700" fill="#FFB84D" text-anchor="middle">!</text>
<text x="72" y="1270" font-size="11.5" font-weight="650" letter-spacing="-.15" fill="#FFD8A8">Calves under-trained</text>
<text x="72" y="1286" font-size="10.5" font-weight="500" fill="#C9A47A">2 of 6–14 target sets · add 4 this week</text>

<!-- ══ CONSISTENCY HEATMAP (new) ══ -->
<text x="24" y="1338" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">CONSISTENCY</text>
<g filter="url(#fc)"><rect x="16" y="1350" width="361" height="240" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="1350.5" width="360" height="239" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="1380" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">13-Week Consistency</text>
<text x="36" y="1398" font-size="11" font-weight="500" fill="#86868B">55 of 85 days trained · 65%</text>
<rect x="281" y="1366" width="76" height="21" rx="10.5" fill="#FFF" fill-opacity=".07"/>
<text x="319" y="1380" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#98989F" text-anchor="middle">MAR – JUN</text>
<g font-size="8.5" font-weight="700" letter-spacing=".6" fill="#6C6C70"><text x="36" y="1426">M</text><text x="36" y="1470">W</text><text x="36" y="1514">F</text></g>
<!-- L0 rest · 30 cells -->
<g fill="#FFF" fill-opacity=".05">
<rect x="66" y="1458" width="17" height="17" rx="5"/><rect x="66" y="1546" width="17" height="17" rx="5"/><rect x="88" y="1436" width="17" height="17" rx="5"/><rect x="88" y="1502" width="17" height="17" rx="5"/><rect x="110" y="1436" width="17" height="17" rx="5"/><rect x="110" y="1458" width="17" height="17" rx="5"/><rect x="110" y="1480" width="17" height="17" rx="5"/><rect x="110" y="1546" width="17" height="17" rx="5"/><rect x="132" y="1458" width="17" height="17" rx="5"/><rect x="132" y="1524" width="17" height="17" rx="5"/><rect x="132" y="1546" width="17" height="17" rx="5"/><rect x="154" y="1480" width="17" height="17" rx="5"/><rect x="154" y="1546" width="17" height="17" rx="5"/><rect x="176" y="1458" width="17" height="17" rx="5"/><rect x="176" y="1524" width="17" height="17" rx="5"/><rect x="176" y="1546" width="17" height="17" rx="5"/><rect x="198" y="1458" width="17" height="17" rx="5"/><rect x="198" y="1546" width="17" height="17" rx="5"/><rect x="220" y="1458" width="17" height="17" rx="5"/><rect x="220" y="1524" width="17" height="17" rx="5"/><rect x="220" y="1546" width="17" height="17" rx="5"/><rect x="242" y="1458" width="17" height="17" rx="5"/><rect x="242" y="1546" width="17" height="17" rx="5"/><rect x="264" y="1458" width="17" height="17" rx="5"/><rect x="264" y="1502" width="17" height="17" rx="5"/><rect x="264" y="1546" width="17" height="17" rx="5"/><rect x="286" y="1502" width="17" height="17" rx="5"/><rect x="286" y="1546" width="17" height="17" rx="5"/><rect x="308" y="1480" width="17" height="17" rx="5"/><rect x="308" y="1546" width="17" height="17" rx="5"/></g>
<!-- L1 light · 6 -->
<g fill="#30D158" fill-opacity=".25"><rect x="88" y="1546" width="17" height="17" rx="5"/><rect x="220" y="1414" width="17" height="17" rx="5"/><rect x="220" y="1436" width="17" height="17" rx="5"/><rect x="220" y="1502" width="17" height="17" rx="5"/><rect x="286" y="1524" width="17" height="17" rx="5"/><rect x="308" y="1414" width="17" height="17" rx="5"/></g>
<!-- L2 moderate · 18 -->
<g fill="#30D158" fill-opacity=".45"><rect x="66" y="1436" width="17" height="17" rx="5"/><rect x="66" y="1502" width="17" height="17" rx="5"/><rect x="88" y="1458" width="17" height="17" rx="5"/><rect x="110" y="1414" width="17" height="17" rx="5"/><rect x="110" y="1502" width="17" height="17" rx="5"/><rect x="132" y="1436" width="17" height="17" rx="5"/><rect x="132" y="1502" width="17" height="17" rx="5"/><rect x="154" y="1436" width="17" height="17" rx="5"/><rect x="154" y="1524" width="17" height="17" rx="5"/><rect x="176" y="1436" width="17" height="17" rx="5"/><rect x="198" y="1502" width="17" height="17" rx="5"/><rect x="220" y="1480" width="17" height="17" rx="5"/><rect x="242" y="1436" width="17" height="17" rx="5"/><rect x="242" y="1524" width="17" height="17" rx="5"/><rect x="286" y="1414" width="17" height="17" rx="5"/><rect x="286" y="1458" width="17" height="17" rx="5"/><rect x="308" y="1502" width="17" height="17" rx="5"/><rect x="308" y="1524" width="17" height="17" rx="5"/></g>
<!-- L3 hard · 21 (incl. today) -->
<g fill="#30D158" fill-opacity=".68"><rect x="66" y="1414" width="17" height="17" rx="5"/><rect x="66" y="1480" width="17" height="17" rx="5"/><rect x="88" y="1414" width="17" height="17" rx="5"/><rect x="88" y="1480" width="17" height="17" rx="5"/><rect x="110" y="1524" width="17" height="17" rx="5"/><rect x="132" y="1414" width="17" height="17" rx="5"/><rect x="132" y="1480" width="17" height="17" rx="5"/><rect x="154" y="1414" width="17" height="17" rx="5"/><rect x="154" y="1502" width="17" height="17" rx="5"/><rect x="176" y="1480" width="17" height="17" rx="5"/><rect x="176" y="1502" width="17" height="17" rx="5"/><rect x="198" y="1414" width="17" height="17" rx="5"/><rect x="198" y="1436" width="17" height="17" rx="5"/><rect x="198" y="1524" width="17" height="17" rx="5"/><rect x="242" y="1414" width="17" height="17" rx="5"/><rect x="242" y="1502" width="17" height="17" rx="5"/><rect x="264" y="1436" width="17" height="17" rx="5"/><rect x="264" y="1480" width="17" height="17" rx="5"/><rect x="286" y="1436" width="17" height="17" rx="5"/><rect x="308" y="1436" width="17" height="17" rx="5"/><rect x="330" y="1414" width="17" height="17" rx="5"/></g>
<!-- L4 very hard · 10 -->
<g fill="#30D158" fill-opacity=".95"><rect x="66" y="1524" width="17" height="17" rx="5"/><rect x="88" y="1524" width="17" height="17" rx="5"/><rect x="154" y="1458" width="17" height="17" rx="5"/><rect x="176" y="1414" width="17" height="17" rx="5"/><rect x="198" y="1480" width="17" height="17" rx="5"/><rect x="242" y="1480" width="17" height="17" rx="5"/><rect x="264" y="1414" width="17" height="17" rx="5"/><rect x="264" y="1524" width="17" height="17" rx="5"/><rect x="286" y="1480" width="17" height="17" rx="5"/><rect x="308" y="1458" width="17" height="17" rx="5"/></g>
<!-- future · 6 -->
<g fill="#FFF" fill-opacity=".028"><rect x="330" y="1436" width="17" height="17" rx="5"/><rect x="330" y="1458" width="17" height="17" rx="5"/><rect x="330" y="1480" width="17" height="17" rx="5"/><rect x="330" y="1502" width="17" height="17" rx="5"/><rect x="330" y="1524" width="17" height="17" rx="5"/><rect x="330" y="1546" width="17" height="17" rx="5"/></g>
<rect x="329.1" y="1413.1" width="18.8" height="18.8" rx="5.9" fill="none" stroke="#FFF" stroke-opacity=".85" stroke-width="1.8"/>
<text x="36" y="1578" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#6C6C70">LESS</text>
<g><rect x="262" y="1570" width="9" height="9" rx="2.5" fill="#FFF" fill-opacity=".05"/><rect x="275" y="1570" width="9" height="9" rx="2.5" fill="#30D158" fill-opacity=".25"/><rect x="288" y="1570" width="9" height="9" rx="2.5" fill="#30D158" fill-opacity=".45"/><rect x="301" y="1570" width="9" height="9" rx="2.5" fill="#30D158" fill-opacity=".68"/><rect x="314" y="1570" width="9" height="9" rx="2.5" fill="#30D158" fill-opacity=".95"/></g>
<text x="331" y="1578" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#6C6C70">MORE</text>

<!-- ══ STREAKS & TOTALS ══ -->
<text x="24" y="1620" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">STREAKS &amp; TOTALS</text>
<g filter="url(#fc)"><rect x="16" y="1632" width="361" height="152" rx="30" fill="url(#cd)"/></g>
<g clip-path="url(#cStr)"><rect x="16" y="1632" width="361" height="152" fill="url(#mG)"/></g>
<rect x="16.5" y="1632.5" width="360" height="151" rx="29.5" fill="none" stroke="url(#ce)"/>
<g filter="url(#fa)"><circle cx="52" cy="1678" r="24" fill="url(#am)"/></g>
<circle cx="52" cy="1678" r="24" fill="none" stroke="#FFF" stroke-opacity=".32" stroke-width="1"/>
<use xlink:href="#fl" href="#fl" transform="translate(52,1678) scale(1.05)" fill="#FFF"/>
<text x="88" y="1670" font-size="16" font-weight="650" letter-spacing="-.35" fill="#FFF">13-day streak</text>
<text x="88" y="1690" font-size="11" font-weight="500" fill="#86868B">Longest 21 days · Mar 4 – Mar 24</text>
<rect x="303" y="1656" width="54" height="20" rx="10" fill="#30D158" fill-opacity=".16"/>
<text x="330" y="1670" font-size="8.5" font-weight="700" letter-spacing=".6" fill="#4ADE80" text-anchor="middle">+1 TODAY</text>
<line x1="36" y1="1716" x2="357" y2="1716" stroke="#FFF" stroke-opacity=".07"/>
<g stroke="#FFF" stroke-opacity=".07"><line x1="136.3" y1="1730" x2="136.3" y2="1776"/><line x1="256.7" y1="1730" x2="256.7" y2="1776"/></g>
<g text-anchor="middle" font-size="19" font-weight="700" letter-spacing="-.6" fill="#FFF"><text x="76.2" y="1748">214</text><text x="196.5" y="1748">96</text><text x="316.8" y="1748">4.2</text></g>
<g text-anchor="middle" font-size="8" font-weight="700" letter-spacing=".8" fill="#86868B"><text x="76.2" y="1768">TOTAL SESSIONS</text><text x="196.5" y="1768">SESSIONS IN 2025</text><text x="316.8" y="1768">AVG PER WEEK</text></g>

<!-- ══ PR TIMELINE ══ -->
<text x="24" y="1814" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">PR TIMELINE</text>
<rect x="303" y="1800" width="54" height="21" rx="10.5" fill="#FFD60A" fill-opacity=".16"/>
<text x="330" y="1814" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#FFD84D" text-anchor="middle">5 NEW</text>
<g filter="url(#fc)"><rect x="16" y="1826" width="361" height="232" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="1826.5" width="360" height="231" rx="29.5" fill="none" stroke="url(#ce)"/>
<line x1="52" y1="1852" x2="52" y2="2032" stroke="#FFF" stroke-opacity=".10" stroke-width="1.6"/>
<g filter="url(#fg)"><circle cx="52" cy="1858" r="9" fill="url(#gd)"/><circle cx="52" cy="1900" r="9" fill="url(#gd)"/><circle cx="52" cy="1942" r="9" fill="url(#gd)"/><circle cx="52" cy="1984" r="9" fill="url(#gd)"/><circle cx="52" cy="2026" r="9" fill="url(#gd)"/></g>
<g stroke="#131316" stroke-width="2.4" fill="none"><circle cx="52" cy="1858" r="9"/><circle cx="52" cy="1900" r="9"/><circle cx="52" cy="1942" r="9"/><circle cx="52" cy="1984" r="9"/><circle cx="52" cy="2026" r="9"/></g>
<g fill="#5C4300"><use xlink:href="#st" href="#st" transform="translate(52,1858) scale(.44)"/><use xlink:href="#st" href="#st" transform="translate(52,1900) scale(.44)"/><use xlink:href="#st" href="#st" transform="translate(52,1942) scale(.44)"/><use xlink:href="#st" href="#st" transform="translate(52,1984) scale(.44)"/><use xlink:href="#st" href="#st" transform="translate(52,2026) scale(.44)"/></g>
<g font-size="8.5" font-weight="700" letter-spacing=".7" fill="#86868B"><text x="74" y="1854">JUN 2</text><text x="74" y="1896">JUN 3</text><text x="74" y="1938">JUN 4</text><text x="74" y="1980">JUN 9</text><text x="74" y="2022">JUN 9</text></g>
<g font-size="13" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="74" y="1872">Bench Press</text><text x="74" y="1914">Deadlift</text><text x="74" y="1956">Back Squat</text><text x="74" y="1998">Shoulder Press</text><text x="74" y="2040">Session Volume</text></g>
<g font-size="13" font-weight="700" letter-spacing="-.25" fill="#FFD84D" text-anchor="end"><text x="357" y="1872">102.5 kg</text><text x="357" y="1914">180 kg</text><text x="357" y="1956">145 kg</text><text x="357" y="1998">60 × 10</text><text x="357" y="2040">8,420 kg</text></g>

<!-- ══ TREND INSIGHTS (new) ══ -->
<g filter="url(#fc)"><rect x="16" y="2070" width="361" height="152" rx="30" fill="url(#cd)"/></g>
<g clip-path="url(#cIns)"><rect x="16" y="2070" width="361" height="152" fill="url(#mV)"/><rect x="16" y="2070" width="361" height="152" fill="url(#mC)"/></g>
<rect x="16.6" y="2070.6" width="359.8" height="150.8" rx="29.5" fill="none" stroke="url(#cb)" stroke-width="1.2"/>
<g filter="url(#fv)"><rect x="36" y="2082" width="34" height="34" rx="12" fill="url(#co)"/></g>
<rect x="36" y="2082" width="34" height="17" rx="12" fill="url(#gl)" opacity=".45"/>
<use xlink:href="#sp" href="#sp" transform="translate(53,2099) scale(.95)" fill="#FFF"/>
<text x="80" y="2104" font-size="9" font-weight="700" letter-spacing="1.3" fill="#A78BFA">TREND INSIGHTS</text>
<rect x="315" y="2088" width="42" height="20" rx="10" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".09" stroke-width=".7"/>
<text x="336" y="2101.5" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#98989F" text-anchor="middle">BETA</text>
<use xlink:href="#sp" href="#sp" transform="translate(40,2134) scale(.55)" fill="#FF9F0A"/>
<text x="54" y="2138" font-size="12" font-weight="500" fill="#E5E5EA">Volume is up 18.0% week over week —</text>
<text x="54" y="2155" font-size="12" font-weight="500" fill="#E5E5EA">plan a deload within the next 14 days.</text>
<use xlink:href="#sp" href="#sp" transform="translate(40,2181) scale(.55)" fill="#FF9F0A"/>
<text x="54" y="2185" font-size="12" font-weight="500" fill="#E5E5EA">Calves sit at 2 of 6–14 target sets.</text>
<text x="54" y="2202" font-size="12" font-weight="500" fill="#E5E5EA">Add two isolation movements Friday.</text>

<!-- ══ EXPORT ══ -->
<rect x="16" y="2234" width="361" height="52" rx="26" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".12" stroke-width="1"/>
<use xlink:href="#ic-share" href="#ic-share" transform="translate(125,2260) scale(.88)" color="#C7C7CC"/>
<text x="144" y="2265" font-size="15" font-weight="600" letter-spacing="-.25" fill="#F5F5F7">Export Health Data</text>

<!-- ══ TAB BAR · Trends active ══ -->
<rect x="0" y="2298" width="393" height="84" fill="url(#tb)"/>
<line x1="0" y1="2298.5" x2="393" y2="2298.5" stroke="#FFF" stroke-opacity=".11"/>
<g transform="translate(49.1,2328)"><use xlink:href="#ic-house" href="#ic-house" fill="#8E8E93"/></g>
<text x="49.1" y="2356" font-size="10" font-weight="500" letter-spacing="-.1" fill="#8E8E93" text-anchor="middle">Home</text>
<g transform="translate(147.4,2328)"><use xlink:href="#ic-db" href="#ic-db" transform="scale(.92)" fill="#8E8E93"/></g>
<text x="147.4" y="2356" font-size="10" font-weight="500" letter-spacing="-.1" fill="#8E8E93" text-anchor="middle">Workouts</text>
<g transform="translate(245.6,2328)" filter="url(#fs)"><use xlink:href="#ic-trend" href="#ic-trend" color="#FF375F"/></g>
<text x="245.6" y="2356" font-size="10" font-weight="600" letter-spacing="-.1" fill="#FF375F" text-anchor="middle">Trends</text>
<g transform="translate(343.9,2328)"><use xlink:href="#ic-person" href="#ic-person" color="#8E8E93"/></g>
<text x="343.9" y="2356" font-size="10" font-weight="500" letter-spacing="-.1" fill="#8E8E93" text-anchor="middle">Profile</text>
<rect x="140.5" y="2358" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="2381" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## SCREEN 2 · EXERCISE PROGRESS DETAIL — 393 × 1650

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1650" viewBox="0 0 393 1650" role="img" aria-labelledby="T2" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="T2">Kinetic — Exercise progress detail: Barbell Bench Press</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1650"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="70" cy="160" r="280"><stop offset="0" stop-color="#FF2D55" stop-opacity=".20"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <radialGradient id="A2" gradientUnits="userSpaceOnUse" cx="375" cy="700" r="300"><stop offset="0" stop-color="#FFD60A" stop-opacity=".08"/><stop offset="1" stop-color="#FFD60A" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="rd" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#FF6A88"/><stop offset="1" stop-color="#C1143C"/></linearGradient>
  <linearGradient id="ln" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF9F0A"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="ar" gradientUnits="userSpaceOnUse" x1="0" y1="426" x2="0" y2="510"><stop offset="0" stop-color="#FF6A3D" stop-opacity=".34"/><stop offset="1" stop-color="#FF6A3D" stop-opacity="0"/></linearGradient>
  <linearGradient id="gd" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FFF0BE"/><stop offset="1" stop-color="#D9A441"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="fr" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#FF2D55" flood-opacity=".45"/></filter>
  <filter id="fp" x="-40%" y="-60%" width="180%" height="240%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fd" x="-90%" y="-60%" width="280%" height="240%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#FF2D55" flood-opacity=".7"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <g id="ic-db"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#8E8E93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="st" d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1650" fill="url(#bg)"/><rect width="393" height="1650" fill="url(#A1)"/><rect width="393" height="1650" fill="url(#A2)"/>

<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:36</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<circle cx="245.5" cy="29.5" r="6.2" fill="#0A0C10"/><circle cx="245.5" cy="29.5" r="3.1" fill="#121A24"/><circle cx="244.2" cy="28.2" r="1.05" fill="#3E6E9E" opacity=".75"/>

<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Bench Press</text>
<g fill="#8E8E93"><circle cx="359" cy="76" r="2"/><circle cx="366" cy="76" r="2"/><circle cx="373" cy="76" r="2"/></g>

<!-- identity -->
<g filter="url(#fc)"><rect x="16" y="110" width="361" height="104" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="110.5" width="360" height="103" rx="29.5" fill="none" stroke="url(#ce)"/>
<g filter="url(#fr)"><rect x="36" y="132" width="60" height="60" rx="20" fill="url(#rd)"/></g>
<rect x="36" y="132" width="60" height="30" rx="20" fill="url(#gl)" opacity=".4"/>
<use xlink:href="#ic-db" href="#ic-db" transform="translate(66,162) scale(1.2)" fill="#FFF"/>
<text x="112" y="152" font-size="19" font-weight="700" letter-spacing="-.45" fill="#FFF">Barbell Bench Press</text>
<text x="112" y="172" font-size="11.5" font-weight="500" fill="#86868B">Barbell · Chest · Triceps · Front Delt</text>
<rect x="112" y="182" width="70" height="18" rx="9" fill="#FFF" fill-opacity=".07"/>
<text x="147" y="194.5" font-size="8" font-weight="700" letter-spacing=".6" fill="#98989F" text-anchor="middle">COMPOUND</text>
<rect x="188" y="182" width="62" height="18" rx="9" fill="#FFF" fill-opacity=".07"/>
<text x="219" y="194.5" font-size="8" font-weight="700" letter-spacing=".6" fill="#98989F" text-anchor="middle">1× / WEEK</text>

<!-- stat strip -->
<g filter="url(#fc)"><rect x="16" y="226" width="361" height="68" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="226.5" width="360" height="67" rx="23.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".08"><line x1="106.25" y1="240" x2="106.25" y2="280"/><line x1="196.5" y1="240" x2="196.5" y2="280"/><line x1="286.75" y1="240" x2="286.75" y2="280"/></g>
<g text-anchor="middle" font-size="15" font-weight="700" letter-spacing="-.4" fill="#FFF"><text x="61.1" y="262">102.5</text><text x="151.4" y="262">119.6</text><text x="241.6" y="262">34</text><text x="331.9" y="262">2,000</text></g>
<g text-anchor="middle" font-size="7.5" font-weight="700" letter-spacing=".7" fill="#86868B"><text x="61.1" y="282">BEST TOP SET</text><text x="151.4" y="282">BEST E1RM</text><text x="241.6" y="282">SESSIONS</text><text x="331.9" y="282">THIS WEEK KG</text></g>

<!-- chart -->
<g filter="url(#fc)"><rect x="16" y="306" width="361" height="274" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="306.5" width="360" height="273" rx="29.5" fill="none" stroke="url(#ce)"/>
<rect x="36" y="322" width="321" height="32" rx="16" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#fp)"><rect x="38" y="324" width="76.25" height="28" rx="14" fill="#FFF" fill-opacity=".13"/></g>
<rect x="38.5" y="324.5" width="75.25" height="27" rx="13.5" fill="none" stroke="#FFF" stroke-opacity=".12" stroke-width=".8"/>
<g text-anchor="middle" font-size="11.5" letter-spacing="-.15"><text x="76.1" y="342.5" font-weight="650" fill="#FFF">Weight</text><text x="156.4" y="342.5" font-weight="500" fill="#86868B">Volume</text><text x="236.6" y="342.5" font-weight="500" fill="#86868B">e1RM</text><text x="316.9" y="342.5" font-weight="500" fill="#86868B">Sets</text></g>
<text x="36" y="382" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Top Set Weight</text>
<text x="36" y="400" font-size="11" font-weight="500" fill="#86868B">Apr 21 – Jun 9 · 8 sessions · <tspan fill="#4ADE80" font-weight="700">+11.1%</tspan></text>
<g stroke="#FFF" stroke-opacity=".05"><line x1="36" y1="426" x2="357" y2="426"/><line x1="36" y1="468" x2="357" y2="468"/><line x1="36" y1="510" x2="357" y2="510"/></g>
<path d="M40 499.5 L62.35 499.5 Q84.7 499.5 107.05 492.95 Q129.4 486.4 151.75 486.4 Q174.1 486.4 196.5 479.85 Q218.9 473.3 241.25 466.7 Q263.6 460.1 285.95 447 Q308.3 433.9 330.65 440.45 L353 447 L353 510 L40 510 Z" fill="url(#ar)"/>
<path d="M40 499.5 L62.35 499.5 Q84.7 499.5 107.05 492.95 Q129.4 486.4 151.75 486.4 Q174.1 486.4 196.5 479.85 Q218.9 473.3 241.25 466.7 Q263.6 460.1 285.95 447 Q308.3 433.9 330.65 440.45 L353 447" fill="none" stroke="url(#ln)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
<g fill="#131316" stroke="#FF6A3D" stroke-width="2"><circle cx="40" cy="499.5" r="3.4"/><circle cx="84.7" cy="499.5" r="3.4"/><circle cx="129.4" cy="486.4" r="3.4"/><circle cx="174.1" cy="486.4" r="3.4"/><circle cx="218.9" cy="473.3" r="3.4"/><circle cx="263.6" cy="460.1" r="3.4"/></g>
<circle cx="308.3" cy="433.9" r="6.4" fill="url(#gd)" stroke="#131316" stroke-width="2.4"/>
<use xlink:href="#st" href="#st" transform="translate(308.3,433.9) scale(.34)" fill="#5C4300"/>
<text x="308.3" y="423" font-size="9.5" font-weight="700" letter-spacing="-.1" fill="#FFD84D" text-anchor="middle">102.5 PR</text>
<g filter="url(#fd)"><circle cx="353" cy="447" r="5.4" fill="#FF2D55" stroke="#131316" stroke-width="2.2"/></g>
<text x="353" y="466" font-size="9.5" font-weight="700" letter-spacing="-.1" fill="#FF6A88" text-anchor="end">100</text>
<g font-size="9" font-weight="600" letter-spacing=".2" fill="#6C6C70"><text x="40" y="530">Apr 21</text><text x="196.5" y="530" text-anchor="middle">May 20</text><text x="353" y="530" text-anchor="end" fill="#98989F">Today</text></g>
<line x1="36" y1="542" x2="357" y2="542" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="562" font-size="10.5" font-weight="500" fill="#6C6C70">Projected 1RM 119.6 kg · Epley formula · strength ratio 1.45× BW</text>

<!-- muscle involvement (new) -->
<g filter="url(#fc)"><rect x="16" y="592" width="361" height="140" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="592.5" width="360" height="139" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="622" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Muscle Involvement</text>
<g font-size="12" font-weight="600" letter-spacing="-.15" fill="#F5F5F7"><text x="36" y="656">Chest</text><text x="36" y="686">Triceps</text><text x="36" y="716">Front Delt</text></g>
<g fill="#FFF" fill-opacity=".08"><rect x="140" y="650" width="180" height="6" rx="3"/><rect x="140" y="680" width="180" height="6" rx="3"/><rect x="140" y="710" width="180" height="6" rx="3"/></g>
<rect x="140" y="650" width="111.6" height="6" rx="3" fill="#FF2D55"/><rect x="140" y="680" width="43.2" height="6" rx="3" fill="#FF9F0A"/><rect x="140" y="710" width="25.2" height="6" rx="3" fill="#AF52DE"/>
<g font-size="11.5" font-weight="700" letter-spacing="-.2" text-anchor="end"><text x="357" y="656" fill="#FF6A88">62%</text><text x="357" y="686" fill="#FFB84D">24%</text><text x="357" y="716" fill="#C77DFF">14%</text></g>

<!-- last session set detail (new) -->
<g filter="url(#fc)"><rect x="16" y="744" width="361" height="192" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="744.5" width="360" height="191" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="774" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Last Session · Jun 9</text>
<text x="36" y="792" font-size="11" font-weight="500" fill="#86868B">4 sets · 2,000 kg · 20 reps · RPE 7.5</text>
<g font-size="8" font-weight="700" letter-spacing=".8" fill="#6C6C70"><text x="36" y="812">SET</text><text x="140" y="812">WEIGHT</text><text x="222" y="812">REPS</text><text x="296" y="812">E1RM</text><text x="357" y="812" text-anchor="end">RPE</text></g>
<line x1="36" y1="820" x2="357" y2="820" stroke="#FFF" stroke-opacity=".08"/>
<g stroke="#FFF" stroke-opacity=".05"><line x1="36" y1="852" x2="357" y2="852"/><line x1="36" y1="878" x2="357" y2="878"/><line x1="36" y1="904" x2="357" y2="904"/></g>
<g font-size="11" font-weight="700" fill="#8E8E93"><text x="36" y="840">1</text><text x="36" y="866">2</text><text x="36" y="892">3</text><text x="36" y="918">4</text></g>
<g font-size="12" font-weight="600" fill="#F5F5F7"><text x="140" y="840">100 kg</text><text x="140" y="866">100 kg</text><text x="140" y="892">100 kg</text><text x="140" y="918">100 kg</text></g>
<g font-size="12" font-weight="600" fill="#F5F5F7"><text x="222" y="840">5</text><text x="222" y="866">5</text><text x="222" y="892">5</text><text x="222" y="918">5</text></g>
<g font-size="12" font-weight="700" fill="#FFF"><text x="296" y="840">116.7</text><text x="296" y="866">116.7</text><text x="296" y="892">116.7</text><text x="296" y="918">116.7</text></g>
<g font-size="11" font-weight="600" fill="#98989F" text-anchor="end"><text x="357" y="840">7.0</text><text x="357" y="866">7.0</text><text x="357" y="892">8.0</text><text x="357" y="918">8.0</text></g>

<!-- history -->
<text x="24" y="966" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">SESSION HISTORY</text>
<text x="359" y="966" font-size="11.5" font-weight="600" letter-spacing="-.1" fill="#FF9F0A" text-anchor="end">34 total</text>
<path d="M362 962 L365.6 965.6 L362 969.2" fill="none" stroke="#FF9F0A" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>

<g filter="url(#ft)"><rect x="16" y="978" width="361" height="76" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="978.5" width="360" height="75" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="994" width="44" height="44" rx="14" fill="#FFF" fill-opacity=".06"/>
<text x="54" y="1012" font-size="8" font-weight="700" letter-spacing=".6" fill="#8E8E93" text-anchor="middle">JUN</text>
<text x="54" y="1031" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFF" text-anchor="middle">09</text>
<text x="88" y="1010" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">5 · 5 · 5 · 5  @ 100 kg</text>
<text x="88" y="1029" font-size="11" font-weight="500" fill="#86868B">2,000 kg volume · RPE 7.5 · e1RM 116.7</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1016)"/>

<g filter="url(#ft)"><rect x="16" y="1064" width="361" height="76" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="1064.5" width="360" height="75" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="1080" width="44" height="44" rx="14" fill="#FFD60A" fill-opacity=".12"/>
<text x="54" y="1098" font-size="8" font-weight="700" letter-spacing=".6" fill="#A08000" text-anchor="middle">JUN</text>
<text x="54" y="1117" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFD84D" text-anchor="middle">02</text>
<text x="88" y="1096" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">5 · 5 · 4 · 4  @ 102.5 kg</text>
<text x="88" y="1115" font-size="11" font-weight="500" fill="#86868B">1,845 kg volume · RPE 9 · e1RM 119.6</text>
<rect x="297" y="1074" width="34" height="18" rx="9" fill="#FFD60A" fill-opacity=".18" stroke="#FFD60A" stroke-opacity=".3" stroke-width=".7"/>
<text x="314" y="1086.5" font-size="8.5" font-weight="700" letter-spacing=".5" fill="#FFD84D" text-anchor="middle">PR</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1102)"/>

<g filter="url(#ft)"><rect x="16" y="1150" width="361" height="76" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="1150.5" width="360" height="75" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="1166" width="44" height="44" rx="14" fill="#FFF" fill-opacity=".06"/>
<text x="54" y="1184" font-size="8" font-weight="700" letter-spacing=".6" fill="#8E8E93" text-anchor="middle">MAY</text>
<text x="54" y="1203" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFF" text-anchor="middle">27</text>
<text x="88" y="1182" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">5 · 5 · 5 · 5  @ 97.5 kg</text>
<text x="88" y="1201" font-size="11" font-weight="500" fill="#86868B">1,950 kg volume · RPE 8 · e1RM 113.8</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1188)"/>

<g filter="url(#ft)"><rect x="16" y="1236" width="361" height="76" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="1236.5" width="360" height="75" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="1252" width="44" height="44" rx="14" fill="#FFF" fill-opacity=".06"/>
<text x="54" y="1270" font-size="8" font-weight="700" letter-spacing=".6" fill="#8E8E93" text-anchor="middle">MAY</text>
<text x="54" y="1289" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFF" text-anchor="middle">20</text>
<text x="88" y="1268" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">5 · 5 · 5 · 5  @ 95 kg</text>
<text x="88" y="1287" font-size="11" font-weight="500" fill="#86868B">1,900 kg volume · RPE 8 · e1RM 110.8</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1274)"/>

<g filter="url(#ft)"><rect x="16" y="1322" width="361" height="76" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="1322.5" width="360" height="75" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="1338" width="44" height="44" rx="14" fill="#FFF" fill-opacity=".06"/>
<text x="54" y="1356" font-size="8" font-weight="700" letter-spacing=".6" fill="#8E8E93" text-anchor="middle">MAY</text>
<text x="54" y="1375" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFF" text-anchor="middle">13</text>
<text x="88" y="1354" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">5 · 5 · 5 · 5  @ 92.5 kg</text>
<text x="88" y="1373" font-size="11" font-weight="500" fill="#86868B">1,850 kg volume · RPE 7.5 · e1RM 107.9</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1360)"/>

<g filter="url(#ft)"><rect x="16" y="1408" width="361" height="76" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="1408.5" width="360" height="75" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="1424" width="44" height="44" rx="14" fill="#FFF" fill-opacity=".06"/>
<text x="54" y="1442" font-size="8" font-weight="700" letter-spacing=".6" fill="#8E8E93" text-anchor="middle">MAY</text>
<text x="54" y="1461" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFF" text-anchor="middle">05</text>
<text x="88" y="1440" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">5 · 5 · 4 · 4  @ 92.5 kg</text>
<text x="88" y="1459" font-size="11" font-weight="500" fill="#86868B">1,665 kg volume · RPE 8 · deload week</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1446)"/>

<g filter="url(#fb)"><rect x="16" y="1500" width="361" height="54" rx="27" fill="url(#br)"/></g>
<rect x="16" y="1500" width="361" height="27" rx="27" fill="url(#gl)" opacity=".35"/>
<rect x="16.5" y="1500.5" width="360" height="53" rx="26.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="196.5" y="1533" font-size="16" font-weight="650" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Log Bench Session</text>
<rect x="16" y="1566" width="361" height="48" rx="24" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".10" stroke-width="1"/>
<text x="196.5" y="1596" font-size="14.5" font-weight="600" letter-spacing="-.25" fill="#C7C7CC" text-anchor="middle">Edit Exercise Details</text>
<rect x="140.5" y="1630" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1649" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## SCREEN 3 · EXERCISE PICKER FOR STATS — 393 × 852

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="852" viewBox="0 0 393 852" role="img" aria-labelledby="T3" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="T3">Kinetic — Exercise picker for stats</title>
<defs>
  <clipPath id="fr"><rect width="393" height="852" rx="54.5"/></clipPath>
  <clipPath id="sc"><rect width="393" height="736"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="330" cy="240" r="290"><stop offset="0" stop-color="#FF2D55" stop-opacity=".15"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <linearGradient id="sel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF2D55" stop-opacity=".16"/><stop offset="1" stop-color="#FF9F0A" stop-opacity=".07"/></linearGradient>
  <linearGradient id="fd" gradientUnits="userSpaceOnUse" x1="0" y1="696" x2="0" y2="736"><stop offset="0" stop-color="#050507" stop-opacity="0"/><stop offset="1" stop-color="#050507" stop-opacity=".94"/></linearGradient>
  <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15151A" stop-opacity=".94"/><stop offset="1" stop-color="#0C0C10" stop-opacity=".99"/></linearGradient>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="ff" x="-20%" y="-60%" width="140%" height="240%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#FF6A3D" flood-opacity=".4"/></filter>
  <g id="ic-db"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
  <g id="ic-leg" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M-5 -8 V-1 L-1 3 V8"/><path d="M5 -8 V-1 L1 3"/></g>
  <g id="ic-pull" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M-8 -5 L-3 0 L-8 5"/><path d="M8 -5 L3 0 L8 5"/><line x1="-3" y1="0" x2="3" y2="0"/></g>
  <path id="ck" d="M-4.2 .4 L-1.3 3.4 L4.6 -3.2" fill="none" stroke="#FFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="mg" fill="none" stroke="#8E8E93" stroke-width="1.9" stroke-linecap="round"><circle cx="-1.6" cy="-1.6" r="5.8"/><line x1="2.6" y1="2.6" x2="7" y2="7"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="852" fill="url(#bg)"/><rect width="393" height="852" fill="url(#A1)"/>

<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:38</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<circle cx="245.5" cy="29.5" r="6.2" fill="#0A0C10"/><circle cx="245.5" cy="29.5" r="3.1" fill="#121A24"/><circle cx="244.2" cy="28.2" r="1.05" fill="#3E6E9E" opacity=".75"/>

<!-- sheet grabber -->
<rect x="178.5" y="62" width="36" height="5" rx="2.5" fill="#FFF" fill-opacity=".22"/>
<text x="24" y="100" font-size="16" font-weight="400" letter-spacing="-.3" fill="#8E8E93">Cancel</text>
<text x="196.5" y="100" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">Choose Exercise</text>

<!-- search · focused -->
<g filter="url(#ff)"><rect x="16" y="112" width="361" height="38" rx="12" fill="#FFF" fill-opacity=".08" stroke="url(#br)" stroke-width="1.8"/></g>
<use xlink:href="#mg" href="#mg" transform="translate(38,131) scale(.95)"/>
<text x="56" y="136" font-size="15" font-weight="400" letter-spacing="-.2" fill="#6C6C70">Search 214 exercises</text>
<rect x="196" y="121" width="2" height="20" rx="1" fill="#FF6A3D"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.51;1" dur="1.1s" repeatCount="indefinite"/></rect>

<!-- filter chips (overflow right = horizontal scroll) -->
<rect x="16" y="162" width="46" height="28" rx="14" fill="#FFF"/>
<text x="39" y="180.5" font-size="12" font-weight="650" letter-spacing="-.15" fill="#1C1C1E" text-anchor="middle">All</text>
<g fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"><rect x="70" y="162" width="58" height="28" rx="14"/><rect x="136" y="162" width="50" height="28" rx="14"/><rect x="194" y="162" width="52" height="28" rx="14"/><rect x="254" y="162" width="82" height="28" rx="14"/><rect x="344" y="162" width="54" height="28" rx="14"/></g>
<g font-size="12" font-weight="500" letter-spacing="-.15" fill="#C7C7CC" text-anchor="middle"><text x="99" y="180.5">Chest</text><text x="161" y="180.5">Back</text><text x="220" y="180.5">Legs</text><text x="295" y="180.5">Shoulders</text><text x="371" y="180.5">Arms</text></g>

<g clip-path="url(#sc)">
<!-- current selection -->
<g filter="url(#ft)"><rect x="16" y="202" width="361" height="60" rx="20" fill="url(#sel)"/></g>
<rect x="16.5" y="202.5" width="360" height="59" rx="19.5" fill="none" stroke="#FF2D55" stroke-opacity=".38" stroke-width="1"/>
<rect x="32" y="216" width="32" height="32" rx="11" fill="#FF2D55" fill-opacity=".18"/>
<use xlink:href="#ic-db" href="#ic-db" transform="translate(48,232) scale(.6)" fill="#FF6A88"/>
<text x="76" y="228" font-size="8" font-weight="700" letter-spacing=".9" fill="#FF6A88">VIEWING STATS FOR</text>
<text x="76" y="248" font-size="15" font-weight="650" letter-spacing="-.3" fill="#FFF">Barbell Bench Press</text>
<circle cx="345" cy="232" r="13" fill="#30D158"/>
<use xlink:href="#ck" href="#ck" transform="translate(345,232) scale(.85)"/>

<!-- PINNED -->
<text x="24" y="292" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">PINNED</text>
<g filter="url(#ft)"><rect x="16" y="302" width="336" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="302.5" width="335" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="312" width="32" height="32" rx="11" fill="#FF2D55" fill-opacity=".15"/>
<use xlink:href="#ic-db" href="#ic-db" transform="translate(46,328) scale(.62)" fill="#FF6A88"/>
<text x="74" y="326" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Barbell Bench Press</text>
<text x="74" y="343" font-size="10.5" font-weight="500" fill="#86868B">Chest · Triceps · 34 sessions</text>
<circle cx="329" cy="328" r="11" fill="#FF2D55"/>
<use xlink:href="#ck" href="#ck" transform="translate(329,328) scale(.72)"/>

<g filter="url(#ft)"><rect x="16" y="362" width="336" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="362.5" width="335" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="372" width="32" height="32" rx="11" fill="#0A84FF" fill-opacity=".16"/>
<use xlink:href="#ic-leg" href="#ic-leg" transform="translate(46,388) scale(.72)" color="#5EB0FF"/>
<text x="74" y="386" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Back Squat</text>
<text x="74" y="403" font-size="10.5" font-weight="500" fill="#86868B">Quads · Glutes · 28 sessions</text>
<circle cx="329" cy="388" r="11" fill="none" stroke="#FFF" stroke-opacity=".16" stroke-width="1.6"/>

<!-- RECENTLY VIEWED -->
<text x="24" y="444" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">RECENTLY VIEWED</text>
<g filter="url(#ft)"><rect x="16" y="454" width="336" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="454.5" width="335" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="464" width="32" height="32" rx="11" fill="#AF52DE" fill-opacity=".16"/>
<use xlink:href="#ic-db" href="#ic-db" transform="translate(46,480) scale(.62)" fill="#C77DFF"/>
<text x="74" y="478" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Deadlift</text>
<text x="74" y="495" font-size="10.5" font-weight="500" fill="#86868B">Back · Hamstrings · 26 sessions</text>
<circle cx="329" cy="480" r="11" fill="none" stroke="#FFF" stroke-opacity=".16" stroke-width="1.6"/>

<g filter="url(#ft)"><rect x="16" y="514" width="336" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="514.5" width="335" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="524" width="32" height="32" rx="11" fill="#FF9F0A" fill-opacity=".15"/>
<use xlink:href="#ic-db" href="#ic-db" transform="translate(46,540) scale(.62)" fill="#FFB84D"/>
<text x="74" y="538" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Seated Shoulder Press</text>
<text x="74" y="555" font-size="10.5" font-weight="500" fill="#86868B">Shoulders · 31 sessions</text>
<circle cx="329" cy="540" r="11" fill="none" stroke="#FFF" stroke-opacity=".16" stroke-width="1.6"/>

<g filter="url(#ft)"><rect x="16" y="574" width="336" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="574.5" width="335" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="584" width="32" height="32" rx="11" fill="#30D158" fill-opacity=".15"/>
<use xlink:href="#ic-pull" href="#ic-pull" transform="translate(46,600) scale(.78)" color="#4ADE80"/>
<text x="74" y="598" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Barbell Row</text>
<text x="74" y="615" font-size="10.5" font-weight="500" fill="#86868B">Back · Biceps · 29 sessions</text>
<circle cx="329" cy="600" r="11" fill="none" stroke="#FFF" stroke-opacity=".16" stroke-width="1.6"/>

<!-- ALL EXERCISES -->
<text x="24" y="656" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">ALL EXERCISES</text>
<text x="345" y="656" font-size="10" font-weight="500" fill="#6C6C70" text-anchor="end">214</text>
<g filter="url(#ft)"><rect x="16" y="666" width="336" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="666.5" width="335" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="676" width="32" height="32" rx="11" fill="#FF9F0A" fill-opacity=".15"/>
<use xlink:href="#ic-db" href="#ic-db" transform="translate(46,692) scale(.62)" fill="#FFB84D"/>
<text x="74" y="690" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Arnold Press</text>
<text x="74" y="707" font-size="10.5" font-weight="500" fill="#86868B">Dumbbell · Shoulders · 12 sessions</text>
<circle cx="329" cy="692" r="11" fill="none" stroke="#FFF" stroke-opacity=".16" stroke-width="1.6"/>

<g filter="url(#ft)"><rect x="16" y="726" width="336" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="726.5" width="335" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="736" width="32" height="32" rx="11" fill="#AF52DE" fill-opacity=".16"/>

<!-- A–Z scrubber index -->
<g font-size="8.5" font-weight="600" letter-spacing="-.1" fill="#8E8E93" text-anchor="middle">
<text x="368" y="300">A</text><text x="368" y="316.8" fill="#FF6A88" font-weight="700">B</text><text x="368" y="333.6">C</text><text x="368" y="350.4">D</text><text x="368" y="367.2">E</text><text x="368" y="384">F</text><text x="368" y="400.8">G</text><text x="368" y="417.6">H</text><text x="368" y="434.4">I</text><text x="368" y="451.2">J</text><text x="368" y="468">K</text><text x="368" y="484.8">L</text><text x="368" y="501.6">M</text><text x="368" y="518.4">N</text><text x="368" y="535.2">O</text><text x="368" y="552">P</text><text x="368" y="568.8">Q</text><text x="368" y="585.6">R</text><text x="368" y="602.4">S</text><text x="368" y="619.2">T</text><text x="368" y="636">U</text><text x="368" y="652.8">V</text><text x="368" y="669.6">W</text><text x="368" y="686.4">X</text><text x="368" y="703.2">Y</text><text x="368" y="720">Z</text></g>
<rect x="0" y="696" width="393" height="40" fill="url(#fd)"/>
</g>

<!-- sticky confirm -->
<rect x="0" y="736" width="393" height="116" fill="url(#tb)"/>
<line x1="0" y1="736.5" x2="393" y2="736.5" stroke="#FFF" stroke-opacity=".11"/>
<g filter="url(#fb)"><rect x="16" y="748" width="361" height="54" rx="27" fill="url(#br)"/></g>
<rect x="16" y="748" width="361" height="27" rx="27" fill="url(#gl)" opacity=".35"/>
<rect x="16.5" y="748.5" width="360" height="53" rx="26.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="196.5" y="781" font-size="16" font-weight="650" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Show Trends</text>
<text x="196.5" y="820" font-size="10.5" font-weight="500" fill="#6C6C70" text-anchor="middle">Barbell Bench Press · last 8 weeks</text>
<rect x="140.5" y="838" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="850.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

---

## Verification log

| Claim | Computation | Result |
|---|---|---|
| Rolling 7-day volume | 6,940+9,540+0+5,180+4,260+0+8,420 | **34,340 kg** ✓ |
| Sessions in window | Jun 3, 4, 6, 7, 9 | **5** ✓ |
| Home "+18%" | (34,340−29,100)/29,100 | **+18.007 → +18.0%** ✓ |
| Home AVG line y=736 | 7-day mean 4,905.7 → h 30.85 → y 735.15 | **≈736** ✓ no patch |
| 8-week mean | 233,110 / 8 | **29,138.75 → 29,139** ✓ |
| 8-week volume gain | (34,340−26,180)/26,180 | **+31.17 → +31.2%** ✓ |
| Bench e1RM gain | (116.7−105.0)/105.0 | **+11.14 → +11.1%** ✓ |
| e1RM identity | Same rep count ⇒ % gain in e1RM = % gain in working weight | **11.1% both** ✓ |
| Bodyweight Δ | (80.6−82.4)/82.4 | **−2.18 → −2.2%** ✓ |
| Strength ratio | 116.7 / 80.6 | **1.4479 → 1.45×** ✓ |
| Muscle-group Σ | 14+12+11+14+10+8+6+10+2 | **87 sets** ✓ |
| Session-set cross-check | 18+20+16+14+19 | **87** ✓ |
| Heatmap cells | 30+6+18+21+10+6 | **91 = 13×7** ✓ |
| Days trained | 5+5+3+4+5+4+5+4+5+4+5+5+1 | **55** ✓ |
| Consistency % | 55 / 85 elapsed | **64.7 → 65%** ✓ |
| Avg/week | 55 / 13 | **4.23 → 4.2** ✓ |
| Sessions-in-2025 cross-check | 96 / 22.9 weeks | **4.19 → 4.2** ✓ consistent |
| e1RM · Deadlift | 180 × (1+3/30) | **198.0** ✓ |
| e1RM · Squat | 145 × 1.16667 | **169.17 → 169.2** ✓ |
| e1RM · Shoulder Press | 60 × 1.33333 | **80.0** ✓ |
| e1RM · Row | 90 × 1.26667 | **114.0** ✓ |
| Jun 9 per-set e1RM | 100 × 1.16667 | **116.67 → 116.7** ✓ |
| Jun 9 set RPE mean | (7+7+8+8)/4 | **7.5** ✓ matches contract |
| May 5 bench volume | 92.5 × 18 | **1,665 kg** ✓ |
| Muscle involvement | 62 + 24 + 14 | **100%** ✓ |
| Bar widths | 0.62/0.24/0.14 × 180 | **111.6 / 43.2 / 25.2** ✓ |
| Load bars | sets × 13.375 pt (321 pt / 24 sets) | all six verified ✓ |
| Home PR delta | 97.5 → 102.5 | **+5.0 kg** ✓ already correct |
| Streak | home 12 pre-session + today | **13** ✓ |

---

## New features added (and why each earns its space)

| Feature | Justification |
|---|---|
| **Muscle Group Load with MEV–MRV target bands** | The only chart that answers "what should I do differently?" rather than "what did I do?" The dimmed band markers show the range bounds explicitly. |
| **13-week consistency heatmap, 5 intensity levels** | Volume charts hide frequency. This is the single densest honest view of adherence — and the deload week (all L1/L2) is legible at a glance. |
| **Trend Insights (Coach)** | Turns two verified numbers into two directives. Every claim traces to the contract: 18.0% w/w and 2-of-6–14 calf sets. |
| **Range segmented control (7D/4W/6M/1Y/ALL)** | Required for any stats surface; also fixes the semantic bug on home by making the window explicit. |
| **Metric switcher on the hero chart** | One card, three datasets — no duplicated chrome. |
| **Personal Bests table with e1RM column** | Raw best is misleading across rep ranges. e1RM normalises it. |
| **PR Timeline** | Chronology is what makes progress feel real rather than abstract. |
| **Muscle Involvement** (detail) | Explains *why* a lift is stalling. |
| **Per-set RPE detail** (detail) | 100×5 four times reads as flat; RPE 7→8 shows the true cost curve. |
| **Pinned + A–Z scrubber** (picker) | 214 exercises is unscrollable; pinned shortcuts and the index are the only humane navigation. |
| **Disabled-state confirm** (picker) | "Show Trends" is enabled only because a selection exists; the helper line names it. |

---

## Light mode

Geometry is byte-identical; the swap is the published token delta. Specific to these screens:

| Element | Dark | Light |
|---|---|---|
| Chart line | `#FF9F0A→#FF2D55` | `#E07800→#D70015` |
| Chart area | brand @ 0.36→0 | brand @ **0.20**→0 |
| Gridlines | white 0.05 | `#3C3C43` @ 0.10 |
| Chart node halo | `#131316` | `#FFFFFF` |
| Heatmap L0–L4 | `#30D158` @ .05/.25/.45/.68/.95 | `#248A3D` @ .08/.28/.48/.70/.95 (deepened for white) |
| Target-range band | white 0.11 | `#787880` @ 0.20 |
| Under-trained bar | `#FF9F0A` | `#E07800` |
| Insight box | `#FF9F0A` @ .10 / text `#FFD8A8` | `#FF9500` @ .12 / text `#8A4B00` |
| Gold PR banner | text `#2B1E00` / `#5C4300` | **unchanged** — gold stays gold in both themes |
| Segmented thumb | white 0.13 | `#FFFFFF` + shadow `0 1 3 rgba(0,0,0,.18)` |
| Picker selected row | `#FF2D55` @ .16 + .38 stroke | `#FF2D55` @ .10 + .30 stroke |
| Alphabet index | `#8E8E93`, active `#FF6A88` | `#8E8E93`, active `#D70015` |
| Tab bar | `#1D1D21` @ .92 | `#FBFBFD` @ .93, hairline `#3C3C43` @ .16 |
| Trends active tint | `#FF375F` | `#FF2D55` |

---

**Next:** the three light-mode files, or **Phase 4 — Profile / Settings**. Say which and I'll ship it on the same contract.