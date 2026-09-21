# PHASE 5 · KINETIC FEED (SOCIAL)
### Four screens · Dark · Contract-locked

---

## ⚠️ Continuity patches (Law III audit, round 3)

Cross-checking the social graph against the daily ledger exposed **two** errors on the delivered home page. Both are in the *Recent Activity* list:

| Row | Was | Must be | Reason |
|---|---|---|---|
| 2 | `HIIT Intervals` · `Yesterday · 28 min · 310 kcal` · `162 avg bpm` | **`Legs · Light`** · **`Saturday · 42:10 · 268 kcal`** · **`4,260 kg lifted`** | Sunday Jun 8 is a **rest day** in the ledger. The nearest prior session is Sat Jun 7. |
| 3 | `Zone 2 Run` · `Monday · 52 min · Easy pace` · `6.8 km` | **`Upper Accessory`** · **`Friday · 38:45 · 244 kcal`** · **`5,180 kg lifted`** | Monday Jun 9 is the Push Day already shown in row 1; no run exists in the ledger. |
| 1 | `Today · 45 min · 380 kcal` | **`Today · 45:12 · 380 kcal`** | Precision — matches Summary and Session Detail exactly. |

Icons change accordingly: row 2 → legs glyph in a **blue** well (`#0A84FF` @ .16 / `#5EB0FF`), row 3 → dumbbell in a **purple** well (`#AF52DE` @ .16 / `#C77DFF`).

**Exercise-ring reconciliation (no patch, but recorded):** ring shows 42/60 min = `33:40` session active + `8:20` brisk walk captured passively by Apple Health. The walk is *not* a logged session, so it correctly does not appear in Recent Activity and does not affect the volume ledger. The heatmap is **session-based**; state this in the UI legend if you build it.

---

## 📐 SOCIAL DATA CONTRACT

```
NOW-LINE (all screens, monotonic, no collisions)
 9:41 session start · 10:19 Active · 10:26 end/Summary · 10:29 Share Composer
 10:31 post published (= home clock) · 10:34 Trends · 10:36 Exercise Detail
 10:38 Picker · 10:42 History · 10:44 Session Detail · 10:46 Edit Session
 10:52 Feed · 10:54 Post Detail · 10:56 Profile Editor
 Post age on Feed at 10:52 = 10:52 − 10:31 = 21m ✓

PEOPLE (avatar initial · hue · weekly-challenge points)
 Alex Rivera  @alexr    A  #5856D6→#BF5AF2   10,340  (you, rank 3)
 Mia Chen     @mia      M  #FF4FB8            12,480  (rank 1)
 Jon Reyes    @jonr     J  #0A84FF            11,920  (rank 2)
 Sofia Marques@sofia    S  #30D158             9,870  (rank 4)
 Dev Patel    @dev      D  #FF9F0A             8,410  (rank 5)
 Lena Fischer @lena     L  #AF52DE             7,905
 Tom Okafor   @tom      T  #32ADE6             6,440
 Challenge: 128 participants · 3 days left (matches home chip ✓)
 Alex's audience "Friends" = 84 mutual follows; Followers 128; Following 112  (84 ≤ 112 ✓)

KUDOS ON ALEX'S JUN 9 POST = 6 → Mia, Jon, Sofia, Dev, Lena, Tom
 Matches Session Detail "Mia, Jon and 4 others" and the M/J/S +3 stack ✓

FEED ITEMS (newest first)
 1 Alex Rivera   10:31 AM today   21m   Push Day · Strength
     8,420 kg · 45:12 · 19 sets · 2 PRs (Volume 8,420 · Shoulder Press 60×10) · 13-day streak
     6 kudos · 3 comments   ← every figure from the session contract ✓
 2 Mia Chen      8:15 AM today    2h   Legs · Hypertrophy
     7,860 kg · 52:40 · 22 sets · 168 reps · Squat PR 125 × 5 (e1RM 145.8)
     14 kudos · 5 comments
 3 Jon Reyes     Sun 6:40 PM     18h   MILESTONE — 100 sessions
     Mar 2022 – Jun 2025 · 14 kudos→32 kudos · 11 comments
 4 Sofia Marques Sun 7:12 AM      1d   Pull Day
     6,240 kg · 48:15 · 18 sets · 144 reps · Deadlift PR 160 × 3 (e1RM 176.0)
     21 kudos · 4 comments

COMMENT THREAD ON POST 1 (3 top-level + 1 reply = "3 comments")
 Mia   18m  "That shoulder press PR is huge. What did you warm up with?"   2 kudos
 Alex  12m  ↳ "Just the bar, then 40 and 50 for five."                     —
 Jon   14m  "Volume up 18% this week. Save something for the rest of us."   5 kudos
 Sofia  6m  "Bookmarked your split. Running it next block."                 1 kudo
 Warm-up 20/40/50 then 60 × 10 working sets — all below the 60 kg PR ✓
 Jon's "18%" = (34,340−29,100)/29,100 ✓ contract

SHARE-CARD VISIBILITY (set once, must match everywhere)
 ON  Volume · Duration · Sets · PRs
 OFF Reps · Heart rate · Notes · RPE
 → Feed poster, Composer preview and Post-Detail poster all render the SAME
   four elements. "Heart rate OFF" is consistent with Profile → Privacy →
   "Show heart-rate data" = OFF.

PROFILE (Alex)
 Sessions 214 · In 2025 96 · Streak 13 (longest 21) · Lifetime volume 1,284,600 kg → "1.28M"
 Followers 128 · Following 112 · Friends (mutual) 84
 Bio 68 chars: "Push / Pull / Legs, five days a week." + "Chasing a 2× bodyweight bench."
   2 × 80.6 kg = 161.2 kg target vs current e1RM 119.6 kg → aspirational, honest ✓
 Ring goals Move 650 kcal · Exercise 60 min · Stand 12 hr  ← identical to home rings ✓
 Weekly volume goal 35,000 kg; this week 34,340 = 98.1% → "98%" ✓
 Units kg / km / cm (bodyweight 80.6 kg ✓)
```

---

