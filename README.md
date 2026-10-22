# Laughing Seed

ขำจนเลขตามไม่ทัน — a Thai-first web toy for generating and copying chaotic numerical laughter. No accounts, database, tracking, generation server, or runtime network calls. One parameter: **length, 1–10,000 digits**.

Design: **Chaotic Internet**, explicitly selected from the real Impeccable direction picker. Acid yellow, heavy Thai typography, black numerical output and pink actions. Mitr, Lilita One and Kanit are served locally under their included OFL licenses; newly authored code is MIT.

## Run

Node 22.12+ (Node 24 recommended).

```sh
npm ci
npm run dev
```

The browser generates on load and after valid length changes. **ขำใหม่อีกที** regenerates; **คัดลอก** copies exactly the visible text content, including the digits in the scrollable output region. Long output wraps and scrolls so controls remain reachable. Clipboard denial offers text selection for manual copy. Web Crypto failure stops generation without a weaker fallback.

## Randomness model

`src/rng.ts` is independent of the DOM. Each output digit uses its own accepted 16-bit sample from `crypto.getRandomValues()`, drawn in 2,048-word (4 KiB) buffers. Values **64,872–65,535 are rejected**; each accepted word is reduced modulo 901. All 901 indices have exactly 72 accepted preimages, eliminating modulo bias.

| Digit | Weight | Probability |
| --- | ---: | ---: |
| 5 | 1 | 1/901 |
| Every other decimal digit | 100 each | 100/901 each |

Indices 0–499 map to digits 0–4 in blocks of 100; index 500 maps to 5; indices 501–900 map to 6–9 in blocks of 100. The implementation never inserts, removes or forces a 5. Zero-five output is possible. The name does not imply a user-configurable seed: no seed exists. This is **weighted cryptographically secure pseudorandom sampling**, not physical true randomness or uniform decimal digits. Deterministic distribution tests prove mapping correctness, not cryptographic security.

The bounded rejection guard fails closed if a broken provider cannot produce usable values. Test randomness injection exists only in the engine's test seam; the public UI always uses Web Crypto.

## Verify

```sh
npx playwright install chromium webkit
npm run check
npm run deploy:dry
```

`check` runs strict TypeScript, a production Vite build, 13 deterministic/secure-provider engine tests, and browser regression tests across Chromium/WebKit at mobile, tablet and desktop sizes. Browser tests cover validation, automatic generation, reroll, exact copy, error recovery, 10,000 digits, keyboard operation, reduced motion, wrapping and axe WCAG A/AA checks. Real OS clipboard readback is exercised in Chromium; WebKit uses a clipboard contract test because Playwright cannot grant its clipboard permission. CI runs verification, never deploys automatically.

See [verification](docs/VERIFICATION.md) for actual results and limitations. Desktop browser emulation is not physical-phone testing.

## Structure and contracts

- `index.html`: Thai semantic interface and discoverable technical explanation.
- `src/rng.ts`: length validation and weighted rejection sampler.
- `src/main.ts`: DOM state, regeneration, counts and clipboard recovery.
- `src/style.css`: responsive layout and selected design.
- `public/_headers`: Cloudflare CSP and browser security headers.
- `tests/`: independent engine and browser regression tests.
- `wrangler.jsonc`: asset-only Worker and the single custom domain.

There is no API or persisted user data. The engine contract is `generateLaughter(integer): string` of exactly the requested length or an error; no partial success. UI state lives in memory and resets on reload. RNG failure clears previous output to avoid implying fresh generation. Invalid edits preserve the prior output and explicitly request a corrected length.

## Release

Target: `https://laugh.theerapat.org`, Cloudflare Worker `laugh` with static assets from `dist`. Publishing requires explicit approval; the original execution brief authorizes this first release. Future releases require their own authorization.

Before a release, verify the exact source with `npm run check`, inspect output, confirm the hostname is still assigned to this project or unused, review `git diff`, and run `npm run deploy:dry`. Then publish only the verified tree with `npm run deploy`. Cloudflare Custom Domains provisions DNS/TLS; never override a conflicting hostname. No credentials are stored in this repository.

After publishing, exercise the **custom HTTPS domain**, verify asset responses and security headers, run browser smoke tests with `TEST_BASE_URL=https://laugh.theerapat.org npm run test:e2e`, and record the commit and Cloudflare version. A successful CLI upload alone is not evidence of a working public domain.
