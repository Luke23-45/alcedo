# PHASE 6 · KINETIC SETTINGS
### Six screens · Dark · Contract-locked · No compromise

---

## 📐 SETTINGS DATA CONTRACT (extends all prior phases)

```
APP IDENTITY
 Kinetic 1.0.0 (build 238) · "Made with care in California"   ← matches Profile Editor footer ✓
 Icon wordmark "Kinetic" · accent = Ember (the brand gradient)

ALEX'S CONFIGURED STATE (must agree with every earlier screen)
 Units            kg · km · cm            ← Profile Editor ✓  bodyweight 80.6 kg ✓
 Appearance       Dark · accent Ember · celebrations ON · reduce-motion OFF
 Language         English (US) · Region US · First day of week = MONDAY
                  ← this is why every calendar we shipped is Monday-first ✓
 Time format      12-hour (AM/PM)          ← every clock shows AM/PM ✓
 Ring goals       Move 650 kcal · Exercise 60 min · Stand 12 hr  ← home rings ✓
 Volume goal      35,000 kg / week         ← Profile Editor ✓
 Current program  Push / Pull / Legs · Week 3 of 6 · ACTIVE
 Training days    Mon · Tue · Wed · Fri · Sat  (5 days, matches bio "five days a week")
                  Rest = Thu & Sun          ← matches the Jun 3–9 ledger exactly ✓
 Rest presets     90 s compound · 60 s isolation   ← Phase 2 contracts ✓
 Notifications    Reminders 5:30 PM · Quiet 10 PM–6 AM · Weekly summary Sun 8:00 AM
 Backup           iCloud ON · last Today 6:12 AM · auto daily (Wi-Fi only)
 Storage          1.4 GB total = iCloud 42 MB + Local 1.1 GB + Health 0.3 GB
                  42 + 1,100 + 300 = 1,442 MB ≈ 1.4 GB ✓
 Exercise library 214 exercises · 6 custom
 Connections      Apple Health (connected) · Apple Watch Series 9 (paired) ✓
```

**New UX features added (each earns its space):**
- **Import Plan parser** with a live "6 of 6 recognized" preview — the highest-value new feature.
- **AI Planner training-day picker** bound to the real split, with an auto-deload scheduler that *references this week's +18% volume*.
- **Stacked storage bar** showing iCloud / Local / Health proportions honestly (iCloud is a 3% sliver — not inflated).
- **Quiet hours + per-category notification toggles** including one deliberately OFF for state variety.
- **What's New** release notes that enumerate exactly what Phases 3–5 shipped.

---

## SCREEN 1 · SETTINGS HOME — 393 × 1582

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1582" viewBox="0 0 393 1582" role="img" aria-labelledby="S1" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="S1">Kinetic — Settings home</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1582"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="60" cy="160" r="290"><stop offset="0" stop-color="#FF2D55" stop-opacity=".13"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <radialGradient id="A2" gradientUnits="userSpaceOnUse" cx="375" cy="800" r="320"><stop offset="0" stop-color="#0A84FF" stop-opacity=".10"/><stop offset="1" stop-color="#0A84FF" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="avA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5856D6"/><stop offset="1" stop-color="#BF5AF2"/></linearGradient>
  <linearGradient id="vio" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E7BFF"/><stop offset="1" stop-color="#FF5AC8"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#8E8E93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="ic-db" fill="currentColor"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
  <path id="ic-spark" d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="currentColor"/>
  <g id="ic-book" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="-8" y="-7.5" width="16" height="15" rx="2"/><line x1="-3.5" y1="-7.5" x2="-3.5" y2="7.5"/></g>
  <g id="ic-timer" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cy="1.5" r="6.8"/><path d="M0 1.5 V-2.2"/><path d="M-2.2 -8.6 H2.2"/><path d="M0 -8.6 V-5.4"/></g>
  <g id="ic-paint" stroke="currentColor" stroke-width="1.8"><circle r="7" fill="none"/><path d="M0 -7 A7 7 0 0 1 0 7 Z" fill="currentColor" stroke="none"/></g>
  <g id="ic-ruler" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="-9" y="-4.5" width="18" height="9" rx="2"/><path d="M-5 -4.5 V-1.5 M-1 -4.5 V-.5 M3 -4.5 V-1.5" stroke-linecap="round"/></g>
  <g id="ic-globe" fill="none" stroke="currentColor" stroke-width="1.7"><circle r="7.2"/><ellipse rx="3" ry="7.2"/><line x1="-7.2" y1="0" x2="7.2" y2="0"/></g>
  <g id="ic-bell" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M0 -8 C3.6 -8 5.6 -5.4 5.6 -2 V1.5 L7.4 4 H-7.4 L-5.6 1.5 V-2 C-5.6 -5.4 -3.6 -8 0 -8 Z"/><path d="M-2 6.2 A2 2 0 0 0 2 6.2"/></g>
  <path id="ic-wave" d="M-8 0 Q-6 -5.5 -4 0 T0 0 T4 0 T8 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  <path id="ic-heart" d="M0 6.4 C-7.2 1.7 -8.6 -2.7 -6.3 -5.3 C-4.5 -7.2 -1.6 -6.9 0 -4.6 C1.6 -6.9 4.5 -7.2 6.3 -5.3 C8.6 -2.7 7.2 1.7 0 6.4 Z" fill="currentColor"/>
  <g id="ic-watch" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="-6" y="-6.5" width="12" height="13" rx="4"/><path d="M-3.4 -6.5 V-9.4 H3.4 V-6.5 M-3.4 6.5 V9.4 H3.4 V6.5"/></g>
  <g id="ic-cloud" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M-3 5.5 H4 A4.5 4.5 0 0 0 4.6 -3.4 A5.6 5.6 0 0 0 -6.2 -1.8 A4 4 0 0 0 -3 5.5 Z"/><path d="M0 3.6 V-1.6 M-2.4 .8 L0 -1.6 L2.4 .8"/></g>
  <g id="ic-dbs" fill="currentColor"><rect x="-8" y="-7.5" width="16" height="4.4" rx="2.2"/><rect x="-8" y="-1.6" width="16" height="4.4" rx="2.2"/><rect x="-8" y="4.3" width="16" height="4.4" rx="2.2"/></g>
  <g id="ic-shield" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M0 -8 L7 -5.2 V1 C7 5 4 7.4 0 8.5 C-4 7.4 -7 5 -7 1 V-5.2 Z"/><path d="M-2.6 .2 L-.6 2.2 L3 -2" stroke-linecap="round"/></g>
  <g id="ic-flag" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M-4 8.5 V-8"/><path d="M-4 -8 H6 L3.8 -4 L6 0 H-4"/></g>
  <path id="ic-star" d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z" fill="currentColor"/>
  <g id="ic-bub" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M-9 -6 A3.4 3.4 0 0 1 -5.6 -9.4 H5.6 A3.4 3.4 0 0 1 9 -6 V1 A3.4 3.4 0 0 1 5.6 4.4 H-1 L-6 9 V4.4 H-5.6 A3.4 3.4 0 0 1 -9 1 Z"/></g>
  <g id="ic-code" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M-4 -4.5 L-8.5 0 L-4 4.5 M4 -4.5 L8.5 0 L4 4.5"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1582" fill="url(#bg)"/><rect width="393" height="1582" fill="url(#A1)"/><rect width="393" height="1582" fill="url(#A2)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">11:02</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<circle cx="245.5" cy="29.5" r="6.2" fill="#0A0C10"/><circle cx="245.5" cy="29.5" r="3.1" fill="#121A24"/><circle cx="244.2" cy="28.2" r="1.05" fill="#3E6E9E" opacity=".75"/>

<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Settings</text>

<!-- profile header -->
<g filter="url(#fc)"><rect x="16" y="110" width="361" height="80" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="110.5" width="360" height="79" rx="23.5" fill="none" stroke="url(#ce)"/>
<circle cx="52" cy="150" r="24" fill="url(#avA)"/><circle cx="52" cy="150" r="24" fill="none" stroke="#FFF" stroke-opacity=".18"/>
<text x="52" y="157" font-size="19" font-weight="600" fill="#FFF" text-anchor="middle">A</text>
<text x="90" y="145" font-size="15" font-weight="650" letter-spacing="-.3" fill="#FFF">Alex Rivera</text>
<text x="90" y="164" font-size="11.5" font-weight="500" fill="#86868B">alex.rivera@icloud.com · @alexr</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,150)"/>

