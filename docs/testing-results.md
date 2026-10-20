# Integration verification results

Date: **20 October 2026 (Australia/Sydney)**. Tester: Codex. Repository/root verified as `/Users/vanln/Developer/gatherbox`, with its own `.git`, main branch, no commits and no remote at the start. Home-folder Git was not changed. The frontend/source, catalogue, handoff and all four supplied references were read before implementation.

## Commands and environment

- `npm test`: **5/5 passed**, Node v24.9.0. Tests are in `tests/integration.test.js`.
- `npm run build`: **passed**, Vite 8.3.4. Outputs are seven HTML pages plus local CSS/JS/SVG assets. Base remains `/gatherbox/`.
- `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`: local production preview used for browser checks.
- `scripts/browser-check.mjs`: **34 grouped checks passed** using bundled Playwright 1.62.1 and installed Chromium build 1243, selected through `CHROMIUM_PATH`. The runtime's default expected browser was missing, so the installed executable was selected; Chromium required execution outside the macOS process sandbox. No new browser download was needed.
- Browser checks used clean automation contexts, actual HTML pages under `/gatherbox/`, fictional form entries and **no fixture query parameters**. Development `preview.js` and its import were removed.

The initial Node run found missing central-price hooks on the home page; those hooks were added and the suite passed. During browser-test authoring, the expected required-field count was corrected from seven to six and text assertions were made to wait for requestAnimationFrame live-region updates. Those were test-harness corrections, not claims of failed customer flows. The completed 34-check run below passed.

To reproduce with the same bundled tools (when present):

```sh
PLAYWRIGHT_MODULE=/Users/vanln/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs \
CHROMIUM_PATH=/Users/vanln/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell \
node scripts/browser-check.mjs
```

README gives a portable optional installation route. The preview must already be running. The runner's default screenshots directory is ignored `tmp/browser-check/`; this session used `/tmp/gatherbox-browser-check/`, then copied the captures into the project `tmp/browser-check/` for local review. These local test captures are not published website evidence and are not included in Git or `dist/`.

## Five Node tests

1. Single kit totals ($41 / $61), mixed 2×10 + 1×20 total $119, one delivery charge, and zero delivery/total for empty cart.
2. Storage validation: unknown IDs, missing/nonpositive/fractional/string/unsafe quantities; duplicate merging, ten-kit cap and removal of extra properties.
3. Malformed storage repair, canonical saved shape and safely handled storage exceptions.
4. Confirmation reference/canonical lines validation and omission of unrelated data.
5. Static home/shop sample prices and help delivery text agree with catalogue.

## Thirty-four grouped browser checks

| # | Check | Result |
| --- | --- | --- |
| 1–7 | Home, shop, cart, checkout, confirmation, help and team: page loading, one h1, language, IDs, labels, ARIA references, loaded images/alt presence and local links/base paths | Passed per page |
| 8 | Direct confirmation without order | Empty state |
| 9 | Empty checkout and blank form | Submission blocked, summary focused |
| 10 | 10-guest kit alone | $29 + $12 = $41 |
| 11 | Remove last kit | Empty cart, heading focused |
| 12 | 20-guest kit alone | $49 + $12 = $61 |
| 13 | Mixed cart (2×10 + 1×20) | Subtotal $107, delivery $12, total $119 |
| 14 | Quantity changes and invalid zero | Total updates, invalid edit restores previous quantity |
| 15 | Reload cart | Saved cart retained |
| 16 | Blank checkout | Six linked errors, summary focus, link focuses field |
| 17 | Invalid email/postcode | Two errors, clear on valid correction |
| 18 | Declined simulation | Failure text, cart and current form retained |
| 19 | Keyboard approval retry | Space/Enter reaches confirmation, $148 for 3×10 + 1×20, cart cleared, no fictional identity/address in app storage or confirmation |
| 20 | Confirmation reload | Same valid nonpersonal summary retained |
| 21 | Contact required/email/whitespace errors, then valid submission | Errors correct; honest not-sent/not-saved result; reset |
| 22 | Malformed and tampered localStorage | Safe empty fallback or canonical valid lines; unknown/invalid/extra data removed |
| 23 | Corrupt confirmation | Empty state |
| 24 | Change cart in second tab | First tab updates from storage event |
| 25 | Mobile keyboard skip link, menu Enter/Tab/Escape | Main focus, expanded state, Home reached, toggle focus restored |
| 26–27 | All seven pages at 390px and 320px | No document overflow; screenshots captured |
| 28 | Keyboard add above existing per-kit cap | Rejected with limit message |
| 29 | Mobile keyboard removal with remaining kit | Remaining quantity focused; $61 total |
| 30 | Actual 390px approved checkout | Confirmation $61; screenshot captured |
| 31 | Main test-context network/runtime observation | No JS errors, HTTP failures, external requests, non-GET requests or checkout data in URLs observed |
| 32 | JavaScript-disabled checkout/contact | Submit controls disabled |
| 33 | Blocked localStorage | Honest save error, no crash |
| 34 | Blocked sessionStorage during approval | Cart retained, confirmation-save failure explained |

## Visual review

Inspected seven captures: desktop cart and confirmation; 390px checkout, checkout errors and successful confirmation; 320px cart and shop. No clipping/overlap observed in those captures. All fourteen narrow-page screenshots were generated, but the remaining captures were not individually visually reviewed. Source styling and original illustrations were preserved.

## What this does not establish

No real payment, backend, order transmission, email, fulfilment, inventory or real delivery-area check exists. Safari, Firefox, real mobile hardware, screen readers, real browser 200% text zoom, full human keyboard-only traversal, repeated audible status timing, browser Back/Forward cache and session restoration remain untested. No fresh full contrast/heading-level audit, AChecker run, W3C WAI report, conformance certification or published-site test was performed.

The prepared GitHub Actions workflow has not executed on GitHub. No repository was created remotely, no push ran and no URL was published. Reference documents remain ignored and outside the build; the report was not edited. Ashcan’s SID was pending at the integration milestone; the user has since supplied 26077610 and confirmed all three identities for publication.


## Publication preflight (20 October 2026)

The user authorised a public `gatherbox` repository, push and Pages deployment. Reverified the exact project/Git root, `.gitignore`, current status and configured real author identity. All three Team names/SIDs now match the user's clarification; no SID is missing. Prototype and sample-price notices appear on all seven pages. Five Node tests and the production build passed again. The expanded production browser suite passed **37 grouped checks**: the original 34 plus all three Team identities, a working shopping route from the empty cart with no visible checkout link, and direct empty checkout with valid fictional fields/approval still refusing to create an order. Nonempty blank/invalid checkout continues to show linked errors and focused summary. No purchase-with-empty-cart option was added.

Verified official action tag revisions through GitHub; refreshed setup-node's pinned v7 revision before publishing. Reference and local environment files remain excluded. Hosted results will be recorded after actual publication.
