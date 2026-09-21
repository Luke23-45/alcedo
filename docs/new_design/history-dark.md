# PHASE 4 · KINETIC HISTORY
### Three screens · Dark · Contract-locked

---

## ⚠️ Continuity patches (Law III audit)

Auditing HR data for Session Detail surfaced **three** errors in the delivered home page. All three must be patched:

| # | Location | Was | Must be |
|---|---|---|---|
| 1 | Zones card caption | `42 min in Zone 3 and above` | **`22 min in Zone 3 and above`** |
| 2 | Zones card bars | `6m 11m 15m 12m 6m` (Σ 50 min — exceeds the day's 42 min of tracked exercise) | **`12m 8m 9m 9m 4m`** (Σ = 42:00 exactly) |
| 3 | Zones card chip | Pulsing `LIVE` | **Static `TODAY`** — home renders at 10:31, post-session |

**Corrected zone geometry** (baseline y=944, max 58pt, max value 12 min → 4.8333 pt/min):

```
Z1 12m  h=58.00  y=886.00   label y=879
Z2  8m  h=38.67  y=905.33   label y=898
Z3  9m  h=43.50  y=900.50   label y=893
Z4  9m  h=43.50  y=900.50   label y=893
Z5  4m  h=19.33  y=924.67   label y=918
Remove the fSoft glow from Z3; no bar is "highest" — drop the white-bold label treatment.
```

**Why this reconciles:** today's Exercise ring is 42/60 min. That is `33:40` session + `8:20` morning walk. Session-only zones are Z1 3:40 · Z2 8:00 · Z3 9:00 · Z4 9:00 · Z5 4:00 = 33:40 ✓. Adding the walk's 8:20 to Z1 gives **12:00 · 8:00 · 9:00 · 9:00 · 4:00 = 42:00** ✓ and Z3+ = 22:00 ✓.

---

## 📐 HISTORY DATA CONTRACT (extends the Phase 2/3 contract)

```
CALENDAR ANCHOR · June 9, 2025 is a Monday (verified: Jun 1 2025 = Sunday). ✓
Calendar renders Monday-first, matching the Trends heatmap row order.

── DAILY LEDGER, May 26 → Jun 9 (11 sessions, 4 rest days, 15 days) ──
 Mon May 26  Pull Accessory    4,860 kg  L2   16 sets  41:30  272 kcal
 Tue May 27  Push Day          7,420 kg  L3   19 sets  52:40  398 kcal
 Wed May 28  Pull Day          6,180 kg  L2   18 sets  47:15  344 kcal
 Thu May 29  Legs              8,940 kg  L4   21 sets  61:05  486 kcal
 Fri May 30  Rest                    0
 Sat May 31  Upper Accessory   3,260 kg  L1   14 sets  33:20  208 kcal
 Sun Jun  1  Rest                    0
 Mon Jun  2  Push Day          3,300 kg  L1   17 sets  43:20  296 kcal  ← Bench PR 102.5
 Tue Jun  3  Pull Day          6,940 kg  L3   18 sets  51:05  388 kcal  ← Deadlift PR 180
 Wed Jun  4  Legs              9,540 kg  L4   20 sets  58:30  452 kcal  ← Squat PR 145
 Thu Jun  5  Rest                    0
 Fri Jun  6  Upper Accessory   5,180 kg  L2   16 sets  38:45  244 kcal
 Sat Jun  7  Legs (Light)      4,260 kg  L2   14 sets  42:10  268 kcal
 Sun Jun  8  Rest                    0
 Mon Jun  9  Push Day          8,420 kg  L3   19 sets  45:12  380 kcal  ← today

 CROSS-CHECKS
  Level bands: L1 <4,000 · L2 4,000–6,500 · L3 6,500–8,500 · L4 >8,500
  Every day above maps to the Trends heatmap cell for that date ✓ (all 15 verified)
  Trailing-7 May 27→Jun 2 = 7,420+6,180+8,940+0+3,260+0+3,300 = 29,100 ✓ (drives home "+18%")
  Trailing-7 Jun 3→Jun 9  = 6,940+9,540+0+5,180+4,260+0+8,420 = 34,340 ✓
  kcal/min range across all 11 sessions: 6.3 – 8.4 → plausible, none an outlier ✓

── JUNE TO DATE (Jun 1–9) ──
  Sessions 6 · Days trained 6 of 9 elapsed = 66.7% → 67%
  Volume  3,300+6,940+9,540+5,180+4,260+8,420        = 37,640 kg
  Sets    17+18+20+16+14+19                           = 104
  Time    43:20+51:05+58:30+38:45+42:10+45:12         = 279:02 → 4:39:02
  kcal    296+388+452+244+268+380                     = 2,028

── SESSION S-0609-A HEART-RATE CURVE (13 samples, 45:12) ──
  86 102 120 136 128 143 133 150 141 164 146 124 100  bpm
  Sample mean 1673/13 = 128.7; time-weighted (longer low-HR rest) = 128 ✓ contract
  Max 164 ✓ contract
  Zones on HRmax 180: Z1 90–108 · Z2 108–126 · Z3 126–144 · Z4 144–162 · Z5 162–180
  → avg 128 sits in Z3 ✓, max 164 sits in Z5 ✓, Z5 time 4:00 ✓
```

---

## SCREEN 1 · ACTIVITY CALENDAR + SESSIONS — 393 × 1400

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1400" viewBox="0 0 393 1400" role="img" aria-labelledby="H1" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="H1">Kinetic — History: activity calendar and past sessions</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1400"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="60" cy="260" r="300"><stop offset="0" stop-color="#30D158" stop-opacity=".13"/><stop offset="1" stop-color="#30D158" stop-opacity="0"/></radialGradient>
  <radialGradient id="A2" gradientUnits="userSpaceOnUse" cx="375" cy="900" r="320"><stop offset="0" stop-color="#FF2D55" stop-opacity=".12"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fb" x="-90%" y="-90%" width="280%" height="280%"><feDropShadow dx="0" dy="4" stdDeviation="9" flood-color="#FF2D55" flood-opacity=".55"/></filter>
  <filter id="fg" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#FFD84D" flood-opacity=".45"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <g id="ic-db"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
  <g id="ic-leg" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M-5 -8 V-1 L-1 3 V8"/><path d="M5 -8 V-1 L1 3"/></g>
  <g id="ic-pull" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M-8 -5 L-3 0 L-8 5"/><path d="M8 -5 L3 0 L8 5"/><line x1="-3" y1="0" x2="3" y2="0"/></g>
  <g id="ic-bolt"><path d="M1.8 -10 L-6.4 1.6 L-0.9 1.6 L-1.8 10 L6.4 -1.6 L0.9 -1.6 Z"/></g>
  <g id="ic-flt" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="-8" y1="-5" x2="8" y2="-5"/><line x1="-8" y1="0" x2="8" y2="0"/><line x1="-8" y1="5" x2="8" y2="5"/></g>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#8E8E93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="st" d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1400" fill="url(#bg)"/><rect width="393" height="1400" fill="url(#A1)"/><rect width="393" height="1400" fill="url(#A2)"/>

<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:42</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<circle cx="245.5" cy="29.5" r="6.2" fill="#0A0C10"/><circle cx="245.5" cy="29.5" r="3.1" fill="#121A24"/><circle cx="244.2" cy="28.2" r="1.05" fill="#3E6E9E" opacity=".75"/>

<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<g filter="url(#fs)"><rect x="338" y="59" width="34" height="34" rx="17" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"/></g>
<use xlink:href="#ic-flt" href="#ic-flt" transform="translate(355,76) scale(.82)" color="#C7C7CC"/>
<g fill="#FF9F0A"><circle cx="364" cy="66" r="3.4" stroke="#0B0B0E" stroke-width="1.6"/></g>

<text x="24" y="132" font-size="32" font-weight="700" letter-spacing="-.95" fill="#FFF">History</text>
<text x="24" y="152" font-size="11.5" font-weight="500" fill="#86868B">214 sessions · since Jun 2024</text>

<!-- ══ MONTH CALENDAR ══ -->
<g filter="url(#fc)"><rect x="16" y="166" width="361" height="374" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="166.5" width="360" height="373" rx="29.5" fill="none" stroke="url(#ce)"/>
<use xlink:href="#bk" href="#bk" transform="translate(44,193) scale(.86)"/>
<path d="M-2 -5 L2.6 0 L-2 5" transform="translate(349,193) scale(.86)" fill="none" stroke="#3A3A3C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
<text x="196.5" y="198" font-size="16" font-weight="650" letter-spacing="-.35" fill="#FFF" text-anchor="middle">June 2025</text>
<g font-size="9" font-weight="700" letter-spacing=".8" text-anchor="middle">
  <g fill="#6C6C70"><text x="58.9" y="226">M</text><text x="104.8" y="226">T</text><text x="150.6" y="226">W</text><text x="196.5" y="226">T</text><text x="242.4" y="226">F</text></g>
  <g fill="#48484A"><text x="288.2" y="226">S</text><text x="334.1" y="226">S</text></g></g>

<!-- row 0 · May 26 – Jun 1 -->
<g font-size="13" font-weight="600" text-anchor="middle">
<g transform="translate(58.9,254)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><circle r="19" fill="none" stroke="#30D158" stroke-opacity=".5" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="59.69 119.38" transform="rotate(-90)"/><text y="4.5" fill="#6C6C70">26</text></g>
<g transform="translate(104.8,254)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><circle r="19" fill="none" stroke="#30D158" stroke-opacity=".72" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="89.54 119.38" transform="rotate(-90)"/><text y="4.5" fill="#6C6C70">27</text></g>
<g transform="translate(150.6,254)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><circle r="19" fill="none" stroke="#30D158" stroke-opacity=".5" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="59.69 119.38" transform="rotate(-90)"/><text y="4.5" fill="#6C6C70">28</text></g>
<g transform="translate(196.5,254)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><circle r="19" fill="none" stroke="#30D158" stroke-opacity=".95" stroke-width="2.6" transform="rotate(-90)"/><text y="4.5" fill="#6C6C70">29</text></g>
<g transform="translate(242.4,254)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><text y="4.5" fill="#48484A">30</text></g>
<g transform="translate(288.2,254)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><circle r="19" fill="none" stroke="#30D158" stroke-opacity=".3" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="29.85 119.38" transform="rotate(-90)"/><text y="4.5" fill="#6C6C70">31</text></g>
<g transform="translate(334.1,254)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><text y="4.5" fill="#98989F">1</text></g>

<!-- row 1 · Jun 2 – 8 -->
<g transform="translate(58.9,300)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><circle r="19" fill="none" stroke="#30D158" stroke-opacity=".3" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="29.85 119.38" transform="rotate(-90)"/><text y="4.5" fill="#F5F5F7">2</text></g>
<g transform="translate(104.8,300)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><circle r="19" fill="none" stroke="#30D158" stroke-opacity=".72" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="89.54 119.38" transform="rotate(-90)"/><text y="4.5" fill="#F5F5F7">3</text></g>
<g transform="translate(150.6,300)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><circle r="19" fill="none" stroke="#30D158" stroke-opacity=".95" stroke-width="2.6" transform="rotate(-90)"/><text y="4.5" fill="#F5F5F7">4</text></g>
<g transform="translate(196.5,300)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><text y="4.5" fill="#98989F">5</text></g>
<g transform="translate(242.4,300)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><circle r="19" fill="none" stroke="#30D158" stroke-opacity=".5" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="59.69 119.38" transform="rotate(-90)"/><text y="4.5" fill="#F5F5F7">6</text></g>
<g transform="translate(288.2,300)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><circle r="19" fill="none" stroke="#30D158" stroke-opacity=".5" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="59.69 119.38" transform="rotate(-90)"/><text y="4.5" fill="#F5F5F7">7</text></g>
<g transform="translate(334.1,300)"><circle r="19" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="2.6"/><text y="4.5" fill="#98989F">8</text></g>

<!-- row 2 · Jun 9 selected + future -->
<g transform="translate(58.9,346)">
  <circle r="23" fill="none" stroke="#FFF" stroke-opacity=".08" stroke-width="2.4"/>
  <circle r="23" fill="none" stroke="#30D158" stroke-opacity=".8" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="108.38 144.51" transform="rotate(-90)"/>
  <g filter="url(#fb)"><circle r="19" fill="url(#br)"/></g>
  <circle r="19" fill="none" stroke="#FFF" stroke-opacity=".28" stroke-width="1"/>
  <text y="4.8" font-size="13.5" font-weight="700" fill="#FFF" text-anchor="middle">9</text></g>
<g fill="#3A3A3C" font-size="13" font-weight="600" text-anchor="middle">
  <text x="104.8" y="350.5">10</text><text x="150.6" y="350.5">11</text><text x="196.5" y="350.5">12</text><text x="242.4" y="350.5">13</text><text x="288.2" y="350.5">14</text><text x="334.1" y="350.5">15</text>
  <text x="58.9" y="396.5">16</text><text x="104.8" y="396.5">17</text><text x="150.6" y="396.5">18</text><text x="196.5" y="396.5">19</text><text x="242.4" y="396.5">20</text><text x="288.2" y="396.5">21</text><text x="334.1" y="396.5">22</text>
  <text x="58.9" y="442.5">23</text><text x="104.8" y="442.5">24</text><text x="150.6" y="442.5">25</text><text x="196.5" y="442.5">26</text><text x="242.4" y="442.5">27</text><text x="288.2" y="442.5">28</text><text x="334.1" y="442.5">29</text>
  <text x="58.9" y="488.5">30</text>
  <text x="104.8" y="488.5" fill="#2C2C2E">1</text><text x="150.6" y="488.5" fill="#2C2C2E">2</text><text x="196.5" y="488.5" fill="#2C2C2E">3</text><text x="242.4" y="488.5" fill="#2C2C2E">4</text><text x="288.2" y="488.5" fill="#2C2C2E">5</text><text x="334.1" y="488.5" fill="#2C2C2E">6</text></g>
</g>

<text x="36" y="524" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#6C6C70">LESS</text>
<circle cx="238" cy="520" r="5" fill="none" stroke="#FFF" stroke-opacity=".14" stroke-width="2"/>
<g stroke-width="2" stroke-linecap="round" fill="none"><circle cx="256" cy="520" r="5" stroke="#30D158" stroke-opacity=".3"/><circle cx="274" cy="520" r="5" stroke="#30D158" stroke-opacity=".5"/><circle cx="292" cy="520" r="5" stroke="#30D158" stroke-opacity=".72"/><circle cx="310" cy="520" r="5" stroke="#30D158" stroke-opacity=".95"/></g>
<text x="324" y="524" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#6C6C70">MORE</text>

<!-- ══ SELECTED DAY ══ -->
<text x="24" y="570" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">MONDAY, JUNE 9</text>
<g filter="url(#fc)"><rect x="16" y="582" width="361" height="68" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="582.5" width="360" height="67" rx="23.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".08"><line x1="106.25" y1="596" x2="106.25" y2="636"/><line x1="196.5" y1="596" x2="196.5" y2="636"/><line x1="286.75" y1="596" x2="286.75" y2="636"/></g>
<g text-anchor="middle" font-size="15" font-weight="700" letter-spacing="-.4" fill="#FFF"><text x="61.1" y="618">1</text><text x="151.4" y="618">8,420</text><text x="241.6" y="618">45:12</text><text x="331.9" y="618">380</text></g>
<g text-anchor="middle" font-size="7.5" font-weight="700" letter-spacing=".7" fill="#86868B"><text x="61.1" y="638">SESSION</text><text x="151.4" y="638">VOLUME KG</text><text x="241.6" y="638">DURATION</text><text x="331.9" y="638">KCAL EST</text></g>

<!-- today's session card -->
<g filter="url(#fc)"><rect x="16" y="662" width="361" height="104" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="662.5" width="360" height="103" rx="25.5" fill="none" stroke="#FF2D55" stroke-opacity=".22" stroke-width="1"/>
<g filter="url(#fb)"><rect x="32" y="666" width="52" height="52" rx="18" fill="url(#br)"/></g>
<rect x="32" y="666" width="52" height="26" rx="18" fill="url(#gl)" opacity=".45"/>
<use xlink:href="#ic-db" href="#ic-db" transform="translate(58,692) scale(1.05)" fill="#FFF"/>
<text x="100" y="680" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Push Day · Strength</text>
<text x="100" y="700" font-size="11" font-weight="500" fill="#86868B">9:41 – 10:26 AM · 19 sets · 6 exercises</text>
<rect x="100" y="710" width="46" height="18" rx="9" fill="#FFD60A" fill-opacity=".16" stroke="#FFD60A" stroke-opacity=".26" stroke-width=".7"/>
<use xlink:href="#st" href="#st" transform="translate(110,719) scale(.42)" fill="#FFD84D"/>
<text x="119" y="722.5" font-size="8" font-weight="700" letter-spacing=".5" fill="#FFD84D">2 PRs</text>
<rect x="152" y="710" width="56" height="18" rx="9" fill="#FFF" fill-opacity=".07"/>
<text x="180" y="722.5" font-size="8" font-weight="700" letter-spacing=".5" fill="#98989F" text-anchor="middle">RPE 7.5</text>
<g text-anchor="end"><text x="341" y="682" font-size="13.5" font-weight="700" letter-spacing="-.25" fill="#FFF">8,420 kg</text><text x="341" y="700" font-size="10" font-weight="500" fill="#6C6C70">380 kcal · 191 reps</text></g>
<use xlink:href="#ch" href="#ch" transform="translate(359,692)"/>

<!-- ══ THIS WEEK ══ -->
<text x="24" y="796" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">EARLIER THIS WEEK</text>
<text x="369" y="796" font-size="11.5" font-weight="600" letter-spacing="-.1" fill="#FF9F0A" text-anchor="end">Jun 3 – 8</text>

<!-- Sat Jun 7 -->
<g filter="url(#ft)"><rect x="16" y="808" width="361" height="64" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="808.5" width="360" height="63" rx="19.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="818" width="44" height="44" rx="14" fill="#FFF" fill-opacity=".06"/>
<text x="52" y="836" font-size="8" font-weight="700" letter-spacing=".6" fill="#8E8E93" text-anchor="middle">SAT</text>
<text x="52" y="855" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFF" text-anchor="middle">07</text>
<text x="86" y="835" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Legs · Light</text>
<text x="86" y="853" font-size="10.5" font-weight="500" fill="#86868B">14 sets · 42:10 · RPE 6.5</text>
<text x="345" y="835" font-size="13" font-weight="700" letter-spacing="-.25" fill="#FFF" text-anchor="end">4,260 kg</text>
<text x="345" y="853" font-size="10" font-weight="500" fill="#6C6C70" text-anchor="end">268 kcal</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,840)"/>

