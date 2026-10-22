# Verification record

Date: 2026-10-22 (Asia/Bangkok). This is evidence, not a claim of cryptographic certification or universal browser support.

## Completed locally

- Strict TypeScript and Vite production build pass.
- RNG: **13/13** tests pass. Includes exhaustive weighted mapping, exact 64,872 rejection boundary, rejected-buffer refill, 1 and 10,000 limits, secure-provider failure, no weak fallback, fresh-call state, and deterministic distribution sanity.
- Browser matrix: **45 pass, 3 explicitly skipped**, Chromium and WebKit, each at 390×844, 768×1024, 1440×1000.
- Native clipboard write/read tested in Chromium at all three sizes. WebKit tests use the Clipboard API contract and failure recovery; native readback is the three skipped tests.
- axe WCAG A/AA checks pass in all six browser configurations, including keyboard/reduced-motion tests. This does not replace assistive-technology or physical-device testing.
- Long output wraps with no horizontal overflow. Tests confirm generation of 10,000 digits and primary action reachability; the three-second threshold includes UI debounce/rendering and is only a regression bound, not a benchmark.
- Impeccable 4.3.1 actually invoked: context, product record, seeded direction round, native direction picker and visual comps; Chaotic Internet explicitly selected by the user. Mechanical detector returned `[]` before final responsive tweaks.
- Wrangler 4.151.3 static-assets dry run passed. `npm audit` reports zero known vulnerabilities in the pinned tree at this date.
- Prepublication pattern scan found zero secret-pattern hit files. No pre-existing commits or source history were present. Pattern scans do not guarantee absence of secrets.

## Visual evidence

Development-only images live in ignored `.impeccable/review/`: mobile, tablet and desktop screenshots. Images were opened and inspected. Impeccable's initial hero comparison returned **65% / failed**, using an early mobile capture with a different frame size from the generated comp. It is not a passed fidelity gate. The final exact-size capture scored 73.67% overall, but the CLI still returned FAIL on hard region-structure vetoes. The independent reviewer marked expressive typography and final diff evidence resolved, established no additional material visual correction, and retained disposition `fix` for the unclosed mechanical gate. The gate has not been forced or reported as passed. Do not claim pixel-perfect reproduction or a successful numeric comp gate based on browser test results.

## Infrastructure reconnaissance

GitHub CLI authenticated as tpeak5237; repository `tpeak5237/laugh` was not found. Cloudflare OAuth can access the active theerapat.org zone and Workers account. There was no `laugh` Worker or matching Worker custom domain or route; public DNS did not resolve. Direct DNS-record listing returned 403. Deployment must use an interactive conflict check that refuses to replace a conflicting DNS record or unrelated origin. No other hostname is in the deployment config.

## Release evidence

Public repository anonymous access, deployed version/source commit, HTTPS/TLS, runtime security headers and the live browser results are now recorded in RELEASE.md and live-smoke.json. None of the local checks alone implies deployment success.

## First live deployment finding and correction

The first live check found Cloudflare-injected analytics/challenge scripts blocked by the strict CSP and Vite-inlined small font subsets blocked by `font-src`. Those console errors were real; the initial deployment was not treated as a completed live release. The correction sets per-application HTML `Cache-Control: public, max-age=0, must-revalidate, no-transform` (preventing Cloudflare response injection without changing unrelated zone settings), and configures Vite `assetsInlineLimit: 0` so fonts remain same-origin files. No `unsafe-inline` exception was added. A new six-configuration regression checks console errors, inline scripts and external requests. Updated local matrix: 45 pass, 3 explicit WebKit clipboard skips.

References: [Cloudflare Web Analytics injection](https://developers.cloudflare.com/web-analytics/get-started/) and [JavaScript Detections no-transform behavior](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/). Live correction verification is recorded in RELEASE.md and live-smoke.json.