## SCREEN 1 · FEED TIMELINE — 393 × 1950

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1950" viewBox="0 0 393 1950" role="img" aria-labelledby="F1" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="F1">Kinetic — Feed timeline</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1950"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="60" cy="200" r="300"><stop offset="0" stop-color="#FF2D55" stop-opacity=".16"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <radialGradient id="A2" gradientUnits="userSpaceOnUse" cx="375" cy="1000" r="330"><stop offset="0" stop-color="#BF5AF2" stop-opacity=".12"/><stop offset="1" stop-color="#BF5AF2" stop-opacity="0"/></radialGradient>
  <radialGradient id="A3" gradientUnits="userSpaceOnUse" cx="30" cy="1700" r="300"><stop offset="0" stop-color="#0A84FF" stop-opacity=".10"/><stop offset="1" stop-color="#0A84FF" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gd" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FFF0BE"/><stop offset=".45" stop-color="#FFD84D"/><stop offset="1" stop-color="#D9A441"/></linearGradient>
  <linearGradient id="pAlex" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF5A3C"/><stop offset="1" stop-color="#C1143C"/></linearGradient>
  <linearGradient id="pMia" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#FF5AC8"/><stop offset="1" stop-color="#6A1B7A"/></linearGradient>
  <linearGradient id="pSof" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#4ADE80"/><stop offset="1" stop-color="#0B5C46"/></linearGradient>
  <linearGradient id="avA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5856D6"/><stop offset="1" stop-color="#BF5AF2"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".32"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fp" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity=".45"/></filter>
  <filter id="fg" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="5" stdDeviation="10" flood-color="#FFD84D" flood-opacity=".40"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#8E8E93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="st" d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"/>
  <path id="fl" d="M0 -8.2 C2.9 -4.6 5.9 -1.7 5.9 1.9 C5.9 5.4 3.3 7.9 0 7.9 C-3.3 7.9 -5.9 5.4 -5.9 1.9 C-5.9 -.2 -4.6 -1.9 -3.3 -3.4 C-3.2 -1.7 -2.4 -.9 -1.3 -.7 C-1.7 -3.5 -1.1 -5.9 0 -8.2 Z"/>
  <path id="hrto" d="M0 6.4 C-7.2 1.7 -8.6 -2.7 -6.3 -5.3 C-4.5 -7.2 -1.6 -6.9 0 -4.6 C1.6 -6.9 4.5 -7.2 6.3 -5.3 C8.6 -2.7 7.2 1.7 0 6.4 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  <path id="bub" d="M-9.5 -6.5 A3.5 3.5 0 0 1 -6 -10 H6 A3.5 3.5 0 0 1 9.5 -6.5 V1.5 A3.5 3.5 0 0 1 6 5 H-1.5 L-6.5 9.5 V5 H-6 A3.5 3.5 0 0 1 -9.5 1.5 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  <g id="shr" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M-6.4 -1.4 H-7.6 A1.8 1.8 0 0 0 -9.4 .4 V7 A1.8 1.8 0 0 0 -7.6 8.8 H7.6 A1.8 1.8 0 0 0 9.4 7 V.4 A1.8 1.8 0 0 0 7.6 -1.4 H6.4"/><path d="M0 -9.6 V3.4"/><path d="M-4.2 -5.4 L0 -9.6 L4.2 -5.4"/></g>
  <g id="cmp" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M-8.5 8.5 L-9.2 4.4 L4.6 -9.4 A2.6 2.6 0 0 1 8.3 -5.7 L-5.5 8.1 Z"/><path d="M2.8 -7.6 L6.5 -3.9"/></g>
  <g id="ic-db" fill="#FFF"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1950" fill="url(#bg)"/><rect width="393" height="1950" fill="url(#A1)"/><rect width="393" height="1950" fill="url(#A2)"/><rect width="393" height="1950" fill="url(#A3)"/>

<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:52</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<circle cx="245.5" cy="29.5" r="6.2" fill="#0A0C10"/><circle cx="245.5" cy="29.5" r="3.1" fill="#121A24"/><circle cx="244.2" cy="28.2" r="1.05" fill="#3E6E9E" opacity=".75"/>

<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Feed</text>
<g filter="url(#fs)"><rect x="338" y="59" width="34" height="34" rx="17" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"/></g>
<use xlink:href="#cmp" href="#cmp" transform="translate(355,76) scale(.85)" color="#C7C7CC"/>

<!-- challenge banner -->
<g filter="url(#fc)"><rect x="16" y="110" width="361" height="76" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="110.5" width="360" height="75" rx="23.5" fill="none" stroke="url(#ce)"/>
<g filter="url(#fg)"><circle cx="48" cy="146" r="20" fill="url(#gd)"/></g>
<circle cx="48" cy="146" r="20" fill="none" stroke="#FFF" stroke-opacity=".35"/>
<use xlink:href="#st" href="#st" transform="translate(48,146) scale(.8)" fill="#5C4300"/>
<text x="80" y="138" font-size="13.5" font-weight="650" letter-spacing="-.25" fill="#FFF">Weekly Challenge</text>
<text x="80" y="156" font-size="10.5" font-weight="500" fill="#86868B">3 days left · 128 participants</text>
<rect x="80" y="166" width="200" height="3.5" rx="1.75" fill="#FFF" fill-opacity=".10"/>
<rect x="80" y="166" width="165.7" height="3.5" rx="1.75" fill="url(#br)"/>
<text x="357" y="142" font-size="18" font-weight="700" letter-spacing="-.55" fill="#FFB84D" text-anchor="end">#3</text>
<text x="357" y="160" font-size="9" font-weight="700" letter-spacing=".6" fill="#86868B" text-anchor="end">10,340 PTS</text>

<!-- filter chips -->
<rect x="16" y="198" width="45" height="28" rx="14" fill="#FFF"/>
<text x="38.5" y="216.5" font-size="12" font-weight="650" letter-spacing="-.15" fill="#1C1C1E" text-anchor="middle">All</text>
<g fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"><rect x="69" y="198" width="84" height="28" rx="14"/><rect x="161" y="198" width="46" height="28" rx="14"/><rect x="215" y="198" width="90" height="28" rx="14"/><rect x="313" y="198" width="84" height="28" rx="14"/></g>
<g font-size="12" font-weight="500" letter-spacing="-.15" fill="#C7C7CC" text-anchor="middle"><text x="111" y="216.5">Following</text><text x="184" y="216.5">PRs</text><text x="260" y="216.5">Milestones</text><text x="355" y="216.5">Challenge</text></g>

<!-- ══ POST 1 · ALEX (you) ══ -->
<g filter="url(#fc)"><rect x="16" y="238" width="361" height="388" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="238.5" width="360" height="387" rx="27.5" fill="none" stroke="url(#ce)"/>
<circle cx="46" cy="270" r="18" fill="url(#avA)"/><circle cx="46" cy="270" r="18" fill="none" stroke="#FFF" stroke-opacity=".18"/>
<text x="46" y="275" font-size="14" font-weight="600" fill="#FFF" text-anchor="middle">A</text>
<text x="74" y="266" font-size="13.5" font-weight="650" letter-spacing="-.2" fill="#FFF">Alex Rivera</text>
<rect x="163" y="255" width="38" height="15" rx="7.5" fill="#FFF" fill-opacity=".09"/>
<text x="182" y="266" font-size="7.5" font-weight="700" letter-spacing=".5" fill="#98989F" text-anchor="middle">YOU</text>
<text x="74" y="283" font-size="10.5" font-weight="500" fill="#86868B">@alexr · 21m · Friends</text>
<g fill="#6C6C70"><circle cx="349" cy="270" r="1.8"/><circle cx="356" cy="270" r="1.8"/><circle cx="363" cy="270" r="1.8"/></g>
<g filter="url(#fp)"><rect x="32" y="296" width="329" height="190" rx="22" fill="url(#pAlex)"/></g>
<rect x="32" y="296" width="329" height="95" rx="22" fill="url(#gl)" opacity=".4"/>
<rect x="32.5" y="296.5" width="328" height="189" rx="21.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="48" y="320" font-size="8" font-weight="700" letter-spacing="1.2" fill="#FFF" fill-opacity=".72">KINETIC · MONDAY, JUNE 9</text>
<text x="48" y="370" font-size="40" font-weight="700" letter-spacing="-1.6" fill="#FFF">8,420</text>
<text x="163" y="370" font-size="15.5" font-weight="600" fill="#FFF" fill-opacity=".72">kg</text>
<text x="48" y="392" font-size="12.5" font-weight="600" letter-spacing="-.2" fill="#FFF" fill-opacity=".88">Push Day · Strength</text>
<g font-size="14" font-weight="700" letter-spacing="-.3" fill="#FFF"><text x="48" y="422">45:12</text><text x="152" y="422">19</text></g>
<g font-size="7.5" font-weight="700" letter-spacing=".7" fill="#FFF" fill-opacity=".62"><text x="48" y="436">DURATION</text><text x="152" y="436">SETS</text></g>
<g fill="#FFF" fill-opacity=".20" stroke="#FFF" stroke-opacity=".30" stroke-width=".8"><rect x="48" y="450" width="112" height="22" rx="11"/><rect x="168" y="450" width="70" height="22" rx="11"/><rect x="246" y="450" width="90" height="22" rx="11"/></g>
<g font-size="8" font-weight="700" letter-spacing=".6" fill="#FFF" text-anchor="middle"><text x="104" y="464.5">SHOULDER PRESS PR</text><text x="203" y="464.5">VOLUME PR</text><text x="291" y="464.5">13-DAY STREAK</text></g>
<text x="36" y="512" font-size="13" font-weight="500" fill="#E5E5EA">Volume up 18% on last push day —</text>
<text x="36" y="529" font-size="13" font-weight="500" fill="#E5E5EA">shoulder press finally moved.</text>
<g stroke="#17171A" stroke-width="2.2"><circle cx="36" cy="556" r="11" fill="#FF4FB8"/><circle cx="54" cy="556" r="11" fill="#0A84FF"/><circle cx="72" cy="556" r="11" fill="#30D158"/></g>
<g font-size="8.5" font-weight="600" fill="#FFF" text-anchor="middle"><text x="36" y="559">M</text><text x="54" y="559">J</text><text x="72" y="559">S</text></g>
<circle cx="90" cy="556" r="11" fill="#2A2A2E" stroke="#17171A" stroke-width="2.2"/>
<text x="90" y="559.5" font-size="7.5" font-weight="700" fill="#98989F" text-anchor="middle">+3</text>
<text x="110" y="560" font-size="11.5" font-weight="500" fill="#98989F">Mia, Jon and 4 others</text>
<g stroke="#FFF" stroke-opacity=".07"><line x1="36" y1="578" x2="357" y2="578"/></g>
<g transform="translate(76.2,598)"><use xlink:href="#hrto" href="#hrto" color="#98989F"/><text x="16" y="4.5" font-size="11.5" font-weight="600" fill="#98989F">6</text></g>
<g transform="translate(196.5,598)"><use xlink:href="#bub" href="#bub" color="#98989F"/><text x="16" y="4.5" font-size="11.5" font-weight="600" fill="#98989F">3</text></g>
<g transform="translate(316.8,598)"><use xlink:href="#shr" href="#shr" transform="scale(.9)" color="#98989F"/></g>

<!-- ══ POST 2 · MIA ══ -->
<g filter="url(#fc)"><rect x="16" y="638" width="361" height="388" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="638.5" width="360" height="387" rx="27.5" fill="none" stroke="url(#ce)"/>
<circle cx="46" cy="670" r="18" fill="#FF4FB8"/><circle cx="46" cy="670" r="18" fill="none" stroke="#FFF" stroke-opacity=".18"/>
<text x="46" y="675" font-size="14" font-weight="600" fill="#FFF" text-anchor="middle">M</text>
<text x="74" y="666" font-size="13.5" font-weight="650" letter-spacing="-.2" fill="#FFF">Mia Chen</text>
<text x="74" y="683" font-size="10.5" font-weight="500" fill="#86868B">@mia · 2h · Public</text>
<g fill="#6C6C70"><circle cx="349" cy="670" r="1.8"/><circle cx="356" cy="670" r="1.8"/><circle cx="363" cy="670" r="1.8"/></g>
<g filter="url(#fp)"><rect x="32" y="696" width="329" height="190" rx="22" fill="url(#pMia)"/></g>
<rect x="32" y="696" width="329" height="95" rx="22" fill="url(#gl)" opacity=".35"/>
<rect x="32.5" y="696.5" width="328" height="189" rx="21.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="48" y="720" font-size="8" font-weight="700" letter-spacing="1.2" fill="#FFF" fill-opacity=".72">KINETIC · MONDAY, JUNE 9</text>
<text x="48" y="770" font-size="40" font-weight="700" letter-spacing="-1.6" fill="#FFF">7,860</text>
<text x="163" y="770" font-size="15.5" font-weight="600" fill="#FFF" fill-opacity=".72">kg</text>
<text x="48" y="792" font-size="12.5" font-weight="600" letter-spacing="-.2" fill="#FFF" fill-opacity=".88">Legs · Hypertrophy</text>
<g font-size="14" font-weight="700" letter-spacing="-.3" fill="#FFF"><text x="48" y="822">52:40</text><text x="152" y="822">22</text></g>
<g font-size="7.5" font-weight="700" letter-spacing=".7" fill="#FFF" fill-opacity=".62"><text x="48" y="836">DURATION</text><text x="152" y="836">SETS</text></g>
<g fill="#FFF" fill-opacity=".20" stroke="#FFF" stroke-opacity=".30" stroke-width=".8"><rect x="48" y="850" width="70" height="22" rx="11"/><rect x="126" y="850" width="74" height="22" rx="11"/><rect x="208" y="850" width="90" height="22" rx="11"/></g>
<g font-size="8" font-weight="700" letter-spacing=".6" fill="#FFF" text-anchor="middle"><text x="83" y="864.5">SQUAT PR</text><text x="163" y="864.5">125 KG × 5</text><text x="253" y="864.5">PERSONAL BEST</text></g>
<text x="36" y="912" font-size="13" font-weight="500" fill="#E5E5EA">Squat 125 for five — third attempt at this</text>
<text x="36" y="929" font-size="13" font-weight="500" fill="#E5E5EA">weight, and the belt finally stayed on.</text>
<g stroke="#17171A" stroke-width="2.2"><circle cx="36" cy="956" r="11" fill="url(#avA)"/><circle cx="54" cy="956" r="11" fill="#0A84FF"/><circle cx="72" cy="956" r="11" fill="#30D158"/></g>
<g font-size="8.5" font-weight="600" fill="#FFF" text-anchor="middle"><text x="36" y="959">A</text><text x="54" y="959">J</text><text x="72" y="959">S</text></g>
<circle cx="90" cy="956" r="11" fill="#2A2A2E" stroke="#17171A" stroke-width="2.2"/>
<text x="90" y="959.5" font-size="7.5" font-weight="700" fill="#98989F" text-anchor="middle">+11</text>
<text x="110" y="960" font-size="11.5" font-weight="500" fill="#98989F">Alex, Jon and 12 others</text>
<line x1="36" y1="978" x2="357" y2="978" stroke="#FFF" stroke-opacity=".07"/>
<g transform="translate(76.2,998)"><use xlink:href="#hrto" href="#hrto" color="#98989F"/><text x="16" y="4.5" font-size="11.5" font-weight="600" fill="#98989F">14</text></g>
<g transform="translate(196.5,998)"><use xlink:href="#bub" href="#bub" color="#98989F"/><text x="16" y="4.5" font-size="11.5" font-weight="600" fill="#98989F">5</text></g>
<g transform="translate(316.8,998)"><use xlink:href="#shr" href="#shr" transform="scale(.9)" color="#98989F"/></g>

<!-- ══ POST 3 · JON · MILESTONE ══ -->
<g filter="url(#fc)"><rect x="16" y="1038" width="361" height="388" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="1038.5" width="360" height="387" rx="27.5" fill="none" stroke="url(#ce)"/>
<circle cx="46" cy="1070" r="18" fill="#0A84FF"/><circle cx="46" cy="1070" r="18" fill="none" stroke="#FFF" stroke-opacity=".18"/>
<text x="46" y="1075" font-size="14" font-weight="600" fill="#FFF" text-anchor="middle">J</text>
<text x="74" y="1066" font-size="13.5" font-weight="650" letter-spacing="-.2" fill="#FFF">Jon Reyes</text>
<rect x="146" y="1055" width="66" height="15" rx="7.5" fill="#FFD60A" fill-opacity=".16"/>
<text x="179" y="1066" font-size="7.5" font-weight="700" letter-spacing=".5" fill="#FFD84D" text-anchor="middle">MILESTONE</text>
<text x="74" y="1083" font-size="10.5" font-weight="500" fill="#86868B">@jonr · 18h · Public</text>
<g fill="#6C6C70"><circle cx="349" cy="1070" r="1.8"/><circle cx="356" cy="1070" r="1.8"/><circle cx="363" cy="1070" r="1.8"/></g>
<g filter="url(#fp)"><rect x="32" y="1096" width="329" height="190" rx="22" fill="url(#gd)"/></g>
<rect x="32" y="1096" width="329" height="95" rx="22" fill="url(#gl)" opacity=".45"/>
<rect x="32.5" y="1096.5" width="328" height="189" rx="21.5" fill="none" stroke="#FFF" stroke-opacity=".40"/>
<circle cx="196.5" cy="1142" r="20" fill="#000" fill-opacity=".13"/>
<use xlink:href="#st" href="#st" transform="translate(196.5,1142) scale(.9)" fill="#5C4300"/>
<text x="196.5" y="1208" font-size="52" font-weight="700" letter-spacing="-2.2" fill="#2B1E00" text-anchor="middle">100</text>
<text x="196.5" y="1228" font-size="10" font-weight="700" letter-spacing="2.8" fill="#5C4300" text-anchor="middle">SESSIONS</text>
<text x="196.5" y="1254" font-size="11" font-weight="500" fill="#7A5A00" text-anchor="middle">Three years in the making</text>
<text x="196.5" y="1272" font-size="8.5" font-weight="700" letter-spacing="1.2" fill="#7A5A00" text-anchor="middle">MARCH 2022 – JUNE 2025</text>
<text x="36" y="1312" font-size="13" font-weight="500" fill="#E5E5EA">Three years, one hundred sessions. Started</text>
<text x="36" y="1329" font-size="13" font-weight="500" fill="#E5E5EA">at 40 kg on the bar and no idea what a split was.</text>
<g stroke="#17171A" stroke-width="2.2"><circle cx="36" cy="1356" r="11" fill="url(#avA)"/><circle cx="54" cy="1356" r="11" fill="#FF4FB8"/><circle cx="72" cy="1356" r="11" fill="#30D158"/></g>
<g font-size="8.5" font-weight="600" fill="#FFF" text-anchor="middle"><text x="36" y="1359">A</text><text x="54" y="1359">M</text><text x="72" y="1359">S</text></g>
<circle cx="90" cy="1356" r="11" fill="#2A2A2E" stroke="#17171A" stroke-width="2.2"/>
<text x="90" y="1359.5" font-size="7.5" font-weight="700" fill="#98989F" text-anchor="middle">+29</text>
<text x="110" y="1360" font-size="11.5" font-weight="500" fill="#98989F">Alex, Mia and 30 others</text>
<line x1="36" y1="1378" x2="357" y2="1378" stroke="#FFF" stroke-opacity=".07"/>
<g transform="translate(76.2,1398)"><use xlink:href="#hrto" href="#hrto" color="#98989F"/><text x="16" y="4.5" font-size="11.5" font-weight="600" fill="#98989F">32</text></g>
<g transform="translate(196.5,1398)"><use xlink:href="#bub" href="#bub" color="#98989F"/><text x="16" y="4.5" font-size="11.5" font-weight="600" fill="#98989F">11</text></g>
<g transform="translate(316.8,1398)"><use xlink:href="#shr" href="#shr" transform="scale(.9)" color="#98989F"/></g>

<!-- ══ POST 4 · SOFIA ══ -->
<g filter="url(#fc)"><rect x="16" y="1438" width="361" height="388" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="1438.5" width="360" height="387" rx="27.5" fill="none" stroke="url(#ce)"/>
<circle cx="46" cy="1470" r="18" fill="#30D158"/><circle cx="46" cy="1470" r="18" fill="none" stroke="#FFF" stroke-opacity=".18"/>
<text x="46" y="1475" font-size="14" font-weight="600" fill="#FFF" text-anchor="middle">S</text>
<text x="74" y="1466" font-size="13.5" font-weight="650" letter-spacing="-.2" fill="#FFF">Sofia Marques</text>
<text x="74" y="1483" font-size="10.5" font-weight="500" fill="#86868B">@sofia · 1d · Friends</text>
<g fill="#6C6C70"><circle cx="349" cy="1470" r="1.8"/><circle cx="356" cy="1470" r="1.8"/><circle cx="363" cy="1470" r="1.8"/></g>
<g filter="url(#fp)"><rect x="32" y="1496" width="329" height="190" rx="22" fill="url(#pSof)"/></g>
<rect x="32" y="1496" width="329" height="95" rx="22" fill="url(#gl)" opacity=".32"/>
<rect x="32.5" y="1496.5" width="328" height="189" rx="21.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="48" y="1520" font-size="8" font-weight="700" letter-spacing="1.2" fill="#FFF" fill-opacity=".72">KINETIC · SUNDAY, JUNE 8</text>
<text x="48" y="1570" font-size="40" font-weight="700" letter-spacing="-1.6" fill="#FFF">6,240</text>
<text x="163" y="1570" font-size="15.5" font-weight="600" fill="#FFF" fill-opacity=".72">kg</text>
<text x="48" y="1592" font-size="12.5" font-weight="600" letter-spacing="-.2" fill="#FFF" fill-opacity=".88">Pull Day</text>
<g font-size="14" font-weight="700" letter-spacing="-.3" fill="#FFF"><text x="48" y="1622">48:15</text><text x="152" y="1622">18</text></g>
<g font-size="7.5" font-weight="700" letter-spacing=".7" fill="#FFF" fill-opacity=".62"><text x="48" y="1636">DURATION</text><text x="152" y="1636">SETS</text></g>
<g fill="#FFF" fill-opacity=".20" stroke="#FFF" stroke-opacity=".30" stroke-width=".8"><rect x="48" y="1650" width="80" height="22" rx="11"/><rect x="136" y="1650" width="74" height="22" rx="11"/></g>
<g font-size="8" font-weight="700" letter-spacing=".6" fill="#FFF" text-anchor="middle"><text x="88" y="1664.5">DEADLIFT PR</text><text x="173" y="1664.5">160 KG × 3</text></g>
<text x="36" y="1712" font-size="13" font-weight="500" fill="#E5E5EA">Deadlift 160 for three. Two years of</text>
<text x="36" y="1729" font-size="13" font-weight="500" fill="#E5E5EA">chipping away at the same bar.</text>
<g stroke="#17171A" stroke-width="2.2"><circle cx="36" cy="1756" r="11" fill="url(#avA)"/><circle cx="54" cy="1756" r="11" fill="#FF4FB8"/><circle cx="72" cy="1756" r="11" fill="#0A84FF"/></g>
<g font-size="8.5" font-weight="600" fill="#FFF" text-anchor="middle"><text x="36" y="1759">A</text><text x="54" y="1759">M</text><text x="72" y="1759">J</text></g>
<circle cx="90" cy="1756" r="11" fill="#2A2A2E" stroke="#17171A" stroke-width="2.2"/>
<text x="90" y="1759.5" font-size="7.5" font-weight="700" fill="#98989F" text-anchor="middle">+18</text>
<text x="110" y="1760" font-size="11.5" font-weight="500" fill="#98989F">Alex, Mia and 19 others</text>
<line x1="36" y1="1778" x2="357" y2="1778" stroke="#FFF" stroke-opacity=".07"/>
<g transform="translate(76.2,1798)"><use xlink:href="#hrto" href="#hrto" color="#98989F"/><text x="16" y="4.5" font-size="11.5" font-weight="600" fill="#98989F">21</text></g>
<g transform="translate(196.5,1798)"><use xlink:href="#bub" href="#bub" color="#98989F"/><text x="16" y="4.5" font-size="11.5" font-weight="600" fill="#98989F">4</text></g>
<g transform="translate(316.8,1798)"><use xlink:href="#shr" href="#shr" transform="scale(.9)" color="#98989F"/></g>

<text x="196.5" y="1856" font-size="11" font-weight="500" fill="#6C6C70" text-anchor="middle">Showing 4 of 128 posts from your circle</text>
<rect x="120.5" y="1868" width="152" height="42" rx="21" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".10" stroke-width="1"/>
<text x="196.5" y="1894" font-size="13.5" font-weight="600" letter-spacing="-.25" fill="#C7C7CC" text-anchor="middle">Load earlier</text>
<rect x="140.5" y="1930" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1949" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## SCREEN 2 · POST DETAIL — 393 × 1080

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1080" viewBox="0 0 393 1080" role="img" aria-labelledby="F2" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="F2">Kinetic — Post detail with comment thread</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1080" rx="54.5"/></clipPath><clipPath id="sc"><rect width="393" height="962"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="196" cy="250" r="290"><stop offset="0" stop-color="#FF2D55" stop-opacity=".16"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="pAlex" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF5A3C"/><stop offset="1" stop-color="#C1143C"/></linearGradient>
  <linearGradient id="avA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5856D6"/><stop offset="1" stop-color="#BF5AF2"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".32"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15151A" stop-opacity=".94"/><stop offset="1" stop-color="#0C0C10" stop-opacity=".99"/></linearGradient>
  <linearGradient id="fd" gradientUnits="userSpaceOnUse" x1="0" y1="922" x2="0" y2="962"><stop offset="0" stop-color="#050507" stop-opacity="0"/><stop offset="1" stop-color="#050507" stop-opacity=".9"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fp" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity=".45"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#FF2D55" flood-opacity=".55"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#8E8E93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="st" d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"/>
  <path id="fl" d="M0 -8.2 C2.9 -4.6 5.9 -1.7 5.9 1.9 C5.9 5.4 3.3 7.9 0 7.9 C-3.3 7.9 -5.9 5.4 -5.9 1.9 C-5.9 -.2 -4.6 -1.9 -3.3 -3.4 C-3.2 -1.7 -2.4 -.9 -1.3 -.7 C-1.7 -3.5 -1.1 -5.9 0 -8.2 Z"/>
  <path id="hrt" d="M0 6.4 C-7.2 1.7 -8.6 -2.7 -6.3 -5.3 C-4.5 -7.2 -1.6 -6.9 0 -4.6 C1.6 -6.9 4.5 -7.2 6.3 -5.3 C8.6 -2.7 7.2 1.7 0 6.4 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  <path id="bub" d="M-9.5 -6.5 A3.5 3.5 0 0 1 -6 -10 H6 A3.5 3.5 0 0 1 9.5 -6.5 V1.5 A3.5 3.5 0 0 1 6 5 H-1.5 L-6.5 9.5 V5 H-6 A3.5 3.5 0 0 1 -9.5 1.5 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  <g id="shr" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M-6.4 -1.4 H-7.6 A1.8 1.8 0 0 0 -9.4 .4 V7 A1.8 1.8 0 0 0 -7.6 8.8 H7.6 A1.8 1.8 0 0 0 9.4 7 V.4 A1.8 1.8 0 0 0 7.6 -1.4 H6.4"/><path d="M0 -9.6 V3.4"/><path d="M-4.2 -5.4 L0 -9.6 L4.2 -5.4"/></g>
  <path id="up" d="M0 8 V-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path id="upa" d="M-4.6 -1.6 L0 -6.4 L4.6 -1.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1080" fill="url(#bg)"/><rect width="393" height="1080" fill="url(#A1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:54</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<circle cx="245.5" cy="29.5" r="6.2" fill="#0A0C10"/><circle cx="245.5" cy="29.5" r="3.1" fill="#121A24"/><circle cx="244.2" cy="28.2" r="1.05" fill="#3E6E9E" opacity=".75"/>

<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Post</text>
<g fill="#8E8E93"><circle cx="359" cy="76" r="2"/><circle cx="366" cy="76" r="2"/><circle cx="373" cy="76" r="2"/></g>

<g clip-path="url(#sc)">
<!-- author -->
<circle cx="48" cy="132" r="22" fill="url(#avA)"/><circle cx="48" cy="132" r="22" fill="none" stroke="#FFF" stroke-opacity=".18"/>
<text x="48" y="138.5" font-size="17" font-weight="600" fill="#FFF" text-anchor="middle">A</text>
<text x="82" y="126" font-size="15" font-weight="650" letter-spacing="-.3" fill="#FFF">Alex Rivera</text>
<rect x="176" y="114" width="38" height="16" rx="8" fill="#FFF" fill-opacity=".09"/>
<text x="195" y="125.5" font-size="7.5" font-weight="700" letter-spacing=".5" fill="#98989F" text-anchor="middle">YOU</text>
<text x="82" y="145" font-size="11.5" font-weight="500" fill="#86868B">@alexr · 21 minutes ago</text>
<g fill="#6C6C70"><circle cx="349" cy="132" r="1.8"/><circle cx="356" cy="132" r="1.8"/><circle cx="363" cy="132" r="1.8"/></g>

<!-- poster (full width) -->
<g filter="url(#fp)"><rect x="16" y="166" width="361" height="190" rx="28" fill="url(#pAlex)"/></g>
<rect x="16" y="166" width="361" height="95" rx="28" fill="url(#gl)" opacity=".4"/>
<rect x="16.5" y="166.5" width="360" height="189" rx="27.5" fill="none" stroke="#FFF" stroke-opacity=".24"/>
<text x="36" y="190" font-size="8" font-weight="700" letter-spacing="1.2" fill="#FFF" fill-opacity=".72">KINETIC · MONDAY, JUNE 9</text>
<text x="36" y="240" font-size="42" font-weight="700" letter-spacing="-1.7" fill="#FFF">8,420</text>
<text x="157" y="240" font-size="16" font-weight="600" fill="#FFF" fill-opacity=".72">kg</text>
<text x="36" y="262" font-size="12.5" font-weight="600" letter-spacing="-.2" fill="#FFF" fill-opacity=".88">Push Day · Strength</text>
<g font-size="14" font-weight="700" letter-spacing="-.3" fill="#FFF"><text x="36" y="288">45:12</text><text x="148" y="288">19</text></g>
<g font-size="7.5" font-weight="700" letter-spacing=".7" fill="#FFF" fill-opacity=".62"><text x="36" y="302">DURATION</text><text x="148" y="302">SETS</text></g>
<g fill="#FFF" fill-opacity=".20" stroke="#FFF" stroke-opacity=".30" stroke-width=".8"><rect x="36" y="316" width="112" height="22" rx="11"/><rect x="156" y="316" width="70" height="22" rx="11"/><rect x="234" y="316" width="90" height="22" rx="11"/></g>
<g font-size="8" font-weight="700" letter-spacing=".6" fill="#FFF" text-anchor="middle"><text x="92" y="330.5">SHOULDER PRESS PR</text><text x="191" y="330.5">VOLUME PR</text><text x="279" y="330.5">13-DAY STREAK</text></g>

<text x="24" y="386" font-size="14" font-weight="500" fill="#F5F5F7">Volume up 18% on last push day —</text>
<text x="24" y="406" font-size="14" font-weight="500" fill="#F5F5F7">shoulder press finally moved.</text>
<text x="24" y="430" font-size="11" font-weight="500" fill="#6C6C70">10:31 AM · June 9, 2025 · Visible to Friends</text>
<line x1="16" y1="448" x2="377" y2="448" stroke="#FFF" stroke-opacity=".08"/>

<g stroke="#17171A" stroke-width="2.4"><circle cx="36" cy="474" r="12" fill="#FF4FB8"/><circle cx="56" cy="474" r="12" fill="#0A84FF"/><circle cx="76" cy="474" r="12" fill="#30D158"/></g>
<g font-size="9.5" font-weight="600" fill="#FFF" text-anchor="middle"><text x="36" y="477.5">M</text><text x="56" y="477.5">J</text><text x="76" y="477.5">S</text></g>
<circle cx="96" cy="474" r="12" fill="#2A2A2E" stroke="#17171A" stroke-width="2.4"/>
<text x="96" y="477.5" font-size="8" font-weight="700" fill="#98989F" text-anchor="middle">+3</text>
<text x="118" y="478" font-size="12.5" font-weight="600" letter-spacing="-.2" fill="#FFF">Mia, Jon and 4 others</text>
<text x="357" y="478" font-size="11.5" font-weight="500" fill="#86868B" text-anchor="end">6 kudos</text>

<!-- action bar -->
<rect x="16" y="498" width="115" height="48" rx="24" fill="#FFF" fill-opacity=".06"/>
<g transform="translate(52,522)" color="#98989F"><use xlink:href="#hrt" href="#hrt"/></g>
<text x="68" y="527" font-size="12.5" font-weight="600" fill="#C7C7CC">Kudos</text>
<rect x="139" y="498" width="115" height="48" rx="24" fill="#FFF" fill-opacity=".06"/>
<g transform="translate(175,522)" color="#98989F"><use xlink:href="#bub" href="#bub" transform="scale(.92)"/></g>
<text x="191" y="527" font-size="12.5" font-weight="600" fill="#C7C7CC">Comment</text>
<rect x="262" y="498" width="115" height="48" rx="24" fill="#FFF" fill-opacity=".06"/>
<g transform="translate(303,522)" color="#98989F"><use xlink:href="#shr" href="#shr" transform="scale(.9)"/></g>
<text x="319" y="527" font-size="12.5" font-weight="600" fill="#C7C7CC">Share</text>

<text x="24" y="576" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">3 COMMENTS</text>

<!-- C1 Mia -->
<circle cx="38" cy="604" r="14" fill="#FF4FB8"/><text x="38" y="608.5" font-size="10.5" font-weight="600" fill="#FFF" text-anchor="middle">M</text>
<text x="64" y="602" font-size="12.5" font-weight="650" letter-spacing="-.15" fill="#FFF">Mia Chen</text>
<text x="357" y="602" font-size="10" font-weight="500" fill="#6C6C70" text-anchor="end">18m</text>
<text x="64" y="620" font-size="12.5" font-weight="500" fill="#E5E5EA">That shoulder press PR is huge. What did</text>
<text x="64" y="637" font-size="12.5" font-weight="500" fill="#E5E5EA">you warm up with?</text>
<g transform="translate(70,654)" color="#86868B"><use xlink:href="#hrt" href="#hrt" transform="scale(.62)"/></g>
<text x="82" y="658" font-size="10" font-weight="600" fill="#86868B">2  ·  Reply</text>

<!-- reply (Alex) -->
<path d="M38 660 V682 Q38 688 44 688 H52" fill="none" stroke="#FFF" stroke-opacity=".14" stroke-width="1.6" stroke-linecap="round"/>
<circle cx="68" cy="688" r="12" fill="url(#avA)"/><text x="68" y="692" font-size="9" font-weight="600" fill="#FFF" text-anchor="middle">A</text>
<text x="90" y="686" font-size="12.5" font-weight="650" letter-spacing="-.15" fill="#FFF">Alex Rivera</text>
<rect x="176" y="675" width="52" height="15" rx="7.5" fill="#FFF" fill-opacity=".09"/>
<text x="202" y="686" font-size="7.5" font-weight="700" letter-spacing=".5" fill="#98989F" text-anchor="middle">AUTHOR</text>
<text x="357" y="686" font-size="10" font-weight="500" fill="#6C6C70" text-anchor="end">12m</text>
<text x="90" y="704" font-size="12.5" font-weight="500" fill="#E5E5EA">Just the bar, then 40 and 50 for five.</text>
<text x="90" y="724" font-size="10" font-weight="600" fill="#86868B">Reply</text>

<!-- C2 Jon -->
<circle cx="38" cy="768" r="14" fill="#0A84FF"/><text x="38" y="772.5" font-size="10.5" font-weight="600" fill="#FFF" text-anchor="middle">J</text>
<text x="64" y="766" font-size="12.5" font-weight="650" letter-spacing="-.15" fill="#FFF">Jon Reyes</text>
<text x="357" y="766" font-size="10" font-weight="500" fill="#6C6C70" text-anchor="end">14m</text>
<text x="64" y="784" font-size="12.5" font-weight="500" fill="#E5E5EA">Volume up 18% this week. Save something</text>
<text x="64" y="801" font-size="12.5" font-weight="500" fill="#E5E5EA">for the rest of us.</text>
<g transform="translate(70,818)" color="#FF2D55"><path d="M0 6.4 C-7.2 1.7 -8.6 -2.7 -6.3 -5.3 C-4.5 -7.2 -1.6 -6.9 0 -4.6 C1.6 -6.9 4.5 -7.2 6.3 -5.3 C8.6 -2.7 7.2 1.7 0 6.4 Z" transform="scale(.62)" fill="#FF2D55" stroke="none"/></g>
<text x="82" y="822" font-size="10" font-weight="700" fill="#FF6A88">5  ·  <tspan font-weight="600" fill="#86868B">Reply</tspan></text>

<!-- C3 Sofia -->
<circle cx="38" cy="856" r="14" fill="#30D158"/><text x="38" y="860.5" font-size="10.5" font-weight="600" fill="#FFF" text-anchor="middle">S</text>
<text x="64" y="854" font-size="12.5" font-weight="650" letter-spacing="-.15" fill="#FFF">Sofia Marques</text>
<text x="357" y="854" font-size="10" font-weight="500" fill="#6C6C70" text-anchor="end">6m</text>
<text x="64" y="872" font-size="12.5" font-weight="500" fill="#E5E5EA">Bookmarked your split. Running it next block.</text>
<g transform="translate(70,888)" color="#86868B"><use xlink:href="#hrt" href="#hrt" transform="scale(.62)"/></g>
<text x="82" y="892" font-size="10" font-weight="600" fill="#86868B">1  ·  Reply</text>

<text x="196.5" y="936" font-size="10.5" font-weight="500" fill="#48484A" text-anchor="middle">Shared from Session Detail · S-0609-A</text>
<rect x="0" y="922" width="393" height="40" fill="url(#fd)"/>
</g>

<!-- sticky comment bar -->
<rect x="0" y="962" width="393" height="118" fill="url(#tb)"/>
<line x1="0" y1="962.5" x2="393" y2="962.5" stroke="#FFF" stroke-opacity=".11"/>
<circle cx="40" cy="1006" r="16" fill="url(#avA)"/><circle cx="40" cy="1006" r="16" fill="none" stroke="#FFF" stroke-opacity=".16"/>
<text x="40" y="1011" font-size="12.5" font-weight="600" fill="#FFF" text-anchor="middle">A</text>
<rect x="66" y="987" width="250" height="38" rx="19" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".9"/>
<text x="84" y="1011" font-size="13.5" font-weight="400" letter-spacing="-.2" fill="#6C6C70">Write a comment…</text>
<g filter="url(#fb)"><circle cx="341" cy="1006" r="17" fill="url(#br)"/></g>
<circle cx="341" cy="1006" r="17" fill="none" stroke="#FFF" stroke-opacity=".24" stroke-width=".9"/>
<g transform="translate(341,1006)" color="#FFF" opacity=".5"><use xlink:href="#up" href="#up" transform="scale(.82)"/><use xlink:href="#upa" href="#upa" transform="scale(.82)"/></g>
<rect x="140.5" y="1056" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="1078.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

*Send button is drawn at **50% opacity** — disabled, because the field is empty. Law I: a control that cannot act must not look like it can.*

---

## SCREEN 3 · SHARE COMPOSER — 393 × 1112

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1112" viewBox="0 0 393 1112" role="img" aria-labelledby="F3" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="F3">Kinetic — Share composer</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1112" rx="54.5"/></clipPath><clipPath id="sc"><rect width="393" height="968"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="196" cy="620" r="300"><stop offset="0" stop-color="#FF6A3D" stop-opacity=".14"/><stop offset="1" stop-color="#FF6A3D" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="pAlex" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF5A3C"/><stop offset="1" stop-color="#C1143C"/></linearGradient>
  <linearGradient id="pAur" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#8E7BFF"/><stop offset="1" stop-color="#0E7490"/></linearGradient>
  <linearGradient id="pSlt" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#4A4A50"/><stop offset="1" stop-color="#1C1C1E"/></linearGradient>
  <linearGradient id="avA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5856D6"/><stop offset="1" stop-color="#BF5AF2"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".32"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15151A" stop-opacity=".94"/><stop offset="1" stop-color="#0C0C10" stop-opacity=".99"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fp" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity=".45"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="ff" x="-20%" y="-60%" width="140%" height="240%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#FF6A3D" flood-opacity=".4"/></filter>
  <g id="ic-db" fill="#FFF"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
  <g id="lck" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M-3.2 -1.4 V-3.6 A3.2 3.2 0 0 1 3.2 -3.6 V-1.4"/><rect x="-5.4" y="-1.4" width="10.8" height="8" rx="2.2" fill="currentColor" stroke="none"/></g>
  <path id="cdown" d="M-3 -1.6 L0 1.6 L3 -1.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ck" d="M-4 .3 L-1.2 3.2 L4.4 -3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="iph" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="-8.5" y="-7" width="17" height="14" rx="3.5"/><circle cx="-3" cy="-2.5" r="1.8"/><path d="M-8.5 4 L-3 -.5 L1 3.5 L4 1 L8.5 5.5"/></g>
  <g id="itag" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M-1 -8.5 H-6 A2.5 2.5 0 0 0 -8.5 -6 V-1 L.5 8 L8 -.5 Z"/><circle cx="-4" cy="-4" r="1.5"/></g>
  <g id="ipin" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M0 9 C0 9 7 2.5 7 -2 A7 7 0 0 0 -7 -2 C-7 2.5 0 9 0 9 Z"/><circle cx="0" cy="-2" r="2.6"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1112" fill="url(#bg)"/><rect width="393" height="1112" fill="url(#A1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:29</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="19" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>

<text x="24" y="82" font-size="16" font-weight="400" letter-spacing="-.3" fill="#8E8E93">Cancel</text>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">New Post</text>
<text x="369" y="82" font-size="16" font-weight="600" letter-spacing="-.3" fill="#FF9F0A" text-anchor="end">Share</text>

<g clip-path="url(#sc)">
<!-- author + audience -->
<circle cx="44" cy="138" r="18" fill="url(#avA)"/><circle cx="44" cy="138" r="18" fill="none" stroke="#FFF" stroke-opacity=".18"/>
<text x="44" y="143" font-size="14" font-weight="600" fill="#FFF" text-anchor="middle">A</text>
<text x="74" y="132" font-size="14" font-weight="650" letter-spacing="-.25" fill="#FFF">Alex Rivera</text>
<rect x="74" y="140" width="88" height="22" rx="11" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"/>
<g transform="translate(86,151)" color="#C7C7CC"><use xlink:href="#lck" href="#lck" transform="scale(.92)"/></g>
<text x="96" y="155" font-size="11" font-weight="600" fill="#C7C7CC">Friends</text>
<g transform="translate(152,151)" color="#8E8E93"><use xlink:href="#cdown" href="#cdown" transform="scale(.85)"/></g>

<!-- attached session -->
<g filter="url(#ft)"><rect x="16" y="178" width="361" height="72" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="178.5" width="360" height="71" rx="21.5" fill="none" stroke="url(#ce)"/>
<g filter="url(#fb)"><rect x="32" y="194" width="40" height="40" rx="14" fill="url(#br)"/></g>
<rect x="32" y="194" width="40" height="20" rx="14" fill="url(#gl)" opacity=".4"/>
<use xlink:href="#ic-db" href="#ic-db" transform="translate(52,214) scale(.82)"/>
<text x="84" y="204" font-size="8" font-weight="700" letter-spacing=".9" fill="#86868B">ATTACHED SESSION</text>
<text x="84" y="226" font-size="13" font-weight="600" letter-spacing="-.2" fill="#FFF">Push Day · Strength — 8,420 kg</text>
<circle cx="353" cy="214" r="13" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<g stroke="#98989F" stroke-width="1.8" stroke-linecap="round"><line x1="348.8" y1="209.8" x2="357.2" y2="218.2"/><line x1="357.2" y1="209.8" x2="348.8" y2="218.2"/></g>

<!-- card style -->
<text x="24" y="280" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">CARD STYLE</text>
<rect x="12.5" y="288.5" width="119" height="71" rx="23.5" fill="none" stroke="url(#br)" stroke-width="2.5"/>
<g filter="url(#fp)"><rect x="16" y="292" width="112" height="64" rx="20" fill="url(#pAlex)"/></g>
<rect x="16" y="292" width="112" height="32" rx="20" fill="url(#gl)" opacity=".4"/>
<text x="72" y="330" font-size="15" font-weight="700" letter-spacing="-.5" fill="#FFF" text-anchor="middle">8,420</text>
<g filter="url(#fb)"><circle cx="120" cy="300" r="9" fill="url(#br)"/></g>
<g transform="translate(120,300)" color="#FFF"><use xlink:href="#ck" href="#ck" transform="scale(.62)"/></g>
<g filter="url(#fp)"><rect x="140" y="292" width="112" height="64" rx="20" fill="url(#pAur)"/></g>
<rect x="140" y="292" width="112" height="32" rx="20" fill="url(#gl)" opacity=".28"/>
<text x="196" y="330" font-size="15" font-weight="700" letter-spacing="-.5" fill="#FFF" fill-opacity=".9" text-anchor="middle">8,420</text>
<g filter="url(#fp)"><rect x="264" y="292" width="113" height="64" rx="20" fill="url(#pSlt)"/></g>
<rect x="264.5" y="292.5" width="112" height="63" rx="19.5" fill="none" stroke="#FFF" stroke-opacity=".12"/>
<text x="320.5" y="330" font-size="15" font-weight="700" letter-spacing="-.5" fill="#FFF" fill-opacity=".9" text-anchor="middle">8,420</text>
<g font-size="10" font-weight="600" letter-spacing="-.1" text-anchor="middle"><text x="72" y="374" fill="#FFF">Ember</text><text x="196" y="374" fill="#86868B">Aurora</text><text x="320.5" y="374" fill="#86868B">Slate</text></g>

<!-- stat toggles -->
<text x="24" y="406" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">STATS ON CARD</text>
<text x="369" y="406" font-size="10" font-weight="500" fill="#6C6C70" text-anchor="end">4 of 8 shown</text>
<g fill="#30D158" fill-opacity=".14" stroke="#30D158" stroke-opacity=".30" stroke-width=".8"><rect x="16" y="418" width="79" height="28" rx="14"/><rect x="103" y="418" width="91" height="28" rx="14"/><rect x="202" y="418" width="66" height="28" rx="14"/><rect x="16" y="454" width="61" height="28" rx="14"/></g>
<g fill="#FFF" fill-opacity=".06" stroke="#FFF" stroke-opacity=".08" stroke-width=".8"><rect x="276" y="418" width="66" height="28" rx="14"/><rect x="85" y="454" width="103" height="28" rx="14"/><rect x="196" y="454" width="73" height="28" rx="14"/><rect x="277" y="454" width="61" height="28" rx="14"/></g>
<g stroke="#30D158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M30 430.5 L33 434 L39 427.5"/><path d="M117 430.5 L120 434 L126 427.5"/><path d="M216 430.5 L219 434 L225 427.5"/><path d="M30 466.5 L33 470 L39 463.5"/></g>
<g fill="none" stroke="#6C6C70" stroke-width="1.4"><circle cx="290" cy="432" r="6"/><circle cx="99" cy="468" r="6"/><circle cx="210" cy="468" r="6"/><circle cx="291" cy="468" r="6"/></g>
<g font-size="11.5" font-weight="600" letter-spacing="-.15"><g fill="#4ADE80"><text x="46" y="436.5">Volume</text><text x="133" y="436.5">Duration</text><text x="232" y="436.5">Sets</text><text x="46" y="472.5">PRs</text></g><g fill="#8E8E93"><text x="306" y="436.5">Reps</text><text x="115" y="472.5">Heart rate</text><text x="226" y="472.5">Notes</text><text x="307" y="472.5">RPE</text></g></g>

<!-- live preview -->
<text x="24" y="514" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">PREVIEW</text>
<circle cx="330" cy="510" r="3.2" fill="#30D158"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
<text x="369" y="514" font-size="10" font-weight="600" letter-spacing=".2" fill="#4ADE80" text-anchor="end">LIVE</text>
<g filter="url(#fp)"><rect x="16" y="526" width="361" height="190" rx="28" fill="url(#pAlex)"/></g>
<rect x="16" y="526" width="361" height="95" rx="28" fill="url(#gl)" opacity=".4"/>
<rect x="16.5" y="526.5" width="360" height="189" rx="27.5" fill="none" stroke="#FFF" stroke-opacity=".24"/>
<text x="36" y="550" font-size="8" font-weight="700" letter-spacing="1.2" fill="#FFF" fill-opacity=".72">KINETIC · MONDAY, JUNE 9</text>
<text x="36" y="600" font-size="42" font-weight="700" letter-spacing="-1.7" fill="#FFF">8,420</text>
<text x="157" y="600" font-size="16" font-weight="600" fill="#FFF" fill-opacity=".72">kg</text>
<text x="36" y="622" font-size="12.5" font-weight="600" letter-spacing="-.2" fill="#FFF" fill-opacity=".88">Push Day · Strength</text>
<g font-size="14" font-weight="700" letter-spacing="-.3" fill="#FFF"><text x="36" y="648">45:12</text><text x="148" y="648">19</text></g>
<g font-size="7.5" font-weight="700" letter-spacing=".7" fill="#FFF" fill-opacity=".62"><text x="36" y="662">DURATION</text><text x="148" y="662">SETS</text></g>
<g fill="#FFF" fill-opacity=".20" stroke="#FFF" stroke-opacity=".30" stroke-width=".8"><rect x="36" y="676" width="112" height="22" rx="11"/><rect x="156" y="676" width="70" height="22" rx="11"/><rect x="234" y="676" width="90" height="22" rx="11"/></g>
<g font-size="8" font-weight="700" letter-spacing=".6" fill="#FFF" text-anchor="middle"><text x="92" y="690.5">SHOULDER PRESS PR</text><text x="191" y="690.5">VOLUME PR</text><text x="279" y="690.5">13-DAY STREAK</text></g>

<!-- text composer (focused) -->
<g filter="url(#fc)"><rect x="16" y="728" width="361" height="100" rx="28" fill="url(#cd)"/></g>
<g filter="url(#ff)"><rect x="16" y="728" width="361" height="100" rx="28" fill="none" stroke="url(#br)" stroke-width="1.8"/></g>
<text x="36" y="756" font-size="8.5" font-weight="700" letter-spacing=".9" fill="#86868B">SAY SOMETHING</text>
<text x="357" y="756" font-size="9" font-weight="500" letter-spacing=".2" fill="#6C6C70" text-anchor="end">62 / 280</text>
<text x="36" y="782" font-size="14" font-weight="500" fill="#F5F5F7">Volume up 18% on last push day —</text>
<text x="36" y="801" font-size="14" font-weight="500" fill="#F5F5F7">shoulder press finally moved.</text>
<rect x="228" y="789" width="2" height="16" rx="1" fill="#FF6A3D"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.51;1" dur="1.1s" repeatCount="indefinite"/></rect>

<!-- attach row -->
<g fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".10" stroke-width=".9"><rect x="16" y="840" width="112" height="48" rx="24"/><rect x="140" y="840" width="112" height="48" rx="24"/><rect x="264" y="840" width="113" height="48" rx="24"/></g>
<g transform="translate(52,864)" color="#C7C7CC"><use xlink:href="#iph" href="#iph" transform="scale(.88)"/></g>
<text x="66" y="868" font-size="12" font-weight="600" letter-spacing="-.15" fill="#C7C7CC">Photo</text>
<g transform="translate(182,864)" color="#C7C7CC"><use xlink:href="#itag" href="#itag" transform="scale(.88)"/></g>
<text x="196" y="868" font-size="12" font-weight="600" letter-spacing="-.15" fill="#C7C7CC">Tag</text>
<g transform="translate(293,864)" color="#C7C7CC"><use xlink:href="#ipin" href="#ipin" transform="scale(.88)"/></g>
<text x="310" y="868" font-size="12" font-weight="600" letter-spacing="-.15" fill="#C7C7CC">Location</text>

<!-- tagged -->
<text x="24" y="918" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">TAGGED</text>
<rect x="16" y="928" width="104" height="28" rx="14" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"/>
<circle cx="32" cy="942" r="9" fill="#FF4FB8"/><text x="32" y="945.5" font-size="8" font-weight="600" fill="#FFF" text-anchor="middle">M</text>
<text x="46" y="946" font-size="11" font-weight="600" letter-spacing="-.1" fill="#F5F5F7">Mia Chen</text>
<g stroke="#8E8E93" stroke-width="1.5" stroke-linecap="round"><line x1="106" y1="938.5" x2="112.5" y2="945.5"/><line x1="112.5" y1="938.5" x2="106" y2="945.5"/></g>
<rect x="128" y="928" width="100" height="28" rx="14" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"/>
<circle cx="144" cy="942" r="9" fill="#0A84FF"/><text x="144" y="945.5" font-size="8" font-weight="600" fill="#FFF" text-anchor="middle">J</text>
<text x="158" y="946" font-size="11" font-weight="600" letter-spacing="-.1" fill="#F5F5F7">Jon Reyes</text>
<g stroke="#8E8E93" stroke-width="1.5" stroke-linecap="round"><line x1="214" y1="938.5" x2="220.5" y2="945.5"/><line x1="220.5" y1="938.5" x2="214" y2="945.5"/></g>
<rect x="236" y="928" width="64" height="28" rx="14" fill="#FFF" fill-opacity=".045" stroke="#FFF" stroke-opacity=".14" stroke-width="1" stroke-dasharray="4 3"/>
<g stroke="#FF9F0A" stroke-width="1.8" stroke-linecap="round"><line x1="248" y1="942" x2="258" y2="942"/><line x1="253" y1="937" x2="253" y2="947"/></g>
<text x="264" y="946" font-size="11" font-weight="600" letter-spacing="-.1" fill="#FFB84D">Add</text>
</g>

<rect x="0" y="968" width="393" height="144" fill="url(#tb)"/>
<line x1="0" y1="968.5" x2="393" y2="968.5" stroke="#FFF" stroke-opacity=".11"/>
<g filter="url(#fb)"><rect x="16" y="982" width="361" height="54" rx="27" fill="url(#br)"/></g>
<rect x="16" y="982" width="361" height="27" rx="27" fill="url(#gl)" opacity=".35"/>
<rect x="16.5" y="982.5" width="360" height="53" rx="26.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="196.5" y="1015" font-size="16" font-weight="650" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Share to Feed</text>
<text x="196.5" y="1058" font-size="10.5" font-weight="500" fill="#6C6C70" text-anchor="middle">Sharing with 84 friends · 4 stats hidden</text>
<rect x="140.5" y="1088" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="1110.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

---

## SCREEN 4 · PROFILE EDITOR — 393 × 1854

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1854" viewBox="0 0 393 1854" role="img" aria-labelledby="F4" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="F4">Kinetic — Profile editor</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1854"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="196" cy="170" r="260"><stop offset="0" stop-color="#5E5CE6" stop-opacity=".20"/><stop offset="1" stop-color="#5E5CE6" stop-opacity="0"/></radialGradient>
  <radialGradient id="A2" gradientUnits="userSpaceOnUse" cx="375" cy="900" r="320"><stop offset="0" stop-color="#FF2D55" stop-opacity=".09"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="avA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5856D6"/><stop offset="1" stop-color="#BF5AF2"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="fa" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="5" stdDeviation="10" flood-color="#5E5CE6" flood-opacity=".5"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <g id="cam" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M-8 -3.5 A2.5 2.5 0 0 1 -5.5 -6 H-3.6 L-2.4 -8 H2.4 L3.6 -6 H5.5 A2.5 2.5 0 0 1 8 -3.5 V5 A2.5 2.5 0 0 1 5.5 7.5 H-5.5 A2.5 2.5 0 0 1 -8 5 Z"/><circle cx="0" cy=".6" r="3.4"/></g>
  <g id="hlth"><path d="M0 6.4 C-7.2 1.7 -8.6 -2.7 -6.3 -5.3 C-4.5 -7.2 -1.6 -6.9 0 -4.6 C1.6 -6.9 4.5 -7.2 6.3 -5.3 C8.6 -2.7 7.2 1.7 0 6.4 Z"/></g>
  <g id="wtch" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="-6" y="-6.5" width="12" height="13" rx="4"/><path d="M-3.4 -6.5 V-9.4 H3.4 V-6.5 M-3.4 6.5 V9.4 H3.4 V6.5"/></g>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ck" d="M-4 .3 L-1.2 3.2 L4.4 -3" fill="none" stroke="#FFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1854" fill="url(#bg)"/><rect width="393" height="1854" fill="url(#A1)"/><rect width="393" height="1854" fill="url(#A2)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:56</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>

<text x="24" y="82" font-size="16" font-weight="400" letter-spacing="-.3" fill="#8E8E93">Cancel</text>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Edit Profile</text>
<text x="369" y="82" font-size="16" font-weight="600" letter-spacing="-.3" fill="#FF9F0A" text-anchor="end">Save</text>

<!-- avatar -->
<g filter="url(#fa)"><circle cx="196.5" cy="164" r="44" fill="url(#avA)"/></g>
<circle cx="196.5" cy="164" r="44" fill="none" stroke="#FFF" stroke-opacity=".20" stroke-width="1.2"/>
<text x="196.5" y="176" font-size="34" font-weight="600" letter-spacing="-1" fill="#FFF" text-anchor="middle">A</text>
<circle cx="229" cy="197" r="16" fill="url(#br)" stroke="#0B0B0E" stroke-width="3.5"/>
<g transform="translate(229,197)" color="#FFF"><use xlink:href="#cam" href="#cam" transform="scale(.66)"/></g>
<text x="196.5" y="232" font-size="12" font-weight="600" letter-spacing="-.15" fill="#FF9F0A" text-anchor="middle">Change Photo</text>

<!-- public stats strip -->
<g filter="url(#fc)"><rect x="16" y="252" width="361" height="68" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="252.5" width="360" height="67" rx="23.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".08"><line x1="106.25" y1="266" x2="106.25" y2="306"/><line x1="196.5" y1="266" x2="196.5" y2="306"/><line x1="286.75" y1="266" x2="286.75" y2="306"/></g>
<g text-anchor="middle" font-size="15" font-weight="700" letter-spacing="-.4" fill="#FFF"><text x="61.1" y="290">214</text><text x="151.4" y="290">13</text><text x="241.6" y="290">1.28M</text><text x="331.9" y="290">128</text></g>
<g text-anchor="middle" font-size="7.5" font-weight="700" letter-spacing=".7" fill="#86868B"><text x="61.1" y="310">SESSIONS</text><text x="151.4" y="310">DAY STREAK</text><text x="241.6" y="310">KG LIFTED</text><text x="331.9" y="310">FOLLOWERS</text></g>

<!-- identity -->
<g filter="url(#fc)"><rect x="16" y="332" width="361" height="198" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="332.5" width="360" height="197" rx="27.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="364" font-size="13" font-weight="500" fill="#98989F">Name</text>
<text x="341" y="364" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF" text-anchor="end">Alex Rivera</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,359)"/>
<line x1="36" y1="384" x2="357" y2="384" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="416" font-size="13" font-weight="500" fill="#98989F">Username</text>
<text x="341" y="416" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF" text-anchor="end">@alexr</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,411)"/>
<line x1="36" y1="436" x2="357" y2="436" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="464" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">BIO</text>
<text x="357" y="464" font-size="9" font-weight="500" letter-spacing=".2" fill="#6C6C70" text-anchor="end">68 / 160</text>
<text x="36" y="490" font-size="13" font-weight="500" fill="#E5E5EA">Push / Pull / Legs, five days a week.</text>
<text x="36" y="509" font-size="13" font-weight="500" fill="#E5E5EA">Chasing a 2× bodyweight bench.</text>

<!-- goals -->
<text x="24" y="560" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">GOALS</text>
<g filter="url(#fc)"><rect x="16" y="572" width="361" height="312" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="572.5" width="360" height="311" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="602" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Daily Rings</text>
<text x="357" y="602" font-size="10.5" font-weight="500" fill="#6C6C70" text-anchor="end">Synced to Apple Watch</text>
<g><circle cx="42" cy="644" r="5" fill="#FF2D55"/><circle cx="42" cy="696" r="5" fill="#A6FF00"/><circle cx="42" cy="748" r="5" fill="#00D9E9"/></g>
<g font-size="13.5" font-weight="500" fill="#F5F5F7"><text x="58" y="649">Move</text><text x="58" y="701">Exercise</text><text x="58" y="753">Stand</text></g>
<g font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF" text-anchor="end"><text x="341" y="649">650 kcal</text><text x="341" y="701">60 min</text><text x="341" y="753">12 hr</text></g>
<g><use xlink:href="#ch" href="#ch" transform="translate(359,644)"/><use xlink:href="#ch" href="#ch" transform="translate(359,696)"/><use xlink:href="#ch" href="#ch" transform="translate(359,748)"/></g>
<g stroke="#FFF" stroke-opacity=".06"><line x1="36" y1="670" x2="357" y2="670"/><line x1="36" y1="722" x2="357" y2="722"/></g>
<line x1="36" y1="782" x2="357" y2="782" stroke="#FFF" stroke-opacity=".08"/>
<text x="36" y="808" font-size="13.5" font-weight="500" fill="#F5F5F7">Weekly volume goal</text>
<text x="357" y="808" font-size="13.5" font-weight="700" letter-spacing="-.25" fill="#FFF" text-anchor="end">35,000 kg</text>
<rect x="36" y="824" width="321" height="6" rx="3" fill="#FFF" fill-opacity=".09"/>
<rect x="36" y="824" width="160.5" height="6" rx="3" fill="url(#br)"/>
<rect x="188.4" y="820" width="2" height="14" rx="1" fill="#FFF" fill-opacity=".55"/>
<g filter="url(#ft2)"><circle cx="196.5" cy="827" r="13" fill="#FFF"/></g>
<circle cx="196.5" cy="827" r="13" fill="none" stroke="#000" stroke-opacity=".08" stroke-width=".8"/>
<circle cx="196.5" cy="827" r="4.5" fill="url(#br)"/>
<g font-size="9" font-weight="600" fill="#6C6C70"><text x="36" y="852">20k</text><text x="357" y="852" text-anchor="end">50k</text></g>
<text x="196.5" y="870" font-size="10" font-weight="500" fill="#86868B" text-anchor="middle">This week 34,340 kg · 98% of goal</text>

<!-- units -->
<text x="24" y="914" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">UNITS &amp; MEASUREMENT</text>
<g filter="url(#fc)"><rect x="16" y="926" width="361" height="186" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="926.5" width="360" height="185" rx="29.5" fill="none" stroke="url(#ce)"/>
<g font-size="13.5" font-weight="500" fill="#F5F5F7"><text x="36" y="966">Weight</text><text x="36" y="1022">Distance</text><text x="36" y="1078">Height</text></g>
<g fill="#FFF" fill-opacity=".06"><rect x="237" y="946" width="120" height="28" rx="14"/><rect x="237" y="1002" width="120" height="28" rx="14"/><rect x="237" y="1058" width="120" height="28" rx="14"/></g>
<g filter="url(#ft2)"><rect x="239" y="948" width="56" height="24" rx="12" fill="#FFF" fill-opacity=".14"/><rect x="239" y="1004" width="56" height="24" rx="12" fill="#FFF" fill-opacity=".14"/><rect x="239" y="1060" width="56" height="24" rx="12" fill="#FFF" fill-opacity=".14"/></g>
<g font-size="11.5" font-weight="600" letter-spacing="-.15" text-anchor="middle"><text x="267" y="964.5" fill="#FFF">kg</text><text x="329" y="964.5" fill="#8E8E93">lb</text><text x="267" y="1020.5" fill="#FFF">km</text><text x="329" y="1020.5" fill="#8E8E93">mi</text><text x="267" y="1076.5" fill="#FFF">cm</text><text x="329" y="1076.5" fill="#8E8E93">ft</text></g>
<g stroke="#FFF" stroke-opacity=".06"><line x1="36" y1="988" x2="357" y2="988"/><line x1="36" y1="1044" x2="357" y2="1044"/></g>
<text x="36" y="1100" font-size="10" font-weight="500" fill="#6C6C70">Bodyweight 80.6 kg · used in every strength ratio</text>

<!-- privacy -->
<text x="24" y="1142" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">PRIVACY &amp; SOCIAL</text>
<g filter="url(#fc)"><rect x="16" y="1154" width="361" height="380" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="1154.5" width="360" height="379" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="1188" font-size="13.5" font-weight="500" fill="#F5F5F7">Profile visibility</text>
<rect x="196" y="1168" width="161" height="28" rx="14" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="251.7" y="1170" width="49.7" height="24" rx="12" fill="#FFF" fill-opacity=".14"/></g>
<g font-size="11" font-weight="600" letter-spacing="-.15" text-anchor="middle"><text x="222.8" y="1186.5" fill="#8E8E93">Public</text><text x="276.5" y="1186.5" fill="#FFF">Friends</text><text x="330.2" y="1186.5" fill="#8E8E93">Private</text></g>
<g stroke="#FFF" stroke-opacity=".06"><line x1="36" y1="1210" x2="357" y2="1210"/><line x1="36" y1="1262" x2="357" y2="1262"/><line x1="36" y1="1314" x2="357" y2="1314"/><line x1="36" y1="1366" x2="357" y2="1366"/><line x1="36" y1="1418" x2="357" y2="1418"/><line x1="36" y1="1470" x2="357" y2="1470"/></g>
<g font-size="13.5" font-weight="500"><text x="36" y="1241" fill="#F5F5F7">Share sessions to feed</text><text x="36" y="1293" fill="#F5F5F7">Appear on leaderboards</text><text x="36" y="1345" fill="#F5F5F7">Show personal records</text><text x="36" y="1397" fill="#F5F5F7">Allow comments</text><text x="36" y="1449" fill="#86868B">Show heart-rate data</text></g>
<g fill="#30D158"><rect x="313" y="1223" width="44" height="26" rx="13"/><rect x="313" y="1275" width="44" height="26" rx="13"/><rect x="313" y="1327" width="44" height="26" rx="13"/><rect x="313" y="1379" width="44" height="26" rx="13"/></g>
<rect x="313" y="1431" width="44" height="26" rx="13" fill="#FFF" fill-opacity=".14"/>
<g filter="url(#ft2)"><circle cx="344" cy="1236" r="11" fill="#FFF"/><circle cx="344" cy="1288" r="11" fill="#FFF"/><circle cx="344" cy="1340" r="11" fill="#FFF"/><circle cx="344" cy="1392" r="11" fill="#FFF"/><circle cx="324" cy="1444" r="11" fill="#FFF"/></g>
<text x="36" y="1501" font-size="13.5" font-weight="500" fill="#F5F5F7">Blocked accounts</text>
<text x="341" y="1501" font-size="13" font-weight="500" fill="#86868B" text-anchor="end">None</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1496)"/>

<!-- connected -->
<text x="24" y="1564" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">CONNECTED</text>
<g filter="url(#fc)"><rect x="16" y="1576" width="361" height="112" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="1576.5" width="360" height="111" rx="27.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="1588" width="32" height="32" rx="11" fill="#FF2D55" fill-opacity=".15"/>
<use xlink:href="#hlth" href="#hlth" transform="translate(48,1604) scale(.72)" fill="#FF6A88"/>
<text x="76" y="1600" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">Apple Health</text>
<text x="76" y="1618" font-size="10.5" font-weight="500" fill="#86868B">Workouts · Heart rate · Steps</text>
<text x="341" y="1608" font-size="12" font-weight="600" letter-spacing="-.15" fill="#30D158" text-anchor="end">Connected</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1604)"/>
<line x1="36" y1="1632" x2="357" y2="1632" stroke="#FFF" stroke-opacity=".06"/>
<rect x="32" y="1644" width="32" height="32" rx="11" fill="#00D9E9" fill-opacity=".15"/>
<use xlink:href="#wtch" href="#wtch" transform="translate(48,1660) scale(.82)" color="#5EDCF0"/>
<text x="76" y="1656" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">Apple Watch</text>
<text x="76" y="1674" font-size="10.5" font-weight="500" fill="#86868B">Rings sync every 5 minutes</text>
<text x="341" y="1664" font-size="12" font-weight="600" letter-spacing="-.15" fill="#98989F" text-anchor="end">Series 9</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1660)"/>

