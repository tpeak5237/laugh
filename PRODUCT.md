# Laughing Seed
<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
delegated: lightweight static TypeScript frontend, independent RNG module, reproducible build and browser tests; Cloudflare Workers static assets. The user explicitly delegates engineering choices in the execution brief.

## Users
Thai Gen Z sharing chaotic numerical laughter in chats, primarily on phones.

## Product Purpose
Generate and copy fresh strings of laughter-like digits immediately, without signing in.

## Positioning
The harder the laughter looks, the fewer actual 5s it needs. Browser Web Crypto supplies independent weighted samples: 5 has weight 1, every other decimal digit weight 100, total 901. Rejection sampling avoids modulo bias; this is a weighted CSPRNG, not physically true randomness or uniform decimal digits.

## Capabilities and Constraints
One configurable parameter: integer length 1–10,000. Generate on load and valid length changes. Regenerate and copy actions. Display actual length and count of 5s. Graceful validation, randomness and clipboard errors. No database, login, tracking, server-side generation, forced 5s or network generation calls.

## Brand Commitments
Thai-first, funny, spontaneous, slightly chaotic and memorable. Output is the attraction. No corporate dashboard, generic purple gradients, decorative glassmorphism, fake metrics or unnecessary navigation.

## Evidence on Hand
The user's execution brief is authoritative. The workspace has no incumbent HTML or implementation. GitHub tpeak5237 authentication and Cloudflare account access are present; target repo was not found. Domain availability remains unverified.

## Product Principles
- Immediate play, one parameter.
- Honest engineering and verifiable claims.
- Public access without accounts.
- Select a visual direction before production UI implementation.

## Accessibility & Inclusion
Keyboard access, useful focus states, reduced motion, mobile/tablet/desktop layouts, readable wrapping and error recovery.