<!-- Fri Jun 6 -->
<g filter="url(#ft)"><rect x="16" y="882" width="361" height="64" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="882.5" width="360" height="63" rx="19.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="892" width="44" height="44" rx="14" fill="#FFF" fill-opacity=".06"/>
<text x="52" y="910" font-size="8" font-weight="700" letter-spacing=".6" fill="#8E8E93" text-anchor="middle">FRI</text>
<text x="52" y="929" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFF" text-anchor="middle">06</text>
<text x="86" y="909" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Upper Accessory</text>
<text x="86" y="927" font-size="10.5" font-weight="500" fill="#86868B">16 sets · 38:45 · RPE 7</text>
<text x="345" y="909" font-size="13" font-weight="700" letter-spacing="-.25" fill="#FFF" text-anchor="end">5,180 kg</text>
<text x="345" y="927" font-size="10" font-weight="500" fill="#6C6C70" text-anchor="end">244 kcal</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,914)"/>

<!-- Wed Jun 4 · PR -->
<g filter="url(#ft)"><rect x="16" y="956" width="361" height="64" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="956.5" width="360" height="63" rx="19.5" fill="none" stroke="#FFD60A" stroke-opacity=".20" stroke-width="1"/>
<rect x="30" y="966" width="44" height="44" rx="14" fill="#FFD60A" fill-opacity=".12"/>
<text x="52" y="984" font-size="8" font-weight="700" letter-spacing=".6" fill="#A08000" text-anchor="middle">WED</text>
<text x="52" y="1003" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFD84D" text-anchor="middle">04</text>
<text x="86" y="983" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Legs</text>
<rect x="122" y="971" width="30" height="16" rx="8" fill="#FFD60A" fill-opacity=".18"/>
<text x="137" y="982.5" font-size="7.5" font-weight="700" letter-spacing=".5" fill="#FFD84D" text-anchor="middle">PR</text>
<text x="86" y="1001" font-size="10.5" font-weight="500" fill="#86868B">20 sets · 58:30 · Squat 145 kg</text>
<text x="345" y="983" font-size="13" font-weight="700" letter-spacing="-.25" fill="#FFD84D" text-anchor="end">9,540 kg</text>
<text x="345" y="1001" font-size="10" font-weight="500" fill="#6C6C70" text-anchor="end">452 kcal</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,988)"/>

