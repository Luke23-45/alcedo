# KINETIC — Workout Flow · Complete Screen Set
### Dark mode · Spec-first · All numbers verified against a single data contract

---

## ⚠️ First: three continuity patches to the delivered home page

Law III (numbers are real or they are lies) caught three contradictions between the home mock and this flow. Patch these before implementing:

| Location | Was | Must be | Reason |
|---|---|---|---|
| Status bar clock | `9:41` | **`10:31`** | Home is rendered *post-session*. Session ran 9:41–10:26 AM. |
| Today's Session card | `12 exercises` | **`6 exercises`** | 12 exercises × 19 sets cannot fit in 45 min. Plan is 6 exercises / 19 sets. |
| Streak pill | `12` | **`13`** | Completing this session increments the streak. Summary screen shows 13. |

Everything else on home already reconciles: `8,420 kg` volume, `45 min`, `380 kcal`, Exercise ring `42/60` (= 33:40 active + 8:20 morning walk), Bench PR `102.5 kg` set **June 2** (today's top set is 100 kg — deliberately *not* a PR).

---

## 📐 DATA CONTRACT — single source of truth

```
SESSION S-0609-A · "Push Day · Strength" · Intermediate · Week 3 of 6
Start 9:41 AM   End 10:26 AM   Elapsed 45:12   Active 33:40   Rest 11:32

 1  Barbell Bench Press     4 × 5  @ 100 kg    = 2,000 kg   (top set; PR is 102.5 from Jun 2)
 2  Incline DB Press        3 × 8  @ 34 kg ea  = 1,632 kg   (34 × 2 × 8 × 3)
 3  Seated Shoulder Press   3 × 10 @ 60 kg     = 1,800 kg   ← PR (prev 57.5)
 4  Cable Crossover         3 × 12 @ 25 kg     =   900 kg
 5  Triceps Rope Pushdown   3 × 15 @ 20 kg     =   900 kg
 6  Pec Deck Fly            3 × 12 @ 33 kg     = 1,188 kg
                                       TOTAL   = 8,420 kg ✓
 Sets 19   Reps 191   Calories 380 (est)   Avg HR 128   Max HR 164   RPE 7.5

MID-SESSION CAPTURE (Active screen, clock 10:19, elapsed 38:24)
 Exercises 1–4 complete + Ex5 Set 1 = 14 / 19 sets
 Volume 2,000+1,632+1,800+900+300 = 6,632 kg   Reps 20+24+30+36+15 = 125
 Rest timer: 00:42 remaining of 01:00 (isolation prescription)

VS PREVIOUS PUSH DAY (Jun 2, 6 days ago)
 Volume   7,650 → 8,420 kg   +770   +10.1%
 Sets     17    → 19         +2
 Top set  102.5 → 100 kg     −2.5   −2.4%
 Duration 43:20 → 45:12      +1:52

BENCH HISTORY (chart, 8 sessions)
 Apr 21: 90 · Apr 28: 90 · May 5: 92.5 · May 13: 92.5
 May 20: 95 · May 27: 97.5 · Jun 2: 102.5 (PR) · Jun 9: 100
 90 → 100 kg = +11.1%   E1RM(102.5 × 5) = 102.5 × (1 + 5/30) = 119.6 kg
```

---

## 1 · ACTIVE SESSION — 393 × 852

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="852" viewBox="0 0 393 852" role="img" aria-labelledby="t1" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility">
<title id="t1">Kinetic — Active Session (rest running)</title>
<defs>
  <clipPath id="fr"><rect width="393" height="852" rx="54.5"/></clipPath>
  <clipPath id="sc"><rect width="393" height="650"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="a1" gradientUnits="userSpaceOnUse" cx="60" cy="150" r="300"><stop offset="0" stop-color="#FF2D55" stop-opacity=".20"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <radialGradient id="a2" gradientUnits="userSpaceOnUse" cx="370" cy="480" r="280"><stop offset="0" stop-color="#0A84FF" stop-opacity=".11"/><stop offset="1" stop-color="#0A84FF" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="rs" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#009DFF"/><stop offset="1" stop-color="#2CE9F7"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <linearGradient id="fd" gradientUnits="userSpaceOnUse" x1="0" y1="606" x2="0" y2="650"><stop offset="0" stop-color="#050507" stop-opacity="0"/><stop offset="1" stop-color="#050507" stop-opacity=".92"/></linearGradient>
  <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15151A" stop-opacity=".94"/><stop offset="1" stop-color="#0C0C10" stop-opacity=".99"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="fr2" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#00D9E9" flood-opacity=".5"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <g id="db"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
  <path id="ck" d="M-4.2 0.4 L-1.3 3.4 L4.6 -3.2" fill="none" stroke="#FFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="dn" d="M-5 -2.5 L0 2.5 L5 -2.5" fill="none" stroke="#8E8E93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="852" fill="url(#bg)"/><rect width="393" height="852" fill="url(#a1)"/><rect width="393" height="852" fill="url(#a2)"/>

<!-- status bar · 10:19 = 9:41 start + 38:24 elapsed -->
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:19</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="13" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>

<!-- nav -->
<g transform="translate(28,76)" filter="url(#fs)"><use xlink:href="#dn" href="#dn"/></g>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Push Day · Strength</text>
<g fill="#8E8E93"><circle cx="359" cy="76" r="2"/><circle cx="366" cy="76" r="2"/><circle cx="373" cy="76" r="2"/></g>

<g clip-path="url(#sc)">
<!-- ELAPSED -->
<g filter="url(#fc)"><rect x="16" y="104" width="361" height="102" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="104.5" width="360" height="101" rx="27.5" fill="none" stroke="url(#ce)"/>
<rect x="317" y="118" width="44" height="20" rx="10" fill="#FF3B30" fill-opacity=".16"/>
<circle cx="328" cy="128" r="3" fill="#FF453A"><animate attributeName="opacity" values="1;.25;1" dur="1.6s" repeatCount="indefinite"/></circle>
<text x="337" y="132" font-size="9" font-weight="700" letter-spacing=".7" fill="#FF6B60">LIVE</text>
<text x="180" y="134" font-size="9" font-weight="700" letter-spacing="1.3" fill="#86868B" text-anchor="middle">ELAPSED</text>
<text x="196.5" y="182" font-size="42" font-weight="700" letter-spacing="-1.6" fill="#FFF" text-anchor="middle">38:24</text>

<!-- STAT STRIP -->
<g filter="url(#fc)"><rect x="16" y="218" width="361" height="68" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="218.5" width="360" height="67" rx="23.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".08"><line x1="106.25" y1="232" x2="106.25" y2="272"/><line x1="196.5" y1="232" x2="196.5" y2="272"/><line x1="286.75" y1="232" x2="286.75" y2="272"/></g>
<g text-anchor="middle"><g font-size="16" font-weight="700" letter-spacing="-.4" fill="#FFF">
  <text x="61.1" y="250">14<tspan font-size="12" font-weight="600" fill="#6C6C70">/19</tspan></text>
  <text x="151.4" y="250">6,632</text><text x="241.6" y="250">125</text><text x="331.9" y="250">128</text></g>
 <g font-size="8" font-weight="700" letter-spacing=".8" fill="#86868B">
  <text x="61.1" y="268">SETS</text><text x="151.4" y="268">VOLUME KG</text><text x="241.6" y="268">REPS</text><text x="331.9" y="268">AVG BPM</text></g></g>

<!-- EXERCISES -->
<text x="24" y="316" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">EXERCISES</text>
<text x="369" y="316" font-size="10" font-weight="600" letter-spacing=".2" fill="#6C6C70" text-anchor="end">5 of 6</text>

<!-- card 4 · Cable Crossover · complete -->
<g filter="url(#fc)"><rect x="16" y="326" width="361" height="190" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="326.5" width="360" height="189" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="339" width="22" height="22" rx="7" fill="#FFF" fill-opacity=".07"/>
<text x="41" y="354" font-size="10" font-weight="700" fill="#8E8E93" text-anchor="middle">4</text>
<text x="62" y="356" font-size="14.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Cable Crossover</text>
<rect x="270" y="340" width="93" height="20" rx="10" fill="#30D158" fill-opacity=".13"/>
<text x="316.5" y="354" font-size="9.5" font-weight="700" letter-spacing=".3" fill="#4ADE80" text-anchor="middle">3 × 12 · DONE</text>
<line x1="30" y1="372" x2="363" y2="372" stroke="#FFF" stroke-opacity=".06"/>
<g font-size="14" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">
  <text x="62" y="395">25 kg</text><text x="62" y="427">25 kg</text><text x="62" y="459">25 kg</text></g>
<g font-size="14" font-weight="600" fill="#F5F5F7"><text x="140" y="395">× 12</text><text x="140" y="427">× 12</text><text x="140" y="459">× 12</text></g>
<g font-size="10.5" font-weight="500" fill="#6C6C70"><text x="205" y="395">prev 12 · 22.5</text><text x="205" y="427">prev 12 · 22.5</text><text x="205" y="459">prev 12 · 22.5</text></g>
<g fill="#30D158"><circle cx="352" cy="390" r="11"/><circle cx="352" cy="422" r="11"/><circle cx="352" cy="454" r="11"/></g>
<g><use xlink:href="#ck" href="#ck" transform="translate(352,390) scale(.82)"/><use xlink:href="#ck" href="#ck" transform="translate(352,422) scale(.82)"/><use xlink:href="#ck" href="#ck" transform="translate(352,454) scale(.82)"/></g>
<g fill="#30D158" opacity=".9"><rect x="30" y="379" width="22" height="22" rx="7" fill-opacity=".14"/><rect x="30" y="411" width="22" height="22" rx="7" fill-opacity=".14"/><rect x="30" y="443" width="22" height="22" rx="7" fill-opacity=".14"/></g>
<g font-size="10" font-weight="700" fill="#4ADE80" text-anchor="middle"><text x="41" y="394">1</text><text x="41" y="426">2</text><text x="41" y="458">3</text></g>
<g><rect x="36" y="487.5" width="11" height="2.4" rx="1.2" fill="#8E8E93"/><rect x="40.3" y="483.2" width="2.4" height="11" rx="1.2" fill="#8E8E93"/></g>
<text x="56" y="492" font-size="11.5" font-weight="600" fill="#98989F">Add Set</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,488)"/>