<!-- danger zone -->
<rect x="16" y="1700" width="361" height="48" rx="24" fill="#FF3B30" fill-opacity=".10" stroke="#FF3B30" stroke-opacity=".22" stroke-width="1"/>
<text x="196.5" y="1730" font-size="14.5" font-weight="600" letter-spacing="-.25" fill="#FF6B60" text-anchor="middle">Log Out</text>
<text x="196.5" y="1776" font-size="12.5" font-weight="500" letter-spacing="-.15" fill="#6C6C70" text-anchor="middle">Delete Account</text>
<text x="196.5" y="1806" font-size="10" font-weight="500" letter-spacing=".2" fill="#48484A" text-anchor="middle">Kinetic 1.0 (238)</text>
<rect x="140.5" y="1834" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1853" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## Verification log

| Claim | Computation | Result |
|---|---|---|
| Post age on Feed | 10:52 − 10:31 | **21m** ✓ |
| Now-line monotonic | 9:41→10:19→10:26→10:29→10:31→10:34→10:36→10:38→10:42→10:44→10:46→10:52→10:54→10:56 | **strictly increasing, no collision** ✓ |
| Kudos on your post | Mia, Jon, Sofia, Dev, Lena, Tom | **6** = Session Detail ✓ |
| Kudos stack | M, J, S + "+3" | **6** — identical to Session Detail ✓ |
| "3 comments" | Mia, Jon, Sofia top-level | **3** ✓ (Alex's reply is nested, not counted) |
| Jon's comment "18%" | (34,340−29,100)/29,100 | **18.007 → 18%** ✓ |
| Reply warm-ups | 20 → 40 → 50 → 60 × 10 working | **all below the PR weight** ✓ |
| Mia reps/set | 168 / 22 | **7.6** ✓ plausible |
| Mia kg/set | 7,860 / 22 | **357** ✓ |
| Mia squat e1RM | 125 × 1.16667 | **145.83 → 145.8** ✓ |
| Sofia reps/set | 144 / 18 | **8.0** ✓ |
| Sofia kg/set | 6,240 / 18 | **347** ✓ |
| Sofia deadlift e1RM | 160 × 1.1 | **176.0** ✓ |
| Feed poster stats shown | Duration + Sets only | matches **ON** toggles (Volume, Duration, Sets, PRs) ✓ |
| Composer preview | identical 4 elements | matches Feed poster pixel-for-pixel ✓ |
| "4 of 8 shown" | Volume, Duration, Sets, PRs ON | **4** ✓ |
| "4 stats hidden" | Reps, Heart rate, Notes, RPE | **4** ✓ |
| Heart rate OFF ⇄ privacy | Profile → "Show heart-rate data" = OFF | **consistent** ✓ |
| Composer char count | 32 + 1 + 29 | **62 / 280** ✓ |
| Bio char count | 37 + 1 + 30 | **68 / 160** ✓ |
| Ring goals | Move 650 / Exercise 60 / Stand 12 | **identical to home rings** ✓ |
| Weekly volume goal | 34,340 / 35,000 | **98.1 → 98%** ✓ |
| Goal slider thumb | (35,000−20,000)/30,000 × 321 | **160.5 → x=196.5** (exact centre) ✓ |
| "Now" marker | (34,340−20,000)/30,000 × 321 + 36 | **189.4** ✓ |
| Challenge bar | 10,340 / 12,480 × 200 | **165.7 pt** ✓ |
| Ranks | 12,480 > 11,920 > 10,340 | **#1 #2 #3** ✓ home |
| Audience arithmetic | Friends 84 ≤ Following 112 ≤ Followers 128 | **valid** ✓ |
| Bio goal feasibility | 2 × 80.6 = 161.2 vs e1RM 119.6 | **aspirational, not false** ✓ |
| Lifetime volume | 1,284,600 / 214 sessions | **6,003 kg avg** ✓ plausible |
| Send button state | field empty | **50% opacity = disabled** ✓ |
| Chip widths | text + 42 (icon 12 + gap 6 + pads 24) | all 8 verified ✓ |
| Poster pill widths | chars × 5.4 + 20 at 8pt/700/ls .6 | all verified ≤ inner right ✓ |

---

## New components introduced

| Component | Screen | Design note |
|---|---|---|
| **Challenge banner with rank + progress** | Feed | Your position in the leaderboard rendered as a *fraction of the leader*, not of 100%. |
| **Filter chip row with overflow** | Feed | Last chip bleeds past the canvas edge — the horizontal-scroll tell. |
| **Share poster (3 themes)** | Feed/Detail/Composer | Ember, Aurora, Slate. Identical internal grid so the format is recognisable regardless of skin. |
| **Milestone hero variant** | Feed | Same 190pt media slot, gold medallion instead of a stat block — card heights stay uniform at 388. |
| **`YOU` / `AUTHOR` / `MILESTONE` badges** | Feed/Detail | Identity context without a second line of copy. |
| **Kudos avatar stack with `+N` cap** | Feed/Detail | Always 3 faces + overflow; knockout stroke matches the *card*, not the page. |
| **Tri-split action bar** | Feed | Equal thirds at x = 76.2 / 196.5 / 316.8 — the same rhythm as every 4-cell strip in the app. |
| **Nested reply with rounded elbow connector** | Detail | `M38 660 V682 Q38 688 44 688 H52` — 1.6pt at 14% white. Indentation is drawn, not implied. |
| **Kudo'd vs. un-kudo'd heart** | Detail | Jon's is filled `#FF2D55` with the count in `#FF6A88`; others are outlined grey. State is legible without colour alone (weight changes too). |
| **Sticky comment bar with disabled send** | Detail | Material-backed, hairline top, 50%-opacity send. |
| **Card-style picker with selection ring + check badge** | Composer | Ring is inset −3.5pt so it never touches the swatch corner. |
| **Stat toggle chips (ON/OFF)** | Composer | Green check = on, hollow ring = off. Drives the preview *and* the "4 stats hidden" caption. |
| **Live preview with pulsing LIVE dot** | Composer | The preview is byte-identical to what appears in the Feed — the whole point of the screen. |
| **Tag chips with avatar + dismiss** | Composer | Dashed `+ Add` chip distinguishes action from entity. |
| **Ring-goal editor rows with colour dots** | Profile | The three dots are the *exact* home-ring hues — the goals screen and the rings screen are visibly the same system. |
| **Slider with a "now" marker** | Profile | Thumb = the setting; white tick = reality. Two values, one control, no ambiguity. |
| **Inline segmented units control** | Profile | 120pt track, 56pt thumb, 14pt radius inside a 14pt radius — concentric. |
| **Privacy toggles incl. one OFF state** | Profile | Four ON, one OFF, so the OFF styling is specified rather than assumed. |
| **Connected-sources rows** | Profile | Status text is semantic-coloured (`Connected` green) not decorative. |

---

## Light mode

Geometry identical. Delta for the new components:

| Element | Dark | Light |
|---|---|---|
| Post card / all surfaces | `#1F1F23→#131316` | `#FFFFFF→#FAFAFC`, edge `#000` .045→.115 |
| Avatar knockout stroke | `#17171A` | `#FFFFFF` |
| Poster themes | Ember / Aurora / Slate as drawn | **unchanged** — posters are images, they do not theme |
| Poster inner text | white @ .62–.88 | **unchanged** |
| Body copy | `#E5E5EA` | `#1C1C1E` |
| Meta / timestamps | `#86868B` | `#8E8E93` |
| Action-bar pills | white .06 | `#787880` @ .12 |
| Outline heart / bubble / share | `#98989F` | `#6E6E73` |
| Kudo'd heart | `#FF2D55` | `#D70015` |
| Reply elbow | white .14 | `#3C3C43` @ .20 |
| ON chip | `#30D158` @ .14 / text `#4ADE80` | `#34C759` @ .16 / text `#248A3D` |
| OFF chip | white .06 / `#8E8E93` | `#787880` @ .12 / `#6E6E73` |
| Selected swatch ring | brand gradient | brand (deepened `#FF9500→#D70015`) |
| Slider thumb shadow | black .55 | `0 1 3 rgba(0,0,0,.28)` + `0 0 0 .5 rgba(0,0,0,.06)` |
| Toggles ON / OFF | `#30D158` / white .14 | `#34C759` / `#787880` @ .20 |
| Segmented thumb | white .13–.14 | `#FFFFFF` + shadow `0 1 3 rgba(0,0,0,.18)` |
| Gold milestone hero | text `#2B1E00` / `#5C4300` / `#7A5A00` | **unchanged** |
| Destructive ghost | `#FF3B30` @ .10 / `#FF6B60` | `#FF3B30` @ .10 / **`#D70015`** |
| Nav text buttons | `#FF9F0A` / `#8E8E93` | **`#007AFF`** (iOS light convention) |
| Comment bar material | `#15151A` @ .94 | `#FBFBFD` @ .93, hairline `#3C3C43` @ .16 |

---

**Where this leaves the build:** 5 phases, 19 screens, one unbroken dataset — every figure traceable to the contract, three rounds of continuity patches caught and specified.

**Next options:** (a) the full light-mode set for Phases 2–5, (b) **Phase 6 — Profile tab + Settings + Onboarding**, or (c) the **interactive component kit** (buttons ×5 ×3, toggles, steppers, sliders, fields with focus/error, skeletons, toasts, sheets, empty states) in both themes as the implementation reference. Which one?