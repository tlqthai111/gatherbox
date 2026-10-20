# Published GatherBox prototype

## Current deployed version for accessibility evaluation

- Update: exact Team page and README credit, “Website development lead: Luu Quoc Thai Tran.”
- Deployment date: 20 October 2026 (Australia/Sydney).
- Deployed source commit: [`098f79884dd2bdbaa1014e8796863906b5ec2b68`](https://github.com/tlqthai111/gatherbox/commit/098f79884dd2bdbaa1014e8796863906b5ec2b68).
- Successful manual deployment: [workflow run #2](https://github.com/tlqthai111/gatherbox/actions/runs/39399578265); both build and deploy jobs passed.
- Website: https://tlqthai111.github.io/gatherbox/
- Verified Team page: https://tlqthai111.github.io/gatherbox/team.html
- Team HTML SHA-256: `ab4a92eca626e7df3c24a9c6ee1216174efc37c6d50d92307f759c26979f8e35`.

The local production build passed. The existing workflow also passed its install, Node-test, build and deployment steps. Verified the visible credit and all three member names/SIDs in the hosted browser; anonymous HTTPS Team HTML matched the local build byte-for-byte. The three-member table and existing Claude/Codex acknowledgements are retained. This was a text-only change; the full 37-check browser suite below was not repeated for this version. Formal accessibility evaluation and unfinished report sections remain pending.

Use this deployed commit plus the published URLs and actual evaluation date when recording Task 8 evidence. The documentation follow-up commit only records this result and does not change website build content.

## Initial publication (historical record)

Published and verified **20 October 2026 (Australia/Sydney)**, with explicit user authorisation.

- Repository: https://github.com/tlqthai111/gatherbox (public; verified through GitHub and the authenticated connector).
- Website: https://tlqthai111.github.io/gatherbox/
- Workflow: https://github.com/tlqthai111/gatherbox/actions/runs/39392380257 (manual run #1, success).
- Deployed source: `7d06c669e2c4fa0b0e271835f018dedc425ac826`.
- Commit author: Luu Quoc Thai Tran <luuquocthai.tran@student.uts.edu.au>, the configured real identity. No synthetic author identity or co-author was added.
- Authentication: existing `tlqthai111` GitHub session and GitHub Desktop were used. GitHub CLI was not installed. No new credential or account was created.

## Publication and exclusions

Verified working directory and Git root as `/Users/vanln/Developer/gatherbox`. Kept its existing `.git` and main branch. Inspected status and `.gitignore`, staged an explicit source allowlist, checked the staged tree and committed 30 source/config/test/documentation files. Created the public repository through GitHub Desktop and pushed `main`. The home-folder repository was not modified.

`reference/`, `.env*`, `node_modules/`, `dist/`, temporary files and local screenshots remain ignored. No reference PDFs/DOCX or local environment files are tracked. The workflow uploads only `dist/`; documentation/source/tests are visible in the public repository but are not website build artifacts. The published `/reference/`, `/.env` and `/docs/` paths return 404.

Pages source is **GitHub Actions**. The manual-only prepared workflow built with `npm ci`, passed five Node tests and the seven-page production build, configured Pages, uploaded its artifact, then deployed successfully. Setup-node's pinned v7 revision was refreshed after verifying official tag SHAs. No deployment or `/gatherbox/` path failure required a website code fix. GitHub reported runner migration notices and a dependency deprecation message; both jobs completed successfully.

The documentation follow-up commit records results only; it does not change the deployed HTML/CSS/JS or assets. The initial deployed source above identifies the version used for those original tests; the current credit-update version is recorded at the top of this file.

## Team verification

All three user-confirmed identities appear on the hosted Team page:

| Member | SID |
| --- | --- |
| Luu Quoc Thai Tran | 25507474 |
| Anthony Bui | 26486593 |
| Ashcan Zaman | 26077610 |

No SID is missing. The ignored report/reference document was not edited; align any remaining placeholder in the submission separately.

## Checks actually performed

- Prepublication `npm test`: 5/5 passed; `npm run build`: passed, all seven HTML entries. Verified student-prototype and sample-price notices on all pages and no reference documents in the output.
- Expanded production-browser suite: **37/37 grouped checks passed locally and again on the actual HTTPS site**, using Playwright 1.62.1 and installed Chromium build 1243. No `?preview=filled` or `?preview=errors` fixture was used.
- All seven hosted pages, images and same-origin links loaded under `/gatherbox/`; labels, one h1, language, IDs and ARIA references checked by script. Team values matched the table above.
- Both kits and mixed carts: 10 kit $41 including delivery; 20 kit $61; 2×10 + 1×20 subtotal $107 and total $119; quantity edits, invalid zero, removal, reload and cross-tab updates passed.
- Empty cart has a working **Shop kits** route and no visible checkout link. Direct `checkout.html` with an empty cart cannot create an order, including after filling valid fictional details and selecting approval. The handler still rejects an empty cart; no option to purchase an empty order was added.
- With products present, blank checkout produces six linked errors and focuses the summary; links focus fields. Invalid email/postcode rejected; corrected errors clear.
- Declined payment retains cart and entries. Keyboard approval retry creates a demonstration confirmation with correct total and clears the cart. Same-tab confirmation reload retains the nonpersonal summary; direct/corrupt confirmation shows the empty state.
- Contact validation and honest not-sent/not-saved response passed. No checkout personal details were found in app storage or confirmation. No external requests, non-GET requests, checkout details in URLs, JS errors or HTTP failures were observed in the main browser flow.
- Tampered/malformed cart storage, blocked localStorage, blocked confirmation storage and no-JavaScript safeguards passed.
- Selected keyboard paths (skip link, menu Enter/Tab/Escape, add, removal and approval retry) passed. All seven pages at 390px and 320px had no horizontal document overflow. An actual 390px checkout completed successfully.
- Anonymous system-HTTPS checks: root and seven explicit HTML URLs returned 200 and matched local production HTML byte-for-byte. Excluded website paths `/reference/`, `/.env` and `/docs/` returned 404. An initial auxiliary system-Python request failed due to its local certificate bundle; repeating through the system-trusted curl client passed with TLS verification enabled. Chromium HTTPS checks had already passed; no TLS checks were disabled.
- Hosted screenshots saved locally in ignored `tmp/hosted-check/`. Inspected desktop confirmation, 320px cart and 390px checkout-error screenshots; no clipping/overlap observed in those captures. Other captures exist but were not all individually visually inspected.

`testing-results.md` retains the earlier local-check details. `scripts/browser-check.mjs` reproduces the expanded suite using `PREVIEW_URL=https://tlqthai111.github.io/gatherbox/`.

## Page URLs for Task 8

| Page | Published URL |
| --- | --- |
| Home | https://tlqthai111.github.io/gatherbox/index.html |
| Shop kits | https://tlqthai111.github.io/gatherbox/shop.html |
| Cart | https://tlqthai111.github.io/gatherbox/cart.html |
| Checkout | https://tlqthai111.github.io/gatherbox/checkout.html |
| Confirmation | https://tlqthai111.github.io/gatherbox/confirmation.html |
| Help/contact | https://tlqthai111.github.io/gatherbox/help.html |
| Team | https://tlqthai111.github.io/gatherbox/team.html |

For representative manual evaluation also create filled/mixed/empty carts, invalid forms, declined/retry states and a successful confirmation through actual interactions. A fresh confirmation URL shows the no-order state; a fresh checkout is deliberately blocked until a kit is added. A single-page automated fetch will not exercise those stateful interactions.

## Unresolved evaluation work

No known blocking functional failure was found in these tested paths. Screen-reader speech/announcement timing, full human keyboard-only traversal, real-browser 200% text zoom, independent full contrast audit, Safari/Firefox, actual mobile hardware and browser back/forward/session restoration remain untested. No AChecker run or W3C WAI report has been generated. No WCAG conformance is claimed. Prices, dispatch and commercial arrangements remain labelled demonstrations/proposals, not verified business performance.

## Next three assessment actions

1. **Task 4:** Explain at least five proposed business processes, then complete the order-to-dispatch BPMN swimlane with roles/handoffs, failed-payment retry and stock exceptions. Separate demonstrated browser steps from future operational work.
2. **Task 7:** Insert this working URL and selected captioned screenshots from the published version; explain goal/audience/UX, static GitHub Pages hosting and simulated versus future hosted payment. Keep scope to the two base kits and verify all names/SIDs in the report.
3. **Task 8:** Run AChecker first on the published pages, manually investigate findings and dynamic states, fix/retest actual issues, then complete the W3C WAI evaluation report for the same version with evidence, scope and honest unresolved findings.