<!-- card 5 · Triceps Rope Pushdown · in progress -->
<g filter="url(#fc)"><rect x="16" y="528" width="361" height="190" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="528.5" width="360" height="189" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="541" width="22" height="22" rx="7" fill="#FFF" fill-opacity=".07"/>
<text x="41" y="556" font-size="10" font-weight="700" fill="#8E8E93" text-anchor="middle">5</text>
<text x="62" y="558" font-size="14.5" font-weight="600" letter-spacing="-.2" fill="#FFF">Triceps Rope Pushdown</text>
<rect x="284" y="542" width="79" height="20" rx="10" fill="#FF2D55" fill-opacity=".15"/>
<text x="323.5" y="556" font-size="9.5" font-weight="700" letter-spacing=".3" fill="#FF6A88" text-anchor="middle">3 × 15 · 20</text>
<line x1="30" y1="574" x2="363" y2="574" stroke="#FFF" stroke-opacity=".06"/>
<!-- set 1 done -->
<rect x="30" y="581" width="22" height="22" rx="7" fill="#30D158" fill-opacity=".14"/>
<text x="41" y="596" font-size="10" font-weight="700" fill="#4ADE80" text-anchor="middle">1</text>
<text x="62" y="597" font-size="14" font-weight="600" fill="#F5F5F7">20 kg</text><text x="140" y="597" font-size="14" font-weight="600" fill="#F5F5F7">× 15</text>
<text x="205" y="597" font-size="10.5" font-weight="500" fill="#6C6C70">prev 15 · 20</text>
<circle cx="352" cy="592" r="11" fill="#30D158"/><use xlink:href="#ck" href="#ck" transform="translate(352,592) scale(.82)"/>
<!-- set 2 current -->
<rect x="30" y="613" width="22" height="22" rx="7" fill="#FF2D55" fill-opacity=".16"/>
<text x="41" y="628" font-size="10" font-weight="700" fill="#FF6A88" text-anchor="middle">2</text>
<text x="62" y="629" font-size="14" font-weight="700" fill="#FFF">20 kg</text><text x="140" y="629" font-size="14" font-weight="700" fill="#FFF">× 15</text>
<text x="205" y="629" font-size="10.5" font-weight="500" fill="#98989F">target 15</text>
<g filter="url(#fb)"><circle cx="352" cy="624" r="11" fill="#FF2D55" fill-opacity=".18" stroke="#FF375F" stroke-width="2.2"/></g>
<circle cx="352" cy="624" r="4" fill="#FF375F"><animate attributeName="opacity" values="1;.4;1" dur="1.8s" repeatCount="indefinite"/></circle>
<!-- set 3 upcoming -->
<rect x="30" y="645" width="22" height="22" rx="7" fill="#FFF" fill-opacity=".05"/>
<text x="41" y="660" font-size="10" font-weight="700" fill="#48484A" text-anchor="middle">3</text>
<text x="62" y="661" font-size="14" font-weight="600" fill="#6C6C70">20 kg</text><text x="140" y="661" font-size="14" font-weight="600" fill="#6C6C70">× 15</text>
<circle cx="352" cy="656" r="11" fill="none" stroke="#FFF" stroke-opacity=".14" stroke-width="1.6"/>

<rect x="0" y="606" width="393" height="44" fill="url(#fd)"/>
</g>

<!-- STICKY FOOTER -->
<rect x="0" y="650" width="393" height="202" fill="url(#tb)"/>
<line x1="0" y1="650.5" x2="393" y2="650.5" stroke="#FFF" stroke-opacity=".11"/>
<!-- rest timer · RUNNING · 42s of 60s = 70% remaining, C(26)=163.36 → 114.35 -->
<g filter="url(#fc)"><rect x="16" y="664" width="361" height="88" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="664.5" width="360" height="87" rx="25.5" fill="none" stroke="url(#ce)"/>
<g filter="url(#fr2)">
  <circle cx="60" cy="708" r="26" fill="none" stroke="#00D9E9" stroke-opacity=".16" stroke-width="7"/>
  <circle cx="60" cy="708" r="26" fill="none" stroke="url(#rs)" stroke-width="7" stroke-linecap="round" stroke-dasharray="114.35 163.36" transform="rotate(-90 60 708)"/>
</g>
<text x="60" y="713" font-size="13" font-weight="700" letter-spacing="-.4" fill="#FFF" text-anchor="middle">42</text>
<text x="102" y="697" font-size="9" font-weight="700" letter-spacing="1.3" fill="#86868B">REST · 60S PRESCRIBED</text>
<text x="102" y="726" font-size="26" font-weight="700" letter-spacing="-.9" fill="#FFF">00:42</text>
<circle cx="234" cy="709" r="15" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"/>
<text x="234" y="713" font-size="9.5" font-weight="700" fill="#C7C7CC" text-anchor="middle">−15</text>
<circle cx="272" cy="709" r="15" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"/>
<text x="272" y="713" font-size="9.5" font-weight="700" fill="#C7C7CC" text-anchor="middle">+15</text>
<rect x="299" y="694" width="64" height="30" rx="15" fill="#FFF" fill-opacity=".10" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<text x="331" y="713.5" font-size="12" font-weight="600" letter-spacing="-.15" fill="#F5F5F7" text-anchor="middle">Skip</text>
<!-- finish -->
<g filter="url(#fb)"><rect x="16" y="764" width="361" height="54" rx="27" fill="url(#br)"/></g>
<rect x="16" y="764" width="361" height="27" rx="27" fill="url(#gl)" opacity=".35"/>
<rect x="16.5" y="764.5" width="360" height="53" rx="26.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="196.5" y="797" font-size="16" font-weight="650" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Finish Workout</text>
<rect x="140.5" y="838" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="850.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

---