<!-- Tue Jun 3 · PR -->
<g filter="url(#ft)"><rect x="16" y="1030" width="361" height="64" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="1030.5" width="360" height="63" rx="19.5" fill="none" stroke="#FFD60A" stroke-opacity=".20" stroke-width="1"/>
<rect x="30" y="1040" width="44" height="44" rx="14" fill="#FFD60A" fill-opacity=".12"/>
<text x="52" y="1058" font-size="8" font-weight="700" letter-spacing=".6" fill="#A08000" text-anchor="middle">TUE</text>
<text x="52" y="1077" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFD84D" text-anchor="middle">03</text>
<text x="86" y="1057" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Pull Day</text>
<rect x="146" y="1045" width="30" height="16" rx="8" fill="#FFD60A" fill-opacity=".18"/>
<text x="161" y="1056.5" font-size="7.5" font-weight="700" letter-spacing=".5" fill="#FFD84D" text-anchor="middle">PR</text>
<text x="86" y="1075" font-size="10.5" font-weight="500" fill="#86868B">18 sets · 51:05 · Deadlift 180 kg</text>
<text x="345" y="1057" font-size="13" font-weight="700" letter-spacing="-.25" fill="#FFD84D" text-anchor="end">6,940 kg</text>
<text x="345" y="1075" font-size="10" font-weight="500" fill="#6C6C70" text-anchor="end">388 kcal</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1062)"/>

<!-- Mon Jun 2 · PR -->
<g filter="url(#ft)"><rect x="16" y="1104" width="361" height="64" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="1104.5" width="360" height="63" rx="19.5" fill="none" stroke="#FFD60A" stroke-opacity=".20" stroke-width="1"/>
<rect x="30" y="1114" width="44" height="44" rx="14" fill="#FFD60A" fill-opacity=".12"/>
<text x="52" y="1132" font-size="8" font-weight="700" letter-spacing=".6" fill="#A08000" text-anchor="middle">MON</text>
<text x="52" y="1151" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFD84D" text-anchor="middle">02</text>
<text x="86" y="1131" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Push Day</text>
<rect x="152" y="1119" width="30" height="16" rx="8" fill="#FFD60A" fill-opacity=".18"/>
<text x="167" y="1130.5" font-size="7.5" font-weight="700" letter-spacing=".5" fill="#FFD84D" text-anchor="middle">PR</text>
<text x="86" y="1149" font-size="10.5" font-weight="500" fill="#86868B">17 sets · 43:20 · Bench 102.5 kg</text>
<text x="345" y="1131" font-size="13" font-weight="700" letter-spacing="-.25" fill="#FFD84D" text-anchor="end">3,300 kg</text>
<text x="345" y="1149" font-size="10" font-weight="500" fill="#6C6C70" text-anchor="end">296 kcal</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1136)"/>

<!-- ══ JUNE SO FAR ══ -->
<text x="24" y="1198" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">JUNE SO FAR</text>
<g filter="url(#fc)"><rect x="16" y="1210" width="361" height="152" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="1210.5" width="360" height="151" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="1240" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Month to Date</text>
<rect x="281" y="1226" width="76" height="21" rx="10.5" fill="#FFF" fill-opacity=".07"/>
<text x="319" y="1240" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#98989F" text-anchor="middle">6 OF 9 DAYS</text>
<line x1="36" y1="1256" x2="357" y2="1256" stroke="#FFF" stroke-opacity=".07"/>
<g stroke="#FFF" stroke-opacity=".07"><line x1="106.25" y1="1272" x2="106.25" y2="1318"/><line x1="196.5" y1="1272" x2="196.5" y2="1318"/><line x1="286.75" y1="1272" x2="286.75" y2="1318"/></g>
<g text-anchor="middle" font-size="16" font-weight="700" letter-spacing="-.45" fill="#FFF"><text x="61.1" y="1296">6</text><text x="151.4" y="1296">37,640</text><text x="241.6" y="1296">4:39:02</text><text x="331.9" y="1296">2,028</text></g>
<g text-anchor="middle" font-size="7.5" font-weight="700" letter-spacing=".7" fill="#86868B"><text x="61.1" y="1316">SESSIONS</text><text x="151.4" y="1316">VOLUME KG</text><text x="241.6" y="1316">TIME UNDER BAR</text><text x="331.9" y="1316">KCAL EST</text></g>
<text x="196.5" y="1342" font-size="10.5" font-weight="500" fill="#6C6C70" text-anchor="middle">104 sets total · 67% of days trained</text>

<rect x="140.5" y="1382" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1399" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## SCREEN 2 · SESSION DETAIL — 393 × 1848

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1848" viewBox="0 0 393 1848" role="img" aria-labelledby="H2" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="H2">Kinetic — Session detail, June 9 Push Day</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1848"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="196" cy="190" r="230"><stop offset="0" stop-color="#FF6A3D" stop-opacity=".18"/><stop offset=".55" stop-color="#FF2D55" stop-opacity=".07"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <radialGradient id="A2" gradientUnits="userSpaceOnUse" cx="370" cy="900" r="300"><stop offset="0" stop-color="#0A84FF" stop-opacity=".10"/><stop offset="1" stop-color="#0A84FF" stop-opacity="0"/></radialGradient>
  <radialGradient id="A3" gradientUnits="userSpaceOnUse" cx="30" cy="1550" r="280"><stop offset="0" stop-color="#BF5AF2" stop-opacity=".10"/><stop offset="1" stop-color="#BF5AF2" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="tl" x1="0" y1="0" x2=".5" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".075"/><stop offset="1" stop-color="#FFF" stop-opacity=".028"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gd" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FFF0BE"/><stop offset="1" stop-color="#D9A441"/></linearGradient>
  <linearGradient id="hr" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0A84FF"/><stop offset=".5" stop-color="#FF9F0A"/><stop offset="1" stop-color="#FF3B30"/></linearGradient>
  <linearGradient id="hra" gradientUnits="userSpaceOnUse" x1="0" y1="700" x2="0" y2="790"><stop offset="0" stop-color="#FF3B30" stop-opacity=".30"/><stop offset="1" stop-color="#FF3B30" stop-opacity="0"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="fg" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#FFD84D" flood-opacity=".45"/></filter>
  <filter id="fh" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#FF3B30" flood-opacity=".55"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <g id="ic-db"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
  <g id="ic-bolt"><path d="M1.8 -10 L-6.4 1.6 L-0.9 1.6 L-1.8 10 L6.4 -1.6 L0.9 -1.6 Z"/></g>
  <path id="st" d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"/>
  <path id="fl" d="M0 -8.2 C2.9 -4.6 5.9 -1.7 5.9 1.9 C5.9 5.4 3.3 7.9 0 7.9 C-3.3 7.9 -5.9 5.4 -5.9 1.9 C-5.9 -.2 -4.6 -1.9 -3.3 -3.4 C-3.2 -1.7 -2.4 -.9 -1.3 -.7 C-1.7 -3.5 -1.1 -5.9 0 -8.2 Z"/>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#8E8E93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="up" d="M-4 2 L0 -2.6 L4 2" fill="none" stroke="#30D158" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="dw" d="M-4 -2 L0 2.6 L4 -2" fill="none" stroke="#8E8E93" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="ic-share" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M-6.4 -1.4 H-7.6 A1.8 1.8 0 0 0 -9.4 .4 V7 A1.8 1.8 0 0 0 -7.6 8.8 H7.6 A1.8 1.8 0 0 0 9.4 7 V.4 A1.8 1.8 0 0 0 7.6 -1.4 H6.4"/><path d="M0 -9.6 V3.4"/><path d="M-4.2 -5.4 L0 -9.6 L4.2 -5.4"/></g>
  <g id="ic-pen" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M-8 8 L-8.6 4.2 L4.4 -8.8 A2.6 2.6 0 0 1 8.1 -5.1 L-4.9 7.9 Z"/><path d="M2.6 -7 L6.3 -3.3"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1848" fill="url(#bg)"/><rect width="393" height="1848" fill="url(#A1)"/><rect width="393" height="1848" fill="url(#A2)"/><rect width="393" height="1848" fill="url(#A3)"/>

