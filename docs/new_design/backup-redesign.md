# SETTINGS → BACKUP & RESTORE — Three-screen redesign
### Five canvases · 393 pt · Dark · Apple-quality · Every constraint honored

**Decisions taken on the audit's traps (stated up front):**

| Trap | Resolution |
|---|---|
| Dead "Read documentation" 404 link (all three screens) | **Replaced with a "How it works" disclosure row** that expands inline with the actual explanation — no network dependency, no broken link. |
| No in-flight UI for remote backup | **Added:** Test button → spinner + "Sending…" + disabled; success → snackbar; error → red snackbar with Retry. |
| No offline-specific error copy | **Unified:** error snackbar uses the real variant (`connection failure`, `401 Unauthorized`, `500 Internal Server Error`, `HTTP error`, `unknown`). |
| "Alcedo Cloud" built-in backend would be fake | **Excluded** from the backend picker — only user-added servers + "None". |
| Frequency/schedule picker would be fiction | **Not added.** "How it works" row states honestly: "runs when data hash changes". |
| Cardio dropped from CSV is hidden | **Disclosed** in plaintext export's "What's not included" list. |
| No privacy note on plaintext export | **Added** at the bottom of the export screen. |
| Incomplete backends shouldn't be selectable | **Rendered greyed** with an "Incomplete" tag; tap does nothing. |
| `Alcedo` is the audit's internal name; design work has been `Kinetic` | **Swapped `Alcedo` → `Kinetic` in rendered copy**; the audit's verbatim copy is otherwise preserved. |

**Three new UX features added** (each earns its space):
- **Last-tested timestamp** on the remote backup screen — persists between sessions, shows the real result of the last Test run (success time or last error).
- **Live export preview count** on plaintext export — "214 sessions · 1,892 sets" computed from the actual DB.
- **Last-imported row** on the import screen — shows the most recent successful import with a count, useful for debugging.

---

## S1 · AUTOMATIC REMOTE BACKUP (main screen)

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1064" viewBox="0 0 393 1064" role="img" aria-labelledby="R1" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="R1">Kinetic — Automatic remote backup, no backend assigned</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1064" rx="54.5"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="60" cy="140" r="280"><stop offset="0" stop-color="#0A84FF" stop-opacity=".12"/><stop offset="1" stop-color="#0A84FF" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".32"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15151A" stop-opacity=".94"/><stop offset="1" stop-color="#0C0C10" stop-opacity=".99"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#FF9F0A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="tgon"><rect x="-22" y="-13" width="44" height="26" rx="13" fill="#30D158"/><circle cx="9" cy="0" r="11" fill="#FFF"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1064" fill="url(#bg)"/><rect width="393" height="1064" fill="url(#A1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">11:09</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="19" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>

<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Automatic remote backup</text>

<text x="24" y="138" font-size="14" font-weight="500" letter-spacing="-.1" fill="#98989F">This is an advanced feature which enables Kinetic</text>
<text x="24" y="158" font-size="14" font-weight="500" letter-spacing="-.1" fill="#98989F">to send backups to a remote server.</text>

<!-- config card -->
<g filter="url(#fc)"><rect x="16" y="180" width="361" height="244" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="180.5" width="360" height="243" rx="23.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="208" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">DESTINATION</text>
<text x="36" y="241" font-size="14" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Backup server</text>
<text x="333" y="241" font-size="13" font-weight="500" fill="#6C6C70" text-anchor="end">None</text>
<use xlink:href="#ch" href="#ch" transform="translate(357,237)"/>
<text x="36" y="259" font-size="10.5" font-weight="500" fill="#6C6C70">Assigns instantly · "None" unassigns</text>
<line x1="32" y1="278" x2="357" y2="278" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="310" font-size="14" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Backup feed account</text>
<text x="36" y="328" font-size="10.5" font-weight="500" fill="#86868B">Include your feed account data in backups</text>
<use xlink:href="#tgon" href="#tgon" transform="translate(335,316)"/>
<line x1="32" y1="348" x2="357" y2="348" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="381" font-size="14" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">How it works</text>
<g font-size="10.5" font-weight="500" fill="#86868B"><text x="36" y="399">Full SQLite DB · gzip · application/octet-stream.</text><text x="36" y="415">Credentials wiped from payload.</text></g>

<!-- last tested (NEW FEATURE) -->
<text x="24" y="456" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">LAST TESTED</text>
<g filter="url(#fc)"><rect x="16" y="468" width="361" height="60" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="468.5" width="360" height="59" rx="19.5" fill="none" stroke="url(#ce)"/>
<circle cx="40" cy="498" r="6" fill="#48484A"/>
<text x="60" y="494" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#98989F">Not tested yet</text>
<text x="60" y="512" font-size="10.5" font-weight="500" fill="#6C6C70">Tap Test to verify the connection</text>

<!-- sticky footer -->
<rect x="0" y="564" width="393" height="500" fill="url(#tb)"/>
<line x1="0" y1="564.5" x2="393" y2="564.5" stroke="#FFF" stroke-opacity=".11"/>
<rect x="16" y="580" width="361" height="54" rx="27" fill="#FFF" fill-opacity=".05" stroke="#FFF" stroke-opacity=".08" stroke-width="1"/>
<text x="196.5" y="613" font-size="15" font-weight="400" letter-spacing="-.3" fill="#48484A" text-anchor="middle">Test</text>
<text x="196.5" y="631" font-size="10" font-weight="500" fill="#48484A" text-anchor="middle">Disabled · no backup server assigned</text>
<rect x="16" y="650" width="361" height="54" rx="27" fill="#FFF" fill-opacity=".07" stroke="#FFF" stroke-opacity=".12" stroke-width="1"/>
<text x="196.5" y="683" font-size="15" font-weight="650" letter-spacing="-.25" fill="#F5F5F7" text-anchor="middle">Manage backends</text>
<rect x="140.5" y="720" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>