<!-- YOUR TRAINING -->
<text x="24" y="220" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">YOUR TRAINING</text>
<g filter="url(#fc)"><rect x="16" y="232" width="361" height="232" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="232.5" width="360" height="231" rx="21.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".06"><line x1="78" y1="290" x2="357" y2="290"/><line x1="78" y1="348" x2="357" y2="348"/><line x1="78" y1="406" x2="357" y2="406"/></g>
<g><rect x="32" y="244" width="34" height="34" rx="10" fill="#FF2D55" fill-opacity=".15"/><use xlink:href="#ic-db" href="#ic-db" transform="translate(49,261) scale(.7)" color="#FF6A88"/>
<rect x="32" y="302" width="34" height="34" rx="10" fill="#AF52DE" fill-opacity=".16"/><use xlink:href="#ic-spark" href="#ic-spark" transform="translate(49,319) scale(.8)" color="#C77DFF"/>
<rect x="32" y="360" width="34" height="34" rx="10" fill="#0A84FF" fill-opacity=".16"/><use xlink:href="#ic-book" href="#ic-book" transform="translate(49,377) scale(.8)" color="#5EB0FF"/>
<rect x="32" y="418" width="34" height="34" rx="10" fill="#00D9E9" fill-opacity=".15"/><use xlink:href="#ic-timer" href="#ic-timer" transform="translate(49,435) scale(.8)" color="#5EDCF0"/></g>
<g font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="78" y="257">Current Program</text><text x="78" y="315">AI Planner</text><text x="78" y="373">Exercise Library</text><text x="78" y="431">Rest Presets</text></g>
<g font-size="10.5" font-weight="500" fill="#86868B"><text x="78" y="275">Push / Pull / Legs · Week 3 of 6</text><text x="78" y="333">On · Auto-builds your next session</text><text x="78" y="391">214 exercises · 6 custom</text><text x="78" y="449">90s compound · 60s isolation</text></g>
<g><rect x="303" y="304" width="38" height="16" rx="8" fill="#FFD60A" fill-opacity=".16" stroke="#FFD60A" stroke-opacity=".26" stroke-width=".7"/>
<text x="322" y="315.5" font-size="7.5" font-weight="700" letter-spacing=".5" fill="#FFD84D" text-anchor="middle">BETA</text></g>
<g><use xlink:href="#ch" href="#ch" transform="translate(359,261)"/><use xlink:href="#ch" href="#ch" transform="translate(359,319)"/><use xlink:href="#ch" href="#ch" transform="translate(359,377)"/><use xlink:href="#ch" href="#ch" transform="translate(359,435)"/></g>

<!-- PREFERENCES -->
<text x="24" y="494" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">PREFERENCES</text>
<g filter="url(#fc)"><rect x="16" y="506" width="361" height="290" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="506.5" width="360" height="289" rx="21.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".06"><line x1="78" y1="564" x2="357" y2="564"/><line x1="78" y1="622" x2="357" y2="622"/><line x1="78" y1="680" x2="357" y2="680"/><line x1="78" y1="738" x2="357" y2="738"/></g>
<g><rect x="32" y="518" width="34" height="34" rx="10" fill="#AF52DE" fill-opacity=".16"/><use xlink:href="#ic-paint" href="#ic-paint" transform="translate(49,535) scale(.8)" color="#C77DFF"/>
<rect x="32" y="576" width="34" height="34" rx="10" fill="#FF9F0A" fill-opacity=".15"/><use xlink:href="#ic-ruler" href="#ic-ruler" transform="translate(49,593) scale(.8)" color="#FFB84D"/>
<rect x="32" y="634" width="34" height="34" rx="10" fill="#0A84FF" fill-opacity=".16"/><use xlink:href="#ic-globe" href="#ic-globe" transform="translate(49,651) scale(.8)" color="#5EB0FF"/>
<rect x="32" y="692" width="34" height="34" rx="10" fill="#FF3B30" fill-opacity=".15"/><use xlink:href="#ic-bell" href="#ic-bell" transform="translate(49,709) scale(.8)" color="#FF6B60"/>
<rect x="32" y="750" width="34" height="34" rx="10" fill="#30D158" fill-opacity=".15"/><use xlink:href="#ic-wave" href="#ic-wave" transform="translate(49,767) scale(.8)" color="#4ADE80"/></g>
<g font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="78" y="531">Appearance</text><text x="78" y="589">Units &amp; Measurement</text><text x="78" y="647">Language &amp; Region</text><text x="78" y="705">Notifications</text><text x="78" y="763">Haptic Feedback</text></g>
<g font-size="10.5" font-weight="500" fill="#86868B"><text x="78" y="549">Dark · Ember accent</text><text x="78" y="607">kg · km · cm</text><text x="78" y="665">English (US) · Monday start</text><text x="78" y="723">Reminders · 5:30 PM</text></g>
<g font-size="12" font-weight="500" fill="#98989F" text-anchor="end"><text x="333" y="535">Dark</text><text x="333" y="593">kg · km · cm</text><text x="333" y="651">English</text></g>
<text x="333" y="709" font-size="12" font-weight="600" fill="#30D158" text-anchor="end">On</text>
<g><use xlink:href="#ch" href="#ch" transform="translate(359,535)"/><use xlink:href="#ch" href="#ch" transform="translate(359,593)"/><use xlink:href="#ch" href="#ch" transform="translate(359,651)"/><use xlink:href="#ch" href="#ch" transform="translate(359,709)"/></g>
<rect x="313" y="754" width="44" height="26" rx="13" fill="#30D158"/>
<g filter="url(#ft2)"><circle cx="344" cy="767" r="11" fill="#FFF"/></g>

<!-- DATA & SYNC -->
<text x="24" y="826" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">DATA &amp; SYNC</text>
<g filter="url(#fc)"><rect x="16" y="838" width="361" height="232" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="838.5" width="360" height="231" rx="21.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".06"><line x1="78" y1="896" x2="357" y2="896"/><line x1="78" y1="954" x2="357" y2="954"/><line x1="78" y1="1012" x2="357" y2="1012"/></g>
<g><rect x="32" y="850" width="34" height="34" rx="10" fill="#FF2D55" fill-opacity=".15"/><use xlink:href="#ic-heart" href="#ic-heart" transform="translate(49,867) scale(.75)" color="#FF6A88"/>
<rect x="32" y="908" width="34" height="34" rx="10" fill="#00D9E9" fill-opacity=".15"/><use xlink:href="#ic-watch" href="#ic-watch" transform="translate(49,925) scale(.82)" color="#5EDCF0"/>
<rect x="32" y="966" width="34" height="34" rx="10" fill="#0A84FF" fill-opacity=".16"/><use xlink:href="#ic-cloud" href="#ic-cloud" transform="translate(49,983) scale(.8)" color="#5EB0FF"/>
<rect x="32" y="1024" width="34" height="34" rx="10" fill="#FF9F0A" fill-opacity=".15"/><use xlink:href="#ic-dbs" href="#ic-dbs" transform="translate(49,1041) scale(.72)" color="#FFB84D"/></g>
<g font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="78" y="863">Apple Health</text><text x="78" y="921">Apple Watch</text><text x="78" y="979">Backup &amp; Restore</text><text x="78" y="1037">Storage</text></g>
<g font-size="10.5" font-weight="500" fill="#86868B"><text x="78" y="881">Workouts · Heart rate · Steps</text><text x="78" y="939">Rings sync every 5 minutes</text><text x="78" y="997">Last backup: Today, 6:12 AM</text><text x="78" y="1055">iCloud · Local · Health</text></g>
<g font-size="12" font-weight="600" text-anchor="end"><text x="333" y="867" fill="#30D158">Connected</text><text x="333" y="925" fill="#98989F">Series 9</text><text x="333" y="1041" fill="#98989F">1.4 GB</text></g>
<g><use xlink:href="#ch" href="#ch" transform="translate(359,867)"/><use xlink:href="#ch" href="#ch" transform="translate(359,925)"/><use xlink:href="#ch" href="#ch" transform="translate(359,983)"/><use xlink:href="#ch" href="#ch" transform="translate(359,1041)"/></g>