## 2 · ACTIVE SESSION — EMPTY STATE · 393 × 852

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="852" viewBox="0 0 393 852" role="img" aria-labelledby="t2" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility">
<title id="t2">Kinetic — Active Session, empty state</title>
<defs>
  <clipPath id="fr"><rect width="393" height="852" rx="54.5"/></clipPath>
  <clipPath id="sc"><rect width="393" height="650"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="a1" gradientUnits="userSpaceOnUse" cx="196" cy="430" r="260"><stop offset="0" stop-color="#FF2D55" stop-opacity=".13"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <linearGradient id="fd" gradientUnits="userSpaceOnUse" x1="0" y1="606" x2="0" y2="650"><stop offset="0" stop-color="#050507" stop-opacity="0"/><stop offset="1" stop-color="#050507" stop-opacity=".92"/></linearGradient>
  <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15151A" stop-opacity=".94"/><stop offset="1" stop-color="#0C0C10" stop-opacity=".99"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <g id="db"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
  <path id="dn" d="M-5 -2.5 L0 2.5 L5 -2.5" fill="none" stroke="#8E8E93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="852" fill="url(#bg)"/><rect width="393" height="852" fill="url(#a1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">9:41</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="19" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>

<g transform="translate(28,76)" filter="url(#fs)"><use xlink:href="#dn" href="#dn"/></g>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Free Session</text>
<g fill="#8E8E93"><circle cx="359" cy="76" r="2"/><circle cx="366" cy="76" r="2"/><circle cx="373" cy="76" r="2"/></g>

<g clip-path="url(#sc)">
<g filter="url(#fc)"><rect x="16" y="104" width="361" height="102" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="104.5" width="360" height="101" rx="27.5" fill="none" stroke="url(#ce)"/>
<rect x="317" y="118" width="44" height="20" rx="10" fill="#FF3B30" fill-opacity=".16"/>
<circle cx="328" cy="128" r="3" fill="#FF453A"><animate attributeName="opacity" values="1;.25;1" dur="1.6s" repeatCount="indefinite"/></circle>
<text x="337" y="132" font-size="9" font-weight="700" letter-spacing=".7" fill="#FF6B60">LIVE</text>
<text x="180" y="134" font-size="9" font-weight="700" letter-spacing="1.3" fill="#86868B" text-anchor="middle">ELAPSED</text>
<text x="196.5" y="182" font-size="42" font-weight="700" letter-spacing="-1.6" fill="#FFF" text-anchor="middle">00:00</text>

<g filter="url(#fc)"><rect x="16" y="218" width="361" height="68" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="218.5" width="360" height="67" rx="23.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".08"><line x1="106.25" y1="232" x2="106.25" y2="272"/><line x1="196.5" y1="232" x2="196.5" y2="272"/><line x1="286.75" y1="232" x2="286.75" y2="272"/></g>
<g text-anchor="middle" font-size="16" font-weight="700" letter-spacing="-.4" fill="#48484A">
  <text x="61.1" y="250">0</text><text x="151.4" y="250">0</text><text x="241.6" y="250">0</text><text x="331.9" y="250">—</text></g>
<g text-anchor="middle" font-size="8" font-weight="700" letter-spacing=".8" fill="#6C6C70">
  <text x="61.1" y="268">SETS</text><text x="151.4" y="268">VOLUME KG</text><text x="241.6" y="268">REPS</text><text x="331.9" y="268">AVG BPM</text></g>

<!-- empty illustration -->
<g transform="translate(196.5,404)">
  <circle r="72" fill="#FFF" fill-opacity=".028"/>
  <circle r="72" fill="none" stroke="#FFF" stroke-opacity=".07" stroke-width="1.4" stroke-dasharray="4 7" stroke-linecap="round"/>
  <circle r="52" fill="#FFF" fill-opacity=".022"/>
  <use xlink:href="#db" href="#db" transform="scale(1.9)" fill="#FFF" fill-opacity=".16"/>
</g>
<text x="196.5" y="510" font-size="19" font-weight="650" letter-spacing="-.4" fill="#F5F5F7" text-anchor="middle">No exercises yet</text>
<text x="196.5" y="534" font-size="12.5" font-weight="500" fill="#86868B" text-anchor="middle">Add your first movement, or start from a plan.</text>
<text x="196.5" y="552" font-size="12.5" font-weight="500" fill="#86868B" text-anchor="middle">The clock is already running.</text>
<g filter="url(#fb)"><rect x="76" y="576" width="241" height="48" rx="24" fill="url(#br)"/></g>
<rect x="76" y="576" width="241" height="24" rx="24" fill="url(#gl)" opacity=".35"/>
<rect x="76.5" y="576.5" width="240" height="47" rx="23.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<g stroke="#FFF" stroke-width="2.2" stroke-linecap="round"><line x1="176" y1="600" x2="192" y2="600"/><line x1="184" y1="592" x2="184" y2="608"/></g>
<text x="204" y="605" font-size="15" font-weight="650" letter-spacing="-.25" fill="#FFF">Add Exercise</text>
<rect x="0" y="606" width="393" height="44" fill="url(#fd)"/>
</g>

<rect x="0" y="650" width="393" height="202" fill="url(#tb)"/>
<line x1="0" y1="650.5" x2="393" y2="650.5" stroke="#FFF" stroke-opacity=".11"/>
<g filter="url(#fc)"><rect x="16" y="664" width="361" height="88" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="664.5" width="360" height="87" rx="25.5" fill="none" stroke="url(#ce)"/>
<circle cx="60" cy="708" r="26" fill="none" stroke="#FFF" stroke-opacity=".08" stroke-width="7"/>
<text x="60" y="713" font-size="12" font-weight="700" letter-spacing="-.3" fill="#48484A" text-anchor="middle">—</text>
<text x="102" y="697" font-size="9" font-weight="700" letter-spacing="1.3" fill="#6C6C70">REST TIMER</text>
<text x="102" y="726" font-size="15" font-weight="600" letter-spacing="-.25" fill="#6C6C70">Starts after your first set</text>
<rect x="299" y="694" width="64" height="30" rx="15" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".06" stroke-width=".8"/>
<text x="331" y="713.5" font-size="12" font-weight="600" letter-spacing="-.15" fill="#48484A" text-anchor="middle">Skip</text>
<rect x="16" y="764" width="361" height="54" rx="27" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".08" stroke-width="1"/>
<text x="196.5" y="797" font-size="16" font-weight="600" letter-spacing="-.3" fill="#48484A" text-anchor="middle">Finish Workout</text>
<text x="196.5" y="832" font-size="10" font-weight="500" fill="#48484A" text-anchor="middle">Log at least one set to finish</text>
<rect x="140.5" y="838" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="850.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

*Note the disabled primary: at zero logged sets, **Finish** drops to `white 7%` fill with `#48484A` label and an explanatory line — never a live button that produces an empty record.*

---

## 3 · REST TIMER STATES — 393 × 252

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="393" height="252" viewBox="0 0 393 252" role="img" aria-labelledby="t3" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Arial,sans-serif">
<title id="t3">Kinetic — Rest timer: paused and complete</title>
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset="1" stop-color="#06060A"/></linearGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="rs" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#009DFF"/><stop offset="1" stop-color="#2CE9F7"/></linearGradient>
  <linearGradient id="go" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7BE000"/><stop offset="1" stop-color="#D6FF52"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fr" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#00D9E9" flood-opacity=".5"/></filter>
  <filter id="fg" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="#A6FF00" flood-opacity=".55"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <path id="pl" d="M-4 -6.4 L6.4 0 L-4 6.4 Z"/>
  <path id="pa" d="M-4.6 -6 H-1.4 V6 H-4.6 Z M1.4 -6 H4.6 V6 H1.4 Z"/>
  <path id="ck" d="M-5 0.4 L-1.6 4 L5.6 -4" fill="none" stroke="#FFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
</defs>
<rect width="393" height="252" fill="url(#bg)"/>
<text x="24" y="34" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">REST TIMER · PAUSED &amp; COMPLETE</text>

<!-- PAUSED -->
<g filter="url(#fc)"><rect x="16" y="48" width="361" height="88" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="48.5" width="360" height="87" rx="25.5" fill="none" stroke="url(#ce)"/>
<g filter="url(#fr)">
  <circle cx="60" cy="92" r="26" fill="none" stroke="#00D9E9" stroke-opacity=".16" stroke-width="7"/>
  <circle cx="60" cy="92" r="26" fill="none" stroke="url(#rs)" stroke-width="7" stroke-linecap="round" stroke-dasharray="114.35 163.36" transform="rotate(-90 60 92)" opacity=".55"/>
</g>
<text x="60" y="97" font-size="13" font-weight="700" letter-spacing="-.4" fill="#FFF" text-anchor="middle" opacity=".6">42</text>
<rect x="102" y="60" width="66" height="20" rx="10" fill="#FF9F0A" fill-opacity=".16"/>
<text x="135" y="74" font-size="9" font-weight="700" letter-spacing=".8" fill="#FFB84D" text-anchor="middle">PAUSED</text>
<text x="102" y="110" font-size="26" font-weight="700" letter-spacing="-.9" fill="#FFF" opacity=".62">00:42</text>
<g filter="url(#fb)"><circle cx="234" cy="93" r="19" fill="url(#br)"/></g>
<use xlink:href="#pl" href="#pl" transform="translate(235.4,93)" fill="#FFF" stroke="#FFF" stroke-width="2.4" stroke-linejoin="round"/>
<circle cx="278" cy="93" r="15" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"/>
<text x="278" y="97" font-size="9.5" font-weight="700" fill="#C7C7CC" text-anchor="middle">+15</text>
<rect x="301" y="78" width="62" height="30" rx="15" fill="#FFF" fill-opacity=".10" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<text x="332" y="97.5" font-size="12" font-weight="600" letter-spacing="-.15" fill="#F5F5F7" text-anchor="middle">Skip</text>

<!-- COMPLETE -->
<g filter="url(#fc)"><rect x="16" y="148" width="361" height="88" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="148.5" width="360" height="87" rx="25.5" fill="none" stroke="url(#ce)"/>
<g filter="url(#fg)"><circle cx="60" cy="192" r="26" fill="none" stroke="url(#go)" stroke-width="7"/></g>
<use xlink:href="#ck" href="#ck" transform="translate(60,192) scale(.9)"/>
<rect x="102" y="160" width="52" height="20" rx="10" fill="#A6FF00" fill-opacity=".16"/>
<text x="128" y="174" font-size="9" font-weight="700" letter-spacing=".8" fill="#C3F53C" text-anchor="middle">READY</text>
<text x="102" y="210" font-size="19" font-weight="650" letter-spacing="-.4" fill="#FFF">Set 3 · Triceps Pushdown</text>
<text x="166" y="174" font-size="10.5" font-weight="500" fill="#86868B">20 kg × 15</text>
<g filter="url(#fb)"><rect x="271" y="177" width="92" height="30" rx="15" fill="url(#br)"/></g>
<rect x="271.5" y="177.5" width="91" height="29" rx="14.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="317" y="196.5" font-size="12" font-weight="650" letter-spacing="-.15" fill="#FFF" text-anchor="middle">Log Set</text>
</svg>
```

---

## 4 · WORKOUT EDITOR — 393 × 852

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="852" viewBox="0 0 393 852" role="img" aria-labelledby="t4" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility">
<title id="t4">Kinetic — Workout Editor</title>
<defs>
  <clipPath id="fr"><rect width="393" height="852" rx="54.5"/></clipPath><clipPath id="sc"><rect width="393" height="692"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="a1" gradientUnits="userSpaceOnUse" cx="70" cy="160" r="290"><stop offset="0" stop-color="#FF9F0A" stop-opacity=".13"/><stop offset="1" stop-color="#FF9F0A" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <linearGradient id="fd" gradientUnits="userSpaceOnUse" x1="0" y1="648" x2="0" y2="692"><stop offset="0" stop-color="#050507" stop-opacity="0"/><stop offset="1" stop-color="#050507" stop-opacity=".94"/></linearGradient>
  <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15151A" stop-opacity=".94"/><stop offset="1" stop-color="#0C0C10" stop-opacity=".99"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="ff" x="-20%" y="-40%" width="140%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#FF6A3D" flood-opacity=".45"/></filter>
  <filter id="fp" x="-40%" y="-60%" width="180%" height="240%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".5"/></filter>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="852" fill="url(#bg)"/><rect width="393" height="852" fill="url(#a1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">9:41</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="19" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>

<text x="24" y="82" font-size="16" font-weight="400" letter-spacing="-.3" fill="#8E8E93">Cancel</text>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Edit Plan</text>
<g fill="#8E8E93"><circle cx="359" cy="76" r="2"/><circle cx="366" cy="76" r="2"/><circle cx="373" cy="76" r="2"/></g>

<g clip-path="url(#sc)">
<!-- plan name · focused -->
<g filter="url(#fc)"><rect x="16" y="104" width="361" height="70" rx="22" fill="url(#cd)"/></g>
<g filter="url(#ff)"><rect x="16" y="104" width="361" height="70" rx="22" fill="none" stroke="url(#br)" stroke-width="2"/></g>
<text x="32" y="128" font-size="9" font-weight="700" letter-spacing="1.25" fill="#86868B">PLAN NAME</text>
<text x="32" y="156" font-size="19" font-weight="600" letter-spacing="-.45" fill="#FFF">Push Day · Strength</text>
<rect x="212" y="140" width="2" height="20" rx="1" fill="#FF6A3D"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.51;1" dur="1.1s" repeatCount="indefinite"/></rect>

<!-- meta strip -->
<g filter="url(#fc)"><rect x="16" y="186" width="361" height="72" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="186.5" width="360" height="71" rx="21.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".08"><line x1="106.25" y1="200" x2="106.25" y2="244"/><line x1="196.5" y1="200" x2="196.5" y2="244"/><line x1="286.75" y1="200" x2="286.75" y2="244"/></g>
<g text-anchor="middle" font-size="15" font-weight="700" letter-spacing="-.4" fill="#FFF">
  <text x="61.1" y="220">6</text><text x="151.4" y="220">19</text><text x="241.6" y="220">45</text><text x="331.9" y="220">3</text></g>
<g text-anchor="middle" font-size="8" font-weight="700" letter-spacing=".8" fill="#86868B">
  <text x="61.1" y="240">EXERCISES</text><text x="151.4" y="240">SETS</text><text x="241.6" y="240">MIN EST</text><text x="331.9" y="240">WEEK OF 6</text></g>

<!-- segmented control -->
<rect x="16" y="270" width="361" height="36" rx="18" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#fp)"><rect x="138.3" y="272" width="116.4" height="32" rx="16" fill="#FFF" fill-opacity=".13"/></g>
<rect x="138.3" y="272" width="116.4" height="32" rx="16" fill="none" stroke="#FFF" stroke-opacity=".12" stroke-width=".8"/>
<g text-anchor="middle" font-size="12" font-weight="600" letter-spacing="-.15">
  <text x="76.2" y="292.5" fill="#98989F">Beginner</text>
  <text x="196.5" y="292.5" fill="#FFF">Intermediate</text>
  <text x="316.8" y="292.5" fill="#98989F">Advanced</text></g>

<text x="24" y="336" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">EXERCISES</text>
<text x="369" y="336" font-size="10" font-weight="600" letter-spacing=".2" fill="#6C6C70" text-anchor="end">Drag to reorder</text>

<!-- rows -->
<g filter="url(#ft)"><rect x="16" y="348" width="361" height="64" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="348.5" width="360" height="63" rx="19.5" fill="none" stroke="url(#ce)"/>
<g fill="#6C6C70"><rect x="30" y="374" width="12" height="2" rx="1"/><rect x="30" y="379" width="12" height="2" rx="1"/><rect x="30" y="384" width="12" height="2" rx="1"/></g>
<rect x="52" y="369" width="22" height="22" rx="7" fill="#FFF" fill-opacity=".07"/><text x="63" y="384" font-size="10" font-weight="700" fill="#8E8E93" text-anchor="middle">1</text>
<text x="84" y="377" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Barbell Bench Press</text>
<text x="84" y="395" font-size="11" font-weight="500" fill="#86868B">4 × 5  ·  100 kg  ·  90s rest</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,380)"/>

<g filter="url(#ft)"><rect x="16" y="422" width="361" height="64" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="422.5" width="360" height="63" rx="19.5" fill="none" stroke="url(#ce)"/>
<g fill="#6C6C70"><rect x="30" y="448" width="12" height="2" rx="1"/><rect x="30" y="453" width="12" height="2" rx="1"/><rect x="30" y="458" width="12" height="2" rx="1"/></g>
<rect x="52" y="443" width="22" height="22" rx="7" fill="#FFF" fill-opacity=".07"/><text x="63" y="458" font-size="10" font-weight="700" fill="#8E8E93" text-anchor="middle">2</text>
<text x="84" y="451" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Incline DB Press</text>
<text x="84" y="469" font-size="11" font-weight="500" fill="#86868B">3 × 8  ·  34 kg each  ·  90s rest</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,454)"/>

<g filter="url(#ft)"><rect x="16" y="496" width="361" height="64" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="496.5" width="360" height="63" rx="19.5" fill="none" stroke="url(#ce)"/>
<g fill="#6C6C70"><rect x="30" y="522" width="12" height="2" rx="1"/><rect x="30" y="527" width="12" height="2" rx="1"/><rect x="30" y="532" width="12" height="2" rx="1"/></g>
<rect x="52" y="517" width="22" height="22" rx="7" fill="#FFF" fill-opacity=".07"/><text x="63" y="532" font-size="10" font-weight="700" fill="#8E8E93" text-anchor="middle">3</text>
<text x="84" y="525" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Seated Shoulder Press</text>
<text x="84" y="543" font-size="11" font-weight="500" fill="#86868B">3 × 10  ·  60 kg  ·  75s rest</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,528)"/>

<g filter="url(#ft)"><rect x="16" y="570" width="361" height="64" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="570.5" width="360" height="63" rx="19.5" fill="none" stroke="url(#ce)"/>
<g fill="#6C6C70"><rect x="30" y="596" width="12" height="2" rx="1"/><rect x="30" y="601" width="12" height="2" rx="1"/><rect x="30" y="606" width="12" height="2" rx="1"/></g>
<rect x="52" y="591" width="22" height="22" rx="7" fill="#FFF" fill-opacity=".07"/><text x="63" y="606" font-size="10" font-weight="700" fill="#8E8E93" text-anchor="middle">4</text>
<text x="84" y="599" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Cable Crossover</text>
<text x="84" y="617" font-size="11" font-weight="500" fill="#86868B">3 × 12  ·  25 kg  ·  60s rest</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,602)"/>

<g filter="url(#ft)"><rect x="16" y="644" width="361" height="64" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="644.5" width="360" height="63" rx="19.5" fill="none" stroke="url(#ce)"/>
<g fill="#6C6C70"><rect x="30" y="670" width="12" height="2" rx="1"/><rect x="30" y="675" width="12" height="2" rx="1"/><rect x="30" y="680" width="12" height="2" rx="1"/></g>
<rect x="52" y="665" width="22" height="22" rx="7" fill="#FFF" fill-opacity=".07"/><text x="63" y="680" font-size="10" font-weight="700" fill="#8E8E93" text-anchor="middle">5</text>
<text x="84" y="673" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Triceps Rope Pushdown</text>
<rect x="0" y="648" width="393" height="44" fill="url(#fd)"/>
</g>

<rect x="0" y="692" width="393" height="160" fill="url(#tb)"/>
<line x1="0" y1="692.5" x2="393" y2="692.5" stroke="#FFF" stroke-opacity=".11"/>
<rect x="16" y="706" width="361" height="48" rx="24" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".14" stroke-width="1" stroke-dasharray="5 4"/>
<g stroke="#FF9F0A" stroke-width="2.1" stroke-linecap="round"><line x1="176" y1="730" x2="192" y2="730"/><line x1="184" y1="722" x2="184" y2="738"/></g>
<text x="204" y="735" font-size="14.5" font-weight="650" letter-spacing="-.25" fill="#FFB84D">Add Exercise</text>
<g filter="url(#fb)"><rect x="16" y="766" width="361" height="54" rx="27" fill="url(#br)"/></g>
<rect x="16" y="766" width="361" height="27" rx="27" fill="url(#gl)" opacity=".35"/>
<rect x="16.5" y="766.5" width="360" height="53" rx="26.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="196.5" y="799" font-size="16" font-weight="650" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Save Plan</text>
<rect x="140.5" y="838" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="850.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

---

## 5 · ADD EXERCISE / SEARCH — 393 × 852

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="852" viewBox="0 0 393 852" role="img" aria-labelledby="t5" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility">
<title id="t5">Kinetic — Add Exercise / Search</title>
<defs>
  <clipPath id="fr"><rect width="393" height="852" rx="54.5"/></clipPath><clipPath id="sc"><rect width="393" height="830"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="a1" gradientUnits="userSpaceOnUse" cx="330" cy="220" r="280"><stop offset="0" stop-color="#0A84FF" stop-opacity=".12"/><stop offset="1" stop-color="#0A84FF" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="fd" gradientUnits="userSpaceOnUse" x1="0" y1="790" x2="0" y2="830"><stop offset="0" stop-color="#050507" stop-opacity="0"/><stop offset="1" stop-color="#050507" stop-opacity=".9"/></linearGradient>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="ff" x="-20%" y="-60%" width="140%" height="240%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#FF6A3D" flood-opacity=".4"/></filter>
  <g id="db"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
  <g id="cl" fill="none" stroke-width="1.9" stroke-linecap="round"><path d="M-7 -7 C-7 2 -3 5 0 8 C3 5 7 2 7 -7"/><line x1="0" y1="8" x2="0" y2="-2"/></g>
  <g id="cb" fill="none" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="-8" y="-6" width="16" height="12" rx="3"/><path d="M-3 -6 V6 M3 -6 V6"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="852" fill="url(#bg)"/><rect width="393" height="852" fill="url(#a1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">9:41</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="19" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>

<!-- search field · focused -->
<g filter="url(#ff)"><rect x="16" y="64" width="310" height="38" rx="12" fill="#FFF" fill-opacity=".08" stroke="url(#br)" stroke-width="1.8"/></g>
<g stroke="#8E8E93" stroke-width="1.9" fill="none" stroke-linecap="round"><circle cx="37" cy="81" r="5.6"/><line x1="41.2" y1="85.2" x2="45" y2="89"/></g>
<text x="56" y="88" font-size="15" font-weight="400" letter-spacing="-.2" fill="#6C6C70">Search exercises</text>
<rect x="169" y="72" width="2" height="20" rx="1" fill="#FF6A3D"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.51;1" dur="1.1s" repeatCount="indefinite"/></rect>
<text x="377" y="88" font-size="15.5" font-weight="400" letter-spacing="-.3" fill="#FF9F0A" text-anchor="end">Cancel</text>

<!-- filter chips -->
<rect x="16" y="114" width="46" height="28" rx="14" fill="#FFF"/>
<text x="39" y="132.5" font-size="12" font-weight="650" letter-spacing="-.15" fill="#1C1C1E" text-anchor="middle">All</text>
<g fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8">
  <rect x="70" y="114" width="58" height="28" rx="14"/><rect x="136" y="114" width="82" height="28" rx="14"/>
  <rect x="226" y="114" width="66" height="28" rx="14"/><rect x="300" y="114" width="66" height="28" rx="14"/>
  <rect x="374" y="114" width="76" height="28" rx="14"/></g>
<g font-size="12" font-weight="500" letter-spacing="-.15" fill="#C7C7CC" text-anchor="middle">
  <text x="99" y="132.5">Chest</text><text x="177" y="132.5">Shoulders</text><text x="259" y="132.5">Triceps</text><text x="333" y="132.5">Barbell</text><text x="412" y="132.5">Machine</text></g>

<g clip-path="url(#sc)">
<text x="24" y="176" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">RECENTS</text>
<text x="369" y="176" font-size="11" font-weight="600" letter-spacing="-.1" fill="#8E8E93" text-anchor="end">Clear</text>

<!-- row template: 52h -->
<g filter="url(#ft)"><rect x="16" y="186" width="361" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="186.5" width="360" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="196" width="32" height="32" rx="11" fill="#FF2D55" fill-opacity=".15"/>
<use xlink:href="#db" href="#db" transform="translate(46,212) scale(.62)" fill="#FF6A88"/>
<text x="74" y="210" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Barbell Bench Press</text>
<text x="74" y="227" font-size="10.5" font-weight="500" fill="#86868B">Barbell · Chest · Triceps</text>
<circle cx="349" cy="212" r="15" fill="#FF2D55" fill-opacity=".16" stroke="#FF2D55" stroke-opacity=".22" stroke-width=".8"/>
<g stroke="#FF6A88" stroke-width="2" stroke-linecap="round"><line x1="343" y1="212" x2="355" y2="212"/><line x1="349" y1="206" x2="349" y2="218"/></g>

<g filter="url(#ft)"><rect x="16" y="246" width="361" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="246.5" width="360" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="256" width="32" height="32" rx="11" fill="#0A84FF" fill-opacity=".16"/>
<use xlink:href="#cb" href="#cb" transform="translate(46,272) scale(.72)" stroke="#5EB0FF"/>
<text x="74" y="270" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Seated Shoulder Press</text>
<text x="74" y="287" font-size="10.5" font-weight="500" fill="#86868B">Machine · Shoulders</text>
<circle cx="349" cy="272" r="15" fill="#FF2D55" fill-opacity=".16" stroke="#FF2D55" stroke-opacity=".22" stroke-width=".8"/>
<g stroke="#FF6A88" stroke-width="2" stroke-linecap="round"><line x1="343" y1="272" x2="355" y2="272"/><line x1="349" y1="266" x2="349" y2="278"/></g>

<g filter="url(#ft)"><rect x="16" y="306" width="361" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="306.5" width="360" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="316" width="32" height="32" rx="11" fill="#FF9F0A" fill-opacity=".15"/>
<use xlink:href="#cl" href="#cl" transform="translate(46,332) scale(.66)" stroke="#FFB84D"/>
<text x="74" y="330" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Incline DB Press</text>
<text x="74" y="347" font-size="10.5" font-weight="500" fill="#86868B">Dumbbell · Upper chest</text>
<circle cx="349" cy="332" r="15" fill="#FF2D55" fill-opacity=".16" stroke="#FF2D55" stroke-opacity=".22" stroke-width=".8"/>
<g stroke="#FF6A88" stroke-width="2" stroke-linecap="round"><line x1="343" y1="332" x2="355" y2="332"/><line x1="349" y1="326" x2="349" y2="338"/></g>

<!-- create custom · dashed -->
<rect x="16" y="366" width="361" height="52" rx="18" fill="#FFF" fill-opacity=".045" stroke="#FFF" stroke-opacity=".14" stroke-width="1" stroke-dasharray="5 4"/>
<circle cx="46" cy="392" r="15" fill="url(#br)"/>
<g stroke="#FFF" stroke-width="2.1" stroke-linecap="round"><line x1="40" y1="392" x2="52" y2="392"/><line x1="46" y1="386" x2="46" y2="398"/></g>
<text x="74" y="389" font-size="14" font-weight="650" letter-spacing="-.2" fill="#FFF">Create Custom Exercise</text>
<text x="74" y="406" font-size="10.5" font-weight="500" fill="#86868B">Name it, track it, own it</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,392)" stroke="#48484A"/>

<text x="24" y="452" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">SUGGESTED FOR PUSH DAY</text>

<g filter="url(#ft)"><rect x="16" y="462" width="361" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="462.5" width="360" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="472" width="32" height="32" rx="11" fill="#AF52DE" fill-opacity=".16"/>
<use xlink:href="#db" href="#db" transform="translate(46,488) scale(.62)" fill="#C77DFF"/>
<text x="74" y="486" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Overhead Press</text>
<text x="74" y="503" font-size="10.5" font-weight="500" fill="#86868B">Barbell · Shoulders · Triceps</text>
<circle cx="349" cy="488" r="15" fill="#FF2D55" fill-opacity=".16" stroke="#FF2D55" stroke-opacity=".22" stroke-width=".8"/>
<g stroke="#FF6A88" stroke-width="2" stroke-linecap="round"><line x1="343" y1="488" x2="355" y2="488"/><line x1="349" y1="482" x2="349" y2="494"/></g>

<g filter="url(#ft)"><rect x="16" y="522" width="361" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="522.5" width="360" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="532" width="32" height="32" rx="11" fill="#FF2D55" fill-opacity=".15"/>
<use xlink:href="#db" href="#db" transform="translate(46,548) scale(.62)" fill="#FF6A88"/>
<text x="74" y="546" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Close-Grip Bench Press</text>
<text x="74" y="563" font-size="10.5" font-weight="500" fill="#86868B">Barbell · Triceps · Chest</text>
<circle cx="349" cy="548" r="15" fill="#FF2D55" fill-opacity=".16" stroke="#FF2D55" stroke-opacity=".22" stroke-width=".8"/>
<g stroke="#FF6A88" stroke-width="2" stroke-linecap="round"><line x1="343" y1="548" x2="355" y2="548"/><line x1="349" y1="542" x2="349" y2="554"/></g>

<g filter="url(#ft)"><rect x="16" y="582" width="361" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="582.5" width="360" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="592" width="32" height="32" rx="11" fill="#30D158" fill-opacity=".15"/>
<use xlink:href="#cl" href="#cl" transform="translate(46,608) scale(.66)" stroke="#4ADE80"/>
<text x="74" y="606" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Cable Crossover</text>
<text x="74" y="623" font-size="10.5" font-weight="500" fill="#86868B">Cable · Chest · 2 in plan</text>
<circle cx="349" cy="608" r="15" fill="#FF2D55" fill-opacity=".16" stroke="#FF2D55" stroke-opacity=".22" stroke-width=".8"/>
<g stroke="#FF6A88" stroke-width="2" stroke-linecap="round"><line x1="343" y1="608" x2="355" y2="608"/><line x1="349" y1="602" x2="349" y2="614"/></g>

<g filter="url(#ft)"><rect x="16" y="642" width="361" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="642.5" width="360" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="652" width="32" height="32" rx="11" fill="#00D9E9" fill-opacity=".15"/>
<use xlink:href="#cb" href="#cb" transform="translate(46,668) scale(.72)" stroke="#5EDCF0"/>
<text x="74" y="666" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Pec Deck Fly</text>
<text x="74" y="683" font-size="10.5" font-weight="500" fill="#86868B">Machine · Chest · Isolation</text>
<circle cx="349" cy="668" r="15" fill="#FF2D55" fill-opacity=".16" stroke="#FF2D55" stroke-opacity=".22" stroke-width=".8"/>
<g stroke="#FF6A88" stroke-width="2" stroke-linecap="round"><line x1="343" y1="668" x2="355" y2="668"/><line x1="349" y1="662" x2="349" y2="674"/></g>

<g filter="url(#ft)"><rect x="16" y="702" width="361" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="702.5" width="360" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="712" width="32" height="32" rx="11" fill="#FF9F0A" fill-opacity=".15"/>
<use xlink:href="#cl" href="#cl" transform="translate(46,728) scale(.66)" stroke="#FFB84D"/>
<text x="74" y="726" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Lateral Raise</text>
<text x="74" y="743" font-size="10.5" font-weight="500" fill="#86868B">Dumbbell · Side delt</text>
<circle cx="349" cy="728" r="15" fill="#FF2D55" fill-opacity=".16" stroke="#FF2D55" stroke-opacity=".22" stroke-width=".8"/>
<g stroke="#FF6A88" stroke-width="2" stroke-linecap="round"><line x1="343" y1="728" x2="355" y2="728"/><line x1="349" y1="722" x2="349" y2="734"/></g>

<g filter="url(#ft)"><rect x="16" y="762" width="361" height="52" rx="18" fill="url(#cd)"/></g>
<rect x="16.5" y="762.5" width="360" height="51" rx="17.5" fill="none" stroke="url(#ce)"/>
<rect x="30" y="772" width="32" height="32" rx="11" fill="#AF52DE" fill-opacity=".16"/>
<use xlink:href="#db" href="#db" transform="translate(46,788) scale(.62)" fill="#C77DFF"/>
<text x="74" y="786" font-size="14" font-weight="600" letter-spacing="-.2" fill="#FFF">Arnold Press</text>
<rect x="0" y="790" width="393" height="40" fill="url(#fd)"/>
</g>
<rect x="140.5" y="838" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="850.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

*One fix needed here: the last chevron reference — add `<path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>` to this file's `<defs>`, and remove `stroke="#48484A"` from the create-custom `<use>` (stroke is already on the def).*

---

## 6 · EXERCISE HISTORY — 393 × 852

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="852" viewBox="0 0 393 852" role="img" aria-labelledby="t6" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility">
<title id="t6">Kinetic — Exercise History: Barbell Bench Press</title>
<defs>
  <clipPath id="fr"><rect width="393" height="852" rx="54.5"/></clipPath><clipPath id="sc"><rect width="393" height="830"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="a1" gradientUnits="userSpaceOnUse" cx="90" cy="150" r="260"><stop offset="0" stop-color="#FFD60A" stop-opacity=".14"/><stop offset="1" stop-color="#FFD60A" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="gd" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#FFE9A8"/><stop offset=".45" stop-color="#FFD84D"/><stop offset="1" stop-color="#D9A441"/></linearGradient>
  <linearGradient id="ln" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF9F0A"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="ar" gradientUnits="userSpaceOnUse" x1="0" y1="286" x2="0" y2="350"><stop offset="0" stop-color="#FF6A3D" stop-opacity=".34"/><stop offset="1" stop-color="#FF6A3D" stop-opacity="0"/></linearGradient>
  <linearGradient id="fd" gradientUnits="userSpaceOnUse" x1="0" y1="786" x2="0" y2="830"><stop offset="0" stop-color="#050507" stop-opacity="0"/><stop offset="1" stop-color="#050507" stop-opacity=".92"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fg" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="5" stdDeviation="10" flood-color="#FFD84D" flood-opacity=".35"/></filter>
  <filter id="fd2" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#FF2D55" flood-opacity=".7"/></filter>
  <path id="st" d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"/>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#8E8E93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="852" fill="url(#bg)"/><rect width="393" height="852" fill="url(#a1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:31</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>

<g transform="translate(28,76)"><use xlink:href="#bk" href="#bk"/></g>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Barbell Bench Press</text>
<g fill="#8E8E93"><circle cx="359" cy="76" r="2"/><circle cx="366" cy="76" r="2"/><circle cx="373" cy="76" r="2"/></g>

<g clip-path="url(#sc)">
<!-- PR BANNER -->
<g filter="url(#fg)"><rect x="16" y="104" width="361" height="88" rx="26" fill="url(#gd)"/></g>
<rect x="16.5" y="104.5" width="360" height="87" rx="25.5" fill="none" stroke="#FFF" stroke-opacity=".45"/>
<rect x="16" y="104" width="361" height="44" rx="26" fill="#FFF" fill-opacity=".28"/>
<circle cx="58" cy="148" r="22" fill="#000" fill-opacity=".14"/>
<use xlink:href="#st" href="#st" transform="translate(58,148) scale(.95)" fill="#5C4300"/>
<text x="94" y="134" font-size="9" font-weight="700" letter-spacing="1.3" fill="#7A5A00">PERSONAL RECORD</text>
<text x="94" y="160" font-size="20" font-weight="700" letter-spacing="-.55" fill="#2B1E00">102.5 kg × 5</text>
<text x="94" y="178" font-size="10.5" font-weight="600" fill="#7A5A00">E1RM 119.6 kg  ·  Set June 2</text>

<!-- PROGRESS CHART -->
<g filter="url(#fc)"><rect x="16" y="204" width="361" height="184" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="204.5" width="360" height="183" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="234" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Top Set Weight</text>
<text x="36" y="252" font-size="11" font-weight="500" fill="#86868B">90 kg → 100 kg  ·  +11.1%</text>
<rect x="299" y="220" width="58" height="21" rx="10.5" fill="#FFF" fill-opacity=".07"/>
<text x="328" y="234" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#98989F" text-anchor="middle">8 SESSIONS</text>
<g stroke="#FFF" stroke-opacity=".05"><line x1="36" y1="286" x2="357" y2="286"/><line x1="36" y1="318" x2="357" y2="318"/><line x1="36" y1="350" x2="357" y2="350"/></g>
<path d="M40 341.3 L62.35 341.3 Q84.7 341.3 107.05 335.8 Q129.4 330.3 151.75 330.3 Q174.1 330.3 196.5 324.85 Q218.9 319.4 241.25 313.9 Q263.6 308.4 285.95 297.5 Q308.3 286.6 330.65 292.05 L353 297.5 L353 350 L40 350 Z" fill="url(#ar)"/>
<path d="M40 341.3 L62.35 341.3 Q84.7 341.3 107.05 335.8 Q129.4 330.3 151.75 330.3 Q174.1 330.3 196.5 324.85 Q218.9 319.4 241.25 313.9 Q263.6 308.4 285.95 297.5 Q308.3 286.6 330.65 292.05 L353 297.5" fill="none" stroke="url(#ln)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="308.3" cy="286.6" r="6" fill="#FFD84D" stroke="#131316" stroke-width="2.4"/>
<circle cx="353" cy="297.5" r="5.4" fill="#FF2D55" stroke="#131316" stroke-width="2.2" filter="url(#fd2)"/>
<text x="308.3" y="276" font-size="9.5" font-weight="700" letter-spacing="-.1" fill="#FFD84D" text-anchor="middle">102.5</text>
<text x="353" y="288" font-size="9.5" font-weight="700" letter-spacing="-.1" fill="#FF6A88" text-anchor="end">100</text>
<g font-size="9" font-weight="600" letter-spacing=".2" fill="#6C6C70">
  <text x="40" y="370">Apr 21</text><text x="308.3" y="370" text-anchor="middle" fill="#A08000">Jun 2</text><text x="353" y="370" text-anchor="end" fill="#98989F">Today</text></g>

<text x="24" y="418" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">PAST SESSIONS</text>
<text x="369" y="418" font-size="11" font-weight="600" letter-spacing="-.1" fill="#FF9F0A" text-anchor="end">See All</text>

<!-- session rows -->
<g filter="url(#ft)"><rect x="16" y="428" width="361" height="76" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="428.5" width="360" height="75" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="444" width="44" height="44" rx="14" fill="#FFF" fill-opacity=".06"/>
<text x="54" y="462" font-size="8" font-weight="700" letter-spacing=".6" fill="#8E8E93" text-anchor="middle">JUN</text>
<text x="54" y="481" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFF" text-anchor="middle">09</text>
<text x="88" y="460" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">5 · 5 · 5 · 5  @ 100 kg</text>
<text x="88" y="479" font-size="11" font-weight="500" fill="#86868B">2,000 kg volume · 4 sets · RPE 7.5</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,466)"/>

<g filter="url(#ft)"><rect x="16" y="514" width="361" height="76" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="514.5" width="360" height="75" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="530" width="44" height="44" rx="14" fill="#FFD60A" fill-opacity=".12"/>
<text x="54" y="548" font-size="8" font-weight="700" letter-spacing=".6" fill="#A08000" text-anchor="middle">JUN</text>
<text x="54" y="567" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFD84D" text-anchor="middle">02</text>
<text x="88" y="546" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">5 · 5 · 4 · 4  @ 102.5 kg</text>
<text x="88" y="565" font-size="11" font-weight="500" fill="#86868B">1,845 kg volume · 4 sets · RPE 9</text>
<rect x="297" y="524" width="34" height="18" rx="9" fill="#FFD60A" fill-opacity=".18" stroke="#FFD60A" stroke-opacity=".3" stroke-width=".7"/>
<text x="314" y="536.5" font-size="8.5" font-weight="700" letter-spacing=".5" fill="#FFD84D" text-anchor="middle">PR</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,552)"/>

<g filter="url(#ft)"><rect x="16" y="600" width="361" height="76" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="600.5" width="360" height="75" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="616" width="44" height="44" rx="14" fill="#FFF" fill-opacity=".06"/>
<text x="54" y="634" font-size="8" font-weight="700" letter-spacing=".6" fill="#8E8E93" text-anchor="middle">MAY</text>
<text x="54" y="653" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFF" text-anchor="middle">27</text>
<text x="88" y="632" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">5 · 5 · 5 · 5  @ 97.5 kg</text>
<text x="88" y="651" font-size="11" font-weight="500" fill="#86868B">1,950 kg volume · 4 sets · RPE 8</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,638)"/>

<g filter="url(#ft)"><rect x="16" y="686" width="361" height="76" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="686.5" width="360" height="75" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="702" width="44" height="44" rx="14" fill="#FFF" fill-opacity=".06"/>
<text x="54" y="720" font-size="8" font-weight="700" letter-spacing=".6" fill="#8E8E93" text-anchor="middle">MAY</text>
<text x="54" y="739" font-size="16" font-weight="700" letter-spacing="-.5" fill="#FFF" text-anchor="middle">20</text>
<text x="88" y="718" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">5 · 5 · 5 · 5  @ 95 kg</text>
<text x="88" y="737" font-size="11" font-weight="500" fill="#86868B">1,900 kg volume · 4 sets · RPE 8</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,724)"/>

<g filter="url(#ft)"><rect x="16" y="772" width="361" height="76" rx="22" fill="url(#cd)"/></g>
<rect x="0" y="786" width="393" height="44" fill="url(#fd)"/>
</g>
<rect x="140.5" y="838" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="850.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

---

## 7 · POST-WORKOUT SUMMARY — 393 × 1190

*Unrolled, per the home-page precedent — eight content blocks cannot fit in one fold.*

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1190" viewBox="0 0 393 1190" role="img" aria-labelledby="t7" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility">
<title id="t7">Kinetic — Post-Workout Summary</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1190"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="a1" gradientUnits="userSpaceOnUse" cx="196" cy="190" r="230"><stop offset="0" stop-color="#FF6A3D" stop-opacity=".26"/><stop offset=".55" stop-color="#FF2D55" stop-opacity=".09"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <radialGradient id="a2" gradientUnits="userSpaceOnUse" cx="360" cy="600" r="280"><stop offset="0" stop-color="#FFD60A" stop-opacity=".09"/><stop offset="1" stop-color="#FFD60A" stop-opacity="0"/></radialGradient>
  <radialGradient id="a3" gradientUnits="userSpaceOnUse" cx="40" cy="960" r="260"><stop offset="0" stop-color="#0A84FF" stop-opacity=".09"/><stop offset="1" stop-color="#0A84FF" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="tl" x1="0" y1="0" x2=".5" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".075"/><stop offset="1" stop-color="#FFF" stop-opacity=".028"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gd" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FFF0BE"/><stop offset="1" stop-color="#D9A441"/></linearGradient>
  <linearGradient id="am" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#FFC24A"/><stop offset="1" stop-color="#FF6A2D"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="fg" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="5" stdDeviation="9" flood-color="#FFD84D" flood-opacity=".45"/></filter>
  <filter id="fa" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="5" stdDeviation="9" flood-color="#FF9F0A" flood-opacity=".45"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <path id="st" d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"/>
  <path id="fl" d="M0 -8.2 C2.9 -4.6 5.9 -1.7 5.9 1.9 C5.9 5.4 3.3 7.9 0 7.9 C-3.3 7.9 -5.9 5.4 -5.9 1.9 C-5.9 -.2 -4.6 -1.9 -3.3 -3.4 C-3.2 -1.7 -2.4 -.9 -1.3 -.7 C-1.7 -3.5 -1.1 -5.9 0 -8.2 Z"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="up" d="M-4 2 L0 -2.6 L4 2" fill="none" stroke="#30D158" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="dw" d="M-4 -2 L0 2.6 L4 -2" fill="none" stroke="#8E8E93" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="sh" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 -7 L-6 1 H-1 L-2 7 L6 -1 H1 Z"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1190" fill="url(#bg)"/><rect width="393" height="1190" fill="url(#a1)"/><rect width="393" height="1190" fill="url(#a2)"/><rect width="393" height="1190" fill="url(#a3)"/>

<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:26</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<g fill="#8E8E93"><circle cx="359" cy="76" r="2"/><circle cx="366" cy="76" r="2"/><circle cx="373" cy="76" r="2"/></g>

<!-- DURATION HERO -->
<g transform="translate(196.5,152)" filter="url(#fs)">
  <circle r="30" fill="none" stroke="url(#br)" stroke-width="2.4" stroke-opacity=".5"/>
  <circle r="23" fill="url(#br)" fill-opacity=".14"/>
  <path d="M-9 0.5 L-2.6 7 L9.5 -6.5" fill="none" stroke="#FFB84D" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<text x="196.5" y="212" font-size="9.5" font-weight="700" letter-spacing="1.7" fill="#FF6A88" text-anchor="middle">SESSION COMPLETE</text>
<text x="196.5" y="272" font-size="62" font-weight="700" letter-spacing="-2.6" fill="#FFF" text-anchor="middle">45:12</text>
<text x="196.5" y="296" font-size="12" font-weight="500" fill="#98989F" text-anchor="middle">33:40 active  ·  11:32 rest</text>
<text x="196.5" y="318" font-size="10.5" font-weight="500" fill="#6C6C70" text-anchor="middle">Monday, June 9  ·  9:41 – 10:26 AM</text>

<!-- STAT TILES -->
<g filter="url(#ft)"><rect x="16" y="336" width="82" height="96" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="336.5" width="81" height="95" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="28" y="348" width="20" height="20" rx="6.5" fill="#FF2D55" fill-opacity=".16"/>
<g transform="translate(38,358) scale(.5)" fill="#FF6A88"><use xlink:href="#sh" href="#sh" color="#FF6A88"/></g>
<text x="28" y="404" font-size="17" font-weight="700" letter-spacing="-.55" fill="#FFF">8,420</text>
<text x="28" y="420" font-size="8" font-weight="700" letter-spacing=".8" fill="#86868B">VOLUME KG</text>

<g filter="url(#ft)"><rect x="109" y="336" width="82" height="96" rx="24" fill="url(#cd)"/></g>
<rect x="109.5" y="336.5" width="81" height="95" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="121" y="348" width="20" height="20" rx="6.5" fill="#A6FF00" fill-opacity=".14"/>
<rect x="126" y="352" width="10" height="12" rx="2.4" fill="none" stroke="#C3F53C" stroke-width="1.8"/><path d="M128.6 356.4 H133.4" stroke="#C3F53C" stroke-width="1.8" stroke-linecap="round"/>
<text x="121" y="404" font-size="17" font-weight="700" letter-spacing="-.55" fill="#FFF">19</text>
<text x="121" y="420" font-size="8" font-weight="700" letter-spacing=".8" fill="#86868B">SETS</text>

<g filter="url(#ft)"><rect x="202" y="336" width="82" height="96" rx="24" fill="url(#cd)"/></g>
<rect x="202.5" y="336.5" width="81" height="95" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="214" y="348" width="20" height="20" rx="6.5" fill="#FF9F0A" fill-opacity=".15"/>
<use xlink:href="#fl" href="#fl" transform="translate(224,358) scale(.6)" fill="#FFB84D"/>
<text x="214" y="404" font-size="17" font-weight="700" letter-spacing="-.55" fill="#FFF">380</text>
<text x="214" y="420" font-size="8" font-weight="700" letter-spacing=".8" fill="#86868B">KCAL EST</text>

<g filter="url(#ft)"><rect x="295" y="336" width="82" height="96" rx="24" fill="url(#cd)"/></g>
<rect x="295.5" y="336.5" width="81" height="95" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="307" y="348" width="20" height="20" rx="6.5" fill="#00D9E9" fill-opacity=".15"/>
<path d="M311 358 h2.4 l1.6 -4 l2.4 8 l1.8 -4 h2.4" fill="none" stroke="#5EDCF0" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
<text x="307" y="404" font-size="17" font-weight="700" letter-spacing="-.55" fill="#FFF">128</text>
<text x="307" y="420" font-size="8" font-weight="700" letter-spacing=".8" fill="#86868B">AVG BPM</text>

<!-- PR BADGES -->
<g filter="url(#fc)"><rect x="16" y="444" width="361" height="154" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="444.5" width="360" height="153" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="474" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">Personal Records</text>
<rect x="303" y="460" width="54" height="21" rx="10.5" fill="#FFD60A" fill-opacity=".16"/>
<text x="330" y="474" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#FFD84D" text-anchor="middle">2 NEW</text>
<g filter="url(#fg)"><circle cx="56" cy="512" r="20" fill="url(#gd)"/></g>
<use xlink:href="#st" href="#st" transform="translate(56,512) scale(.82)" fill="#5C4300"/>
<text x="88" y="508" font-size="13" font-weight="600" letter-spacing="-.2" fill="#FFF">Volume PR</text>
<text x="88" y="525" font-size="10.5" font-weight="500" fill="#86868B">8,420 kg  ·  +770 kg vs Jun 2</text>
<g filter="url(#fg)"><circle cx="56" cy="568" r="20" fill="url(#gd)"/></g>
<use xlink:href="#st" href="#st" transform="translate(56,568) scale(.82)" fill="#5C4300"/>
<text x="88" y="564" font-size="13" font-weight="600" letter-spacing="-.2" fill="#FFF">Shoulder Press PR</text>
<text x="88" y="581" font-size="10.5" font-weight="500" fill="#86868B">60 kg × 10  ·  prev best 57.5 kg</text>

<!-- VS PREVIOUS -->
<g filter="url(#fc)"><rect x="16" y="610" width="361" height="196" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="610.5" width="360" height="195" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="640" font-size="15.5" font-weight="600" letter-spacing="-.3" fill="#FFF">vs. Previous Push Day</text>
<text x="36" y="658" font-size="11" font-weight="500" fill="#86868B">June 2  ·  6 days ago</text>
<g font-size="8.5" font-weight="700" letter-spacing=".8" fill="#6C6C70">
  <text x="36" y="684">METRIC</text><text x="248" y="684" text-anchor="end">JUN 2</text><text x="308" y="684" text-anchor="end">TODAY</text><text x="357" y="684" text-anchor="end">Δ</text></g>
<line x1="36" y1="692" x2="357" y2="692" stroke="#FFF" stroke-opacity=".08"/>
<g font-size="12" font-weight="500"><g fill="#98989F"><text x="36" y="714">Volume</text><text x="36" y="742">Sets</text><text x="36" y="770">Top set · Bench</text><text x="36" y="798">Duration</text></g>
<g fill="#6C6C70" text-anchor="end"><text x="248" y="714">7,650 kg</text><text x="248" y="742">17</text><text x="248" y="770">102.5 kg</text><text x="248" y="798">43:20</text></g>
<g fill="#FFF" font-weight="700" text-anchor="end"><text x="308" y="714">8,420 kg</text><text x="308" y="742">19</text><text x="308" y="770">100 kg</text><text x="308" y="798">45:12</text></g></g>
<g text-anchor="end" font-size="11" font-weight="700"><text x="357" y="714" fill="#30D158">+10.1%</text><text x="357" y="742" fill="#30D158">+2</text><text x="357" y="770" fill="#8E8E93">−2.4%</text><text x="357" y="798" fill="#30D158">+1:52</text></g>
<g><use xlink:href="#up" href="#up" transform="translate(317,710)"/><use xlink:href="#up" href="#up" transform="translate(333,738)"/><use xlink:href="#dw" href="#dw" transform="translate(317,766)"/><use xlink:href="#up" href="#up" transform="translate(317,794)"/></g>
<g stroke="#FFF" stroke-opacity=".05"><line x1="36" y1="722" x2="357" y2="722"/><line x1="36" y1="750" x2="357" y2="750"/><line x1="36" y1="778" x2="357" y2="778"/></g>

<!-- STREAK -->
<g filter="url(#fc)"><rect x="16" y="818" width="361" height="108" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="818.5" width="360" height="107" rx="29.5" fill="none" stroke="url(#ce)"/>
<g filter="url(#fa)"><circle cx="62" cy="860" r="26" fill="url(#am)"/></g>
<circle cx="62" cy="860" r="26" fill="none" stroke="#FFF" stroke-opacity=".3" stroke-width="1"/>
<use xlink:href="#fl" href="#fl" transform="translate(62,860) scale(1.05)" fill="#FFF"/>
<text x="104" y="856" font-size="17" font-weight="650" letter-spacing="-.35" fill="#FFF">13-Day Streak</text>
<text x="104" y="876" font-size="11.5" font-weight="500" fill="#98989F">Longest this year. Keep it alive tomorrow.</text>
<g><g fill="#FF9F0A"><circle cx="110" cy="902" r="5.5"/><circle cx="132" cy="902" r="5.5"/><circle cx="154" cy="902" r="5.5"/><circle cx="176" cy="902" r="5.5"/><circle cx="198" cy="902" r="5.5"/></g>
<g fill="none" stroke="#FFF" stroke-opacity=".16" stroke-width="1.6"><circle cx="220" cy="902" r="4.7"/><circle cx="242" cy="902" r="4.7"/></g>
<g filter="url(#fb)"><circle cx="264" cy="902" r="5.5" fill="url(#br)"/></g></g>
<text x="357" y="906" font-size="9.5" font-weight="700" letter-spacing=".6" fill="#6C6C70" text-anchor="end">THIS WEEK</text>

<!-- NOTES -->
<g filter="url(#fc)"><rect x="16" y="938" width="361" height="116" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="938.5" width="360" height="115" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="966" font-size="9" font-weight="700" letter-spacing="1.3" fill="#86868B">SESSION NOTES</text>
<text x="369" y="966" font-size="11.5" font-weight="600" letter-spacing="-.1" fill="#FF9F0A" text-anchor="end">Edit</text>
<g font-size="12.5" font-weight="500" fill="#E5E5EA"><text x="36" y="992">Bench felt controlled at 100 kg. Left shoulder</text><text x="36" y="1011">tight on set 3 — add extra warm-up next time.</text><text x="36" y="1030" fill="#98989F">Drop incline press to 32 kg if it recurs.</text></g>

<!-- KUDOS -->
<g filter="url(#fc)"><rect x="16" y="1066" width="361" height="76" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="1066.5" width="360" height="75" rx="25.5" fill="none" stroke="url(#ce)"/>
<g stroke="#17171A" stroke-width="2.4">
  <circle cx="46" cy="1104" r="14" fill="#FF4FB8"/><circle cx="66" cy="1104" r="14" fill="#0A84FF"/><circle cx="86" cy="1104" r="14" fill="#30D158"/></g>
<g font-size="10.5" font-weight="600" fill="#FFF" text-anchor="middle"><text x="46" y="1108">M</text><text x="66" y="1108">J</text><text x="86" y="1108">S</text></g>
<circle cx="106" cy="1104" r="14" fill="#2A2A2E" stroke="#17171A" stroke-width="2.4"/>
<text x="106" y="1108" font-size="9" font-weight="700" fill="#98989F" text-anchor="middle">+3</text>
<text x="132" y="1100" font-size="12.5" font-weight="600" letter-spacing="-.2" fill="#FFF">Mia, Jon and 4 others</text>
<text x="132" y="1117" font-size="10.5" font-weight="500" fill="#86868B">gave you kudos for this session</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,1104)"/>

<!-- ACTIONS -->
<rect x="16" y="1156" width="174" height="54" rx="27" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".12" stroke-width="1"/>
<g stroke="#F5F5F7" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M70 1188 l5 -5 l10 -10 a3.5 3.5 0 0 1 5 5 l-10 10 z"/><path d="M79 1179 l5 5"/></g>
<text x="112" y="1189" font-size="15" font-weight="600" letter-spacing="-.25" fill="#F5F5F7">Share</text>
<g filter="url(#fb)"><rect x="203" y="1156" width="174" height="54" rx="27" fill="url(#br)"/></g>
<rect x="203" y="1156" width="174" height="27" rx="27" fill="url(#gl)" opacity=".35"/>
<rect x="203.5" y="1156.5" width="173" height="53" rx="26.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="290" y="1189" font-size="15" font-weight="650" letter-spacing="-.25" fill="#FFF" text-anchor="middle">Done</text>
</g>
<rect x=".5" y=".5" width="392" height="1189" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

*Canvas is 1190 tall; the Share/Done pair at y=1156 is the sticky action bar — pin it to the viewport bottom with a `url(#gTab)`-style blur backing at runtime.*

---

## Verification log — every number checked

| Claim | Computation | Result |
|---|---|---|
| Total volume | 2000+1632+1800+900+900+1188 | **8,420 kg** ✓ |
| Mid-session volume | 2000+1632+1800+900+(20×15) | **6,632 kg** ✓ |
| Remaining to finish | 600 (Ex5 s2–3) + 1,188 (Ex6) | 6,632 + 1,788 = **8,420** ✓ |
| Reps total | 20+24+30+36+45+36 | **191** ✓ |
| Reps at capture | 20+24+30+36+15 | **125** ✓ |
| Sets | 4+3+3+3+3+3 | **19** ✓ |
| Elapsed split | 33:40 + 11:32 | **45:12** ✓ |
| Clock mid-session | 9:41 + 38:24 | **10:19** ✓ |
| Rest ring | r=26, C=163.36; 42/60 remaining | dash **114.35** ✓ |
| Volume delta | (8420−7650)/7650 | **+10.07 → +10.1%** ✓ |
| Top-set delta | (100−102.5)/102.5 | **−2.44 → −2.4%** ✓ |
| Duration delta | 45:12 − 43:20 | **+1:52** ✓ |
| Bench trend | (100−90)/90 | **+11.1%** ✓ |
| E1RM | 102.5 × (1 + 5/30) | **119.58 → 119.6 kg** ✓ |
| Jun 2 bench volume | 102.5 × 18 | **1,845 kg** ✓ |
| Streak | home 12 (pre) → complete | **13** ✓ |

---

## Light mode

Geometry is **identical** across all seven files — light mode is the published token delta, applied mechanically. For these screens specifically:

| Element | Dark | Light |
|---|---|---|
| Rest ring | `#009DFF→#2CE9F7` | `#0089CE→#17C8E8` |
| Set-complete check | `#30D158` | `#34C759` |
| Current-set ring | `#FF375F` | `#FF2D55` |
| PR banner text on gold | `#2B1E00` / `#5C4300` | **unchanged** (gold stays gold in both themes) |
| Chart line | `#FF9F0A→#FF2D55` | `#E07800→#D70015` |
| Chart area fill | brand @ 0.34 → 0 | brand @ **0.20** → 0 |
| Gridlines | white 0.05 | `#3C3C43` @ 0.10 |
| Segment thumb | white 0.13 | `#FFFFFF` + shadow `0 1 3 rgba(0,0,0,.18)` |
| Disabled Finish | white 0.07 / `#48484A` | `#787880` @ 0.12 / `#AEAEB2` |
| Streak dots (upcoming) | white 0.16 ring | `#787880` @ 0.24 ring |
| All card fills / edges / shadows | — | per home-page light mapping |

---

