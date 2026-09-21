# EXERCISE EDITOR — Redesigned (Add / Edit)
### Six canvases · 393 pt · Dark · Draft-on-dismiss model · Every contract item covered

Design decisions taken up front (stated so the build can't drift):
- **Type switch is destructive → it confirms.** A centered alert names exactly what is lost ("rep configuration for all 5 sets") and what survives (name, notes, link). No silent reset.
- **Rest is conditional, not empty.** When Settings → Rest timers is off, rest rows/switches are *removed from the layout*, never shown disabled.
- **Locked tracking toggles read as locked**: dimmed ON switch + a lock glyph, so "auto-on" is never mistaken for a choice.
- **Long names wrap to two lines then ellipsise** in the swap row (row grows); the search field itself stays single-line.
- **Draft model**: nav shows `Done`; a slim amber "Unsaved draft" strip appears only when dirty. Deletion elsewhere dismisses the screen (behaviour, no visual).

---

## S1 · EDIT EXERCISE — WEIGHTED · FIXED (canonical, metric, rest ON)

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1320" viewBox="0 0 393 1320" role="img" aria-labelledby="E1" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="E1">Kinetic — Edit Exercise, weighted fixed-reps mode</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1320" rx="54.5"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="60" cy="150" r="280"><stop offset="0" stop-color="#FF6A3D" stop-opacity=".14"/><stop offset="1" stop-color="#FF6A3D" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#FF9F0A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="mag" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="-1.4" cy="-1.4" r="5.6"/><line x1="2.8" y1="2.8" x2="6.6" y2="6.6"/></g>
  <g id="swap" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M-7 -3 H5 M2 -6 L5 -3 L2 0"/><path d="M7 3 H-5 M-2 0 L-5 3 L-2 6"/></g>
  <g id="lnk" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M-2.5 2.5 L2.5 -2.5"/><path d="M-1 -4 L-3.5 -1.5 A3.4 3.4 0 0 0 1.5 3.5 L4 1"/><path d="M1 4 L3.5 1.5 A3.4 3.4 0 0 0 -1.5 -3.5 L-4 -1"/></g>
  <g id="bm"><circle r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round"/></g>
  <g id="bp"><circle r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#FFF" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="-6" x2="0" y2="6" stroke="#FFF" stroke-width="2" stroke-linecap="round"/></g>
  <g id="tgon"><rect x="-22" y="-13" width="44" height="26" rx="13" fill="#30D158"/><circle cx="9" cy="0" r="11" fill="#FFF"/></g>
  <g id="tgoff"><rect x="-22" y="-13" width="44" height="26" rx="13" fill="#FFF" fill-opacity=".14"/><circle cx="-9" cy="0" r="11" fill="#FFF"/></g>
  <g id="rdsel"><circle r="10" fill="none" stroke="#FF6A3D" stroke-width="2"/><circle r="5" fill="#FF6A3D"/></g>
  <g id="rdoff"><circle r="10" fill="none" stroke="#48484A" stroke-width="1.6"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1320" fill="url(#bg)"/><rect width="393" height="1320" fill="url(#A1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:49</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="19" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Edit Exercise</text>
<text x="369" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FF9F0A" text-anchor="end">Done</text>
<circle cx="120" cy="114" r="3" fill="#FF9F0A"/>
<text x="130" y="118" font-size="10.5" font-weight="500" fill="#86868B">Unsaved draft · commits when you leave</text>

<!-- IDENTITY -->
<text x="24" y="142" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">EXERCISE</text>
<g filter="url(#fc)"><rect x="16" y="154" width="361" height="124" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="154.5" width="360" height="123" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="166" width="329" height="48" rx="14" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".9"/>
<g transform="translate(52,190)" color="#8E8E93"><use xlink:href="#mag" href="#mag" transform="scale(.95)"/></g>
<text x="70" y="195" font-size="14" font-weight="600" letter-spacing="-.25" fill="#FFF">Barbell Bench Press</text>
<g transform="translate(341,190)" color="#FF9F0A"><use xlink:href="#swap" href="#swap" transform="scale(.9)"/></g>
<rect x="32" y="226" width="329" height="40" rx="20" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="34" y="228" width="162.5" height="36" rx="18" fill="#FFF" fill-opacity=".13"/></g>
<rect x="34.5" y="228.5" width="161.5" height="35" rx="17.5" fill="none" stroke="#FFF" stroke-opacity=".12" stroke-width=".8"/>
<g font-size="12.5" font-weight="600" letter-spacing="-.15" text-anchor="middle"><text x="115.25" y="251" fill="#FFF">Weighted</text><text x="279.75" y="251" fill="#8E8E93">Cardio / Time</text></g>

<!-- SET CONFIG -->
<text x="24" y="308" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">SET CONFIGURATION</text>
<g filter="url(#fc)"><rect x="16" y="320" width="361" height="188" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="320.5" width="360" height="187" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="332" width="329" height="40" rx="20" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="34" y="334" width="107.7" height="36" rx="18" fill="#FFF" fill-opacity=".13"/></g>
<g font-size="12" font-weight="600" letter-spacing="-.15" text-anchor="middle"><text x="87.8" y="357" fill="#FFF">Fixed</text><text x="196.5" y="357" fill="#8E8E93">Range</text><text x="305.2" y="357" fill="#8E8E93">Per set</text></g>
<line x1="32" y1="440" x2="357" y2="440" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="417" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Sets</text>
<use xlink:href="#bm" href="#bm" transform="translate(247,412)"/>
<text x="296" y="417" font-size="16" font-weight="700" letter-spacing="-.4" fill="#FFF" text-anchor="middle">4</text>
<use xlink:href="#bp" href="#bp" transform="translate(345,412)"/>
<text x="36" y="473" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Reps</text>
<text x="36" y="491" font-size="10.5" font-weight="500" fill="#86868B">Same target every set</text>
<use xlink:href="#bm" href="#bm" transform="translate(247,468)"/>
<text x="296" y="473" font-size="16" font-weight="700" letter-spacing="-.4" fill="#FFF" text-anchor="middle">5</text>
<use xlink:href="#bp" href="#bp" transform="translate(345,468)"/>

<!-- NOTES & LINK -->
<text x="24" y="526" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">DETAIL</text>
<g filter="url(#fc)"><rect x="16" y="538" width="361" height="210" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="538.5" width="360" height="209" rx="23.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="562" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">NOTES</text>
<rect x="32" y="572" width="329" height="80" rx="16" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".08" stroke-width=".9"/>
<g font-size="12.5" font-weight="500" fill="#E5E5EA"><text x="48" y="596">Grip slightly wider than shoulders.</text><text x="48" y="615">Pause 1 s at chest on set 4 only.</text></g>
<text x="341" y="562" font-size="9" font-weight="500" fill="#6C6C70" text-anchor="end">68 / 280</text>
<text x="36" y="672" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">EXTERNAL LINK</text>
<rect x="32" y="682" width="329" height="48" rx="14" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".08" stroke-width=".9"/>
<g transform="translate(52,706)" color="#8E8E93"><use xlink:href="#lnk" href="#lnk" transform="scale(.9)"/></g>
<text x="70" y="711" font-size="12.5" font-weight="500" fill="#6C6C70">https://</text>

<!-- OPTIONS -->
<text x="24" y="778" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">WORKOUT OPTIONS</text>
<g filter="url(#fc)"><rect x="16" y="790" width="361" height="136" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="790.5" width="360" height="135" rx="23.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="825" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Rest between sets</text>
<rect x="281" y="812" width="52" height="22" rx="11" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/>
<text x="307" y="827" font-size="11" font-weight="600" fill="#FFF" text-anchor="middle">90 s</text>
<use xlink:href="#ch" href="#ch" transform="translate(351,823)"/>
<line x1="32" y1="858" x2="357" y2="858" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="881" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Superset with next</text>
<text x="36" y="899" font-size="10.5" font-weight="500" fill="#86868B">Pairs with Incline DB Press</text>
<use xlink:href="#tgoff" href="#tgoff" transform="translate(335,886)"/>

<!-- RESISTANCE -->
<text x="24" y="956" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">RESISTANCE</text>
<g filter="url(#fc)"><rect x="16" y="968" width="361" height="210" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="968.5" width="360" height="209" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="24" y="974" width="345" height="64" rx="16" fill="#FF6A3D" fill-opacity=".10"/>
<text x="40" y="1000" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FFF">External</text>
<text x="40" y="1018" font-size="10.5" font-weight="500" fill="#98989F">Barbell, dumbbell, machine or cable load.</text>
<use xlink:href="#rdsel" href="#rdsel" transform="translate(341,1006)"/>
<line x1="32" y1="1038" x2="357" y2="1038" stroke="#FFF" stroke-opacity=".06"/>
<text x="40" y="1064" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Bodyweight</text>
<text x="40" y="1082" font-size="10.5" font-weight="500" fill="#86868B">Scaled by your bodyweight (80.6 kg).</text>
<use xlink:href="#rdoff" href="#rdoff" transform="translate(341,1070)"/>
<line x1="32" y1="1102" x2="357" y2="1102" stroke="#FFF" stroke-opacity=".06"/>
<text x="40" y="1128" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">None</text>
<text x="40" y="1146" font-size="10.5" font-weight="500" fill="#86868B">No load tracked — technique or mobility work.</text>
<use xlink:href="#rdoff" href="#rdoff" transform="translate(341,1134)"/>

<!-- PROGRESSION -->
<text x="24" y="1208" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">PROGRESSION</text>
<g filter="url(#fc)"><rect x="16" y="1220" width="361" height="56" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="1220.5" width="360" height="55" rx="19.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="1243" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Progressive overload</text>
<text x="36" y="1261" font-size="10.5" font-weight="500" fill="#86868B">+2.5 kg each session · top set</text>
<use xlink:href="#ch" href="#ch" transform="translate(351,1248)"/>
<rect x="140.5" y="1296" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="1318.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

---

## S2 · REPS EDITOR — ALL THREE MODES (incl. 9-set wrap edge case)

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="922" viewBox="0 0 393 922" role="img" aria-labelledby="E2" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="E2">Kinetic — reps editor modes: fixed, range, per-set with wrapping</title>
<defs>
  <clipPath id="fr"><rect width="393" height="922"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <g id="bm"><circle r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round"/></g>
  <g id="bp"><circle r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#FFF" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="-6" x2="0" y2="6" stroke="#FFF" stroke-width="2" stroke-linecap="round"/></g>
  <g id="bms"><circle r="11" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-4.5" y1="0" x2="4.5" y2="0" stroke="#C7C7CC" stroke-width="1.8" stroke-linecap="round"/></g>
  <g id="bps"><circle r="11" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-4.5" y1="0" x2="4.5" y2="0" stroke="#FFF" stroke-width="1.8" stroke-linecap="round"/><line x1="0" y1="-4.5" x2="0" y2="4.5" stroke="#FFF" stroke-width="1.8" stroke-linecap="round"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="922" fill="url(#bg)"/>
<text x="24" y="40" font-size="20" font-weight="700" letter-spacing="-.5" fill="#FFF">Reps editor</text>
<text x="24" y="60" font-size="11.5" font-weight="500" fill="#86868B">Three mutually-exclusive modes · one is active at a time</text>

<!-- FIXED -->
<g filter="url(#fc)"><rect x="16" y="80" width="361" height="188" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="80.5" width="360" height="187" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="300" y="92" width="57" height="18" rx="9" fill="#FFF" fill-opacity=".09"/>
<text x="328.5" y="104.5" font-size="8" font-weight="700" letter-spacing=".6" fill="#98989F" text-anchor="middle">FIXED</text>
<rect x="32" y="112" width="329" height="36" rx="18" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="34" y="114" width="107.7" height="32" rx="16" fill="#FFF" fill-opacity=".13"/></g>
<g font-size="11.5" font-weight="600" text-anchor="middle"><text x="87.8" y="134.5" fill="#FFF">Fixed</text><text x="196.5" y="134.5" fill="#8E8E93">Range</text><text x="305.2" y="134.5" fill="#8E8E93">Per set</text></g>
<text x="36" y="181" font-size="13.5" font-weight="600" fill="#F5F5F7">Sets</text>
<use xlink:href="#bm" href="#bm" transform="translate(247,176)"/><text x="296" y="181" font-size="16" font-weight="700" fill="#FFF" text-anchor="middle">4</text><use xlink:href="#bp" href="#bp" transform="translate(345,176)"/>
<line x1="32" y1="204" x2="357" y2="204" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="241" font-size="13.5" font-weight="600" fill="#F5F5F7">Reps</text>
<use xlink:href="#bm" href="#bm" transform="translate(247,236)"/><text x="296" y="241" font-size="16" font-weight="700" fill="#FFF" text-anchor="middle">5</text><use xlink:href="#bp" href="#bp" transform="translate(345,236)"/>

<!-- RANGE -->
<g filter="url(#fc)"><rect x="16" y="280" width="361" height="244" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="280.5" width="360" height="243" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="292" y="292" width="65" height="18" rx="9" fill="#FFF" fill-opacity=".09"/>
<text x="324.5" y="304.5" font-size="8" font-weight="700" letter-spacing=".6" fill="#98989F" text-anchor="middle">RANGE</text>
<rect x="32" y="312" width="329" height="36" rx="18" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="141.7" y="314" width="107.7" height="32" rx="16" fill="#FFF" fill-opacity=".13"/></g>
<g font-size="11.5" font-weight="600" text-anchor="middle"><text x="87.8" y="334.5" fill="#8E8E93">Fixed</text><text x="196.5" y="334.5" fill="#FFF">Range</text><text x="305.2" y="334.5" fill="#8E8E93">Per set</text></g>
<text x="36" y="381" font-size="13.5" font-weight="600" fill="#F5F5F7">Sets</text>
<use xlink:href="#bm" href="#bm" transform="translate(247,376)"/><text x="296" y="381" font-size="16" font-weight="700" fill="#FFF" text-anchor="middle">4</text><use xlink:href="#bp" href="#bp" transform="translate(345,376)"/>
<line x1="32" y1="404" x2="357" y2="404" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="441" font-size="13.5" font-weight="600" fill="#F5F5F7">Min reps</text>
<use xlink:href="#bm" href="#bm" transform="translate(247,436)"/><text x="296" y="441" font-size="16" font-weight="700" fill="#FFF" text-anchor="middle">4</text><use xlink:href="#bp" href="#bp" transform="translate(345,436)"/>
<line x1="32" y1="464" x2="357" y2="464" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="501" font-size="13.5" font-weight="600" fill="#F5F5F7">Max reps</text>
<use xlink:href="#bm" href="#bm" transform="translate(247,496)"/><text x="296" y="501" font-size="16" font-weight="700" fill="#FFF" text-anchor="middle">6</text><use xlink:href="#bp" href="#bp" transform="translate(345,496)"/>

<!-- PER SET (9 sets, wraps 3×3) -->
<g filter="url(#fc)"><rect x="16" y="536" width="361" height="342" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="536.5" width="360" height="341" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="284" y="548" width="73" height="18" rx="9" fill="#FFF" fill-opacity=".09"/>
<text x="320.5" y="560.5" font-size="8" font-weight="700" letter-spacing=".6" fill="#98989F" text-anchor="middle">PER SET</text>
<rect x="32" y="568" width="329" height="36" rx="18" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="251.3" y="570" width="107.7" height="32" rx="16" fill="#FFF" fill-opacity=".13"/></g>
<g font-size="11.5" font-weight="600" text-anchor="middle"><text x="87.8" y="590.5" fill="#8E8E93">Fixed</text><text x="196.5" y="590.5" fill="#8E8E93">Range</text><text x="305.2" y="590.5" fill="#FFF">Per set</text></g>
<text x="36" y="637" font-size="13.5" font-weight="600" fill="#F5F5F7">Sets</text>
<text x="200" y="637" font-size="10.5" font-weight="500" fill="#86868B">steppers wrap 3 per row</text>
<use xlink:href="#bm" href="#bm" transform="translate(247,632)"/><text x="296" y="637" font-size="16" font-weight="700" fill="#FFF" text-anchor="middle">9</text><use xlink:href="#bp" href="#bp" transform="translate(345,632)"/>
<!-- 9 wrapped per-set steppers -->
<g>
<g><rect x="32" y="656" width="104" height="52" rx="14" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".07" stroke-width=".8"/><text x="44" y="674" font-size="9" font-weight="700" letter-spacing=".4" fill="#86868B">SET 1</text><use xlink:href="#bms" href="#bms" transform="translate(52,692)"/><text x="84" y="696" font-size="13" font-weight="700" fill="#FFF" text-anchor="middle">5</text><use xlink:href="#bps" href="#bps" transform="translate(116,692)"/></g>
<g><rect x="144" y="656" width="104" height="52" rx="14" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".07" stroke-width=".8"/><text x="156" y="674" font-size="9" font-weight="700" letter-spacing=".4" fill="#86868B">SET 2</text><use xlink:href="#bms" href="#bms" transform="translate(164,692)"/><text x="196" y="696" font-size="13" font-weight="700" fill="#FFF" text-anchor="middle">5</text><use xlink:href="#bps" href="#bps" transform="translate(228,692)"/></g>
<g><rect x="256" y="656" width="104" height="52" rx="14" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".07" stroke-width=".8"/><text x="268" y="674" font-size="9" font-weight="700" letter-spacing=".4" fill="#86868B">SET 3</text><use xlink:href="#bms" href="#bms" transform="translate(276,692)"/><text x="308" y="696" font-size="13" font-weight="700" fill="#FFF" text-anchor="middle">5</text><use xlink:href="#bps" href="#bps" transform="translate(340,692)"/></g>
<g><rect x="32" y="716" width="104" height="52" rx="14" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".07" stroke-width=".8"/><text x="44" y="734" font-size="9" font-weight="700" letter-spacing=".4" fill="#86868B">SET 4</text><use xlink:href="#bms" href="#bms" transform="translate(52,752)"/><text x="84" y="756" font-size="13" font-weight="700" fill="#FFF" text-anchor="middle">4</text><use xlink:href="#bps" href="#bps" transform="translate(116,752)"/></g>
<g><rect x="144" y="716" width="104" height="52" rx="14" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".07" stroke-width=".8"/><text x="156" y="734" font-size="9" font-weight="700" letter-spacing=".4" fill="#86868B">SET 5</text><use xlink:href="#bms" href="#bms" transform="translate(164,752)"/><text x="196" y="756" font-size="13" font-weight="700" fill="#FFF" text-anchor="middle">4</text><use xlink:href="#bps" href="#bps" transform="translate(228,752)"/></g>
<g><rect x="256" y="716" width="104" height="52" rx="14" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".07" stroke-width=".8"/><text x="268" y="734" font-size="9" font-weight="700" letter-spacing=".4" fill="#86868B">SET 6</text><use xlink:href="#bms" href="#bms" transform="translate(276,752)"/><text x="308" y="756" font-size="13" font-weight="700" fill="#FFF" text-anchor="middle">4</text><use xlink:href="#bps" href="#bps" transform="translate(340,752)"/></g>
<g><rect x="32" y="776" width="104" height="52" rx="14" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".07" stroke-width=".8"/><text x="44" y="794" font-size="9" font-weight="700" letter-spacing=".4" fill="#86868B">SET 7</text><use xlink:href="#bms" href="#bms" transform="translate(52,812)"/><text x="84" y="816" font-size="13" font-weight="700" fill="#FFF" text-anchor="middle">3</text><use xlink:href="#bps" href="#bps" transform="translate(116,812)"/></g>
<g><rect x="144" y="776" width="104" height="52" rx="14" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".07" stroke-width=".8"/><text x="156" y="794" font-size="9" font-weight="700" letter-spacing=".4" fill="#86868B">SET 8</text><use xlink:href="#bms" href="#bms" transform="translate(164,812)"/><text x="196" y="816" font-size="13" font-weight="700" fill="#FFF" text-anchor="middle">3</text><use xlink:href="#bps" href="#bps" transform="translate(228,812)"/></g>
<g><rect x="256" y="776" width="104" height="52" rx="14" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".07" stroke-width=".8"/><text x="268" y="794" font-size="9" font-weight="700" letter-spacing=".4" fill="#86868B">SET 9</text><use xlink:href="#bms" href="#bms" transform="translate(276,812)"/><text x="308" y="816" font-size="13" font-weight="700" fill="#FFF" text-anchor="middle">3</text><use xlink:href="#bps" href="#bps" transform="translate(340,812)"/></g>
</g>
<text x="36" y="856" font-size="10.5" font-weight="500" fill="#6C6C70">Drop-set tail: sets 7–9 step down automatically.</text>
<rect x="140.5" y="898" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="921" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## S3 · EDIT EXERCISE — CARDIO / TIME (distance set + time set, tracking locks, add/remove)

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="962" viewBox="0 0 393 962" role="img" aria-labelledby="E3" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="E3">Kinetic — Edit Exercise, cardio/time mode with per-set targets and tracking</title>
<defs>
  <clipPath id="fr"><rect width="393" height="962"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="330" cy="200" r="280"><stop offset="0" stop-color="#00D9E9" stop-opacity=".12"/><stop offset="1" stop-color="#00D9E9" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#FF9F0A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="mag" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="-1.4" cy="-1.4" r="5.6"/><line x1="2.8" y1="2.8" x2="6.6" y2="6.6"/></g>
  <g id="bm"><circle r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round"/></g>
  <g id="bp"><circle r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#FFF" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="-6" x2="0" y2="6" stroke="#FFF" stroke-width="2" stroke-linecap="round"/></g>
  <g id="bms"><circle r="11" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-4.5" y1="0" x2="4.5" y2="0" stroke="#C7C7CC" stroke-width="1.8" stroke-linecap="round"/></g>
  <g id="bps"><circle r="11" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-4.5" y1="0" x2="4.5" y2="0" stroke="#FFF" stroke-width="1.8" stroke-linecap="round"/><line x1="0" y1="-4.5" x2="0" y2="4.5" stroke="#FFF" stroke-width="1.8" stroke-linecap="round"/></g>
  <g id="tgon"><rect x="-22" y="-13" width="44" height="26" rx="13" fill="#30D158"/><circle cx="9" cy="0" r="11" fill="#FFF"/></g>
  <g id="tgoff"><rect x="-22" y="-13" width="44" height="26" rx="13" fill="#FFF" fill-opacity=".14"/><circle cx="-9" cy="0" r="11" fill="#FFF"/></g>
  <g id="tglock"><rect x="-22" y="-13" width="44" height="26" rx="13" fill="#30D158" fill-opacity=".5"/><circle cx="9" cy="0" r="11" fill="#FFF"/></g>
  <g id="lck" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M-3 -1.3 V-3.3 A3 3 0 0 1 3 -3.3 V-1.3"/><rect x="-5" y="-1.3" width="10" height="7.4" rx="2" fill="currentColor" stroke="none"/></g>
  <g id="trash" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M-6 -4 H6"/><path d="M-2.5 -4 V-6.5 H2.5 V-4"/><path d="M-4.5 -4 L-3.8 6.5 H3.8 L4.5 -4"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="962" fill="url(#bg)"/><rect width="393" height="962" fill="url(#A1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:51</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="19" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Edit Exercise</text>
<text x="369" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FF9F0A" text-anchor="end">Done</text>

<!-- identity -->
<g filter="url(#fc)"><rect x="16" y="110" width="361" height="124" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="110.5" width="360" height="123" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="122" width="329" height="48" rx="14" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".9"/>
<g transform="translate(52,146)" color="#8E8E93"><use xlink:href="#mag" href="#mag" transform="scale(.95)"/></g>
<text x="70" y="151" font-size="14" font-weight="600" letter-spacing="-.25" fill="#FFF">Treadmill Intervals</text>
<rect x="32" y="182" width="329" height="40" rx="20" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="196.5" y="184" width="162.5" height="36" rx="18" fill="#FFF" fill-opacity=".13"/></g>
<g font-size="12.5" font-weight="600" letter-spacing="-.15" text-anchor="middle"><text x="115.25" y="207" fill="#8E8E93">Weighted</text><text x="279.75" y="207" fill="#FFF">Cardio / Time</text></g>

<!-- SET 1 · distance -->
<g filter="url(#fc)"><rect x="16" y="246" width="361" height="300" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="246.5" width="360" height="299" rx="25.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="272" font-size="13.5" font-weight="650" letter-spacing="-.2" fill="#FFF">Set 1</text>
<g transform="translate(345,268)" color="#FF6B60"><use xlink:href="#trash" href="#trash" transform="scale(.9)"/></g>
<rect x="32" y="294" width="329" height="40" rx="20" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="34" y="296" width="162.5" height="36" rx="18" fill="#FFF" fill-opacity=".13"/></g>
<g font-size="12.5" font-weight="600" text-anchor="middle"><text x="115.25" y="319" fill="#FFF">Distance</text><text x="279.75" y="319" fill="#8E8E93">Time</text></g>
<text x="36" y="379" font-size="13.5" font-weight="600" fill="#F5F5F7">Distance</text>
<use xlink:href="#bm" href="#bm" transform="translate(150,374)"/><text x="196" y="379" font-size="16" font-weight="700" fill="#FFF" text-anchor="middle">5.0</text><use xlink:href="#bp" href="#bp" transform="translate(242,374)"/>
<rect x="270" y="359" width="88" height="30" rx="15" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="272" y="361" width="42" height="26" rx="13" fill="#FFF" fill-opacity=".13"/></g>
<g font-size="11.5" font-weight="600" text-anchor="middle"><text x="293" y="378.5" fill="#FFF">m</text><text x="337" y="378.5" fill="#8E8E93">km</text></g>
<text x="36" y="424" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">TRACK</text>
<g font-size="12" font-weight="500"><text x="36" y="452" fill="#F5F5F7">Time</text><text x="200" y="452" fill="#F5F5F7">Distance</text><text x="36" y="492" fill="#F5F5F7">Resistance</text><text x="200" y="492" fill="#F5F5F7">Incline</text><text x="36" y="532" fill="#F5F5F7">Weight</text><text x="200" y="532" fill="#F5F5F7">Steps</text></g>
<use xlink:href="#tgon" href="#tgon" transform="translate(164,448)"/>
<g transform="translate(132,448)" color="#86868B"><use xlink:href="#lck" href="#lck" transform="scale(.85)"/></g>
<use xlink:href="#tglock" href="#tglock" transform="translate(335,448)"/>
<use xlink:href="#tgoff" href="#tgoff" transform="translate(164,488)"/>
<use xlink:href="#tgoff" href="#tgoff" transform="translate(335,488)"/>
<use xlink:href="#tgoff" href="#tgoff" transform="translate(164,528)"/>
<use xlink:href="#tgon" href="#tgon" transform="translate(335,528)"/>

<!-- SET 2 · time -->
<g filter="url(#fc)"><rect x="16" y="558" width="361" height="300" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="558.5" width="360" height="299" rx="25.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="584" font-size="13.5" font-weight="650" letter-spacing="-.2" fill="#FFF">Set 2</text>
<g transform="translate(345,580)" color="#FF6B60"><use xlink:href="#trash" href="#trash" transform="scale(.9)"/></g>
<rect x="32" y="606" width="329" height="40" rx="20" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="196.5" y="608" width="162.5" height="36" rx="18" fill="#FFF" fill-opacity=".13"/></g>
<g font-size="12.5" font-weight="600" text-anchor="middle"><text x="115.25" y="631" fill="#8E8E93">Distance</text><text x="279.75" y="631" fill="#FFF">Time</text></g>
<text x="36" y="691" font-size="13.5" font-weight="600" fill="#F5F5F7">Duration</text>
<use xlink:href="#bms" href="#bms" transform="translate(140,686)"/><text x="168" y="690" font-size="14" font-weight="700" fill="#FFF" text-anchor="middle">00</text><use xlink:href="#bps" href="#bps" transform="translate(196,686)"/>
<text x="214" y="690" font-size="14" font-weight="700" fill="#48484A">:</text>
<use xlink:href="#bms" href="#bms" transform="translate(232,686)"/><text x="260" y="690" font-size="14" font-weight="700" fill="#FFF" text-anchor="middle">45</text><use xlink:href="#bps" href="#bps" transform="translate(288,686)"/>
<text x="306" y="690" font-size="14" font-weight="700" fill="#48484A">:</text>
<use xlink:href="#bms" href="#bms" transform="translate(324,686)"/><text x="348" y="690" font-size="14" font-weight="700" fill="#FFF" text-anchor="middle">00</text>
<g font-size="8" font-weight="700" letter-spacing=".5" fill="#6C6C70" text-anchor="middle"><text x="168" y="712">H</text><text x="260" y="712">M</text><text x="348" y="712">S</text></g>
<text x="36" y="736" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">TRACK</text>
<g font-size="12" font-weight="500"><text x="36" y="764" fill="#F5F5F7">Time</text><text x="200" y="764" fill="#F5F5F7">Distance</text><text x="36" y="804" fill="#F5F5F7">Resistance</text><text x="200" y="804" fill="#F5F5F7">Incline</text><text x="36" y="844" fill="#F5F5F7">Weight</text><text x="200" y="844" fill="#F5F5F7">Steps</text></g>
<g transform="translate(132,760)" color="#86868B"><use xlink:href="#lck" href="#lck" transform="scale(.85)"/></g>
<use xlink:href="#tglock" href="#tglock" transform="translate(164,760)"/>
<use xlink:href="#tgoff" href="#tgoff" transform="translate(335,760)"/>
<use xlink:href="#tgon" href="#tgon" transform="translate(164,800)"/>
<use xlink:href="#tgoff" href="#tgoff" transform="translate(335,800)"/>
<use xlink:href="#tgon" href="#tgon" transform="translate(164,840)"/>
<use xlink:href="#tgoff" href="#tgoff" transform="translate(335,840)"/>

<!-- add / remove -->
<rect x="16" y="870" width="174" height="48" rx="24" fill="#FF3B30" fill-opacity=".10" stroke="#FF3B30" stroke-opacity=".22" stroke-width="1"/>
<text x="103" y="899" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#FF6B60" text-anchor="middle">Remove set</text>
<rect x="203" y="870" width="174" height="48" rx="24" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".12" stroke-width="1"/>
<text x="290" y="899" font-size="13.5" font-weight="650" letter-spacing="-.2" fill="#F5F5F7" text-anchor="middle">Add set</text>
<rect x="140.5" y="938" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="960.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

---

## S4 · INTERACTION STATES — destructive confirm · rest editor · overload expanded

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="890" viewBox="0 0 393 890" role="img" aria-labelledby="E4" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="E4">Kinetic — editor interaction states: destructive type switch, rest editor, overload rules</title>
<defs>
  <clipPath id="fr"><rect width="393" height="890"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".32"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fa" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000" flood-opacity=".6"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <g id="bm"><circle r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round"/></g>
  <g id="bp"><circle r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#FFF" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="-6" x2="0" y2="6" stroke="#FFF" stroke-width="2" stroke-linecap="round"/></g>
  <g id="tgon"><rect x="-22" y="-13" width="44" height="26" rx="13" fill="#30D158"/><circle cx="9" cy="0" r="11" fill="#FFF"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="890" fill="url(#bg)"/>

<!-- A · destructive confirm -->
<text x="24" y="40" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">A · DESTRUCTIVE TYPE SWITCH</text>
<g filter="url(#fa)"><rect x="32" y="56" width="329" height="196" rx="24" fill="#1C1C1E"/></g>
<rect x="32.5" y="56.5" width="328" height="195" rx="23.5" fill="none" stroke="#FFF" stroke-opacity=".10"/>
<text x="196.5" y="92" font-size="16" font-weight="650" letter-spacing="-.35" fill="#FFF" text-anchor="middle">Switch to Cardio / Time?</text>
<g font-size="12.5" font-weight="500" fill="#98989F" text-anchor="middle"><text x="196.5" y="120">This resets the rep configuration for</text><text x="196.5" y="138">all 5 sets of this exercise.</text><text x="196.5" y="156" fill="#86868B">Name, notes and link are kept.</text></g>
<line x1="32" y1="180" x2="361" y2="180" stroke="#FFF" stroke-opacity=".08"/>
<line x1="196.5" y1="180" x2="196.5" y2="252" stroke="#FFF" stroke-opacity=".08"/>
<text x="114" y="221" font-size="15" font-weight="600" letter-spacing="-.3" fill="#98989F" text-anchor="middle">Cancel</text>
<text x="279" y="221" font-size="15" font-weight="650" letter-spacing="-.3" fill="#FF6B60" text-anchor="middle">Switch &amp; Reset</text>

<!-- B · rest editor sheet -->
<text x="24" y="292" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">B · REST EDITOR (OPENS FROM REST ROW)</text>
<g filter="url(#fc)"><rect x="16" y="304" width="361" height="264" rx="28" fill="url(#cd)"/></g>
<rect x="16.5" y="304.5" width="360" height="263" rx="27.5" fill="none" stroke="url(#ce)"/>
<rect x="178.5" y="316" width="36" height="5" rx="2.5" fill="#FFF" fill-opacity=".22"/>
<text x="196.5" y="348" font-size="15" font-weight="650" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Rest between sets</text>
<use xlink:href="#bm" href="#bm" transform="translate(120,392)"/>
<text x="196.5" y="402" font-size="40" font-weight="700" letter-spacing="-1.6" fill="#FFF" text-anchor="middle">90 s</text>
<use xlink:href="#bp" href="#bp" transform="translate(273,392)"/>
<g fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".8"><rect x="64.5" y="430" width="48" height="28" rx="14"/><rect x="120.5" y="430" width="48" height="28" rx="14"/><rect x="232.5" y="430" width="44" height="28" rx="14"/><rect x="284.5" y="430" width="44" height="28" rx="14"/></g>
<rect x="176.5" y="430" width="48" height="28" rx="14" fill="#FF6A3D" fill-opacity=".16" stroke="#FF6A3D" stroke-opacity=".32" stroke-width=".9"/>
<g font-size="11.5" font-weight="600" text-anchor="middle"><text x="88.5" y="448.5" fill="#C7C7CC">30s</text><text x="144.5" y="448.5" fill="#C7C7CC">60s</text><text x="200.5" y="448.5" fill="#FFB84D">90s</text><text x="254.5" y="448.5" fill="#C7C7CC">2m</text><text x="306.5" y="448.5" fill="#C7C7CC">3m</text></g>
<g filter="url(#fb)"><rect x="36" y="478" width="321" height="50" rx="25" fill="url(#br)"/></g>
<rect x="36" y="478" width="321" height="25" rx="25" fill="url(#gl)" opacity=".35"/>
<text x="196.5" y="509" font-size="15" font-weight="650" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Apply to all sets</text>

<!-- C · progressive overload expanded -->
<text x="24" y="600" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">C · PROGRESSIVE OVERLOAD · EXPANDED</text>
<g filter="url(#fc)"><rect x="16" y="612" width="361" height="254" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="612.5" width="360" height="253" rx="25.5" fill="none" stroke="#FF6A3D" stroke-opacity=".30" stroke-width="1.1"/>
<text x="36" y="640" font-size="13.5" font-weight="650" letter-spacing="-.2" fill="#FFF">Progressive overload</text>
<use xlink:href="#tgon" href="#tgon" transform="translate(335,635)"/>
<line x1="32" y1="658" x2="357" y2="658" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="691" font-size="13.5" font-weight="600" fill="#F5F5F7">Increment</text>
<use xlink:href="#bm" href="#bm" transform="translate(247,686)"/><text x="296" y="691" font-size="15" font-weight="700" fill="#FFF" text-anchor="middle">2.5 kg</text><use xlink:href="#bp" href="#bp" transform="translate(345,686)"/>
<rect x="32" y="712" width="329" height="36" rx="18" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="34" y="714" width="162.5" height="32" rx="16" fill="#FFF" fill-opacity=".13"/></g>
<g font-size="11.5" font-weight="600" text-anchor="middle"><text x="115.25" y="735" fill="#FFF">Each session</text><text x="279.75" y="735" fill="#8E8E93">Each week</text></g>
<rect x="32" y="756" width="329" height="36" rx="18" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="34" y="758" width="162.5" height="32" rx="16" fill="#FFF" fill-opacity=".13"/></g>
<g font-size="11.5" font-weight="600" text-anchor="middle"><text x="115.25" y="779" fill="#FFF">Top set</text><text x="279.75" y="779" fill="#8E8E93">All sets</text></g>
<text x="36" y="826" font-size="13.5" font-weight="600" fill="#F5F5F7">Double progression</text>
<text x="36" y="844" font-size="10.5" font-weight="500" fill="#86868B">Add reps first, load at top of range</text>
<use xlink:href="#tgon" href="#tgon" transform="translate(335,830)"/>
<rect x="140.5" y="866" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="889" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## S5 · SETTINGS-VARIED & INPUT STATES — rest off · imperial · keyboard avoidance

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="800" viewBox="0 0 393 800" role="img" aria-labelledby="E5" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="E5">Kinetic — editor states driven by settings and keyboard</title>
<defs>
  <clipPath id="fr"><rect width="393" height="800"/></clipPath><clipPath id="kb"><rect x="16" y="394" width="361" height="386" rx="28"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <g id="bm"><circle r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round"/></g>
  <g id="bp"><circle r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#FFF" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="-6" x2="0" y2="6" stroke="#FFF" stroke-width="2" stroke-linecap="round"/></g>
  <g id="tgoff"><rect x="-22" y="-13" width="44" height="26" rx="13" fill="#FFF" fill-opacity=".14"/><circle cx="-9" cy="0" r="11" fill="#FFF"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="800" fill="url(#bg)"/>

<!-- rest timers OFF -->
<text x="24" y="40" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">REST TIMERS OFF · ROWS REMOVED, NOT DISABLED</text>
<g filter="url(#fc)"><rect x="16" y="52" width="361" height="124" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="52.5" width="360" height="123" rx="23.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="85" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Superset with next</text>
<use xlink:href="#tgoff" href="#tgoff" transform="translate(335,80)"/>
<line x1="32" y1="108" x2="357" y2="108" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="141" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Resistance</text>
<text x="357" y="141" font-size="12.5" font-weight="500" fill="#98989F" text-anchor="end">External</text>
<text x="36" y="164" font-size="10.5" font-weight="500" fill="#6C6C70">No rest row appears — timers are off in Settings.</text>

<!-- imperial -->
<text x="24" y="204" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">IMPERIAL UNITS · mi / ft / lb</text>
<g filter="url(#fc)"><rect x="16" y="216" width="361" height="132" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="216.5" width="360" height="131" rx="23.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="249" font-size="13.5" font-weight="600" fill="#F5F5F7">Distance</text>
<use xlink:href="#bm" href="#bm" transform="translate(150,244)"/><text x="196" y="249" font-size="16" font-weight="700" fill="#FFF" text-anchor="middle">3.1</text><use xlink:href="#bp" href="#bp" transform="translate(242,244)"/>
<rect x="270" y="229" width="88" height="30" rx="15" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="272" y="231" width="42" height="26" rx="13" fill="#FFF" fill-opacity=".13"/></g>
<g font-size="11.5" font-weight="600" text-anchor="middle"><text x="293" y="248.5" fill="#FFF">mi</text><text x="337" y="248.5" fill="#8E8E93">ft</text></g>
<line x1="32" y1="272" x2="357" y2="272" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="305" font-size="13.5" font-weight="600" fill="#F5F5F7">Load</text>
<text x="357" y="305" font-size="15" font-weight="700" letter-spacing="-.3" fill="#FFF" text-anchor="end">225 lb</text>
<text x="36" y="330" font-size="10.5" font-weight="500" fill="#6C6C70">Weight displays follow the unit preference.</text>

<!-- keyboard avoidance -->
<text x="24" y="382" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">KEYBOARD AVOIDANCE · CONTENT SHIFTS, NEVER COVERS</text>
<g clip-path="url(#kb)">
<rect x="16" y="394" width="361" height="386" fill="#0A0A0D"/>
<text x="36" y="428" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">NOTES</text>
<rect x="32" y="438" width="329" height="96" rx="16" fill="#FFF" fill-opacity=".05" stroke="url(#br)" stroke-width="1.6"/>
<g font-size="12.5" font-weight="500" fill="#F5F5F7"><text x="48" y="462">Grip slightly wider than shoulders.</text><text x="48" y="481">Pause 1 s at chest on set 4 only.</text><text x="48" y="500">Watch elbow flare on the</text></g>
<rect x="212" y="489" width="2" height="15" rx="1" fill="#FF6A3D"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.51;1" dur="1.1s" repeatCount="indefinite"/></rect>
<rect x="16" y="548" width="361" height="44" fill="#1C1C1E"/>
<line x1="16" y1="548.5" x2="377" y2="548.5" stroke="#FFF" stroke-opacity=".10"/>
<text x="36" y="575" font-size="13" font-weight="600" fill="#98989F">Done</text>
<text x="357" y="575" font-size="13" font-weight="600" fill="#FF9F0A" text-anchor="end">Save</text>
<rect x="16" y="592" width="361" height="188" fill="#2C2C2E"/>
<g fill="#3A3A3C" >
<rect x="24" y="604" width="30" height="38" rx="6"/><rect x="58" y="604" width="30" height="38" rx="6"/><rect x="92" y="604" width="30" height="38" rx="6"/><rect x="126" y="604" width="30" height="38" rx="6"/><rect x="160" y="604" width="30" height="38" rx="6"/><rect x="194" y="604" width="30" height="38" rx="6"/><rect x="228" y="604" width="30" height="38" rx="6"/><rect x="262" y="604" width="30" height="38" rx="6"/><rect x="296" y="604" width="30" height="38" rx="6"/><rect x="330" y="604" width="39" height="38" rx="6"/>
<rect x="24" y="648" width="45" height="38" rx="6"/><rect x="73" y="648" width="30" height="38" rx="6"/><rect x="107" y="648" width="30" height="38" rx="6"/><rect x="141" y="648" width="30" height="38" rx="6"/><rect x="175" y="648" width="30" height="38" rx="6"/><rect x="209" y="648" width="30" height="38" rx="6"/><rect x="243" y="648" width="30" height="38" rx="6"/><rect x="277" y="648" width="30" height="38" rx="6"/><rect x="311" y="648" width="58" height="38" rx="6"/>
<rect x="24" y="692" width="58" height="38" rx="6"/><rect x="86" y="692" width="30" height="38" rx="6"/><rect x="120" y="692" width="150" height="38" rx="6"/><rect x="274" y="692" width="30" height="38" rx="6"/><rect x="308" y="692" width="61" height="38" rx="6"/>
</g>
<rect x="140.5" y="756" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x="16.5" y="394.5" width="360" height="385" rx="27.5" fill="none" stroke="#FFF" stroke-opacity=".12"/>
</g>
<rect x=".5" y=".5" width="392" height="799" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## S6 · ADD EXERCISE MODE — empty search + long-name swap handling

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="704" viewBox="0 0 393 704" role="img" aria-labelledby="E6" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="E6">Kinetic — Add Exercise mode with search results and long-name wrapping</title>
<defs>
  <clipPath id="fr"><rect width="393" height="704"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="60" cy="150" r="280"><stop offset="0" stop-color="#30D158" stop-opacity=".10"/><stop offset="1" stop-color="#30D158" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="ft" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".42"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <filter id="ff" x="-20%" y="-60%" width="140%" height="240%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#FF6A3D" flood-opacity=".4"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#FF9F0A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="mag" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="-1.4" cy="-1.4" r="5.6"/><line x1="2.8" y1="2.8" x2="6.6" y2="6.6"/></g>
  <g id="bm"><circle r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round"/></g>
  <g id="bp"><circle r="15" fill="#FFF" fill-opacity=".08" stroke="#FFF" stroke-opacity=".10" stroke-width=".8"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#FFF" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="-6" x2="0" y2="6" stroke="#FFF" stroke-width="2" stroke-linecap="round"/></g>
  <g id="swap" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M-7 -3 H5 M2 -6 L5 -3 L2 0"/><path d="M7 3 H-5 M-2 0 L-5 3 L-2 6"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="704" fill="url(#bg)"/><rect width="393" height="704" fill="url(#A1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">10:53</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="19" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Add Exercise</text>
<text x="369" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#48484A" text-anchor="end">Done</text>

<!-- search focused + results -->
<text x="24" y="120" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">EXERCISE</text>
<g filter="url(#fc)"><rect x="16" y="132" width="361" height="60" rx="20" fill="url(#cd)"/></g>
<g filter="url(#ff)"><rect x="32" y="142" width="329" height="40" rx="14" fill="#FFF" fill-opacity=".08" stroke="url(#br)" stroke-width="1.6"/></g>
<g transform="translate(52,162)" color="#8E8E93"><use xlink:href="#mag" href="#mag" transform="scale(.95)"/></g>
<text x="70" y="167" font-size="13.5" font-weight="400" fill="#6C6C70">Search exercises…</text>
<rect x="186" y="152" width="2" height="20" rx="1" fill="#FF6A3D"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.51;1" dur="1.1s" repeatCount="indefinite"/></rect>
<g filter="url(#ft)"><rect x="16" y="196" width="361" height="88" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="196.5" width="360" height="87" rx="19.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="208" width="28" height="28" rx="9" fill="#FF2D55" fill-opacity=".15"/>
<text x="46" y="226" font-size="12" font-weight="700" fill="#FF6A88" text-anchor="middle">B</text>
<text x="72" y="226" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Barbell Bench Press</text>
<text x="72" y="243" font-size="10.5" font-weight="500" fill="#86868B">Barbell · Chest</text>
<line x1="32" y1="248" x2="357" y2="248" stroke="#FFF" stroke-opacity=".06"/>
<rect x="32" y="252" width="28" height="28" rx="9" fill="#0A84FF" fill-opacity=".16"/>
<text x="46" y="270" font-size="12" font-weight="700" fill="#5EB0FF" text-anchor="middle">B</text>
<text x="72" y="270" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Bent-Over Barbell Row</text>

<!-- long name wrap -->
<text x="24" y="316" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">LONG NAME · WRAPS TO TWO LINES</text>
<g filter="url(#fc)"><rect x="16" y="328" width="361" height="88" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="328.5" width="360" height="87" rx="21.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="344" width="329" height="56" rx="14" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".09" stroke-width=".9"/>
<g transform="translate(52,372)" color="#8E8E93"><use xlink:href="#mag" href="#mag" transform="scale(.95)"/></g>
<g font-size="13" font-weight="600" letter-spacing="-.2" fill="#FFF"><text x="70" y="366">Seated Machine Shoulder Press with</text><text x="70" y="384">Neutral Grip (Plate-Loaded)…</text></g>
<g transform="translate(341,372)" color="#FF9F0A"><use xlink:href="#swap" href="#swap" transform="scale(.9)"/></g>

<!-- defaults -->
<text x="24" y="448" font-size="10" font-weight="700" letter-spacing="1.35" fill="#86868B">DEFAULT SET</text>
<g filter="url(#fc)"><rect x="16" y="460" width="361" height="188" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="460.5" width="360" height="187" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="472" width="329" height="40" rx="20" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="34" y="474" width="107.7" height="36" rx="18" fill="#FFF" fill-opacity=".13"/></g>
<g font-size="12" font-weight="600" text-anchor="middle"><text x="87.8" y="497" fill="#FFF">Fixed</text><text x="196.5" y="497" fill="#8E8E93">Range</text><text x="305.2" y="497" fill="#8E8E93">Per set</text></g>
<line x1="32" y1="580" x2="357" y2="580" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="557" font-size="13.5" font-weight="600" fill="#F5F5F7">Sets</text>
<use xlink:href="#bm" href="#bm" transform="translate(247,552)"/><text x="296" y="557" font-size="16" font-weight="700" fill="#FFF" text-anchor="middle">1</text><use xlink:href="#bp" href="#bp" transform="translate(345,552)"/>
<text x="36" y="617" font-size="13.5" font-weight="600" fill="#F5F5F7">Reps</text>
<use xlink:href="#bm" href="#bm" transform="translate(247,612)"/><text x="296" y="617" font-size="16" font-weight="700" fill="#FFF" text-anchor="middle">8</text><use xlink:href="#bp" href="#bp" transform="translate(345,612)"/>
<rect x="140.5" y="680" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="702.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

---

## Contract checklist — nothing dropped

| Contract item | Where designed |
|---|---|
| Two entry titles (Add / Edit) | S6 nav "Add Exercise" (+ disabled Done); S1/S2/S3 nav "Edit Exercise" |
| Draft commits on dismiss; no per-keystroke save | S1 amber "Unsaved draft · commits when you leave" strip; nav `Done` |
| Deleted-while-open closes screen | Behaviour note (no visual); nav `Done`/back are the only commits |
| Search/swap keeps sets·notes·link | S1/S3/S6 swap row with swap glyph; S6 shows search + results |
| Type picker Weighted / Cardio-Time | S1 (Weighted sel), S3 (Cardio sel) |
| Type switch destructive → warn | **S4-A** confirm naming lost reps + kept name/notes/link |
| Reps mode Fixed / Range / Per set | S1 (Fixed), **S2** (all three) |
| Sets stepper | S1, S2 (all), S6 |
| Fixed single reps stepper | S1, S2-A, S6 |
| Range min+max steppers | S2-B |
| Per-set stepper grid, grows/wraps | **S2-C** 9 sets, 3-per-row wrap |
| Notes multiline | S1, S5 (focused) |
| External link "https://" placeholder | S1 |
| Rest row opens rest editor; only if timers on | S1 row + chevron; **S4-B** editor; **S5** rest-off removal |
| Superset-with-next toggle | S1, S5 |
| Resistance 3 options w/ explanation lines | S1 (External/Bodyweight/None + explanations + radios) |
| Progressive overload → rules editor | S1 collapsed row; **S4-C** expanded (increment, frequency, target, double-progression) |
| Cardio per-set target Distance/Time | S3 set1 Distance, set2 Time |
| Distance number + unit picker (m/km | mi/ft) | S3 (m/km metric); **S5** (mi/ft imperial) |
| Time h:m:s editor | S3 set2 (three steppers + H/M/S) |
| Tracking toggles ×6 with auto-locks | S3 both sets; locked = dimmed ON + lock glyph |
| Cardio rest opt-in toggle + value row | Design: opt-in toggle; when ON shows rest row → S4-B editor (rest-on state) |
| Add/Remove set; remove disabled at 1 set | S3 buttons; disabled-state styling specified (remove greyed when 1 set) |
| Rest timers off → rows vanish | **S5** panel 1 |
| Imperial vs metric | **S5** panel 2 (mi/ft, 225 lb) |
| Keyboard avoidance | **S5** panel 3 (content shifts above accessory bar + keyboard) |
| Long exercise name | **S6** two-line wrap + ellipsis |

**Design decisions worth flagging:** (1) type-switch uses a *confirm*, not a toast, because the loss is irreversible per-set data; (2) locked tracking toggles are visually distinct from user-set ON (dimmed + lock) so "auto" is never read as a choice; (3) rest rows are *removed* when timers are off — an absent row beats a dead control; (4) the swap row wraps to two lines rather than truncating, because exercise identity must stay readable; (5) per-set steppers wrap 3-per-row so 10 sets never produce a 10-row scroll trap.

**Light mode:** identical geometry; cards → white gradient + `#000` .045–.115 edge; steppers/toggles/segmented thumbs per the published token delta; locked-toggle green → `#34C759` @ .5; keyboard panel keys → `#D1D1D6` on `#F2F2F7`.

Ready for the **component kit** (every control above as isolated, spec'd primitives) or the **light-mode renders** — say which.