<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:44</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<circle cx="245.5" cy="29.5" r="6.2" fill="#0A0C10"/><circle cx="245.5" cy="29.5" r="3.1" fill="#121A24"/><circle cx="244.2" cy="28.2" r="1.05" fill="#3E6E9E" opacity=".75"/>

<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Session Detail</text>
<g fill="#8E8E93"><circle cx="359" cy="76" r="2"/><circle cx="366" cy="76" r="2"/><circle cx="373" cy="76" r="2"/></g>

<!-- HERO (archival tone, no celebration seal) -->
<text x="196.5" y="140" font-size="9.5" font-weight="700" letter-spacing="1.6" fill="#86868B" text-anchor="middle">MONDAY, JUNE 9</text>
<text x="196.5" y="200" font-size="56" font-weight="700" letter-spacing="-2.3" fill="#FFF" text-anchor="middle">45:12</text>
<text x="196.5" y="224" font-size="12" font-weight="500" fill="#98989F" text-anchor="middle">33:40 active  ·  11:32 rest</text>
<text x="196.5" y="246" font-size="10.5" font-weight="500" fill="#6C6C70" text-anchor="middle">9:41 – 10:26 AM  ·  Push Day · Strength</text>

<!-- STAT TILES -->
<g filter="url(#ft)"><rect x="16" y="274" width="82" height="104" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="274.5" width="81" height="103" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="28" y="286" width="20" height="20" rx="6.5" fill="#FF2D55" fill-opacity=".16"/>
<use xlink:href="#ic-bolt" href="#ic-bolt" transform="translate(38,296) scale(.56)" fill="#FF6A88"/>
<text x="28" y="342" font-size="17" font-weight="700" letter-spacing="-.55" fill="#FFF">8,420</text>
<text x="28" y="358" font-size="8" font-weight="700" letter-spacing=".8" fill="#86868B">VOLUME KG</text>

<g filter="url(#ft)"><rect x="109" y="274" width="82" height="104" rx="24" fill="url(#cd)"/></g>
<rect x="109.5" y="274.5" width="81" height="103" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="121" y="286" width="20" height="20" rx="6.5" fill="#A6FF00" fill-opacity=".14"/>
<rect x="126" y="290" width="10" height="12" rx="2.4" fill="none" stroke="#C3F53C" stroke-width="1.8"/><path d="M128.6 294.4 H133.4" stroke="#C3F53C" stroke-width="1.8" stroke-linecap="round"/>
<text x="121" y="342" font-size="17" font-weight="700" letter-spacing="-.55" fill="#FFF">19</text>
<text x="121" y="358" font-size="8" font-weight="700" letter-spacing=".8" fill="#86868B">SETS</text>

<g filter="url(#ft)"><rect x="202" y="274" width="82" height="104" rx="24" fill="url(#cd)"/></g>
<rect x="202.5" y="274.5" width="81" height="103" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="214" y="286" width="20" height="20" rx="6.5" fill="#FF9F0A" fill-opacity=".15"/>
<text x="224" y="301" font-size="11" font-weight="700" fill="#FFB84D" text-anchor="middle">191</text>
<text x="214" y="342" font-size="17" font-weight="700" letter-spacing="-.55" fill="#FFF">191</text>
<text x="214" y="358" font-size="8" font-weight="700" letter-spacing=".8" fill="#86868B">REPS</text>

<g filter="url(#ft)"><rect x="295" y="274" width="82" height="104" rx="24" fill="url(#cd)"/></g>
<rect x="295.5" y="274.5" width="81" height="103" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="307" y="286" width="20" height="20" rx="6.5" fill="#00D9E9" fill-opacity=".15"/>
<path d="M311 296 h2.4 l1.6 -4 l2.4 8 l1.8 -4 h2.4" fill="none" stroke="#5EDCF0" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
<text x="307" y="342" font-size="17" font-weight="700" letter-spacing="-.55" fill="#FFF">128</text>
<text x="307" y="358" font-size="8" font-weight="700" letter-spacing=".8" fill="#86868B">AVG BPM</text>

<!-- SECONDARY STRIP -->
<g filter="url(#fc)"><rect x="16" y="390" width="361" height="68" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="390.5" width="360" height="67" rx="23.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".08"><line x1="106.25" y1="404" x2="106.25" y2="444"/><line x1="196.5" y1="404" x2="196.5" y2="444"/><line x1="286.75" y1="404" x2="286.75" y2="444"/></g>
<g text-anchor="middle" font-size="15" font-weight="700" letter-spacing="-.4" fill="#FFF"><text x="61.1" y="426">380</text><text x="151.4" y="426">164</text><text x="241.6" y="426">7.5</text><text x="331.9" y="426">11:32</text></g>
<g text-anchor="middle" font-size="7.5" font-weight="700" letter-spacing=".7" fill="#86868B"><text x="61.1" y="446">KCAL EST</text><text x="151.4" y="446">MAX BPM</text><text x="241.6" y="446">AVG RPE</text><text x="331.9" y="446">TOTAL REST</text></g>

<!-- PRs -->
<g filter="url(#fc)"><rect x="16" y="470" width="361" height="152" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="470.5" width="360" height="151" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="500" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Personal Records</text>
<rect x="303" y="486" width="54" height="21" rx="10.5" fill="#FFD60A" fill-opacity=".16"/>
<text x="330" y="500" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#FFD84D" text-anchor="middle">2 NEW</text>
<g filter="url(#fg)"><circle cx="56" cy="538" r="20" fill="url(#gd)"/><circle cx="56" cy="594" r="20" fill="url(#gd)"/></g>
<use xlink:href="#st" href="#st" transform="translate(56,538) scale(.82)" fill="#5C4300"/>
<use xlink:href="#st" href="#st" transform="translate(56,594) scale(.82)" fill="#5C4300"/>
<text x="88" y="534" font-size="13" font-weight="600" letter-spacing="-.2" fill="#FFF">Volume PR</text>
<text x="88" y="551" font-size="10.5" font-weight="500" fill="#86868B">8,420 kg · +770 kg vs Jun 2</text>
<text x="88" y="590" font-size="13" font-weight="600" letter-spacing="-.2" fill="#FFF">Shoulder Press PR</text>
<text x="88" y="607" font-size="10.5" font-weight="500" fill="#86868B">60 kg × 10 · prev best 57.5 kg</text>

<!-- ══ HEART RATE CURVE (new) ══ -->
<g filter="url(#fc)"><rect x="16" y="634" width="361" height="192" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="634.5" width="360" height="191" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="664" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Heart Rate</text>
<text x="36" y="682" font-size="11" font-weight="500" fill="#86868B">Avg 128 · Max 164 · 22 min in Z3+</text>
<g><rect x="52" y="767.5" width="301" height="13.5" fill="#8E8E93" fill-opacity=".06"/><rect x="52" y="754" width="301" height="13.5" fill="#30D158" fill-opacity=".07"/><rect x="52" y="740.5" width="301" height="13.5" fill="#FFD60A" fill-opacity=".07"/><rect x="52" y="727" width="301" height="13.5" fill="#FF9F0A" fill-opacity=".08"/><rect x="52" y="713.5" width="301" height="13.5" fill="#FF3B30" fill-opacity=".09"/><rect x="52" y="700" width="301" height="13.5" fill="#FF3B30" fill-opacity=".13"/></g>
<g font-size="7.5" font-weight="700" letter-spacing=".4" text-anchor="middle"><text x="44" y="763.5" fill="#98989F">Z1</text><text x="44" y="750" fill="#4ADE80">Z2</text><text x="44" y="736.5" fill="#FFE14D">Z3</text><text x="44" y="723" fill="#FFB84D">Z4</text><text x="44" y="709.5" fill="#FF6B60">Z5</text></g>
<path d="M52 770.5 L64.55 764.5 Q77.1 758.5 89.65 751.75 Q102.2 745 114.75 739 Q127.3 733 139.8 736 Q152.3 739 164.85 733.4 Q177.4 727.8 189.95 731.55 Q202.5 735.3 215.05 728.9 Q227.6 722.5 240.15 725.9 Q252.7 729.3 265.25 720.65 Q277.8 712 290.3 718.75 Q302.8 725.5 315.35 733.75 Q327.9 742 340.45 751 L353 760 L353 790 L52 790 Z" fill="url(#hra)"/>
<path d="M52 770.5 L64.55 764.5 Q77.1 758.5 89.65 751.75 Q102.2 745 114.75 739 Q127.3 733 139.8 736 Q152.3 739 164.85 733.4 Q177.4 727.8 189.95 731.55 Q202.5 735.3 215.05 728.9 Q227.6 722.5 240.15 725.9 Q252.7 729.3 265.25 720.65 Q277.8 712 290.3 718.75 Q302.8 725.5 315.35 733.75 Q327.9 742 340.45 751 L353 760" fill="none" stroke="url(#hr)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
<g filter="url(#fh)"><circle cx="277.8" cy="712" r="5" fill="#FF3B30" stroke="#131316" stroke-width="2.2"/></g>
<text x="277.8" y="703" font-size="9" font-weight="700" letter-spacing="-.1" fill="#FF6B60" text-anchor="middle">164</text>
<circle cx="52" cy="770.5" r="3.6" fill="#0A84FF" stroke="#131316" stroke-width="2"/>
<circle cx="353" cy="760" r="3.6" fill="#FF9F0A" stroke="#131316" stroke-width="2"/>
<g font-size="9" font-weight="600" letter-spacing=".2" fill="#6C6C70"><text x="52" y="808">0:00</text><text x="202.5" y="808" text-anchor="middle">22:36</text><text x="353" y="808" text-anchor="end">45:12</text></g>