<!-- legend / honest copy -->
<text x="24" y="756" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">HONEST COPY</text>
<g filter="url(#fc)"><rect x="16" y="768" width="361" height="226" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="768.5" width="360" height="225" rx="23.5" fill="none" stroke="url(#ce)"/>
<g font-size="12.5" font-weight="500" fill="#E5E5EA"><text x="36" y="796">Runs automatically when data hash</text><text x="36" y="814">changes — there is no schedule.</text><text x="36" y="842" fill="#98989F">No restore-from-server: "Restore from</text><text x="36" y="860" fill="#98989F">Backup…" opens the OS file picker.</text><text x="36" y="888" fill="#98989F">Built-in Kinetic backend is not a valid</text><text x="36" y="906" fill="#98989F">destination — only user-added servers.</text><text x="36" y="934" fill="#98989F">Deleting the assigned backend (from</text><text x="36" y="952" fill="#98989F">Manage backends) silently unassigns it.</text></g>
<g fill="#48484A"><circle cx="28" cy="792" r="2.2"/><circle cx="28" cy="838" r="2.2"/><circle cx="28" cy="884" r="2.2"/><circle cx="28" cy="930" r="2.2"/></g>
<rect x="140.5" y="1040" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="1062.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

---

## S2 · BACKEND PICKER (sub-screen pushed from S1)

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="900" viewBox="0 0 393 900" role="img" aria-labelledby="R2" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="R2">Kinetic — Choose backup server picker</title>
<defs>
  <clipPath id="fr"><rect width="393" height="900" rx="54.5"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="60" cy="140" r="280"><stop offset="0" stop-color="#0A84FF" stop-opacity=".10"/><stop offset="1" stop-color="#0A84FF" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#FF9F0A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ck" d="M-4 .3 L-1.2 3.2 L4.4 -3" fill="none" stroke="#FFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ch" d="M-2 -4 L2 0 L-2 4" fill="none" stroke="#48484A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="900" fill="url(#bg)"/><rect width="393" height="900" fill="url(#A1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">11:10</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="19" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>

<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Choose server</text>

<!-- none option (selected) -->
<g filter="url(#fc)"><rect x="16" y="110" width="361" height="56" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="110.5" width="360" height="55" rx="19.5" fill="none" stroke="url(#br)" stroke-opacity=".55" stroke-width="1.4"/>
<text x="36" y="145" font-size="14" font-weight="650" letter-spacing="-.2" fill="#FFF">None</text>
<text x="36" y="162" font-size="10.5" font-weight="500" fill="#86868B">Auto-backup will silently do nothing</text>
<g transform="translate(345,138)"><use xlink:href="#ck" href="#ck" transform="scale(.9)" color="#FF9F0A"/></g>

<!-- complete backends list -->
<text x="24" y="198" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">COMPLETE BACKENDS</text>
<g filter="url(#fc)"><rect x="16" y="210" width="361" height="228" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="210.5" width="360" height="227" rx="23.5" fill="none" stroke="url(#ce)"/>
<g>
  <text x="36" y="239" font-size="14" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Home server</text>
  <text x="36" y="257" font-size="10.5" font-weight="500" fill="#86868B">https://home.example.net/kinetic · Alcedo</text>
  <use xlink:href="#ch" href="#ch" transform="translate(357,246)"/>
</g>
<line x1="32" y1="274" x2="357" y2="274" stroke="#FFF" stroke-opacity=".06"/>
<g>
  <text x="36" y="303" font-size="14" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Work NAS</text>
  <text x="36" y="321" font-size="10.5" font-weight="500" fill="#86868B">https://nas.corp.io:8443/backup · Endpoint</text>
  <use xlink:href="#ch" href="#ch" transform="translate(357,310)"/>
</g>
<line x1="32" y1="338" x2="357" y2="338" stroke="#FFF" stroke-opacity=".06"/>
<g>
  <text x="36" y="367" font-size="14" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Friend's VPS</text>
  <text x="36" y="385" font-size="10.5" font-weight="500" fill="#86868B">https://backup.friend.net · Alcedo</text>
  <use xlink:href="#ch" href="#ch" transform="translate(357,374)"/>
</g>
<line x1="32" y1="402" x2="357" y2="402" stroke="#FFF" stroke-opacity=".06"/>
<text x="36" y="428" font-size="10" font-weight="500" fill="#6C6C70">Tap any row to assign instantly</text>

<!-- incomplete backends (unselectable) -->
<text x="24" y="470" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">INCOMPLETE · CANNOT BE ASSIGNED</text>
<g filter="url(#fc)"><rect x="16" y="482" width="361" height="72" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="482.5" width="360" height="71" rx="19.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="510" font-size="13.5" font-weight="600" letter-spacing="-.2" fill="#6C6C70">Test endpoint</text>
<text x="36" y="528" font-size="10.5" font-weight="500" fill="#48484A">No URL configured · edit to complete</text>
<rect x="280" y="502" width="72" height="17" rx="8.5" fill="#FF3B30" fill-opacity=".12" stroke="#FF3B30" stroke-opacity=".22" stroke-width=".8"/>
<text x="316" y="513.5" font-size="7.5" font-weight="700" letter-spacing=".6" fill="#FF6B60" text-anchor="middle">INCOMPLETE</text>

<!-- add new -->
<text x="24" y="586" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">ADD</text>
<g filter="url(#fc)"><rect x="16" y="598" width="361" height="56" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="598.5" width="360" height="55" rx="19.5" fill="none" stroke="#FF9F0A" stroke-opacity=".25" stroke-width="1" stroke-dasharray="4 3"/>
<g stroke="#FF9F0A" stroke-width="2.1" stroke-linecap="round"><line x1="150" y1="626" x2="166" y2="626"/><line x1="158" y1="618" x2="158" y2="634"/></g>
<text x="178" y="631" font-size="14" font-weight="650" letter-spacing="-.2" fill="#FFB84D">Add new backend…</text>

<!-- footnote -->
<g font-size="10.5" font-weight="500" fill="#48484A" text-anchor="middle"><text x="196.5" y="692">Type = "Alcedo backend" or "Backup endpoint only"</text><text x="196.5" y="710">Auth = API key · Basic · raw headers</text><text x="196.5" y="728" fill="#6C6C70">No OAuth · no sign-in screen</text></g>
<rect x="140.5" y="876" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="898.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

---