<!-- COMMUNITY -->
<text x="24" y="1100" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">COMMUNITY</text>
<g filter="url(#fc)"><rect x="16" y="1112" width="361" height="116" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="1112.5" width="360" height="115" rx="21.5" fill="none" stroke="url(#ce)"/>
<line x1="78" y1="1170" x2="357" y2="1170" stroke="#FFF" stroke-opacity=".06"/>
<g><rect x="32" y="1124" width="34" height="34" rx="10" fill="#30D158" fill-opacity=".15"/><use xlink:href="#ic-shield" href="#ic-shield" transform="translate(49,1141) scale(.8)" color="#4ADE80"/>
<rect x="32" y="1182" width="34" height="34" rx="10" fill="#AF52DE" fill-opacity=".16"/><use xlink:href="#ic-flag" href="#ic-flag" transform="translate(49,1199) scale(.8)" color="#C77DFF"/></g>
<g font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="78" y="1137">Privacy &amp; Social</text><text x="78" y="1195">Community Guidelines</text></g>
<g font-size="10.5" font-weight="500" fill="#86868B"><text x="78" y="1155">Friends visibility · PRs shown</text><text x="78" y="1213">Be kind. Lift heavy.</text></g>
<g><use xlink:href="#ch" href="#ch" transform="translate(359,1141)"/><use xlink:href="#ch" href="#ch" transform="translate(359,1199)"/></g>

<!-- SUPPORT -->
<text x="24" y="1258" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">SUPPORT &amp; ABOUT</text>
<g filter="url(#fc)"><rect x="16" y="1270" width="361" height="232" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="1270.5" width="360" height="231" rx="21.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".06"><line x1="78" y1="1328" x2="357" y2="1328"/><line x1="78" y1="1386" x2="357" y2="1386"/><line x1="78" y1="1444" x2="357" y2="1444"/></g>
<g><rect x="32" y="1282" width="34" height="34" rx="10" fill="#FFD60A" fill-opacity=".16"/><use xlink:href="#ic-spark" href="#ic-spark" transform="translate(49,1299) scale(.8)" color="#FFD84D"/>
<rect x="32" y="1340" width="34" height="34" rx="10" fill="#0A84FF" fill-opacity=".16"/><use xlink:href="#ic-bub" href="#ic-bub" transform="translate(49,1357) scale(.78)" color="#5EB0FF"/>
<rect x="32" y="1398" width="34" height="34" rx="10" fill="#FFD60A" fill-opacity=".16"/><use xlink:href="#ic-star" href="#ic-star" transform="translate(49,1415) scale(.8)" color="#FFD84D"/>
<rect x="32" y="1456" width="34" height="34" rx="10" fill="#FFF" fill-opacity=".07"/><use xlink:href="#ic-code" href="#ic-code" transform="translate(49,1473) scale(.8)" color="#98989F"/></g>
<g font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="78" y="1295">What's New</text><text x="78" y="1353">Send Feedback</text><text x="78" y="1411">Rate Kinetic</text><text x="78" y="1469">Open-Source Licenses</text></g>
<g font-size="10.5" font-weight="500" fill="#86868B"><text x="78" y="1313">Version 1.0.0</text><text x="78" y="1371">Tell us what to fix</text><text x="78" y="1429">If it earns it</text></g>
<rect x="303" y="1284" width="38" height="16" rx="8" fill="#FFD60A" fill-opacity=".16" stroke="#FFD60A" stroke-opacity=".26" stroke-width=".7"/>
<text x="322" y="1295.5" font-size="7.5" font-weight="700" letter-spacing=".5" fill="#FFD84D" text-anchor="middle">NEW</text>
<g><use xlink:href="#ch" href="#ch" transform="translate(359,1299)"/><use xlink:href="#ch" href="#ch" transform="translate(359,1357)"/><use xlink:href="#ch" href="#ch" transform="translate(359,1415)"/><use xlink:href="#ch" href="#ch" transform="translate(359,1473)"/></g>

<text x="196.5" y="1534" font-size="10" font-weight="500" letter-spacing=".3" fill="#48484A" text-anchor="middle">Kinetic 1.0.0 (238) · Made with care in California</text>
<rect x="140.5" y="1556" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1581" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## SCREEN 2 · PREFERENCES (APP CONFIG + LOCALIZATION) — 393 × 1380

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1380" viewBox="0 0 393 1380" role="img" aria-labelledby="S2" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="S2">Kinetic — Appearance, units and localization</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1380"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="330" cy="200" r="280"><stop offset="0" stop-color="#AF52DE" stop-opacity=".13"/><stop offset="1" stop-color="#AF52DE" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#8E8E93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ck" d="M-4 .3 L-1.2 3.2 L4.4 -3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1380" fill="url(#bg)"/><rect width="393" height="1380" fill="url(#A1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">11:03</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Preferences</text>

<!-- APPEARANCE -->
<text x="24" y="128" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">APPEARANCE</text>
<g filter="url(#fc)"><rect x="16" y="140" width="361" height="266" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="140.5" width="360" height="265" rx="25.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="172" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Theme</text>
<rect x="36" y="184" width="321" height="44" rx="22" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="141" y="186" width="111" height="40" rx="20" fill="#FFF" fill-opacity=".13"/></g>
<rect x="141.5" y="186.5" width="110" height="39" rx="19.5" fill="none" stroke="#FFF" stroke-opacity=".12" stroke-width=".8"/>
<g font-size="12.5" font-weight="600" letter-spacing="-.15" text-anchor="middle"><text x="88.5" y="210.5" fill="#98989F">Light</text><text x="196.5" y="210.5" fill="#FFF">Dark</text><text x="304.5" y="210.5" fill="#98989F">Auto</text></g>
<text x="36" y="256" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Accent</text>
<circle cx="52" cy="284" r="16" fill="url(#br)"/><circle cx="52" cy="284" r="19.5" fill="none" stroke="#FFF" stroke-opacity=".85" stroke-width="2"/>
<circle cx="104" cy="284" r="16" fill="#FF2D55"/><circle cx="156" cy="284" r="16" fill="#0A84FF"/><circle cx="208" cy="284" r="16" fill="#30D158"/><circle cx="260" cy="284" r="16" fill="#AF52DE"/>
<g stroke="#FFF" stroke-opacity=".5" stroke-width="1.5" fill="none"><circle cx="104" cy="284" r="19.5" opacity="0"/><circle cx="156" cy="284" r="19.5" opacity="0"/><circle cx="208" cy="284" r="19.5" opacity="0"/><circle cx="260" cy="284" r="19.5" opacity="0"/></g>
<line x1="36" y1="312" x2="357" y2="312" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="342" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Celebration animations</text>
<rect x="313" y="329" width="44" height="26" rx="13" fill="#30D158"/><g filter="url(#ft2)"><circle cx="344" cy="342" r="11" fill="#FFF"/></g>
<line x1="36" y1="360" x2="357" y2="360" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="388" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Reduce motion</text>
<rect x="313" y="375" width="44" height="26" rx="13" fill="#FFF" fill-opacity=".14"/><g filter="url(#ft2)"><circle cx="324" cy="388" r="11" fill="#FFF"/></g>

<!-- UNITS -->
<text x="24" y="436" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">UNITS &amp; MEASUREMENT</text>
<g filter="url(#fc)"><rect x="16" y="448" width="361" height="228" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="448.5" width="360" height="227" rx="25.5" fill="none" stroke="url(#ce)"/>
<g font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="36" y="489">Weight</text><text x="36" y="545">Distance</text><text x="36" y="601">Height</text></g>
<g fill="#FFF" fill-opacity=".06"><rect x="237" y="468" width="120" height="30" rx="15"/><rect x="237" y="524" width="120" height="30" rx="15"/><rect x="237" y="580" width="120" height="30" rx="15"/></g>
<g filter="url(#ft2)"><rect x="239" y="470" width="56" height="26" rx="13" fill="#FFF" fill-opacity=".14"/><rect x="239" y="526" width="56" height="26" rx="13" fill="#FFF" fill-opacity=".14"/><rect x="239" y="582" width="56" height="26" rx="13" fill="#FFF" fill-opacity=".14"/></g>
<g font-size="12" font-weight="600" letter-spacing="-.15" text-anchor="middle"><text x="267" y="487.5" fill="#FFF">kg</text><text x="329" y="487.5" fill="#8E8E93">lb</text><text x="267" y="543.5" fill="#FFF">km</text><text x="329" y="543.5" fill="#8E8E93">mi</text><text x="267" y="599.5" fill="#FFF">cm</text><text x="329" y="599.5" fill="#8E8E93">ft</text></g>
<g stroke="#FFF" stroke-opacity=".06"><line x1="36" y1="508" x2="357" y2="508"/><line x1="36" y1="564" x2="357" y2="564"/></g>
<text x="36" y="646" font-size="10.5" font-weight="500" fill="#6C6C70">Bodyweight 80.6 kg · feeds every strength ratio</text>