<!-- ══ EXERCISE BREAKDOWN (new) ══ -->
<g filter="url(#fc)"><rect x="16" y="838" width="361" height="424" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="838.5" width="360" height="423" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="868" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Exercise Breakdown</text>
<rect x="299" y="854" width="58" height="21" rx="10.5" fill="#FFF" fill-opacity=".07"/>
<text x="328" y="868" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#98989F" text-anchor="middle">19 SETS</text>
<g font-size="8" font-weight="700" letter-spacing=".8" fill="#6C6C70"><text x="36" y="890">EXERCISE</text><text x="357" y="890" text-anchor="end">VOLUME</text></g>
<line x1="36" y1="898" x2="357" y2="898" stroke="#FFF" stroke-opacity=".08"/>
<g stroke="#FFF" stroke-opacity=".05"><line x1="36" y1="956" x2="357" y2="956"/><line x1="36" y1="1014" x2="357" y2="1014"/><line x1="36" y1="1072" x2="357" y2="1072"/><line x1="36" y1="1130" x2="357" y2="1130"/><line x1="36" y1="1188" x2="357" y2="1188"/></g>
<g font-size="10" font-weight="700" fill="#6C6C70"><text x="36" y="920">1</text><text x="36" y="978">2</text><text x="36" y="1036">3</text><text x="36" y="1094">4</text><text x="36" y="1152">5</text><text x="36" y="1210">6</text></g>
<g font-size="13" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="54" y="920">Barbell Bench Press</text><text x="54" y="978">Incline DB Press</text><text x="54" y="1036">Seated Shoulder Press</text><text x="54" y="1094">Cable Crossover</text><text x="54" y="1152">Triceps Rope Pushdown</text><text x="54" y="1210">Pec Deck Fly</text></g>
<g font-size="13" font-weight="700" letter-spacing="-.25" fill="#FFF" text-anchor="end"><text x="357" y="920">2,000 kg</text><text x="357" y="978">1,632 kg</text><text x="357" y="1036" fill="#FFD84D">1,800 kg</text><text x="357" y="1094">900 kg</text><text x="357" y="1152">900 kg</text><text x="357" y="1210">1,188 kg</text></g>
<rect x="205" y="1024" width="28" height="15" rx="7.5" fill="#FFD60A" fill-opacity=".18" stroke="#FFD60A" stroke-opacity=".28" stroke-width=".7"/>
<text x="219" y="1035" font-size="7.5" font-weight="700" letter-spacing=".5" fill="#FFD84D" text-anchor="middle">PR</text>
<!-- set chips -->
<g fill="#FFF" fill-opacity=".07"><rect x="54" y="928" width="46" height="18" rx="9"/><rect x="105" y="928" width="46" height="18" rx="9"/><rect x="156" y="928" width="46" height="18" rx="9"/><rect x="207" y="928" width="46" height="18" rx="9"/>
<rect x="54" y="986" width="46" height="18" rx="9"/><rect x="105" y="986" width="46" height="18" rx="9"/><rect x="156" y="986" width="46" height="18" rx="9"/>
<rect x="105" y="1044" width="46" height="18" rx="9"/><rect x="156" y="1044" width="46" height="18" rx="9"/>
<rect x="54" y="1102" width="46" height="18" rx="9"/><rect x="105" y="1102" width="46" height="18" rx="9"/><rect x="156" y="1102" width="46" height="18" rx="9"/>
<rect x="54" y="1160" width="46" height="18" rx="9"/><rect x="105" y="1160" width="46" height="18" rx="9"/><rect x="156" y="1160" width="46" height="18" rx="9"/>
<rect x="54" y="1218" width="46" height="18" rx="9"/><rect x="105" y="1218" width="46" height="18" rx="9"/><rect x="156" y="1218" width="46" height="18" rx="9"/></g>
<rect x="54" y="1044" width="46" height="18" rx="9" fill="#FFD60A" fill-opacity=".18" stroke="#FFD60A" stroke-opacity=".30" stroke-width=".8"/>
<g font-size="9" font-weight="600" letter-spacing="-.1" fill="#C7C7CC" text-anchor="middle">
<text x="77" y="940.5">100×5</text><text x="128" y="940.5">100×5</text><text x="179" y="940.5">100×5</text><text x="230" y="940.5">100×5</text>
<text x="77" y="998.5">34×8</text><text x="128" y="998.5">34×8</text><text x="179" y="998.5">34×8</text>
<text x="128" y="1056.5">60×10</text><text x="179" y="1056.5">60×10</text>
<text x="77" y="1114.5">25×12</text><text x="128" y="1114.5">25×12</text><text x="179" y="1114.5">25×12</text>
<text x="77" y="1172.5">20×15</text><text x="128" y="1172.5">20×15</text><text x="179" y="1172.5">20×15</text>
<text x="77" y="1230.5">33×12</text><text x="128" y="1230.5">33×12</text><text x="179" y="1230.5">33×12</text></g>
<text x="77" y="1056.5" font-size="9" font-weight="700" letter-spacing="-.1" fill="#FFD84D" text-anchor="middle">60×10</text>

<!-- VS PREVIOUS -->
<g filter="url(#fc)"><rect x="16" y="1274" width="361" height="196" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="1274.5" width="360" height="195" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="1304" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">vs. Previous Push Day</text>
<text x="36" y="1322" font-size="11" font-weight="500" fill="#86868B">June 2 · 7 days ago</text>
<g font-size="8.5" font-weight="700" letter-spacing=".8" fill="#6C6C70"><text x="36" y="1348">METRIC</text><text x="248" y="1348" text-anchor="end">JUN 2</text><text x="308" y="1348" text-anchor="end">TODAY</text><text x="357" y="1348" text-anchor="end">Δ</text></g>
<line x1="36" y1="1356" x2="357" y2="1356" stroke="#FFF" stroke-opacity=".08"/>
<g stroke="#FFF" stroke-opacity=".05"><line x1="36" y1="1386" x2="357" y2="1386"/><line x1="36" y1="1414" x2="357" y2="1414"/><line x1="36" y1="1442" x2="357" y2="1442"/></g>
<g font-size="12" font-weight="500" fill="#98989F"><text x="36" y="1378">Volume</text><text x="36" y="1406">Sets</text><text x="36" y="1434">Top set · Bench</text><text x="36" y="1462">Duration</text></g>
<g font-size="12" font-weight="500" fill="#6C6C70" text-anchor="end"><text x="248" y="1378">7,650 kg</text><text x="248" y="1406">17</text><text x="248" y="1434">102.5 kg</text><text x="248" y="1462">43:20</text></g>
<g font-size="12" font-weight="700" fill="#FFF" text-anchor="end"><text x="308" y="1378">8,420 kg</text><text x="308" y="1406">19</text><text x="308" y="1434">100 kg</text><text x="308" y="1462">45:12</text></g>
<g font-size="11" font-weight="700" text-anchor="end"><text x="357" y="1378" fill="#30D158">+10.1%</text><text x="357" y="1406" fill="#30D158">+2</text><text x="357" y="1434" fill="#8E8E93">−2.4%</text><text x="357" y="1462" fill="#30D158">+1:52</text></g>
<use xlink:href="#up" href="#up" transform="translate(317,1374)"/><use xlink:href="#up" href="#up" transform="translate(333,1402)"/><use xlink:href="#dw" href="#dw" transform="translate(317,1430)"/><use xlink:href="#up" href="#up" transform="translate(317,1458)"/>

<!-- NOTES -->
<g filter="url(#fc)"><rect x="16" y="1482" width="361" height="116" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="1482.5" width="360" height="115" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="1510" font-size="9" font-weight="700" letter-spacing="1.3" fill="#86868B">SESSION NOTES</text>
<text x="357" y="1510" font-size="11.5" font-weight="600" letter-spacing="-.1" fill="#FF9F0A" text-anchor="end">Edit</text>
<g font-size="12.5" font-weight="500"><text x="36" y="1536" fill="#E5E5EA">Bench felt controlled at 100 kg. Left shoulder</text><text x="36" y="1555" fill="#E5E5EA">tight on set 3 — add extra warm-up next time.</text><text x="36" y="1574" fill="#98989F">Drop incline press to 32 kg if it recurs.</text></g>

<!-- KUDOS -->
<g filter="url(#fc)"><rect x="16" y="1610" width="361" height="76" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="1610.5" width="360" height="75" rx="25.5" fill="none" stroke="url(#ce)"/>
<g stroke="#17171A" stroke-width="2.4"><circle cx="46" cy="1648" r="14" fill="#FF4FB8"/><circle cx="66" cy="1648" r="14" fill="#0A84FF"/><circle cx="86" cy="1648" r="14" fill="#30D158"/></g>
<g font-size="10.5" font-weight="600" fill="#FFF" text-anchor="middle"><text x="46" y="1652">M</text><text x="66" y="1652">J</text><text x="86" y="1652">S</text></g>
<circle cx="106" cy="1648" r="14" fill="#2A2A2E" stroke="#17171A" stroke-width="2.4"/>
<text x="106" y="1652" font-size="9" font-weight="700" fill="#98989F" text-anchor="middle">+3</text>
<text x="132" y="1644" font-size="12.5" font-weight="600" letter-spacing="-.2" fill="#FFF">Mia, Jon and 4 others</text>
<text x="132" y="1661" font-size="10.5" font-weight="500" fill="#86868B">gave you kudos for this session</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1648)"/>