## S3 · REMOTE BACKUP · TEST STATES (in-flight + success + 5 error variants)

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1200" viewBox="0 0 393 1200" role="img" aria-labelledby="R3" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="R3">Kinetic — Remote backup Test states: in-flight, success, 5 error variants</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1200"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stroke-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stop-opacity=".32"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="14" stdDeviation="22" flood-color="#000" flood-opacity=".65"/></filter>
  <path id="ck" d="M-4 .3 L-1.2 3.2 L4.4 -3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="warn" d="M0 -8 L8 6 H-8 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1200" fill="url(#bg)"/>

<!-- A · IN-FLIGHT -->
<text x="24" y="40" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">A · IN FLIGHT · Test button transforms</text>
<g filter="url(#fc)"><rect x="16" y="52" width="361" height="136" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="52.5" width="360" height="135" rx="23.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="86" font-size="14" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">Backup server</text>
<text x="333" y="86" font-size="13" font-weight="500" fill="#4ADE80" text-anchor="end">Home server</text>
<text x="36" y="104" font-size="10.5" font-weight="500" fill="#86868B">https://home.example.net/kinetic</text>
<line x1="32" y1="120" x2="357" y2="120" stroke="#FFF" stroke-opacity=".06"/>
<rect x="32" y="134" width="329" height="46" rx="23" fill="url(#br)" opacity=".55"/>
<rect x="32.5" y="134.5" width="328" height="45" rx="22.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<g transform="translate(148,157)" fill="none" stroke="#FFF" stroke-width="2.2" stroke-linecap="round">
  <path d="M0 -7 A7 7 0 1 1 -7 0" opacity=".9">
    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s" repeatCount="indefinite"/>
  </path>
</g>
<text x="172" y="162" font-size="14.5" font-weight="650" letter-spacing="-.25" fill="#FFF">Sending…</text>

<!-- B · SUCCESS snackbar -->
<text x="24" y="220" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">B · SUCCESS · auto-dismisses in 3s</text>
<g filter="url(#fs)"><rect x="40" y="232" width="313" height="52" rx="26" fill="#1C1C1E"/></g>
<rect x="40.5" y="232.5" width="312" height="51" rx="25.5" fill="none" stroke="#30D158" stroke-opacity=".40" stroke-width="1.2"/>
<circle cx="70" cy="258" r="11" fill="#30D158"/>
<g transform="translate(70,258)" color="#FFF"><use xlink:href="#ck" href="#ck" transform="scale(.78)"/></g>
<text x="92" y="254" font-size="13.5" font-weight="650" letter-spacing="-.2" fill="#FFF">Backup sent successfully</text>
<text x="92" y="272" font-size="10.5" font-weight="500" fill="#86868B">1.4 GB · gzip 412 MB · 2.1s</text>

<!-- LAST TESTED row after success -->
<text x="24" y="316" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">LAST TESTED · updated after success</text>
<g filter="url(#fc)"><rect x="16" y="328" width="361" height="56" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="328.5" width="360" height="55" rx="19.5" fill="none" stroke="url(#ce)"/>
<circle cx="40" cy="356" r="6" fill="#30D158"/>
<text x="60" y="352" font-size="13" font-weight="600" letter-spacing="-.2" fill="#FFF">Success · Today, 11:12 AM</text>
<text x="60" y="370" font-size="10.5" font-weight="500" fill="#86868B">1.4 GB uploaded in 2.1 s</text>

<!-- C · ERROR VARIANTS (5) -->
<text x="24" y="416" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">C · ERROR VARIANTS · each includes Retry</text>

<!-- connection failure -->
<g filter="url(#fs)"><rect x="40" y="428" width="313" height="56" rx="22" fill="#1C1C1E"/></g>
<rect x="40.5" y="428.5" width="312" height="55" rx="21.5" fill="none" stroke="#FF3B30" stroke-opacity=".32" stroke-width="1.2"/>
<circle cx="66" cy="456" r="11" fill="#FF3B30" fill-opacity=".18"/>
<g transform="translate(66,456)" color="#FF6B60"><use xlink:href="#warn" href="#warn" transform="scale(.75)"/></g>
<text x="88" y="452" font-size="12.5" font-weight="650" letter-spacing="-.15" fill="#FFF">Failed to backup to remote</text>
<text x="88" y="468" font-size="10.5" font-weight="500" fill="#FF6B60">Connection failure</text>
<rect x="296" y="445" width="46" height="22" rx="11" fill="#FFF" fill-opacity=".10" stroke="#FFF" stroke-opacity=".12" stroke-width=".8"/>
<text x="319" y="460" font-size="10.5" font-weight="700" fill="#FFF" text-anchor="middle">Retry</text>

<!-- 401 -->
<g filter="url(#fs)"><rect x="40" y="496" width="313" height="56" rx="22" fill="#1C1C1E"/></g>
<rect x="40.5" y="496.5" width="312" height="55" rx="21.5" fill="none" stroke="#FF3B30" stroke-opacity=".32" stroke-width="1.2"/>
<circle cx="66" cy="524" r="11" fill="#FF3B30" fill-opacity=".18"/>
<g transform="translate(66,524)" color="#FF6B60"><use xlink:href="#warn" href="#warn" transform="scale(.75)"/></g>
<text x="88" y="520" font-size="12.5" font-weight="650" letter-spacing="-.15" fill="#FFF">Failed to backup to remote</text>
<text x="88" y="536" font-size="10.5" font-weight="500" fill="#FF6B60">401 Unauthorized · check API key</text>
<rect x="296" y="513" width="46" height="22" rx="11" fill="#FFF" fill-opacity=".10" stroke="#FFF" stroke-opacity=".12" stroke-width=".8"/>
<text x="319" y="528" font-size="10.5" font-weight="700" fill="#FFF" text-anchor="middle">Retry</text>

<!-- 500 -->
<g filter="url(#fs)"><rect x="40" y="564" width="313" height="56" rx="22" fill="#1C1C1E"/></g>
<rect x="40.5" y="564.5" width="312" height="55" rx="21.5" fill="none" stroke="#FF3B30" stroke-opacity=".32" stroke-width="1.2"/>
<circle cx="66" cy="592" r="11" fill="#FF3B30" fill-opacity=".18"/>
<g transform="translate(66,592)" color="#FF6B60"><use xlink:href="#warn" href="#warn" transform="scale(.75)"/></g>
<text x="88" y="588" font-size="12.5" font-weight="650" letter-spacing="-.15" fill="#FFF">Failed to backup to remote</text>
<text x="88" y="604" font-size="10.5" font-weight="500" fill="#FF6B60">500 Internal Server Error</text>
<rect x="296" y="581" width="46" height="22" rx="11" fill="#FFF" fill-opacity=".10" stroke="#FFF" stroke-opacity=".12" stroke-width=".8"/>
<text x="319" y="596" font-size="10.5" font-weight="700" fill="#FFF" text-anchor="middle">Retry</text>

<!-- HTTP generic -->
<g filter="url(#fs)"><rect x="40" y="632" width="313" height="56" rx="22" fill="#1C1C1E"/></g>
<rect x="40.5" y="632.5" width="312" height="55" rx="21.5" fill="none" stroke="#FF3B30" stroke-opacity=".32" stroke-width="1.2"/>
<circle cx="66" cy="660" r="11" fill="#FF3B30" fill-opacity=".18"/>
<g transform="translate(66,660)" color="#FF6B60"><use xlink:href="#warn" href="#warn" transform="scale(.75)"/></g>
<text x="88" y="656" font-size="12.5" font-weight="650" letter-spacing="-.15" fill="#FFF">Failed to backup to remote</text>
<text x="88" y="672" font-size="10.5" font-weight="500" fill="#FF6B60">HTTP error 413 · payload too large</text>
<rect x="296" y="649" width="46" height="22" rx="11" fill="#FFF" fill-opacity=".10" stroke="#FFF" stroke-opacity=".12" stroke-width=".8"/>
<text x="319" y="664" font-size="10.5" font-weight="700" fill="#FFF" text-anchor="middle">Retry</text>

<!-- unknown -->
<g filter="url(#fs)"><rect x="40" y="700" width="313" height="56" rx="22" fill="#1C1C1E"/></g>
<rect x="40.5" y="700.5" width="312" height="55" rx="21.5" fill="none" stroke="#FF3B30" stroke-opacity=".32" stroke-width="1.2"/>
<circle cx="66" cy="728" r="11" fill="#FF3B30" fill-opacity=".18"/>
<g transform="translate(66,728)" color="#FF6B60"><use xlink:href="#warn" href="#warn" transform="scale(.75)"/></g>
<text x="88" y="724" font-size="12.5" font-weight="650" letter-spacing="-.15" fill="#FFF">Failed to backup to remote</text>
<text x="88" y="740" font-size="10.5" font-weight="500" fill="#FF6B60">Unknown error</text>
<rect x="296" y="717" width="46" height="22" rx="11" fill="#FFF" fill-opacity=".10" stroke="#FFF" stroke-opacity=".12" stroke-width=".8"/>
<text x="319" y="732" font-size="10.5" font-weight="700" fill="#FFF" text-anchor="middle">Retry</text>

<!-- LAST TESTED after error -->
<text x="24" y="788" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">LAST TESTED · records last error too</text>
<g filter="url(#fc)"><rect x="16" y="800" width="361" height="72" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="800.5" width="360" height="71" rx="19.5" fill="none" stroke="#FF3B30" stroke-opacity=".22" stroke-width="1"/>
<circle cx="40" cy="822" r="6" fill="#FF6B60"/>
<text x="60" y="818" font-size="13" font-weight="600" letter-spacing="-.2" fill="#FF6B60">Failed · Today, 11:11 AM</text>
<text x="60" y="836" font-size="10.5" font-weight="500" fill="#86868B">500 Internal Server Error</text>
<text x="60" y="858" font-size="10" font-weight="500" fill="#6C6C70">Tap Retry on the snackbar or Test again.</text>

<!-- retry behavior footnote -->
<text x="24" y="908" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">RETRY BEHAVIOR</text>
<g filter="url(#fc)"><rect x="16" y="920" width="361" height="244" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="920.5" width="360" height="243" rx="23.5" fill="none" stroke="url(#ce)"/>
<g font-size="12.5" font-weight="500" fill="#E5E5EA"><text x="36" y="950">Retry on the snackbar re-sends the same</text><text x="36" y="968">payload without re-computing it.</text><text x="36" y="996" fill="#98989F">Pressing Test again forces a fresh full-</text><text x="36" y="1014" fill="#98989F">database upload.</text><text x="36" y="1042" fill="#98989F">Both paths share the same in-flight UI</text><text x="36" y="1060" fill="#98989F">(spinner + Sending… label).</text><text x="36" y="1088" fill="#98989F">No spinner on the parent card during</text><text x="36" y="1106" fill="#98989F">auto-backup — auto-backup is silent.</text></g>
<g fill="#48484A"><circle cx="28" cy="946" r="2.2"/><circle cx="28" cy="992" r="2.2"/><circle cx="28" cy="1038" r="2.2"/><circle cx="28" cy="1084" r="2.2"/></g>
<rect x="140.5" y="1176" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".5" y=".5" width="392" height="1199" fill="none" stroke="#FFF" stroke-opacity=".08"/>
</svg>
```

---

## S4 · PLAIN-TEXT EXPORT

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1280" viewBox="0 0 393 1280" role="img" aria-labelledby="R4" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="R4">Kinetic — Plain-text export with CSV/JSON toggle and privacy note</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1280" rx="54.5"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="330" cy="160" r="280"><stop offset="0" stop-color="#30D158" stop-opacity=".10"/><stop offset="1" stop-color="#30D158" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stroke-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stroke-opacity=".32"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15151A" stroke-opacity=".94"/><stop offset="1" stop-color="#0C0C10" stop-opacity=".99"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="ft2" x="-60%" y="-80%" width="220%" height="280%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#FF9F0A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="lck" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M-3 -1.3 V-3.3 A3 3 0 0 1 3 -3.3 V-1.3"/><rect x="-5" y="-1.3" width="10" height="7.4" rx="2" fill="currentColor" stroke="none"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1280" fill="url(#bg)"/><rect width="393" height="1280" fill="url(#A1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">11:14</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="19" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Export data</text>

<!-- caption (verbatim audit copy, Alcedo→Kinetic) -->
<text x="24" y="128" font-size="13" font-weight="500" letter-spacing="-.1" fill="#98989F">This feature allows you to export your data</text>
<text x="24" y="146" font-size="13" font-weight="500" letter-spacing="-.1" fill="#98989F">in a plaintext format such as CSV for use in</text>
<text x="24" y="164" font-size="13" font-weight="500" letter-spacing="-.1" fill="#98989F">other applications. It is not intended for</text>
<text x="24" y="182" font-size="13" font-weight="500" letter-spacing="-.1" fill="#98989F">backup purposes. For backups, please use</text>
<text x="24" y="200" font-size="13" font-weight="500" letter-spacing="-.1" fill="#98989F">the backup feature. Kinetic cannot restore</text>
<text x="24" y="218" font-size="13" font-weight="500" letter-spacing="-.1" fill="#98989F">data from plaintext exports.</text>

<!-- format segmented -->
<text x="24" y="250" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">FORMAT</text>
<g filter="url(#fc)"><rect x="16" y="262" width="361" height="76" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="262.5" width="360" height="75" rx="23.5" fill="none" stroke="url(#ce)"/>
<rect x="32" y="276" width="329" height="48" rx="24" fill="#FFF" fill-opacity=".06"/>
<g filter="url(#ft2)"><rect x="34" y="278" width="162.5" height="44" rx="22" fill="#FFF" fill-opacity=".13"/></g>
<rect x="34.5" y="278.5" width="161.5" height="43" rx="21.5" fill="none" stroke="#FFF" stroke-opacity=".12" stroke-width=".8"/>
<g font-size="13.5" font-weight="650" letter-spacing="-.2" text-anchor="middle"><text x="115.25" y="306" fill="#FFF">CSV</text><text x="279.75" y="306" fill="#8E8E93">JSON</text></g>
<text x="36" y="332" font-size="9" font-weight="500" fill="#6C6C70">Selection is not persisted · reopens at CSV</text>

<!-- live preview (NEW FEATURE) -->
<text x="24" y="366" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">WILL EXPORT</text>
<g filter="url(#fc)"><rect x="16" y="378" width="361" height="80" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="378.5" width="360" height="79" rx="21.5" fill="none" stroke="url(#ce)"/>
<g stroke="#FFF" stroke-opacity=".08"><line x1="132" y1="392" x2="132" y2="444"/><line x1="248" y1="392" x2="248" y2="444"/></g>
<g text-anchor="middle" font-size="16" font-weight="700" letter-spacing="-.4" fill="#FFF"><text x="74" y="418">214</text><text x="190" y="418">1,892</text><text x="306" y="418">6</text></g>
<g text-anchor="middle" font-size="7.5" font-weight="700" letter-spacing=".8" fill="#86868B"><text x="74" y="438">SESSIONS</text><text x="190" y="438">COMPLETED SETS</text><text x="306" y="438">EXERCISES</text></g>
<text x="36" y="454" font-size="9" font-weight="500" fill="#6C6C70">All recorded sessions · no date filter · no scope toggles</text>

<!-- what's in CSV -->
<text x="24" y="492" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">CSV · WHAT'S IN THE FILE</text>
<g filter="url(#fc)"><rect x="16" y="504" width="361" height="220" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="504.5" width="360" height="219" rx="23.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="530" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">COLUMNS · ONE ROW PER COMPLETED SET</text>
<rect x="32" y="540" width="329" height="92" rx="14" fill="#000" fill-opacity=".35" stroke="#FFF" stroke-opacity=".06" stroke-width=".9"/>
<g font-size="9.5" font-weight="600" font-family="'SF Mono','Menlo',monospace" fill="#C7C7CC"><text x="48" y="562">SessionId</text><text x="126" y="562">Timestamp</text><text x="224" y="562">Exercise</text><text x="48" y="582">Weight</text><text x="126" y="582">WeightUnit</text><text x="224" y="582">Reps</text><text x="48" y="602">TargetReps</text><text x="126" y="602">Notes</text></g>
<text x="36" y="654" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">HONEST CAVEATS</text>
<g font-size="11.5" font-weight="500" fill="#E5E5EA"><text x="36" y="676">Weight = raw stored value in its own unit</text><text x="36" y="694">(mixed kg/lbs possible · never labelled "kg").</text><text x="36" y="718" fill="#98989F">Bodyweight exercises show only added/assisted</text><text x="36" y="736" fill="#98989F">weight, not effective load.</text></g>

<!-- what's NOT in CSV (the cardio trap, disclosed) -->
<text x="24" y="756" font-size="9" font-weight="700" letter-spacing="1.2" fill="#FF6B60">CSV · WHAT'S NOT IN THE FILE</text>
<g filter="url(#fc)"><rect x="16" y="768" width="361" height="124" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="768.5" width="360" height="123" rx="21.5" fill="none" stroke="#FF3B30" stroke-opacity=".20" stroke-width="1"/>
<g font-size="11.5" font-weight="500" fill="#E5E5EA"><text x="36" y="796">All cardio sessions — silently dropped.</text><text x="36" y="814" fill="#98989F">An all-cardio history produces an empty file.</text><text x="36" y="842" fill="#98989F">Programs, exercises, feed, settings,</text><text x="36" y="860" fill="#98989F">achievements — not included.</text></g>
<g fill="#FF6B60"><circle cx="28" cy="792" r="2.2"/><circle cx="28" cy="838" r="2.2"/></g>

<!-- JSON -->
<text x="24" y="924" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">JSON · ALTERNATIVE SHAPE</text>
<g filter="url(#fc)"><rect x="16" y="936" width="361" height="104" rx="22" fill="url(#cd)"/></g>
<rect x="16.5" y="936.5" width="360" height="103" rx="21.5" fill="none" stroke="url(#ce)"/>
<g font-size="11.5" font-weight="500" fill="#E5E5EA"><text x="36" y="964">Internal session shape.</text><text x="36" y="982" fill="#98989F">BigNumbers as strings · durations as PT3M ·</text><text x="36" y="1000" fill="#98989F">weights as {unit: "kilograms"|"pounds"}.</text><text x="36" y="1024" fill="#98989F">Blueprint exercises stripped.</text></g>

<!-- filename preview -->
<text x="24" y="1070" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">FILENAME</text>
<g filter="url(#fc)"><rect x="16" y="1082" width="361" height="48" rx="16" fill="url(#cd)"/></g>
<rect x="16.5" y="1082.5" width="360" height="47" rx="15.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="1111" font-size="11.5" font-weight="500" font-family="'SF Mono','Menlo',monospace" fill="#C7C7CC">kinetic-export.20250609_111432.csv</text>
<text x="36" y="1128" font-size="9" font-weight="500" fill="#6C6C70">Device local time · no timezone · generated on export</text>

<!-- privacy note (NEW) -->
<rect x="16" y="1148" width="361" height="56" rx="18" fill="#FF9F0A" fill-opacity=".08" stroke="#FF9F0A" stroke-opacity=".22" stroke-width="1"/>
<g transform="translate(40,1176)" color="#FFB84D"><use xlink:href="#lck" href="#lck" transform="scale(.95)"/></g>
<g font-size="11.5" font-weight="500" fill="#FFD8A8"><text x="62" y="1170">This is plaintext health data handed to the</text><text x="62" y="1188" fill="#C9A47A">OS share sheet. Any receiving app can read it.</text></g>

<!-- sticky -->
<rect x="0" y="1216" width="393" height="64" fill="url(#tb)"/>
<line x1="0" y1="1216.5" x2="393" y2="1216.5" stroke="#FFF" stroke-opacity=".11"/>
<g filter="url(#fb)"><rect x="16" y="1224" width="361" height="54" rx="27" fill="url(#br)"/></g>
<rect x="16" y="1224" width="361" height="27" rx="27" fill="url(#gl)" opacity=".35"/>
<rect x="16.5" y="1224.5" width="360" height="53" rx="26.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="196.5" y="1257" font-size="16" font-weight="650" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Export</text>
<rect x="140.5" y="1256" width="112" height="5" rx="2.5" fill="#FFF" fill-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="1278.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

---

## S5 · IMPORT FROM OTHER APPS

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="393" height="1230" viewBox="0 0 393 1230" role="img" aria-labelledby="R5" font-family="-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif" text-rendering="optimizeLegibility" shape-rendering="geometricPrecision">
<title id="R5">Kinetic — Import from other apps with honest format disclosures</title>
<defs>
  <clipPath id="fr"><rect width="393" height="1230" rx="54.5"/></clipPath>
  <linearGradient id="bg" x1="0" y1="0" x2=".25" y2="1"><stop offset="0" stop-color="#0B0B0E"/><stop offset=".5" stop-color="#050507"/><stop offset="1" stop-color="#08080B"/></linearGradient>
  <radialGradient id="A1" gradientUnits="userSpaceOnUse" cx="60" cy="140" r="280"><stop offset="0" stop-color="#0A84FF" stop-opacity=".12"/><stop offset="1" stop-color="#0A84FF" stop-opacity="0"/></radialGradient>
  <linearGradient id="cd" x1="0" y1="0" x2=".45" y2="1"><stop offset="0" stop-color="#1F1F23"/><stop offset=".55" stop-color="#17171A"/><stop offset="1" stop-color="#131316"/></linearGradient>
  <linearGradient id="ce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stroke-opacity=".17"/><stop offset=".35" stop-color="#FFF" stop-opacity=".06"/><stop offset="1" stop-color="#FFF" stop-opacity=".025"/></linearGradient>
  <linearGradient id="br" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#FFB03A"/><stop offset=".45" stop-color="#FF6A3D"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF" stroke-opacity=".32"/><stop offset="1" stop-color="#FFF" stop-opacity="0"/></linearGradient>
  <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15151A" stroke-opacity=".94"/><stop offset="1" stop-color="#0C0C10" stop-opacity=".99"/></linearGradient>
  <filter id="fc" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".5"/></filter>
  <filter id="fb" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#FF2D55" flood-opacity=".5"/></filter>
  <filter id="fs" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="14" stdDeviation="22" flood-color="#000" flood-opacity=".65"/></filter>
  <path id="bk" d="M2 -5 L-2.6 0 L2 5" fill="none" stroke="#FF9F0A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="ck" d="M-4 .3 L-1.2 3.2 L4.4 -3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="warn" d="M0 -8 L8 6 H-8 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  <g id="rdsel"><circle r="10" fill="none" stroke="#FF6A3D" stroke-width="2"/><circle r="5" fill="#FF6A3D"/></g>
  <g id="rdoff"><circle r="10" fill="none" stroke="#48484A" stroke-width="1.6"/></g>
</defs>
<g clip-path="url(#fr)">
<rect width="393" height="1230" fill="url(#bg)"/><rect width="393" height="1230" fill="url(#A1)"/>
<text x="66" y="36" font-size="16" font-weight="600" letter-spacing="-.35" fill="#FFF" text-anchor="middle">11:16</text>
<g fill="#FFF"><rect x="281" y="27" width="3" height="4.5" rx="1.5"/><rect x="286" y="25" width="3" height="6.5" rx="1.5"/><rect x="291" y="23" width="3" height="8.5" rx="1.5"/><rect x="296" y="20.5" width="3" height="11" rx="1.5"/></g>
<g fill="none" stroke="#FFF" stroke-width="1.6" stroke-linecap="round"><path d="M306.28 23.78A9.5 9.5 0 0 1 319.72 23.78"/><path d="M308.55 26.05A6.3 6.3 0 0 1 317.45 26.05"/><path d="M310.81 28.31A3.1 3.1 0 0 1 315.19 28.31"/></g>
<circle cx="313" cy="30.8" r="1.3" fill="#FFF"/>
<rect x="328" y="23" width="24" height="11" rx="3.2" fill="none" stroke="#FFF" stroke-opacity=".38"/><rect x="329.8" y="24.8" width="19" height="7.4" rx="2" fill="#FFF"/>
<path d="M353.6 26.4c1.3.4 1.3 3.8 0 4.2z" fill="#FFF" fill-opacity=".42"/>
<rect x="133.5" y="11" width="126" height="37" rx="18.5" fill="#000"/>
<use xlink:href="#bk" href="#bk" transform="translate(28,76)"/>
<text x="196.5" y="82" font-size="15" font-weight="600" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Import from other apps</text>

<text x="24" y="128" font-size="14" font-weight="500" letter-spacing="-.1" fill="#98989F">Import workout history from another app.</text>
<text x="24" y="146" font-size="13" font-weight="500" letter-spacing="-.1" fill="#6C6C70">History only — no programs, exercises, or feed.</text>

<!-- last imported (NEW FEATURE) -->
<text x="24" y="178" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">LAST IMPORTED</text>
<g filter="url(#fc)"><rect x="16" y="190" width="361" height="60" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="190.5" width="360" height="59" rx="19.5" fill="none" stroke="url(#ce)"/>
<circle cx="40" cy="220" r="6" fill="#30D158"/>
<text x="60" y="216" font-size="13" font-weight="600" letter-spacing="-.2" fill="#FFF">Jun 4 · 23 workouts</text>
<text x="60" y="234" font-size="10.5" font-weight="500" fill="#86868B">FitNotes-style · 2,140 sets</text>

<!-- format selector (radio, not segmented — exactly 2 options, default FitNotes) -->
<text x="24" y="282" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">FORMAT</text>
<g filter="url(#fc)"><rect x="16" y="294" width="361" height="260" rx="26" fill="url(#cd)"/></g>
<rect x="16.5" y="294.5" width="360" height="259" rx="25.5" fill="none" stroke="url(#ce)"/>

<!-- FitNotes (selected) -->
<rect x="24" y="302" width="345" height="116" rx="18" fill="#FF6A3D" fill-opacity=".08"/>
<use xlink:href="#rdsel" href="#rdsel" transform="translate(40,340)"/>
<text x="60" y="332" font-size="14" font-weight="650" letter-spacing="-.2" fill="#FFF">FitNotes-style CSV</text>
<text x="60" y="350" font-size="10.5" font-weight="500" fill="#86868B">Any CSV with the FitNotes column set.</text>
<text x="60" y="374" font-size="9.5" font-weight="700" letter-spacing="1" fill="#FFB84D">DROPS</text>
<g font-size="10.5" font-weight="500" fill="#98989F"><text x="60" y="392">Cardio rows · missing date/exercise · invalid dates.</text><text x="60" y="408">Set times are synthetic (noon UTC + 1 s/set).</text></g>

<line x1="32" y1="426" x2="357" y2="426" stroke="#FFF" stroke-opacity=".06"/>

<!-- StrongLifts -->
<use xlink:href="#rdoff" href="#rdoff" transform="translate(40,472)"/>
<text x="60" y="464" font-size="14" font-weight="600" letter-spacing="-.2" fill="#F5F5F7">StrongLifts-style CSV</text>
<text x="60" y="482" font-size="10.5" font-weight="500" fill="#86868B">Any CSV with the StrongLifts column set.</text>
<text x="60" y="506" font-size="9.5" font-weight="700" letter-spacing="1" fill="#8E8E93">DROPS</text>
<g font-size="10.5" font-weight="500" fill="#6C6C70"><text x="60" y="524">0-rep sets — including real failed sets.</text><text x="60" y="540">Weight unit comes from Set 1 header only.</text></g>

<!-- honest copy about scope -->
<text x="24" y="588" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">HOW MERGE WORKS</text>
<g filter="url(#fc)"><rect x="16" y="600" width="361" height="216" rx="24" fill="url(#cd)"/></g>
<rect x="16.5" y="600.5" width="360" height="215" rx="23.5" fill="none" stroke="url(#ce)"/>
<g font-size="12" font-weight="500" fill="#E5E5EA"><text x="36" y="628">Opens the OS document picker immediately.</text><text x="36" y="646">No preview · no review · no undo.</text><text x="36" y="674" fill="#98989F">Commits the instant the file parses.</text><text x="36" y="692" fill="#98989F">Exact grouping-key match = duplicate,</text><text x="36" y="710" fill="#98989F">silently skipped ("first import wins").</text><text x="36" y="738" fill="#98989F">Manually logged workouts on the same</text><text x="36" y="756" fill="#98989F">day are NOT detected as duplicates.</text><text x="36" y="784" fill="#98989F">Fix a bad import by deleting the sessions</text><text x="36" y="802" fill="#98989F">in History, then re-importing.</text></g>
<g fill="#48484A"><circle cx="28" cy="624" r="2.2"/><circle cx="28" cy="670" r="2.2"/><circle cx="28" cy="734" r="2.2"/><circle cx="28" cy="780" r="2.2"/></g>

<!-- unsupported apps note -->
<text x="24" y="848" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">NOT SUPPORTED</text>
<g filter="url(#fc)"><rect x="16" y="860" width="361" height="84" rx="20" fill="url(#cd)"/></g>
<rect x="16.5" y="860.5" width="360" height="83" rx="19.5" fill="none" stroke="url(#ce)"/>
<text x="36" y="886" font-size="12" font-weight="500" fill="#98989F">Hevy · Strong · Jefit · Garmin · Apple Health</text>
<text x="36" y="904" font-size="12" font-weight="500" fill="#98989F">exports cannot be imported here.</text>
<text x="36" y="928" font-size="10.5" font-weight="500" fill="#6C6C70">Only FitNotes and StrongLifts CSV shapes are real.</text>

<!-- sticky footer -->
<rect x="0" y="968" width="393" height="262" fill="url(#tb)"/>
<line x1="0" y1="968.5" x2="393" y2="968.5" stroke="#FFF" stroke-opacity=".11"/>
<g filter="url(#fb)"><rect x="16" y="984" width="361" height="54" rx="27" fill="url(#br)"/></g>
<rect x="16" y="984" width="361" height="27" rx="27" fill="url(#gl)" opacity=".35"/>
<rect x="16.5" y="984.5" width="360" height="53" rx="26.5" fill="none" stroke="#FFF" stroke-opacity=".22"/>
<text x="196.5" y="1017" font-size="16" font-weight="650" letter-spacing="-.3" fill="#FFF" text-anchor="middle">Import</text>
<text x="196.5" y="1060" font-size="10.5" font-weight="500" fill="#6C6C70" text-anchor="middle">Opens document picker · no confirmation</text>

<!-- success + failure snackbars -->
<text x="24" y="1094" font-size="9" font-weight="700" letter-spacing="1.2" fill="#86868B">AFTER IMPORT · SNACKBARS</text>
<g filter="url(#fs)"><rect x="40" y="1106" width="313" height="46" rx="23" fill="#1C1C1E"/></g>
<rect x="40.5" y="1106.5" width="312" height="45" rx="22.5" fill="none" stroke="#30D158" stroke-opacity=".40" stroke-width="1.2"/>
<circle cx="66" cy="1129" r="11" fill="#30D158"/>
<g transform="translate(66,1129)" color="#FFF"><use xlink:href="#ck" href="#ck" transform="scale(.78)"/></g>
<text x="88" y="1133" font-size="13" font-weight="650" letter-spacing="-.2" fill="#FFF">Imported 23 workout(s)</text>

<g filter="url(#fs)"><rect x="40" y="1162" width="313" height="46" rx="23" fill="#1C1C1E"/></g>
<rect x="40.5" y="1162.5" width="312" height="45" rx="22.5" fill="none" stroke="#FF3B30" stroke-opacity=".32" stroke-width="1.2"/>
<circle cx="66" cy="1185" r="11" fill="#FF3B30" fill-opacity=".18"/>
<g transform="translate(66,1185)" color="#FF6B60"><use xlink:href="#warn" href="#warn" transform="scale(.75)"/></g>
<g font-size="12" font-weight="600" letter-spacing="-.15" fill="#FFF"><text x="88" y="1181">Could not import:</text><text x="88" y="1197" font-weight="500" fill="#FF6B60" font-family="'SF Mono','Menlo',monospace" font-size="10.5">Missing CSV columns: Date, Exercise</text></g>
<rect x="140.5" y="1206" width="112" height="5" rx="2.5" fill="#FFF" stroke-opacity=".88"/>
</g>
<rect x=".75" y=".75" width="391.5" height="1228.5" rx="54" fill="none" stroke="#FFF" stroke-opacity=".13" stroke-width="1.5"/>
</svg>
```

---

## Verification log

| Claim | Audit requirement | Resolution |
|---|---|---|
| Screen titles | "Automatic remote backup", "Export data", "Import from other apps" | verbatim on each nav ✓ |
| Nav has no Done/Save | pushed screens, instant apply | all three screens: back chevron + title only ✓ |
| Remote caption | verbatim | "This is an advanced feature which enables Kinetic to send backups to a remote server." ✓ |
| Backend picker + "None" | complete backends only; incomplete greyed | 3 complete + 1 incomplete with red INCOMPLETE tag ✓ |
| Feed-account switch | toggles instantly, honest subtitle | "Include your feed account data in backups" ✓ |
| Test disabled when no backend | S1 shows Test greyed + "Disabled" caption ✓ |
| Test is a REAL full upload | spinner + "Sending…" + disabled state (S3-A) ✓ |
| Success snackbar | "Backup sent successfully" (S3-B) verbatim ✓ |
| 5 error variants | connection / 401 / 500 / HTTP / unknown (S3-C) all rendered ✓ |
| Retry button on errors | every error snackbar has a Retry chip ✓ |
| Auto-backup has no schedule | honest copy panel states it runs when data hash changes ✓ |
| No restore-from-server | honest copy states "Restore from Backup…" opens OS picker ✓ |
| No "Alcedo Cloud" built-in | picker shows only user-added backends ✓ |
| Backend types | Alcedo / Endpoint only (picker footnote) ✓ |
| Auth types | API key / Basic / raw (picker footnote) ✓ |
| "Read documentation" 404 | replaced with inline "How it works" disclosure ✓ |
| Export caption | verbatim (Alcedo→Kinetic swap noted) ✓ |
| Format segmented CSV/JSON | default CSV, "not persisted" caption ✓ |
| Export button always enabled | brand button, no disabled state ✓ |
| OS share sheet is the outcome | no in-app confirmation shown; filename preview only ✓ |
| Cardio dropped from CSV | disclosed in red "WHAT'S NOT IN THE FILE" card ✓ |
| CSV columns honest | all 8 columns rendered in monospace ✓ |
| Weight not labelled "kg" | caption states "raw stored value in its own unit" ✓ |
| Bodyweight caveat | "added/assisted weight, not effective load" ✓ |
| Filename format | `kinetic-export.YYYYMMDD_HHMMSS.csv` ✓ |
| Privacy note added | new amber panel at bottom ✓ |
| Import caption | verbatim ✓ |
| Exactly 2 formats | FitNotes-style / StrongLifts-style radio list ✓ |
| "-style" meaning disclosed | "Any CSV with the X column set" subtitle ✓ |
| Import opens OS picker immediately | button caption states "no confirmation" ✓ |
| FitNotes drops | cardio, missing date/exercise, invalid dates, synthetic set times ✓ |
| StrongLifts drops | 0-rep sets including failed sets, unit from Set 1 only ✓ |
| No preview / no review / no undo | "How merge works" panel states this honestly ✓ |
| First-import-wins | disclosed ✓ |
| Manual workouts on same day not detected | disclosed ✓ |
| Fix by delete+reimport | disclosed ✓ |
| Only FitNotes/StrongLifts supported | "Not supported" panel lists Hevy/Strong/Jefit/Garmin/Health explicitly ✓ |
| Success snackbar | "Imported 23 workout(s)" (count pluralised correctly) ✓ |
| Already-imported snackbar | mentioned in copy ("first import wins"); not rendered because S5 shows a successful import, not a re-import — pattern is the same green snackbar with different text ✓ |
| Failure snackbar | "Could not import:" + raw parser string rendered ✓ |

**Light-mode delta:** identical geometry; surfaces → `#FFFFFF→#FAFAFC` + `#000` .045–.115 edge; snackbar backgrounds → `#FFFFFF` with hairline `#000` .12; destructive text `#FF6B60` → **`#D70015`**; brand button gradient → `#FF9500→#E8003F`; segmented thumbs → `#FFFFFF` + shadow `0 1 3 rgba(0,0,0,.18)`.

**Next options:** the **light-mode renders** of these three screens, the **add/edit backend** screens that S2 pushes into, or the **interactive component kit** (snackbars, radio lists, segmented controls, steppers, disclosures) in both themes as the definitive implementation reference.