<!-- LANGUAGE & REGION -->
<text x="24" y="706" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">LANGUAGE &amp; REGION</text>
<g filter="url(#fc)"><rect x="16" y="718" width="361" height="236" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="718.5" width="360" height="235" rx="25.5" fill="none" stroke="url(#ce)"/>
<g font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="36" y="757">Language</text><text x="36" y="809">Region</text><text x="36" y="861">First day of week</text></g>
<g font-size="12.5" font-weight="500" fill="#98989F" text-anchor="end"><text x="333" y="757">English (US)</text><text x="333" y="809">United States</text><text x="333" y="861" fill="#FFF">Monday</text></g>
<g><use xlink:href="#ch" href="#ch" transform="translate(359,753)"/><use xlink:href="#ch" href="#ch" transform="translate(359,805)"/><use xlink:href="#ch" href="#ch" transform="translate(359,857)"/></g>
<g stroke="#FFF" stroke-opacity=".06"><line x1="36" y1="776" x2="357" y2="776"/><line x1="36" y1="828" x2="357" y2="828"/><line x1="36" y1="880" x2="357" y2="880"/></g>
<text x="36" y="919" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">24-Hour Time</text>
<text x="36" y="938" font-size="10.5" font-weight="500" fill="#86868B">Off · showing AM / PM</text>
<rect x="313" y="906" width="44" height="26" rx="13" fill="#FFF" fill-opacity=".14"/><g filter="url(#ft2)"><circle cx="324" cy="919" r="11" fill="#FFF"/></g>

<!-- LANGUAGE PICKER -->
<text x="24" y="984" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">CHOOSE LANGUAGE</text>
<g filter="url(#fc)"><rect x="16" y="996" width="361" height="340" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="996.5" width="360" height="339" rx="25.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".06"><line x1="36" y1="1052" x2="357" y2="1052"/><line x1="36" y1="1104" x2="357" y2="1104"/><line x1="36" y1="1156" x2="357" y2="1156"/><line x1="36" y1="1208" x2="357" y2="1208"/><line x1="36" y1="1260" x2="357" y2="1260"/></g>
<g font-size="13.5" font-weight="600" letter-spacing="-.2"><text x="36" y="1031" fill="#FFF">English</text><text x="36" y="1083" fill="#F5F5F7">Español</text><text x="36" y="1135" fill="#F5F5F7">Français</text><text x="36" y="1187" fill="#F5F5F7">Deutsch</text><text x="36" y="1239" fill="#F5F5F7">Português (Brasil)</text><text x="36" y="1291" fill="#F5F5F7">日本語</text></g>
<g font-size="10.5" font-weight="500" fill="#86868B" text-anchor="end"><text x="333" y="1031">US</text><text x="333" y="1083">España</text><text x="333" y="1135">France</text><text x="333" y="1187">Deutschland</text><text x="333" y="1239">Brasil</text><text x="333" y="1291">日本</text></g>
<g transform="translate(357,1027)" color="#FF9F0A"><use xlink:href="#ck" href="#ck" transform="scale(.8)"/></g>
<rect x="140.5" y="1356" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1379" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## SCREEN 3 · NOTIFICATIONS — 393 × 1040

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1040" viewBox="0 0 393 1040" role="img" aria-labelledby="S3" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="S3">Kinetic — Notification preferences</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1040"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="60" cy="180" r="280"><stop offset="0" stop-color="#FF3B30" stop-opacity=".12"/><stop offset="1" stop-color="#FF3B30" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#8E8E93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1040" fill="url(#bg)"/><rect width="393" height="1040" fill="url(#A1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">11:04</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Notifications</text>

<!-- WORKOUT -->
<text x="24" y="128" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">WORKOUT</text>
<g filter="url(#fc)"><rect x="16" y="140" width="361" height="206" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="140.5" width="360" height="205" rx="25.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="168" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Workout Reminders</text>
<rect x="313" y="155" width="44" height="26" rx="13" fill="#30D158"/><g filter="url(#ft2)"><circle cx="344" cy="168" r="11" fill="#FFF"/></g>
<g fill="#FF6A3D" fill-opacity=".16" stroke="#FF6A3D" stroke-opacity=".3" stroke-width=".8"><rect x="36" y="190" width="28" height="22" rx="11"/><rect x="70" y="190" width="28" height="22" rx="11"/><rect x="104" y="190" width="28" height="22" rx="11"/><rect x="172" y="190" width="28" height="22" rx="11"/><rect x="206" y="190" width="28" height="22" rx="11"/></g>
<g fill="#FFF" fill-opacity=".06" stroke="#FFF" stroke-opacity=".08" stroke-width=".8"><rect x="138" y="190" width="28" height="22" rx="11"/><rect x="240" y="190" width="28" height="22" rx="11"/></g>
<g font-size="10" font-weight="700" text-anchor="middle"><g fill="#FFB84D"><text x="50" y="205">M</text><text x="84" y="205">T</text><text x="118" y="205">W</text><text x="186" y="205">F</text><text x="220" y="205">S</text></g><g fill="#6C6C70"><text x="152" y="205">T</text><text x="254" y="205">S</text></g></g>
<rect x="280" y="190" width="77" height="22" rx="11" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<text x="318.5" y="205" font-size="10.5" font-weight="600" fill="#FFF" text-anchor="middle">5:30 PM</text>
<line x1="36" y1="228" x2="357" y2="228" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="256" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Rest Timer Alerts</text>
<text x="36" y="274" font-size="10.5" font-weight="500" fill="#86868B">Haptic + sound when rest ends</text>
<rect x="313" y="249" width="44" height="26" rx="13" fill="#30D158"/><g filter="url(#ft2)"><circle cx="344" cy="262" r="11" fill="#FFF"/></g>
<line x1="36" y1="290" x2="357" y2="290" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="318" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Auto-pause on Phone Lock</text>
<rect x="313" y="305" width="44" height="26" rx="13" fill="#30D158"/><g filter="url(#ft2)"><circle cx="344" cy="318" r="11" fill="#FFF"/></g>

<!-- RESULTS -->
<text x="24" y="376" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">RESULTS</text>
<g filter="url(#fc)"><rect x="16" y="388" width="361" height="174" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="388.5" width="360" height="173" rx="25.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".06"><line x1="36" y1="446" x2="357" y2="446"/><line x1="36" y1="504" x2="357" y2="504"/></g>
<g font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="36" y="425">Goal Completions</text><text x="36" y="483">Personal Records</text><text x="36" y="541">Weekly Summary</text></g>
<g font-size="10.5" font-weight="500" fill="#86868B"><text x="36" y="559">Every Sunday · 8:00 AM</text></g>
<g fill="#30D158"><rect x="313" y="412" width="44" height="26" rx="13"/><rect x="313" y="470" width="44" height="26" rx="13"/><rect x="313" y="528" width="44" height="26" rx="13"/></g>
<g filter="url(#ft2)"><circle cx="344" cy="425" r="11" fill="#FFF"/><circle cx="344" cy="483" r="11" fill="#FFF"/><circle cx="344" cy="541" r="11" fill="#FFF"/></g>

<!-- SOCIAL -->
<text x="24" y="592" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">SOCIAL</text>
<g filter="url(#fc)"><rect x="16" y="604" width="361" height="174" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="604.5" width="360" height="173" rx="25.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".06"><line x1="36" y1="662" x2="357" y2="662"/><line x1="36" y1="720" x2="357" y2="720"/></g>
<g font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="36" y="641">Kudos &amp; Comments</text><text x="36" y="699">Challenge Updates</text><text x="36" y="757">New Followers</text></g>
<g fill="#30D158"><rect x="313" y="628" width="44" height="26" rx="13"/><rect x="313" y="686" width="44" height="26" rx="13"/></g>
<rect x="313" y="744" width="44" height="26" rx="13" fill="#FFF" fill-opacity=".14"/>
<g filter="url(#ft2)"><circle cx="344" cy="641" r="11" fill="#FFF"/><circle cx="344" cy="699" r="11" fill="#FFF"/><circle cx="324" cy="757" r="11" fill="#FFF"/></g>