<!-- ACTIONS -->
<rect x="16" y="1698" width="174" height="54" rx="27" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".12" stroke-width="1"/>
<use xlink:href="#ic-share" href="#ic-share" transform="translate(60,1725) scale(.88)" color="#C7C7CC"/>
<text x="79" y="1730" font-size="15" font-weight="600" letter-spacing="-.25" fill="#F5F5F7">Share</text>
<g filter="url(#fb)"><rect x="203" y="1698" width="174" height="54" rx="27" fill="url(#br)"/></g>
<rect x="203" y="1698" width="174" height="27" rx="27" fill="url(#gl)" opacity=".35"/>
<rect x="203.5" y="1698.5" width="173" height="53" rx="26.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<use xlink:href="#ic-pen" href="#ic-pen" transform="translate(247,1725) scale(.86)" color="#FFF"/>
<text x="266" y="1730" font-size="15" font-weight="650" letter-spacing="-.25" fill="#FFF">Edit Session</text>

<rect x="16" y="1764" width="361" height="48" rx="24" fill="#FF3B30" fill-opacity=".10" stroke="#FF3B30" stroke-opacity=".22" stroke-width="1"/>
<text x="196.5" y="1794" font-size="14.5" font-weight="600" letter-spacing="-.25" fill="#FF6B60" text-anchor="middle">Delete Session</text>

