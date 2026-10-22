# Laughing Seed — release handoff

Status: **DEPLOYED**, verified 2026-10-22 (Asia/Bangkok). Application runtime checks pass; the Impeccable numeric fidelity gate remains unresolved and is not represented as a pass.

| Item | Verified value |
| --- | --- |
| Public repository | https://github.com/tpeak5237/laugh — PUBLIC; anonymous HTTP 200 |
| Production | https://laugh.theerapat.org/ — HTTPS 200, no login or redirect |
| Design | Chaotic Internet, selected by the user from the real Impeccable picker and confirmed with the same screenshot |
| Deployed source commit | `be686585db4f765e671ec8f30a2e9144fc626927` |
| Cloudflare target | Static-assets Worker `laugh`, custom domain `laugh.theerapat.org` |
| Deployment version | `0673c4f6-88e2-4384-b859-57084849d565` |
| GitHub CI for deployed source | [Verify 39775545467 — success](https://github.com/tpeak5237/laugh/actions/runs/39775545467) |
| Local engine tests | 13 pass |
| Local browser suite | 45 pass, 3 explicit WebKit native-clipboard readback skips |
| Live custom-domain browser suite | 45 pass, same 3 explicit skips |

## Live evidence

`live-smoke.json` records separate Chromium and WebKit mobile/desktop checks against the custom HTTPS domain, with TLS 1.3, a valid certificate for the hostname, HTTP 200, initial 50 digits, a changed reroll result, 10,000-digit output, successful Clipboard API write status, no horizontal overflow, no broken assets, and byte-for-byte HTML equality with the local production build. Chromium native clipboard readback also passes in the live regression suite. WebKit native write succeeds in the smoke checks; automated readback remains unverified.

All four normal application flows recorded zero application console/page errors and zero external application requests in the final capture batch. WebKit's Playwright screenshot preparation separately attempts to inject an inline `body {}` stylesheet (Playwright screenshotter `syncAnimations`), which the strict CSP correctly blocks; these errors are recorded separately as `screenshotToolErrors`, not hidden or attributed to application code. Live screenshots were opened and inspected for both engines on mobile and desktop.

Security headers served live: CSP limited to same-origin scripts/styles/fonts, no `unsafe-inline`, no outbound application connections, frame embedding denied, nosniff, no-referrer, permissions restrictions, and HSTS. An unknown route returns a real 404 with no authentication redirect.

The first deployment exposed Cloudflare automatic script injection and Vite's small inlined font subsets. The corrective release prevents HTML transformation with `no-transform` and keeps all fonts as same-origin assets. No unrelated DNS or zone setting was changed.

## Honest limitations

- Impeccable was actually used, including independent finish review and final design documentation. The final visual score is **73.67%**, but the mechanical hero gate still returns FAIL on region structure (including random digits and font differences). The reviewer marked expressive lettering and final diff evidence resolved, found no further material visual correction, and retained disposition **fix** for the open mechanical gate. No pixel-perfect or complete Impeccable gate pass is claimed.
- Earlier live samples also contained Cloudflare's sampled client-side-security `Report-Only` header and a resource-monitoring report. This provider-level behavior can recur, even though the final batch had no external requests. Current OAuth access cannot manage Page Shield/rulesets (403); the whole zone was not modified to remove this behavior. This is provider security telemetry, not an application analytics integration. See [Cloudflare's explanation](https://developers.cloudflare.com/client-side-security/how-it-works/).
- Browser automation and axe checks do not prove physical iPhone/Android behavior or a complete assistive-technology audit.
- Clipboard access depends on browser permission; manual selection is available on denial. No certification of cryptographic strength is inferred from distribution tests.
- Secret scanning is pattern-based, not a guarantee. Production requires no application secrets. The initial repository had no private source history; the published commits and tracked files were scanned before publication.

## Maintenance

`npm ci && npm run check` reproduces local verification. `TEST_BASE_URL=https://laugh.theerapat.org npm run test:e2e` exercises the live domain. `npm run scan:secrets` checks tracked and non-ignored files for common credential patterns. Future publishing still requires explicit authorization; CI verifies only and has no deployment credentials.

This handoff is a documentation commit after the deployed source commit. Documentation-only updates do not imply a new Cloudflare deployment version.