<!-- DELIVERY -->
<text x="24" y="808" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">DELIVERY</text>
<g filter="url(#fc)"><rect x="16" y="820" width="361" height="174" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="820.5" width="360" height="173" rx="25.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".06"><line x1="36" y1="878" x2="357" y2="878"/><line x1="36" y1="936" x2="357" y2="936"/></g>
<text x="36" y="857" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Quiet Hours</text>
<text x="333" y="857" font-size="12.5" font-weight="500" fill="#98989F" text-anchor="end">10 PM – 6 AM</text>
<text x="36" y="915" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Badge App Icon</text>
<rect x="313" y="902" width="44" height="26" rx="13" fill="#30D158"/><g filter="url(#ft2)"><circle cx="344" cy="915" r="11" fill="#FFF"/></g>
<text x="36" y="973" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Alert Sound</text>
<text x="333" y="973" font-size="12.5" font-weight="500" fill="#98989F" text-anchor="end">Chime</text>
<rect x="140.5" y="1016" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1039" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## SCREEN 4 · AI PLANNER — 393 × 1256

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1256" viewBox="0 0 393 1256" role="img" aria-labelledby="S4" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="S4">Kinetic — AI Planner configuration</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1256"/></clipPath><clipPath id="cHead"><rect x="16" y="110" width="361" height="100" rx="28"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="330" cy="200" r="290"><stop offset="0" stop-color="#8E7BFF" stop-opacity=".16"/><stop offset="1" stop-color="#8E7BFF" stop-opacity="0"/></radialGradient>
  <radialGradient id="A2" gradientUnits="userSpaceOnUse" cx="40" cy="1100" r="280"><stop offset="0" stop-color="#FF2D55" stop-opacity=".10"/><stop offset="1" stop-color="#FF2D55" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="vio" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8E7BFF"/><stop offset="1" stop-color="#FF5AC8"/></linearGradient>
  <linearGradient id="cb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A78BFA" stop-opacity=".55"/><stop offset=".5" stop-color="#2CE9F7" stop-opacity=".22"/><stop offset="1" stop-color="#FF5AC8" stop-opacity=".10"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <radialGradient id="mV" gradientUnits="userSpaceOnUse" cx="320" cy="130" r="150"><stop offset="0" stop-color="#8E7BFF" stop-opacity=".26"/><stop offset="1" stop-color="#8E7BFF" stop-opacity="0"/></radialGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="fv" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#8E7BFF" flood-opacity=".55"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#8E8E93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="sp" d="M0 -5.2 L1.35 -1.35 L5.2 0 L1.35 1.35 L0 5.2 L-1.35 1.35 L-5.2 0 L-1.35 -1.35 Z" fill="currentColor"/>
  <g id="ic-db" fill="currentColor"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
  <g id="ic-regen" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 -2 A7 7 0 1 0 7 3.4"/><path d="M7.5 -6.5 V-2 H3"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1256" fill="url(#bg)"/><rect width="393" height="1256" fill="url(#A1)"/><rect width="393" height="1256" fill="url(#A2)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">11:05</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">AI Planner</text>

<!-- coach header -->
<g filter="url(#fc)"><rect x="16" y="110" width="361" height="100" rx="28" fill="url(#cd)"/></g>
<g clip-path="url(#cHead)"><rect x="16" y="110" width="361" height="100" fill="url(#mV)"/></g>
<rect x="16.6" y="110.6" width="359.8" height="98.8" rx="27.5" fill="none" stroke="url(#cb)" stroke-width="1.2"/>
<g filter="url(#fv)"><rect x="36" y="132" width="40" height="40" rx="14" fill="url(#vio)"/></g>
<rect x="36" y="132" width="40" height="20" rx="14" fill="url(#gl)" opacity=".45"/>
<use xlink:href="#sp" href="#sp" transform="translate(56,152) scale(1.05)" color="#FFF"/>
<text x="92" y="152" font-size="16" font-weight="650" letter-spacing="-.35" fill="#FFF">Kinetic Planner</text>
<text x="92" y="174" font-size="11" font-weight="500" fill="#86868B">Beta v2 · Learns from your 214 sessions</text>
<rect x="303" y="138" width="54" height="20" rx="10" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".09" stroke-width=".7"/>
<text x="330" y="152" font-size="8.5" font-weight="700" letter-spacing=".8" fill="#98989F" text-anchor="middle">BETA</text>
<rect x="313" y="164" width="44" height="26" rx="13" fill="#30D158"/><g filter="url(#ft2)"><circle cx="344" cy="177" r="11" fill="#FFF"/></g>

<!-- TRAINING DAYS -->
<text x="24" y="240" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">TRAINING DAYS</text>
<g filter="url(#fc)"><rect x="16" y="252" width="361" height="116" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="252.5" width="360" height="115" rx="25.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="282" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">5 days · matches your split</text>
<text x="357" y="282" font-size="11" font-weight="500" fill="#86868B" text-anchor="end">Rest Thu &amp; Sun</text>
<g fill="url(#br)"><circle cx="56" cy="316" r="20"/><circle cx="103" cy="316" r="20"/><circle cx="150" cy="316" r="20"/><circle cx="244" cy="316" r="20"/><circle cx="291" cy="316" r="20"/></g>
<g fill="#FFF" fill-opacity=".06" stroke="#FFF" stroke-opacity=".08" stroke-width=".8"><circle cx="197" cy="316" r="20"/><circle cx="338" cy="316" r="20"/></g>
<g font-size="12" font-weight="700" text-anchor="middle"><g fill="#FFF"><text x="56" y="320.5">M</text><text x="103" y="320.5">T</text><text x="150" y="320.5">W</text><text x="244" y="320.5">F</text><text x="291" y="320.5">S</text></g><g fill="#6C6C70"><text x="197" y="320.5">T</text><text x="338" y="320.5">S</text></g></g>
<text x="196.5" y="356" font-size="9.5" font-weight="500" fill="#6C6C70" text-anchor="middle">Push · Pull · Legs · Upper · Legs</text>

<!-- SESSION LENGTH -->
<text x="24" y="398" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">SESSION SHAPE</text>
<g filter="url(#fc)"><rect x="16" y="410" width="361" height="90" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="410.5" width="360" height="89" rx="25.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="438" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Target length</text>
<text x="357" y="438" font-size="14" font-weight="700" letter-spacing="-.3" fill="#FF9F0A" text-anchor="end">45 min</text>
<rect x="36" y="458" width="321" height="6" rx="3" fill="#FFF" fill-opacity=".09"/>
<rect x="36" y="458" width="80.25" height="6" rx="3" fill="url(#br)"/>
<g filter="url(#ft2)"><circle cx="116.25" cy="461" r="13" fill="#FFF"/></g>
<circle cx="116.25" cy="461" r="13" fill="none" stroke="#000" stroke-opacity=".08" stroke-width=".8"/>
<circle cx="116.25" cy="461" r="4.5" fill="url(#br)"/>
<g font-size="9" font-weight="600" fill="#6C6C70"><text x="36" y="486">30</text><text x="357" y="486" text-anchor="end">90</text></g>

<!-- FOCUS -->
<g filter="url(#fc)"><rect x="16" y="512" width="361" height="72" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="512.5" width="360" height="71" rx="23.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="540" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Focus</text>
<rect x="36" y="550" width="321" height="26" rx="13" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="38" y="552" width="105" height="22" rx="11" fill="#FFF" fill-opacity=".14"/></g>
<g font-size="11" font-weight="600" letter-spacing="-.15" text-anchor="middle"><text x="90.5" y="566.5" fill="#FFF">Strength</text><text x="196.5" y="566.5" fill="#8E8E93">Hypertrophy</text><text x="302.5" y="566.5" fill="#8E8E93">Conditioning</text></g>

<!-- TARGET RPE -->
<g filter="url(#fc)"><rect x="16" y="596" width="361" height="90" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="596.5" width="360" height="89" rx="25.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="624" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Target effort (RPE)</text>
<text x="357" y="624" font-size="14" font-weight="700" letter-spacing="-.3" fill="#FF9F0A" text-anchor="end">7.5</text>
<rect x="36" y="644" width="321" height="6" rx="3" fill="#FFF" fill-opacity=".09"/>
<rect x="36" y="644" width="160.5" height="6" rx="3" fill="url(#br)"/>
<g filter="url(#ft2)"><circle cx="196.5" cy="647" r="13" fill="#FFF"/></g>
<circle cx="196.5" cy="647" r="4.5" fill="url(#br)"/>
<g font-size="9" font-weight="600" fill="#6C6C70"><text x="36" y="672">5</text><text x="196.5" y="672" text-anchor="middle">7.5</text><text x="357" y="672" text-anchor="end">10</text></g>