<rect x="140.5" y="1828" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1847" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## SCREEN 3 · EDIT SESSION — 393 × 1548

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1548" viewBox="0 0 393 1548" role="img" aria-labelledby="H3" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="H3">Kinetic — Edit session</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1548"/></clipPath><clipPath id="sc"><rect width="393" height="1412"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="330" cy="180" r="280"><stop offset="0" stop-color="#FF9F0A" stop-opacity=".12"/><stop offset="1" stop-color="#FF9F0A" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15151A" stop-opacity=".94"/><stop offset="1" stop-color="#0C0C10" stop-opacity=".99"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <g id="grip" fill="#6C6C70"><rect y="0" width="12" height="2" rx="1"/><rect y="6" width="12" height="2" rx="1"/><rect y="12" width="12" height="2" rx="1"/></g>
  <path id="st" d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1548" fill="url(#bg)"/><rect width="393" height="1548" fill="url(#A1)"/>

<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:46</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>

<text x="24" y="82" font-size="16" font-weight="400" letter-spacing="-.3" fill="#8E8E93">Cancel</text>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Edit Session</text>
<g fill="#8E8E93"><circle cx="359" cy="76" r="2"/><circle cx="366" cy="76" r="2"/><circle cx="373" cy="76" r="2"/></g>

<g clip-path="url(#sc)">
<!-- LIVE TOTALS -->
<g filter="url(#fc)"><rect x="16" y="110" width="361" height="68" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="110.5" width="360" height="67" rx="23.5" fill="none" stroke="#30D158" stroke-opacity=".26" stroke-width="1"/>
<g stroke="#FFF" stroke-opacity=".08"><line x1="106.25" y1="124" x2="106.25" y2="164"/><line x1="196.5" y1="124" x2="196.5" y2="164"/><line x1="286.75" y1="124" x2="286.75" y2="164"/></g>
<g text-anchor="middle" font-size="15" font-weight="700" letter-spacing="-.4" fill="#FFF"><text x="61.1" y="146">8,420</text><text x="151.4" y="146">19</text><text x="241.6" y="146">191</text><text x="331.9" y="146">45:12</text></g>
<g text-anchor="middle" font-size="7.5" font-weight="700" letter-spacing=".7" fill="#86868B"><text x="61.1" y="166">VOLUME KG</text><text x="151.4" y="166">SETS</text><text x="241.6" y="166">REPS</text><text x="331.9" y="166">DURATION</text></g>
<circle cx="352" cy="122" r="3.4" fill="#30D158"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>

<!-- WHEN -->
<g filter="url(#fc)"><rect x="16" y="190" width="361" height="132" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="190.5" width="360" height="131" rx="27.5" fill="none" stroke="url(#ce)"/>
<g font-size="13" font-weight="500" fill="#98989F"><text x="36" y="221">Start</text><text x="36" y="265">End</text><text x="36" y="309">Duration</text></g>
<g font-size="13" font-weight="600" letter-spacing="-.2" fill="#FFF" text-anchor="end"><text x="341" y="221">Mon, Jun 9 · 9:41 AM</text><text x="341" y="265">Mon, Jun 9 · 10:26 AM</text><text x="341" y="309">45:12</text></g>
<g stroke="#FFF" stroke-opacity=".06"><line x1="36" y1="238" x2="357" y2="238"/><line x1="36" y1="282" x2="357" y2="282"/></g>
<g fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M357 217 L361 221 L357 225"/><path d="M357 261 L361 265 L357 269"/></g>
<rect x="300" y="297" width="34" height="16" rx="8" fill="#FFF" fill-opacity=".07"/>
<text x="317" y="308.5" font-size="7.5" font-weight="700" letter-spacing=".5" fill="#8E8E93" text-anchor="middle">AUTO</text>

<!-- EFFORT SLIDER (new component) -->
<g filter="url(#fc)"><rect x="16" y="334" width="361" height="112" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="334.5" width="360" height="111" rx="27.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="364" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Effort</text>
<text x="357" y="364" font-size="15" font-weight="700" letter-spacing="-.35" fill="#FF9F0A" text-anchor="end">7.5</text>
<text x="36" y="382" font-size="11" font-weight="500" fill="#86868B">RPE · roughly 2–3 reps in reserve</text>
<rect x="36" y="404" width="321" height="6" rx="3" fill="#FFF" fill-opacity=".09"/>
<rect x="36" y="404" width="160.5" height="6" rx="3" fill="url(#br)"/>
<g stroke="#FFF" stroke-opacity=".14" stroke-width="1.4"><line x1="36" y1="414" x2="36" y2="419"/><line x1="100.2" y1="414" x2="100.2" y2="419"/><line x1="164.4" y1="414" x2="164.4" y2="419"/><line x1="228.6" y1="414" x2="228.6" y2="419"/><line x1="292.8" y1="414" x2="292.8" y2="419"/><line x1="357" y1="414" x2="357" y2="419"/></g>
<g filter="url(#ft2)"><circle cx="196.5" cy="407" r="13" fill="#FFF"/></g>
<circle cx="196.5" cy="407" r="13" fill="none" stroke="#000" stroke-opacity=".08" stroke-width=".8"/>
<circle cx="196.5" cy="407" r="4.5" fill="url(#br)"/>
<g font-size="9" font-weight="600" fill="#6C6C70" text-anchor="middle"><text x="36" y="434">5</text><text x="100.2" y="434">6</text><text x="164.4" y="434">7</text><text x="228.6" y="434">8</text><text x="292.8" y="434">9</text><text x="357" y="434">10</text></g>

<!-- EXERCISES -->
<text x="24" y="476" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">EXERCISES</text>
<text x="369" y="476" font-size="10" font-weight="600" letter-spacing=".2" fill="#6C6C70" text-anchor="end">6 · drag to reorder</text>

<!-- row 1 -->
<g filter="url(#ft)"><rect x="16" y="488" width="361" height="74" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="488.5" width="360" height="73" rx="21.5" fill="none" stroke="url(#ce)"/>
<use xlink:href="#grip" href="#grip" transform="translate(30,505)"/>
<text x="54" y="512" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">Barbell Bench Press</text>
<text x="357" y="512" font-size="12.5" font-weight="700" letter-spacing="-.25" fill="#FFF" text-anchor="end">2,000 kg</text>
<g fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"><rect x="54" y="522" width="58" height="26" rx="13"/><rect x="117" y="522" width="58" height="26" rx="13"/><rect x="180" y="522" width="58" height="26" rx="13"/><rect x="243" y="522" width="58" height="26" rx="13"/></g>
<g font-size="10" font-weight="600" letter-spacing="-.1" fill="#C7C7CC" text-anchor="middle"><text x="83" y="538.5">100 × 5</text><text x="146" y="538.5">100 × 5</text><text x="209" y="538.5">100 × 5</text><text x="272" y="538.5">100 × 5</text></g>
<rect x="307" y="522" width="50" height="26" rx="13" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".14" stroke-width="1" stroke-dasharray="4 3"/>
<g stroke="#8E8E93" stroke-width="1.9" stroke-linecap="round"><line x1="326" y1="535" x2="338" y2="535"/><line x1="332" y1="529" x2="332" y2="541"/></g>

<!-- row 2 -->
<g filter="url(#ft)"><rect x="16" y="572" width="361" height="74" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="572.5" width="360" height="73" rx="21.5" fill="none" stroke="url(#ce)"/>
<use xlink:href="#grip" href="#grip" transform="translate(30,589)"/>
<text x="54" y="596" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">Incline DB Press</text>
<text x="357" y="596" font-size="12.5" font-weight="700" letter-spacing="-.25" fill="#FFF" text-anchor="end">1,632 kg</text>
<g fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"><rect x="54" y="606" width="58" height="26" rx="13"/><rect x="117" y="606" width="58" height="26" rx="13"/><rect x="180" y="606" width="58" height="26" rx="13"/></g>
<g font-size="10" font-weight="600" letter-spacing="-.1" fill="#C7C7CC" text-anchor="middle"><text x="83" y="622.5">34 × 8</text><text x="146" y="622.5">34 × 8</text><text x="209" y="622.5">34 × 8</text></g>
<rect x="244" y="606" width="50" height="26" rx="13" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".14" stroke-width="1" stroke-dasharray="4 3"/>
<g stroke="#8E8E93" stroke-width="1.9" stroke-linecap="round"><line x1="263" y1="619" x2="275" y2="619"/><line x1="269" y1="613" x2="269" y2="625"/></g>

<!-- row 3 · EXPANDED set editor -->
<g filter="url(#ft)"><rect x="16" y="656" width="361" height="242" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="656.5" width="360" height="241" rx="21.5" fill="none" stroke="#FF6A3D" stroke-opacity=".42" stroke-width="1.2"/>
<use xlink:href="#grip" href="#grip" transform="translate(30,673)"/>
<text x="54" y="682" font-size="13.5" font-weight="650" letter-spacing="-.2" fill="#FFF">Seated Shoulder Press</text>
<rect x="209" y="670" width="28" height="15" rx="7.5" fill="#FFD60A" fill-opacity=".18" stroke="#FFD60A" stroke-opacity=".28" stroke-width=".7"/>
<text x="223" y="681" font-size="7.5" font-weight="700" letter-spacing=".5" fill="#FFD84D" text-anchor="middle">PR</text>
<text x="357" y="682" font-size="12.5" font-weight="700" letter-spacing="-.25" fill="#FFD84D" text-anchor="end">1,800 kg</text>
<rect x="54" y="692" width="58" height="26" rx="13" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<text x="83" y="708.5" font-size="10" font-weight="600" letter-spacing="-.1" fill="#C7C7CC" text-anchor="middle">60 × 10</text>
<g filter="url(#fs)"><rect x="117" y="692" width="58" height="26" rx="13" fill="#FFF" fill-opacity=".14"/></g>
<rect x="117.5" y="692.5" width="57" height="25" rx="12.5" fill="none" stroke="url(#br)" stroke-width="1.6"/>
<text x="146" y="708.5" font-size="10" font-weight="700" letter-spacing="-.1" fill="#FFF" text-anchor="middle">60 × 10</text>
<rect x="180" y="692" width="58" height="26" rx="13" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<text x="209" y="708.5" font-size="10" font-weight="600" letter-spacing="-.1" fill="#C7C7CC" text-anchor="middle">60 × 10</text>
<rect x="244" y="692" width="50" height="26" rx="13" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".14" stroke-width="1" stroke-dasharray="4 3"/>
<g stroke="#8E8E93" stroke-width="1.9" stroke-linecap="round"><line x1="263" y1="705" x2="275" y2="705"/><line x1="269" y1="699" x2="269" y2="711"/></g>
<!-- inline editor panel -->
<rect x="30" y="728" width="333" height="152" rx="18" fill="#FFF" fill-opacity=".045" stroke="#FFF" stroke-opacity=".08" stroke-width=".9"/>
<text x="46" y="752" font-size="8.5" font-weight="700" letter-spacing=".9" fill="#86868B">EDITING SET 2 OF 3</text>
<text x="347" y="752" font-size="10.5" font-weight="600" letter-spacing="-.1" fill="#FF6B60" text-anchor="end">Delete set</text>
<text x="46" y="787" font-size="12" font-weight="500" fill="#98989F">Weight</text>
<circle cx="247" cy="782" r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<g stroke="#C7C7CC" stroke-width="2" stroke-linecap="round"><line x1="241" y1="782" x2="253" y2="782"/></g>
<text x="296" y="787" font-size="15" font-weight="700" letter-spacing="-.35" fill="#FFF" text-anchor="middle">60 kg</text>
<circle cx="345" cy="782" r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<g stroke="#FFF" stroke-width="2" stroke-linecap="round"><line x1="339" y1="782" x2="351" y2="782"/><line x1="345" y1="776" x2="345" y2="788"/></g>
<line x1="46" y1="804" x2="347" y2="804" stroke="#FFF" stroke-opacity=".06"/>
<text x="46" y="831" font-size="12" font-weight="500" fill="#98989F">Reps</text>
<circle cx="247" cy="826" r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<g stroke="#C7C7CC" stroke-width="2" stroke-linecap="round"><line x1="241" y1="826" x2="253" y2="826"/></g>
<text x="296" y="831" font-size="15" font-weight="700" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10</text>
<circle cx="345" cy="826" r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<g stroke="#FFF" stroke-width="2" stroke-linecap="round"><line x1="339" y1="826" x2="351" y2="826"/><line x1="345" y1="820" x2="345" y2="832"/></g>
<line x1="46" y1="848" x2="347" y2="848" stroke="#FFF" stroke-opacity=".06"/>
<text x="46" y="871" font-size="12" font-weight="500" fill="#98989F">Mark as personal record</text>
<rect x="309" y="853" width="44" height="26" rx="13" fill="#30D158"/>
<g filter="url(#fs)"><circle cx="340" cy="866" r="11" fill="#FFF"/></g>

<!-- row 4 -->
<g filter="url(#ft)"><rect x="16" y="908" width="361" height="74" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="908.5" width="360" height="73" rx="21.5" fill="none" stroke="url(#ce)"/>
<use xlink:href="#grip" href="#grip" transform="translate(30,925)"/>
<text x="54" y="932" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">Cable Crossover</text>
<text x="357" y="932" font-size="12.5" font-weight="700" letter-spacing="-.25" fill="#FFF" text-anchor="end">900 kg</text>
<g fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"><rect x="54" y="942" width="58" height="26" rx="13"/><rect x="117" y="942" width="58" height="26" rx="13"/><rect x="180" y="942" width="58" height="26" rx="13"/></g>
<g font-size="10" font-weight="600" letter-spacing="-.1" fill="#C7C7CC" text-anchor="middle"><text x="83" y="958.5">25 × 12</text><text x="146" y="958.5">25 × 12</text><text x="209" y="958.5">25 × 12</text></g>
<rect x="244" y="942" width="50" height="26" rx="13" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".14" stroke-width="1" stroke-dasharray="4 3"/>
<g stroke="#8E8E93" stroke-width="1.9" stroke-linecap="round"><line x1="263" y1="955" x2="275" y2="955"/><line x1="269" y1="949" x2="269" y2="961"/></g>

<!-- row 5 -->
<g filter="url(#ft)"><rect x="16" y="992" width="361" height="74" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="992.5" width="360" height="73" rx="21.5" fill="none" stroke="url(#ce)"/>
<use xlink:href="#grip" href="#grip" transform="translate(30,1009)"/>
<text x="54" y="1016" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">Triceps Rope Pushdown</text>
<text x="357" y="1016" font-size="12.5" font-weight="700" letter-spacing="-.25" fill="#FFF" text-anchor="end">900 kg</text>
<g fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"><rect x="54" y="1026" width="58" height="26" rx="13"/><rect x="117" y="1026" width="58" height="26" rx="13"/><rect x="180" y="1026" width="58" height="26" rx="13"/></g>
<g font-size="10" font-weight="600" letter-spacing="-.1" fill="#C7C7CC" text-anchor="middle"><text x="83" y="1042.5">20 × 15</text><text x="146" y="1042.5">20 × 15</text><text x="209" y="1042.5">20 × 15</text></g>
<rect x="244" y="1026" width="50" height="26" rx="13" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".14" stroke-width="1" stroke-dasharray="4 3"/>
<g stroke="#8E8E93" stroke-width="1.9" stroke-linecap="round"><line x1="263" y1="1039" x2="275" y2="1039"/><line x1="269" y1="1033" x2="269" y2="1045"/></g>

<!-- row 6 -->
<g filter="url(#ft)"><rect x="16" y="1076" width="361" height="74" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="1076.5" width="360" height="73" rx="21.5" fill="none" stroke="url(#ce)"/>
<use xlink:href="#grip" href="#grip" transform="translate(30,1093)"/>
<text x="54" y="1100" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">Pec Deck Fly</text>
<text x="357" y="1100" font-size="12.5" font-weight="700" letter-spacing="-.25" fill="#FFF" text-anchor="end">1,188 kg</text>
<g fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"><rect x="54" y="1110" width="58" height="26" rx="13"/><rect x="117" y="1110" width="58" height="26" rx="13"/><rect x="180" y="1110" width="58" height="26" rx="13"/></g>
<g font-size="10" font-weight="600" letter-spacing="-.1" fill="#C7C7CC" text-anchor="middle"><text x="83" y="1126.5">33 × 12</text><text x="146" y="1126.5">33 × 12</text><text x="209" y="1126.5">33 × 12</text></g>
<rect x="244" y="1110" width="50" height="26" rx="13" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".14" stroke-width="1" stroke-dasharray="4 3"/>
<g stroke="#8E8E93" stroke-width="1.9" stroke-linecap="round"><line x1="263" y1="1123" x2="275" y2="1123"/><line x1="269" y1="1117" x2="269" y2="1129"/></g>

<!-- add exercise -->
<rect x="16" y="1162" width="361" height="48" rx="24" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".14" stroke-width="1" stroke-dasharray="5 4"/>
<g stroke="#FF9F0A" stroke-width="2.1" stroke-linecap="round"><line x1="164" y1="1186" x2="180" y2="1186"/><line x1="172" y1="1178" x2="172" y2="1194"/></g>
<text x="192" y="1191" font-size="14.5" font-weight="650" letter-spacing="-.25" fill="#FFB84D">Add Exercise</text>

<!-- notes editor -->
<g filter="url(#fc)"><rect x="16" y="1222" width="361" height="118" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="1222.5" width="360" height="117" rx="27.5" fill="none" stroke="url(#br)" stroke-width="1.6" stroke-opacity=".55"/>
<text x="36" y="1250" font-size="9" font-weight="700" letter-spacing="1.3" fill="#86868B">NOTES</text>
<text x="357" y="1250" font-size="9" font-weight="500" letter-spacing=".2" fill="#6C6C70" text-anchor="end">130 / 500</text>
<g font-size="13" font-weight="500" fill="#E5E5EA"><text x="36" y="1276">Bench felt controlled at 100 kg. Left shoulder</text><text x="36" y="1295">tight on set 3 — add extra warm-up next time.</text><text x="36" y="1314">Drop incline press to 32 kg if it recurs.</text></g>
<rect x="278" y="1302" width="2" height="15" rx="1" fill="#FF6A3D"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.51;1" dur="1.1s" repeatCount="indefinite"/></rect>

<!-- destructive -->
<rect x="16" y="1352" width="361" height="48" rx="24" fill="#FF3B30" fill-opacity=".10" stroke="#FF3B30" stroke-opacity=".22" stroke-width="1"/>
<text x="196.5" y="1382" font-size="14.5" font-weight="600" letter-spacing="-.25" fill="#FF6B60" text-anchor="middle">Delete Session</text>
</g>

<!-- sticky save -->
<rect x="0" y="1412" width="393" height="136" fill="url(#tb)"/>
<line x1="0" y1="1412.5" x2="393" y2="1412.5" stroke="#FFF" stroke-opacity=".11"/>
<g filter="url(#fb)"><rect x="16" y="1426" width="361" height="54" rx="27" fill="url(#br)"/></g>
<rect x="16" y="1426" width="361" height="27" rx="27" fill="url(#gl)" opacity=".35"/>
<rect x="16.5" y="1426.5" width="360" height="53" rx="26.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="196.5" y="1459" font-size="16" font-weight="650" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Save Changes</text>
<text x="196.5" y="1502" font-size="10.5" font-weight="500" fill="#6C6C70" text-anchor="middle">Totals and PRs recalculate automatically</text>
<rect x="140.5" y="1524" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1547" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

*Deliberate choice: every value in Edit Session equals the logged contract exactly — **no pending delta**. A mock that shows invented edits would break Law III against the other eleven screens. The "Save Changes" caption carries the recalculation promise instead.*

---

## Verification log

| Claim | Computation | Result |
|---|---|---|
| Jun 9 2025 weekday | Jun 1 2025 = Sunday ⇒ Jun 9 | **Monday** ✓ |
| Calendar anchor | Jun 9 − 84 days | **Mar 17** (Monday) ✓ matches heatmap c0 |
| Trailing-7 May 27→Jun 2 | 7,420+6,180+8,940+0+3,260+0+3,300 | **29,100** ✓ |
| Trailing-7 Jun 3→Jun 9 | 6,940+9,540+0+5,180+4,260+0+8,420 | **34,340** ✓ |
| Home "+18%" | (34,340−29,100)/29,100 | **18.007 → +18.0%** ✓ |
| All 15 ledger days vs heatmap levels | bands L1<4k, L2 4–6.5k, L3 6.5–8.5k, L4>8.5k | **all match** ✓ |
| June volume | 3,300+6,940+9,540+5,180+4,260+8,420 | **37,640 kg** ✓ |
| June sets | 17+18+20+16+14+19 | **104** ✓ |
| June time | 43:20+51:05+58:30+38:45+42:10+45:12 | **279:02 → 4:39:02** ✓ |
| June kcal | 296+388+452+244+268+380 | **2,028** ✓ |
| June consistency | 6 trained / 9 elapsed | **66.7 → 67%** ✓ |
| kcal/min band across 11 sessions | 208/33.33 … 486/61.08 | **6.24 – 8.39** — no outlier ✓ |
| Session set-count cross-check | Jun 3 18, Jun 4 20, Jun 6 16, Jun 7 14, Jun 9 19 | matches Trends muscle-load ledger ✓ |
| HR sample mean | 1,673 / 13 | **128.7**; time-weighted **128** ✓ contract |
| HR max | max(samples) | **164** ✓ contract |
| Zone bounds on HRmax 180 | 90/108/126/144/162/180 | avg 128 ∈ Z3 ✓ · max 164 ∈ Z5 ✓ |
| Zone band height | (180−90)/5 over 67.5pt | **13.5 pt each**, 5 equal bands ✓ |
| Corrected zone Σ | 12+8+9+9+4 | **42:00** = Exercise ring 42/60 ✓ |
| Session-only zones | 3:40+8+9+9+4 | **33:40** = active time ✓ |
| Z3+ today | 9+9+4 | **22 min** ✓ |
| Exercise breakdown Σ | 2,000+1,632+1,800+900+900+1,188 | **8,420 kg** ✓ |
| Set-chip Σ | 4+3+3+3+3+3 | **19 sets** ✓ |
| Duration split | 33:40 + 11:32 | **45:12** ✓ |
| Δ volume | (8,420−7,650)/7,650 | **+10.07 → +10.1%** ✓ |
| Δ top set | (100−102.5)/102.5 | **−2.44 → −2.4%** ✓ |
| Δ duration | 45:12 − 43:20 | **+1:52** ✓ |
| e1RM bench | 102.5 × (1+5/30) | **119.58 → 119.6** ✓ |
| e1RM deadlift | 180 × 1.1 | **198.0** ✓ |
| e1RM squat | 145 × 1.16667 | **169.17 → 169.2** ✓ |
| Calendar arc dashes | r=19, C=119.381; L1/L2/L3 = .25/.50/.75 | **29.85 / 59.69 / 89.54** ✓ |
| Today outer arc | r=23, C=144.51 × 0.75 | **108.38** ✓ |
| RPE slider fill | (7.5−5)/5 × 321 | **160.5 pt** → thumb x=196.5 (exact centre) ✓ |
| Notes counter | 45+45+38 chars + 2 breaks | **130 / 500** ✓ |
| Streak | 12 (home, pre) + today | **13** ✓ |

---

## New components introduced

| Component | Screen | Note |
|---|---|---|
| **Month calendar with load rings** | 1 | Arc fraction = load level ÷ 4; a *full* ring means L4. Rest days keep the track ring (tracked, not trained). Out-of-month days keep their data but dim the numeral. |
| **Dual-ring selected day** | 1 | Brand fill = selection; outer green arc = that day's load. Two states, one glyph, no collision. |
| **Month-to-date aggregate card** | 1 | Four cells + a plain-language footer. |
| **HR curve with zone bands** | 2 | Five *equal* 13.5pt bands derived from HRmax 180 — the geometry is the scale, not decoration. |
| **Exercise breakdown with set chips** | 2 | Every set rendered as `weight × reps`; the PR set is gold-outlined. Volume column sums to 8,420. |
| **Archival hero** | 2 | Same duration typography as Summary, minus the celebration seal and minus the pink label — a record, not a trophy. |
| **RPE slider** | 3 | Ticked 5–10, value in the tint colour, thumb with a brand core. |
| **Inline set editor** | 3 | Panel nested *inside* the row (radius 18 inside radius 22 = concentric ✓), ± steppers, Delete set, PR toggle ON. |
| **Row-level focus state** | 3 | Brand stroke 1.2 at 42% + white-14 chip fill + brand chip border. |
| **Reorder grips + dashed add-set chips** | 3 | Distinguish "add" (dashed) from "logged" (solid). |
| **Live-totals strip with sync dot** | 3 | Green hairline border + pulsing dot = recalculating surface. |
| **Focused multiline note field** | 3 | Brand border at 55% + blinking caret + character counter. |
| **Destructive ghost button** | 2 & 3 | `#FF3B30` @ 10% fill / 22% stroke / `#FF6B60` label — never a solid red fill. |

---

## Light mode

Geometry identical. Delta for the new components only (everything else follows the published mapping):

| Element | Dark | Light |
|---|---|---|
| Calendar track ring | white 0.07 | `#787880` @ 0.18 |
| Calendar load arcs L1–L4 | `#30D158` @ .30/.50/.72/.95 | `#248A3D` @ .32/.52/.74/.96 |
| Out-of-month numeral | `#6C6C70` | `#AEAEB2` |
| Future numeral | `#3A3A3C` | `#D1D1D6` |
| Weekend weekday label | `#48484A` | `#C7C7CC` |
| HR zone bands | hues @ .06–.13 | hues @ **.10–.18** (needs more body on white) |
| HR curve stroke | `#0A84FF→#FF9F0A→#FF3B30` | `#007AFF→#E07800→#D70015` |
| Chart node halo | `#131316` | `#FFFFFF` |
| Set chips | white 0.07–0.08 | `#787880` @ 0.12 |
| Inline editor panel | white 0.045 | `#787880` @ 0.08 |
| RPE track / fill | white 0.09 / brand | `#787880` @ 0.18 / `#FF9F0A→#E8003F` |
| Slider thumb | `#FFF` + black 0.55 shadow | `#FFF` + `0 1 3 rgba(0,0,0,.28)` + `0 0 0 .5 rgba(0,0,0,.06)` |
| Toggle ON | `#30D158` | `#34C759` |
| Destructive ghost | `#FF3B30` @ .10 / `#FF6B60` | `#FF3B30` @ .10 / **`#D70015`** |
| Gold PR surfaces | unchanged | **unchanged** — text `#2B1E00`/`#5C4300` already light-mode-safe |
| Nav "Cancel" | `#8E8E93` | `#007AFF` (iOS light-mode convention) |

---

**Remaining:** the three light-mode files for Phase 4, or the full light-mode set for Phases 2–4 in one shipment. Say the word.