# GatherBox

UTS 31245 Assessment 2 prototype, due 25 October 2026. GatherBox proposes neutral tableware kits for Sydney households: 10 or 20 guests, with one plate, cup, fork and napkin per guest. This is a static demonstration, not a trading store.

Website development lead: Luu Quoc Thai Tran.

The existing Claude frontend design is retained. Codex integrated the cart, checkout, explicit payment outcomes, confirmation and contact validation on 20 October 2026. Current handoff: [docs/frontend-handoff.md](docs/frontend-handoff.md).

## Setup and commands

Use Node 24 (supported engine: Node ^20.19 or >=22.12) and npm. Keep this folder's own `.git` repository; do not use or modify the enclosing home-folder repository.

```sh
cd /Users/vanln/Developer/gatherbox
npm ci
npm run dev
```

Open the printed `/gatherbox/` URL. The following checks and preview use the production build:

```sh
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open [the local production preview](http://127.0.0.1:4173/gatherbox/). Stop the server with Ctrl+C. Preview serves the last build: run `npm run build` again after code changes. No `?preview=filled` or `?preview=errors` fixtures are present; all populated states must come from actual interactions.

`npm test` runs five dependency-free Node tests covering money calculations, storage validation, corrupt/blocked storage, confirmation validation and static/catalogue price consistency. The seven build inputs are home (`index.html`), shop, cart, checkout, confirmation, help and team.

## Browser regression check (optional test tooling)

`scripts/browser-check.mjs` checks the production preview using Playwright Chromium. Start the preview first. Playwright is optional local tooling and is not shipped in the website or required by the deployment workflow. To install it without changing the dependency manifest or lockfile:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node scripts/browser-check.mjs
```

Alternatively set `PLAYWRIGHT_MODULE` to an existing Playwright `index.mjs`; `CHROMIUM_PATH` can select an installed Chromium executable. `PREVIEW_URL` overrides the default `http://127.0.0.1:4173/gatherbox/`. Screenshots go to ignored `tmp/browser-check/` (override with `SCREENSHOT_DIR`). The test creates isolated browser contexts and fictional entries; it does not use your normal browser profile. See [test results](docs/testing-results.md) for the actual environment and checks run.

## Demonstration behaviour and privacy

- The single price source is `src/catalogue.js`: **AUD $29 / $49 kits and $12 delivery are demonstration values, not researched prices**. Delivery applies once to a nonempty order; an empty cart costs $0.
- Local storage `gatherbox.cart.v1` contains only valid `{ productId, quantity }` lines. Quantities are whole numbers 1–10 per kit. Adding above the limit is rejected; cart quantity errors restore the last saved value.
- Checkout requires fictional name, email, street address, suburb, a four-digit postcode and an explicit approved/declined simulation. A postcode format check does not verify a real address or Sydney eligibility.
- Declined payment keeps the cart and current entries for retry. Approved payment writes only a reference and kit lines to tab session storage `gatherbox.demo-order.v1`, clears the cart and opens confirmation. Reloading confirmation in the same tab retains that nonpersonal summary. A direct visit with no valid summary shows an empty state. Browser session restoration may restore session storage.
- Checkout/contact details are never sent, placed in URLs or written to app storage. Confirmation intentionally omits customer identity/address. Forms reset on page exit; checkout also resets after approval, and contact resets after its honest “not sent or saved” result. Autocomplete is disabled as a browser hint. There are no card fields, accounts, backend, analytics, external API calls or email delivery.
- If browser storage is blocked, cart changes fail with an honest message. If confirmation storage fails, checkout keeps the cart and allows retry. JavaScript is required for interaction; disabled controls prevent fallback form submission when it is unavailable.

## GitHub Pages deployment

Published with the user's explicit authorisation on 20 October 2026:

- Public repository: [tlqthai111/gatherbox](https://github.com/tlqthai111/gatherbox)
- Public website: [GatherBox student prototype](https://tlqthai111.github.io/gatherbox/)
- Latest successful build/deploy: [GitHub Actions run #3](https://github.com/tlqthai111/gatherbox/actions/runs/39555516703), source commit `1d135f18d5e8b76669392682ff429af64e4e943b` (21 October 2026).
- All three Team identities verified against the user: Luu Quoc Thai Tran - 25507474; Anthony Bui - 26486593; Ashcan Zaman - 26077610. No SID is pending.
- Verification: **46 grouped Chromium checks passed locally and on the latest hosted version**, including computed brand/cart quantity names, cart behaviour and checkout protection. See the [accessibility review](docs/accessibility-review.md) and [versioned deployment record](docs/deployment-results.md). The user supplied initial AChecker findings; a checker rerun, formal evaluation and unfinished report work remain pending.

The saved workflow remains **manual-only** (`workflow_dispatch`), with no push trigger. It uses Node 24, installs locked dependencies with `npm ci`, runs `npm test`, builds all seven pages, uploads **only `dist/`** and deploys `main` through the `github-pages` environment. References, environment files, dependencies, build output and local test screenshots remain ignored. No home-folder repository was changed.

For future approved website changes:

1. Edit and review locally; run `npm test`, `npm run build` and the browser regression script.
2. Inspect `git status --short` and `git diff`; ensure `git check-ignore reference/*` still succeeds and no local environment file is tracked.
3. Commit with the configured real identity and push `main` only when authorised. A push alone does not deploy.
4. Pages is already configured at **Settings → Pages → Source → GitHub Actions**. In **Actions → Deploy GatherBox to GitHub Pages → Run workflow**, select `main`, inspect both jobs, then verify the hosted pages again.
5. Capture final Task 7 screenshots/URL and run the required AChecker then W3C WAI evaluation for Task 8 against that same version. Record actual findings and unresolved issues.

`vite.config.js` keeps `base: '/gatherbox/'` and seven HTML build inputs. A different repository name requires changing the base and repeating path tests. No SPA route fallback is needed. Code publication and an accessible-looking interface do not establish WCAG conformance.

Official sources checked 20 October 2026: [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Vite static deployment](https://vite.dev/guide/static-deploy.html). Official action tag revisions were checked against GitHub before deployment; setup-node's v7 pin was refreshed. Review revisions before future upgrades.

## Project notes

- [Implementation decisions / Task 7 evidence](docs/implementation-notes.md)
- [Assumptions and unresolved business claims](docs/assumptions.md)
- [Accessibility checks and pending evaluation](docs/accessibility-checklist.md)
- [Exact verification results](docs/testing-results.md)
- [AI contribution log; human review still required](docs/ai-use-log.md)