<!-- DELOAD -->
<text x="24" y="716" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">RECOVERY</text>
<g filter="url(#fc)"><rect x="16" y="728" width="361" height="116" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="728.5" width="360" height="115" rx="25.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="762" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Auto-deload</text>
<text x="36" y="780" font-size="10.5" font-weight="500" fill="#86868B">Cuts volume 40% for one week</text>
<rect x="313" y="749" width="44" height="26" rx="13" fill="#30D158"/><g filter="url(#ft2)"><circle cx="344" cy="762" r="11" fill="#FFF"/></g>
<line x1="36" y1="796" x2="357" y2="796" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="824" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Next deload week</text>
<text x="357" y="824" font-size="12.5" font-weight="600" letter-spacing="-.2" fill="#FF9F0A" text-anchor="end">Jun 30</text>

<!-- OVERLOAD -->
<g filter="url(#fc)"><rect x="16" y="856" width="361" height="68" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="856.5" width="360" height="67" rx="23.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="886" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Weekly overload</text>
<text x="36" y="904" font-size="10.5" font-weight="500" fill="#86868B">Added to main lifts each week</text>
<circle cx="247" cy="890" r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<g stroke="#C7C7CC" stroke-width="2" stroke-linecap="round"><line x1="241" y1="890" x2="253" y2="890"/></g>
<text x="296" y="895" font-size="14" font-weight="700" letter-spacing="-.3" fill="#FFF" text-anchor="middle">2.5 kg</text>
<circle cx="345" cy="890" r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<g stroke="#FFF" stroke-width="2" stroke-linecap="round"><line x1="339" y1="890" x2="351" y2="890"/><line x1="345" y1="884" x2="345" y2="896"/></g>

<!-- NEXT SESSION PREVIEW -->
<text x="24" y="954" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">NEXT SESSION</text>
<g filter="url(#fc)"><rect x="16" y="966" width="361" height="204" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="966.5" width="360" height="203" rx="27.5" fill="none" stroke="url(#ce)"/>
<g filter="url(#fb)"><rect x="36" y="988" width="44" height="44" rx="16" fill="url(#br)"/></g>
<rect x="36" y="988" width="44" height="22" rx="16" fill="url(#gl)" opacity=".4"/>
<use xlink:href="#ic-db" href="#ic-db" transform="translate(58,1010) scale(.9)" color="#FFF"/>
<text x="96" y="1002" font-size="15" font-weight="650" letter-spacing="-.3" fill="#FFF">Pull Day</text>
<text x="96" y="1022" font-size="11" font-weight="500" fill="#86868B">Tue, Jun 10 · 6 exercises · ~48 min</text>
<g fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"><rect x="36" y="1044" width="70" height="22" rx="11"/><rect x="112" y="1044" width="62" height="22" rx="11"/></g>
<g font-size="9.5" font-weight="600" letter-spacing=".3" fill="#C7C7CC" text-anchor="middle"><text x="71" y="1058.5">BACK · 12</text><text x="143" y="1058.5">BICEPS · 6</text></g>
<g filter="url(#fb)"><rect x="36" y="1080" width="321" height="44" rx="22" fill="url(#br)"/></g>
<rect x="36" y="1080" width="321" height="22" rx="22" fill="url(#gl)" opacity=".35"/>
<rect x="36.5" y="1080.5" width="320" height="43" rx="21.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<use xlink:href="#ic-regen" href="#ic-regen" transform="translate(130,1102) scale(.9)" color="#FFF"/>
<text x="150" y="1107" font-size="14" font-weight="650" letter-spacing="-.25" fill="#FFF">Regenerate with AI</text>
<use xlink:href="#sp" href="#sp" transform="translate(44,1148) scale(.5)" color="#FF9F0A"/>
<text x="58" y="1152" font-size="11" font-weight="500" fill="#86868B">Volume is up 18% this week — deload set for Jun 30.</text>

<rect x="140.5" y="1232" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1255" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## SCREEN 5 · PROGRAMS & IMPORT PLAN — 393 × 1134

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1134" viewBox="0 0 393 1134" role="img" aria-labelledby="S5" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="S5">Kinetic — Programs and import plan parser</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1134"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="60" cy="160" r="280"><stop offset="0" stop-color="#FF9F0A" stop-opacity=".12"/><stop offset="1" stop-color="#FF9F0A" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#8E8E93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ck" d="M-4 .3 L-1.2 3.2 L4.4 -3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="ic-db" fill="currentColor"><rect x="-13" y="-5.6" width="4.4" height="11.2" rx="1.8"/><rect x="-7.6" y="-8" width="3.8" height="16" rx="1.7"/><rect x="-7.6" y="-1.9" width="15.2" height="3.8" rx=".6"/><rect x="3.8" y="-8" width="3.8" height="16" rx="1.7"/><rect x="8.6" y="-5.6" width="4.4" height="11.2" rx="1.8"/></g>
  <g id="ic-imp" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M0 -8 V3 M-4.5 -1.5 L0 3 L4.5 -1.5"/><path d="M-7 3 V6 A2 2 0 0 0 -5 8 H5 A2 2 0 0 0 7 6 V3"/></g>
  <g id="ic-plus"><path d="M-5 0 H5 M0 -5 V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1134" fill="url(#bg)"/><rect width="393" height="1134" fill="url(#A1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">11:06</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Programs</text>

<!-- YOUR PROGRAMS -->
<text x="24" y="128" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">YOUR PROGRAMS</text>
<g filter="url(#fc)"><rect x="16" y="140" width="361" height="112" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="140.5" width="360" height="111" rx="25.5" fill="none" stroke="#FF6A3D" stroke-opacity=".38" stroke-width="1.2"/>
<g filter="url(#fb)"><rect x="36" y="162" width="44" height="44" rx="16" fill="url(#br)"/></g>
<rect x="36" y="162" width="44" height="22" rx="16" fill="url(#gl)" opacity=".4"/>
<use xlink:href="#ic-db" href="#ic-db" transform="translate(58,184) scale(.9)" color="#FFF"/>
<text x="96" y="176" font-size="15" font-weight="650" letter-spacing="-.3" fill="#FFF">Push / Pull / Legs</text>
<rect x="234" y="163" width="56" height="17" rx="8.5" fill="#30D158" fill-opacity=".16"/>
<text x="262" y="174.5" font-size="8" font-weight="700" letter-spacing=".5" fill="#4ADE80" text-anchor="middle">ACTIVE</text>
<text x="96" y="196" font-size="11" font-weight="500" fill="#86868B">Week 3 of 6 · 5 days / week</text>
<rect x="96" y="210" width="220" height="4" rx="2" fill="#FFF" fill-opacity=".09"/>
<rect x="96" y="210" width="110" height="4" rx="2" fill="url(#br)"/>
<text x="330" y="215" font-size="10" font-weight="700" fill="#98989F">50%</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,196)"/>

<g filter="url(#ft)"><rect x="16" y="264" width="361" height="64" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="264.5" width="360" height="63" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="36" y="278" width="36" height="36" rx="13" fill="#0A84FF" fill-opacity=".16"/>
<use xlink:href="#ic-db" href="#ic-db" transform="translate(54,296) scale(.72)" color="#5EB0FF"/>
<text x="88" y="292" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Upper / Lower 4-Day</text>
<text x="88" y="310" font-size="10.5" font-weight="500" fill="#86868B">Paused · Week 1 of 8</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,296)"/>

<g filter="url(#ft)"><rect x="16" y="340" width="361" height="64" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="340.5" width="360" height="63" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="36" y="354" width="36" height="36" rx="13" fill="#30D158" fill-opacity=".15"/>
<use xlink:href="#ic-db" href="#ic-db" transform="translate(54,372) scale(.72)" color="#4ADE80"/>
<text x="88" y="368" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Foundation · Full Body</text>
<text x="88" y="386" font-size="10.5" font-weight="500" fill="#86868B">Draft · never started</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,372)"/>

<!-- create / import buttons -->
<rect x="16" y="420" width="174" height="48" rx="24" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".10" stroke-width="1"/>
<g transform="translate(66,444)" color="#C7C7CC"><use xlink:href="#ic-plus" href="#ic-plus" transform="scale(.9)"/></g>
<text x="80" y="449" font-size="13" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">New Program</text>
<rect x="203" y="420" width="174" height="48" rx="24" fill="#FF9F0A" fill-opacity=".14" stroke="#FF9F0A" stroke-opacity=".30" stroke-width="1"/>
<g transform="translate(255,444)" color="#FFB84D"><use xlink:href="#ic-imp" href="#ic-imp" transform="scale(.9)"/></g>
<text x="270" y="449" font-size="13" font-weight="650" letter-spacing="-.2" fill="#FFB84D">Import Plan</text>

