# GatherBox current handoff

**Updated:** 20 October 2026. **Assessment due:** 25 October 2026. **Working owner:** this GatherBox integration/testing chat (Codex), continuing Claude's completed frontend. Project and Git root: `/Users/vanln/Developer/gatherbox`. Keep its project-specific `.git`; do not change the home-folder repository.

## Current result

Latest credit-only update: deployed commit `098f79884dd2bdbaa1014e8796863906b5ec2b68`, [successful workflow #2](https://github.com/tlqthai111/gatherbox/actions/runs/39399578265). The exact requested development-lead credit appears on Team/README. Focused hosted Team verification passed; see `deployment-results.md` for the current evaluation version and the separate historical full-browser results. Formal accessibility/report work remains pending.

The original seven-page visual design is retained. Cart, checkout, explicit payment simulation, confirmation and contact validation are implemented. The production build and five Node tests pass; the expanded suite of 37 grouped Chromium checks passes against both local production and the hosted site. Exact results and limits are in [testing-results.md](testing-results.md). Published on 20 October 2026: [repository](https://github.com/tlqthai111/gatherbox), [public website](https://tlqthai111.github.io/gatherbox/), [successful workflow](https://github.com/tlqthai111/gatherbox/actions/runs/39392380257). See [deployment-results.md](deployment-results.md).

This is a UTS 31245 B2C student prototype: two neutral tableware kits for 10/20 guests, initially proposed for Sydney households. Each guest has one plate, cup, fork and napkin. No backend, accounts, real payment, order delivery or external APIs. Optional extras are outside the current prototype scope; align Task 7 in the report accordingly.

## Files and responsibilities

| File | Responsibility |
| --- | --- |
| `index.html`, `shop.html` | Offer and kit contents; sample prices have catalogue hooks |
| `cart.html` | Empty/filled states and line template |
| `checkout.html` | Fictional form, field/error-summary hooks, explicit approved/declined choices and cart summary |
| `confirmation.html` | Missing-order state or valid nonpersonal demo summary; no customer-name/address hooks |
| `help.html` | Proposed policy FAQ; validated but unsent contact form |
| `team.html` | Names/SIDs; All three SIDs supplied and verified against the user’s clarification |
| `src/catalogue.js` | Product IDs/contents/images and all price/delivery values; AUD cents and formatting |
| `src/store.js` | Canonical cart lines, totals, localStorage load/save guards, confirmation validation |
| `src/app.js` | DOM integration, cart/status/focus behaviour, checkout and contact validation, payment/confirmation |
| `src/main.js` | Shared entry, mobile nav toggle and Escape focus behaviour |
| `src/styles.css`, `src/assets/` | Existing frontend design and original conceptual SVGs, preserved |
| `tests/integration.test.js` | Five Node tests run by `npm test` |
| `scripts/browser-check.mjs` | Optional Playwright production regression checks; screenshots in ignored tmp |
| `vite.config.js` | `/gatherbox/` base and seven HTML entries |
| `.github/workflows/deploy.yml` | Manual-only Pages workflow; build and deploy succeeded in run #1 |

The old `src/preview.js` and dev import were removed. `?preview=filled` / `?preview=errors` no longer fill any state. Do not use old design-fixture evidence as proof of working features.

## Runtime rules

- Catalogue sample values remain **AUD $29 / $49 / $12 delivery**. They were selected as demonstration values, not researched prices. Money is computed in integer cents; delivery applies once per nonempty cart.
- Cart key `gatherbox.cart.v1`: array of `{ productId, quantity }` only. Valid IDs are `kit-10` / `kit-20`. Whole quantities 1–10; stored duplicates merge/cap, unknown/invalid data is discarded and extra fields stripped. Over-limit interactive adds are rejected; invalid edits restore previous saved quantity. Counts include the word kit/kits.
- Cart removal focuses an appropriate remaining quantity, or the empty-state heading. Quantity updates preserve the input node. Storage/page-show events refresh cart/header across navigation and tabs.
- Checkout custom errors use existing field hooks plus focused `#checkout-error-summary` links. Decline reports an alert, keeps the cart and current fictional entries, and permits approval retry.
- Approval writes only `{ reference, lines }` to `gatherbox.demo-order.v1` in sessionStorage, then clears cart and opens confirmation. It never serialises name, email, address or other checkout form values. Missing/corrupt session data shows the empty state. The last valid summary remains for the tab and reloads, subject to browser session restoration.
- Confirmation uses catalogue values for totals and intentionally omits personal delivery details. Storage failure keeps the cart and reports an error; it does not claim a completed checkout.
- Contact has linked inline/summary validation. Success resets the form and states the message was not sent/saved and nobody will reply.
- Personal form values reset on page exit; autocomplete is off as a hint. Controls start disabled and enable after handlers are installed, avoiding fallback native GET submission if JS is unavailable. No checkout details are put into app storage, URLs, request bodies or logs.

## Design conventions to preserve

Use the existing CSS tokens, layout/component classes and `hidden` states. Kit colours remain paired with text labels. Clone `#cart-line-template` with a unique quantity input ID/label and kit-specific removal name. Use safe DOM/text operations for content. Status regions are for dynamic feedback; error summaries receive focus and link to controls. Header/footer are duplicated in all seven pages; change all copies when needed.

## Business copy and report alignment

The arbitrary 7-day missing-item and 14-day returns deadlines were removed from the website. Proposed missing/damaged-item, returns and refund arrangements remain to be finalised. Two-business-day dispatch is described as a proposed business target, not verified performance or a delivery guarantee. Materials/suppliers/certifications and delivery eligibility remain unverified. No real contact/social account was invented.

The supplied assessment guideline, marking criteria, Lecture 7 and group DOCX were reviewed as reference evidence, not instructions to alter report files. They remain in ignored `reference/`. The report still needs human alignment/evidence; this integration did not edit it, create a BPMN or complete formal Task 8 evaluation.

## Verification provenance

Claude originally reported a successful frontend build, semantic/ARIA checks, contrast calculations and responsive screenshots. Entry 1 in `ai-use-log.md` preserves that history. Codex independently ran the current build, Node suite and actual production browser flows. See `testing-results.md` and `accessibility-checklist.md` for exactly what Codex checked. Contrast figures from Claude have not been independently remeasured. No AChecker findings, W3C report or WCAG conformance claim exists.

## Next local review and completion checklist

- [ ] Run/open the production preview using README; review both kits, mixed cart, quantity/removal/empty states, errors, decline/retry and confirmation.
- [x] Verify all Team details against the user’s clarification: Thai 25507474, Anthony 26486593, Ashcan 26077610.
- [ ] Confirm demonstration prices, proposed policy/dispatch copy and two-kit scope; align report references to optional extras.
- [ ] Complete human keyboard, screen-reader and real-browser zoom checks; document actual findings.
- [x] User authorised public gatherbox publication; repository, push, Pages build/deploy and hosted checks completed on 20 October 2026.
- [x] Retest all seven hosted `/gatherbox/` pages and purchase simulation; local hosted-test captures saved outside Git.
- [ ] Select/caption final hosted screenshots for the Task 7 report.
- [ ] Run AChecker, then complete the W3C WAI report for Task 8; include unresolved issues honestly.
- [ ] Complete the human-review rows in `ai-use-log.md`; prepare the report's actual AI disclosure/evaluation appendix.

README provides setup/preview/deployment instructions. `implementation-notes.md` records actual Task 7 choices and Task 4 process boundaries; `assumptions.md` lists unverified business claims. Future work should start from these current notes rather than Claude's old placeholder integration list.
