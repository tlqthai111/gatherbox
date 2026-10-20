# GatherBox

UTS 31245 Assessment 2 prototype, due 25 October 2026. GatherBox proposes neutral tableware kits for Sydney households: 10 or 20 guests, with one plate, cup, fork and napkin per guest. This is a static demonstration, not a trading store.

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

No remote repository has been created, no push has run, and nothing has been published. The saved workflow is **manual-only** (`workflow_dispatch`); it has no push trigger. It installs locked dependencies, runs the Node tests, builds, uploads **only `dist/`**, then deploys the approved `main` branch. GitHub-hosted workflow execution is still untested.

The user authorised public repository creation, push and publication on 20 October 2026. Publication verification is in progress. Deployment procedure:

1. Team details are confirmed from the user: Luu Quoc Thai Tran — 25507474; Anthony Bui — 26486593; Ashcan Zaman — 26077610. Align the report to the two base kits; optional extras are outside scope.
2. Confirm `git rev-parse --show-toplevel` is this project. Inspect `git status --short` and `git check-ignore reference/*`. `reference/`, `node_modules/`, `dist/`, `.env*` and `tmp/` must stay excluded. Do not force-add reference documents.
3. Only when authorised, create a GitHub repository named **gatherbox**. For GitHub Free, use a public repository. Review and commit the source locally, connect that repository and push `main` only with the user's approval. This README does not authorise those actions.
4. In the repository, choose **Settings → Pages → Build and deployment → Source → GitHub Actions**.
5. In **Actions → Deploy GatherBox to GitHub Pages → Run workflow**, select `main` and run it when publication is approved. The environment is `github-pages`; the workflow reports the deployed URL.
6. Check `https://<username>.github.io/gatherbox/` and every `.html` page, including a fresh direct confirmation visit. Retest both payment outcomes and keyboard/mobile operation on that exact URL.
7. Capture final screenshots and URL for Task 7. Run AChecker first, then prepare the complete W3C WAI evaluation report for Task 8 on that published version. Record actual findings, fixes, date, scope and pending issues.

The existing `base: '/gatherbox/'` and seven HTML inputs are in `vite.config.js`. A different repository name requires changing the base and repeating path tests. No SPA route fallback is needed.

Official sources checked 20 October 2026: [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Vite static deployment](https://vite.dev/guide/static-deploy.html), [GitHub Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages). Action revisions are pinned to the current Vite example; review them before future upgrades.

## Project notes

- [Implementation decisions / Task 7 evidence](docs/implementation-notes.md)
- [Assumptions and unresolved business claims](docs/assumptions.md)
- [Accessibility checks and pending evaluation](docs/accessibility-checklist.md)
- [Exact verification results](docs/testing-results.md)
- [AI contribution log; human review still required](docs/ai-use-log.md)