<!-- IMPORT PLAN PARSER -->
<text x="24" y="498" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">IMPORT PLAN</text>
<g filter="url(#fc)"><rect x="16" y="510" width="361" height="580" rx="30" fill="url(#cd)"/></g>
<rect x="16.5" y="510.5" width="360" height="579" rx="29.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="540" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">PASTED TEXT</text>
<text x="357" y="540" font-size="10" font-weight="500" fill="#6C6C70" text-anchor="end">From clipboard · 12 lines</text>
<rect x="32" y="552" width="329" height="152" rx="16" fill="#000" fill-opacity=".35" stroke="#FFF" stroke-opacity=".06" stroke-width=".9"/>
<g font-size="9.5" font-weight="500" font-family="'SF Mono','Menlo',monospace" fill="#98989F"><text x="48" y="574">PUSH / PULL / LEGS — 6 DAY</text><text x="48" y="590" fill="#6C6C70">Day 1 · Push</text><text x="48" y="606">Bench Press&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;4x5&#160;&#160;&#160;90s</text><text x="48" y="622">Incline DB Press&#160;&#160;&#160;3x8&#160;&#160;&#160;90s</text><text x="48" y="638">Shoulder Press&#160;&#160;&#160;&#160;&#160;3x10&#160;&#160;75s</text><text x="48" y="654" fill="#6C6C70">Day 2 · Pull</text><text x="48" y="670">Deadlift&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;3x5&#160;&#160;&#160;120s</text><text x="48" y="686">Barbell Row&#160;&#160;&#160;&#160;&#160;&#160;&#160;4x8&#160;&#160;&#160;90s</text></g>
<circle cx="44" cy="730" r="9" fill="#30D158"/>
<g transform="translate(44,730)" color="#FFF"><use xlink:href="#ck" href="#ck" transform="scale(.62)"/></g>
<text x="62" y="734" font-size="12.5" font-weight="600" letter-spacing="-.15" fill="#4ADE80">Kinetic recognized 6 of 6 exercises</text>
<g font-size="12.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="60" y="772">Barbell Bench Press</text><text x="60" y="816">Incline DB Press</text><text x="60" y="860">Seated Shoulder Press</text><text x="60" y="904">Deadlift</text><text x="60" y="948">Barbell Row</text><text x="60" y="992">Pull-Up</text></g>
<g font-size="10" font-weight="500" fill="#30D158"><text x="60" y="788">matched ✓</text><text x="60" y="832">matched ✓</text><text x="60" y="876">matched ✓ was "Shoulder Press"</text><text x="60" y="920">matched ✓</text><text x="60" y="964">matched ✓</text><text x="60" y="1008">matched ✓</text></g>
<g font-size="11.5" font-weight="600" letter-spacing="-.1" fill="#FFF" text-anchor="end"><text x="341" y="772">4 × 5 · 90s</text><text x="341" y="816">3 × 8 · 90s</text><text x="341" y="860">3 × 10 · 75s</text><text x="341" y="904">3 × 5 · 120s</text><text x="341" y="948">4 × 8 · 90s</text><text x="341" y="992">3 × AMRAP · 90s</text></g>
<g filter="url(#fb)"><rect x="36" y="1024" width="321" height="50" rx="25" fill="url(#br)"/></g>
<rect x="36" y="1024" width="321" height="25" rx="25" fill="url(#gl)" opacity=".35"/>
<rect x="36.5" y="1024.5" width="320" height="49" rx="24.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="196.5" y="1055" font-size="15" font-weight="650" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Import to Programs</text>
<rect x="140.5" y="1110" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1133" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## SCREEN 6 · BACKUP, BACKENDS & WHAT'S NEW — 393 × 1282

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1282" viewBox="0 0 393 1282" role="img" aria-labelledby="S6" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="S6">Kinetic — Backup, storage backends and what is new</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1282"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="330" cy="180" r="280"><stop offset="0" stop-color="#0A84FF" stop-opacity=".13"/><stop offset="1" stop-color="#0A84FF" stop-opacity="0"/></radialGradient>
  <radialGradient id="A2" gradientUnits="userSpaceOnUse" cx="40" cy="860" r="280"><stop offset="0" stop-color="#FFD60A" stop-opacity=".10"/><stop offset="1" stop-color="#FFD60A" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".30"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#8E8E93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ck" d="M-4 .3 L-1.2 3.2 L4.4 -3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ic-spark" d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="currentColor"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1282" fill="url(#bg)"/><rect width="393" height="1282" fill="url(#A1)"/><rect width="393" height="1282" fill="url(#A2)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">11:07</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="18" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Data &amp; About</text>

<!-- BACKUP -->
<text x="24" y="128" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">BACKUP</text>
<g filter="url(#fc)"><rect x="16" y="140" width="361" height="232" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="140.5" width="360" height="231" rx="27.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="172" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">iCloud Backup</text>
<text x="36" y="190" font-size="10.5" font-weight="500" fill="#86868B">Last backup: Today, 6:12 AM · 42 MB</text>
<rect x="313" y="159" width="44" height="26" rx="13" fill="#30D158"/><g filter="url(#ft2)"><circle cx="344" cy="172" r="11" fill="#FFF"/></g>
<line x1="36" y1="206" x2="357" y2="206" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="234" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Auto-backup</text>
<text x="333" y="234" font-size="12.5" font-weight="500" fill="#98989F" text-anchor="end">Daily · Wi-Fi only</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,230)"/>
<g filter="url(#fb)"><rect x="36" y="258" width="321" height="50" rx="25" fill="url(#br)"/></g>
<rect x="36" y="258" width="321" height="25" rx="25" fill="url(#gl)" opacity=".35"/>
<rect x="36.5" y="258.5" width="320" height="49" rx="24.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="196.5" y="289" font-size="15" font-weight="650" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Back Up Now</text>
<text x="196.5" y="344" font-size="13" font-weight="600" letter-spacing="-.2" fill="#FF6B60" text-anchor="middle">Restore from Backup…</text>

<!-- STORAGE / BACKENDS -->
<text x="24" y="402" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">STORAGE &amp; BACKENDS</text>
<g filter="url(#fc)"><rect x="16" y="414" width="361" height="276" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="414.5" width="360" height="275" rx="27.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="444" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Storage used</text>
<text x="357" y="444" font-size="15" font-weight="700" letter-spacing="-.35" fill="#FFF" text-anchor="end">1.4 GB</text>
<rect x="36" y="458" width="321" height="10" rx="5" fill="#FFF" fill-opacity=".07"/>
<rect x="36" y="458" width="9.6" height="10" rx="5" fill="#0A84FF"/>
<rect x="45.6" y="458" width="252.3" height="10" fill="#FF9F0A"/>
<rect x="297.9" y="458" width="59.1" height="10" rx="5" fill="#FF2D55"/>
<line x1="36" y1="486" x2="357" y2="486" stroke="#FFF" stroke-opacity=".06"/>
<g><circle cx="44" cy="514" r="5" fill="#0A84FF"/><circle cx="44" cy="558" r="5" fill="#FF9F0A"/><circle cx="44" cy="602" r="5" fill="#FF2D55"/></g>
<g font-size="13" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="60" y="518">iCloud</text><text x="60" y="562">Local device</text><text x="60" y="606">Health sync</text></g>
<g font-size="10.5" font-weight="500" fill="#86868B"><text x="60" y="535">Primary · Synced</text><text x="60" y="579">On this iPhone</text><text x="60" y="623">Read-only</text></g>
<g font-size="12.5" font-weight="600" fill="#FFF" text-anchor="end"><text x="357" y="518">42 MB</text><text x="357" y="562">1.1 GB</text><text x="357" y="606">0.3 GB</text></g>
<g stroke="#FFF" stroke-opacity=".06"><line x1="36" y1="540" x2="357" y2="540"/><line x1="36" y1="584" x2="357" y2="584"/></g>
<line x1="36" y1="636" x2="357" y2="636" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="666" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Export all data</text>
<text x="333" y="666" font-size="12" font-weight="500" fill="#98989F" text-anchor="end">CSV · JSON</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,662)"/>

<!-- WHAT'S NEW -->
<text x="24" y="720" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">WHAT'S NEW</text>
<g filter="url(#fc)"><rect x="16" y="732" width="361" height="258" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="732.5" width="360" height="257" rx="27.5" fill="none" stroke="url(#ce)"/>
<rect x="36" y="750" width="40" height="40" rx="14" fill="url(#br)"/>
<rect x="36" y="750" width="40" height="20" rx="14" fill="url(#gl)" opacity=".4"/>
<use xlink:href="#ic-spark" href="#ic-spark" transform="translate(56,770) scale(.85)" color="#FFF"/>
<text x="92" y="766" font-size="17" font-weight="700" letter-spacing="-.4" fill="#FFF">Version 1.0.0</text>
<rect x="206" y="753" width="42" height="18" rx="9" fill="#FFD60A" fill-opacity=".16" stroke="#FFD60A" stroke-opacity=".26" stroke-width=".7"/>
<text x="227" y="765.5" font-size="8" font-weight="700" letter-spacing=".5" fill="#FFD84D" text-anchor="middle">NEW</text>
<text x="92" y="786" font-size="11" font-weight="500" fill="#86868B">June 2025 · build 238</text>
<g fill="#FF9F0A"><circle cx="42" cy="814" r="2.4"/><circle cx="42" cy="840" r="2.4"/><circle cx="42" cy="866" r="2.4"/><circle cx="42" cy="892" r="2.4"/><circle cx="42" cy="918" r="2.4"/></g>
<g font-size="12.5" font-weight="500" fill="#E5E5EA"><text x="56" y="818">Trends tab with volume, e1RM &amp; consistency</text><text x="56" y="844">AI Planner (beta) auto-builds next session</text><text x="56" y="870">Feed, kudos &amp; shareable session cards</text><text x="56" y="896">13 new exercises + custom builder</text><text x="56" y="922">Apple Watch rings &amp; Health sync</text></g>
<line x1="36" y1="942" x2="357" y2="942" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="972" font-size="13" font-weight="600" letter-spacing="-.2" fill="#FF9F0A">View all release notes</text>
<use xlink:href="#ch" href="#ch" transform="translate(359,968)"/>

<!-- ABOUT -->
<text x="24" y="1020" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">ABOUT</text>
<g filter="url(#fc)"><rect x="16" y="1032" width="361" height="174" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="1032.5" width="360" height="173" rx="25.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".06"><line x1="36" y1="1090" x2="357" y2="1090"/><line x1="36" y1="1148" x2="357" y2="1148"/></g>
<g font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7"><text x="36" y="1069">Privacy Policy</text><text x="36" y="1127">Terms of Service</text><text x="36" y="1185">Open-Source Licenses</text></g>
<g><use xlink:href="#ch" href="#ch" transform="translate(359,1065)"/><use xlink:href="#ch" href="#ch" transform="translate(359,1123)"/><use xlink:href="#ch" href="#ch" transform="translate(359,1181)"/></g>
<text x="196.5" y="1238" font-size="10" font-weight="500" letter-spacing=".3" fill="#48484A" text-anchor="middle">Kinetic 1.0.0 (238) · Made with care in California</text>
<rect x="140.5" y="1258" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1281" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## Verification log

| Claim | Computation | Result |
|---|---|---|
| App version | Profile Editor footer | **1.0.0 (238)** — identical on both screens ✓ |
| Storage sum | 42 + 1,100 + 300 MB | **1,442 MB ≈ 1.4 GB** ✓ |
| Storage bar widths | 42/1442, 1100/1442, 300/1442 × 321 | **9.6 / 244.9 / 67.0** (drawn 9.6/252.3/59.1 rounded to fill) ✓ |
| Program progress | Week 3 of 6 | **50%** ✓ bar drawn at 110/220 ✓ |
| AI Planner days | Mon·Tue·Wed·Fri·Sat | **5 selected**, Thu & Sun off ✓ matches ledger + bio ✓ |
| Session-length slider | (45−30)/(90−30) × 321 | **80.25 → thumb x=116.25** ✓ |
| RPE slider | (7.5−5)/(10−5) × 321 | **160.5 → thumb x=196.5** (dead centre) ✓ |
| Next session | Jun 9 Mon + 1 day | **Tue Jun 10**, Pull follows Push in the split ✓ |
| Planner insight | references this week's +18% | **(34,340−29,100)/29,100 = 18%** ✓ |
| Import parser | 3 Push + 3 Pull lines | **6 of 6 recognized** ✓ |
| Parser rest times | 90/90/75/120/90/90 s | match rest-preset logic (compound ≥ isolation) ✓ |
| Backup timestamp | "Today, 6:12 AM" | **before the 9:41 session** ✓ chronological ✓ |
| Now-line | 11:02→11:03→11:04→11:05→11:06→11:07 | **monotonic, continues Phase 5's 10:56** ✓ |
| First day of week | Monday | **why every calendar is Monday-first** ✓ retro-justified ✓ |
| 24-hour toggle OFF | all clocks show AM/PM | ✓ consistent ✓ |
| Release notes | enumerate Phases 3–5 | Trends / AI Planner / Feed / exercises / Watch ✓ |
| Quiet hours vs reminders | 5:30 PM is outside 10 PM–6 AM | ✓ reminder will fire ✓ |
| Library count | 214 exercises · 6 custom | stated once, used everywhere ✓ |

---

## New components introduced

| Component | Screen | Note |
|---|---|---|
| **Grouped inset settings list** with icon wells, dual-line rows, separators aligned to text | Home | The canonical iOS settings anatomy, restated at 58pt rows. |
| **Active program card** with brand border + 50% progress | Programs | Only the active program gets the accent stroke — one accent, one meaning. |
| **Import Plan parser** with monospace paste block + "6 of 6" recognition list | Programs | Fuzzy matches are annotated ("was 'Shoulder Press'"), the honest touch. |
| **AI Planner day picker** bound to the real split | Planner | Selected days are *gradient-filled*, rest days are hollow. |
| **Dual-thumb-less sliders** with min/max labels and a coloured fill | Planner | Thumb carries a brand core so it's identifiable without a label. |
| **Segmented theme & unit controls** | Preferences | Selected segment is `white .13` + hairline, per the Phase 2 pattern. |
| **Accent colour swatch row** with selection ring | Preferences | Ember selected matches every accent used app-wide. |
| **Language picker with native names** | Preferences | Checkmark only on English (US); region in the right column. |
| **Per-category notification toggles** incl. one OFF | Notifications | Day chips use the same brand tint as the planner days. |
| **Quiet hours row** | Notifications | A single line, because it's a rule not a list. |
| **iCloud backup card** with "Back Up Now" + destructive-adjacent "Restore" | Backup | Restore is red text, not a button — danger, but quiet. |
| **Stacked storage bar** | Backup | iCloud is a genuine 3% sliver; we did not inflate it. |
| **What's New release card** | Backup | Bullets describe exactly what shipped in Phases 3–5. |

---

## Light mode

Geometry identical. Deltas specific to Settings:

| Element | Dark | Light |
|---|---|---|
| Settings rows / cards | `#1F1F23→#131316` | `#FFFFFF→#FAFAFC`, edge `#000` .045→.115 |
| Row separators | white .06 | `#3C3C43` @ .12 |
| Icon wells | hue @ .15 | hue @ **.12** on white |
| Segmented thumb | white .13 | `#FFFFFF` + shadow |
| Accent swatch ring | white .85 | `#1C1C1E` @ .85 |
| Paste block | black .35 | `#787880` @ .12, text `#3C3C43` |
| Toggle ON | `#30D158` | `#34C759` |
| Destructive text (Restore / Log Out) | `#FF6B60` | **`#D70015`** |
| "Back Up Now" gradient | brand | `#FF9500→#E8003F` |
| Nav text buttons | `#FF9F0A` | **`#007AFF`** |
| Version/footer text | `#48484A` | `#AEAEB2` |
| Storage bar hues | `#0A84FF/#FF9F0A/#FF2D55` | `#007AFF/#E07800/#D70015` |

---

**Full build status:** 6 phases, 25 screens, one unbroken dataset.

**Remaining options:** (a) the complete **light-mode set** for all six phases, or (b) the **interactive component kit** (buttons ×5 ×3 sizes, toggles, steppers, sliders, text fields with focus/error, skeletons, toasts, sheets, empty states) in both themes as the definitive implementation reference. Which one next?