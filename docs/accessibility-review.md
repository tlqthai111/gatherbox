# Review of reported AChecker findings

Reviewed **21 October 2026 (Australia/Sydney)** by Codex. Site: https://tlqthai111.github.io/gatherbox/. The user supplied initial WCAG 2.0 AA results: Check 7 on all seven pages, and Check 188 on Cart. The underlying AChecker report file, run date and processing details were not supplied. These findings were reviewed against actual source and Chromium's rendered accessibility tree; AChecker has **not been rerun** by Codex for this change. No zero-findings or WCAG-conformance claim is made.

## Before changing the code

Verified the working directory and Git root as `/Users/vanln/Developer/gatherbox`, with a clean working tree. Fast-forwarded the existing remote README formatting commit (`1ca72ea`) before editing; no home-folder repository was touched. Read all seven header copies, `cart.html`, the `src/app.js` renderer, existing checks, deployment configuration and accessibility notes.

Inspected the existing published site in a clean Chromium context using the browser's `Accessibility.getFullAXTree` protocol method, not just source text or `alt` attributes. Before any edit:

- Each of the seven brand links already computed to **GatherBox home page**.
- With both products added through Shop, Cart exposed two spinbuttons named **Quantity of 10-guest kits** and **Quantity of 20-guest kits**.
- Rendered inputs had unique IDs `cart-qty-kit-10` and `cart-qty-kit-20`, with matching associated labels.
- The source template's visible label text was `Quantity`, but its label had no `for` and its input had no `id`. The existing renderer assigned both associations and kit-specific text before inserting each clone.

These observations did not reproduce an unnamed brand link or unnamed active quantity field in Chromium. A reported checker result alone is not proof of a runtime failure. The precise reason AChecker raised Check 188 was not independently established; source/template inspection is a plausible explanation, not a verified account of the checker's implementation.

## Changes and classification

| Finding | Actual change | Assessment |
| --- | --- | --- |
| Check 7, all seven pages | Brand image now has `alt="GatherBox home page"`. The visible wordmark stays `<span aria-hidden="true">GatherBox</span>`. Removed the redundant visually hidden `home page` span. The link and image themselves are not hidden. | **Alternative markup / checker compatibility improvement.** The prior image-plus-text link already had a useful computed name; this was not a confirmed runtime naming defect in the inspected browser. The new image alternative supplies the same link name once. |
| Check 188, Cart | Template now pairs `label for="cart-qty-template"` with `input id="cart-qty-template"`; its visible `Quantity` text remains. The renderer still overrides input ID, label `htmlFor` and product-specific label text before insertion. Added a comment explaining that contract. | **Confirmed static template association omission corrected.** The inactive template is now self-contained and clearer to source inspection. Active rendered controls already had correct associations/names; no runtime unlabeled-input defect was confirmed. |

The default template ID remains inside inert template content. It is not inserted into the active page; live IDs remain product-specific and unique. No styling, kit content, prices, checkout logic, team membership, development-lead credit or AI acknowledgement was replaced.

The interpretation of the original brand pattern is consistent with [W3C WAI's logo-with-link-text example](https://www.w3.org/WAI/tutorials/images/functional/#example-2-logo-image-within-link-text): an image can have empty alt when accompanying link text provides its purpose. The requested replacement instead names the functional image and hides only duplicate text. W3C also explains that an explicit label's `for` must match its control's `id` in [Labeling Controls](https://www.w3.org/WAI/tutorials/forms/labels/). These references explain the patterns; they do not establish whole-site conformance.

## Local verification actually run

- `npm test`: **5/5 passed**, existing Node tests.
- `npm run build`: **passed**, Vite 8.3.4, all seven HTML entries; existing `/gatherbox/` base retained.
- Production preview at `http://127.0.0.1:4174/gatherbox/`, with no design fixtures.
- Expanded `scripts/browser-check.mjs`: **46/46 grouped checks passed**, using bundled Playwright 1.62.1 and installed Chromium build 1243. This includes the previous 37 behaviour checks plus seven computed-brand-name checks, one inert-template association check and one two-product cart naming/association check.
- All seven computed brand link names were exactly **GatherBox home page**, with no repeated wordmark. The duplicate wordmark remained visible, with `aria-hidden` applied only to its span.
- Mixed cart DOM and Chromium accessibility tree confirmed `cart-qty-kit-10` / `Quantity of 10-guest kits` and `cart-qty-kit-20` / `Quantity of 20-guest kits`; label `for` values matched. No active `cart-qty-template` input appeared.
- Empty and populated carts; both kit sizes; mixed totals; quantity updates; invalid quantity restoration; line/last removal and focus; reload and cross-tab synchronisation passed.
- Empty cart's Shop kits route worked, with no visible checkout link. Direct empty checkout still refused a valid fictional form with approval selected and did not create an order. With kits present, blank/invalid fields produced linked errors and focused summaries. Decline/retry, approval/confirmation and contact validation also passed.
- Selected keyboard paths and all seven pages at 390px/320px passed, including a mobile approved checkout. No JS errors or HTTP failures were observed in the main flow.
- Compared the old published header against the new local header at **1280px and 390px** in the same browser: both screenshot pairs were **byte-identical**. CSS remained unchanged.

## Deployment and evaluation limits

Published on **21 October 2026** through [manual workflow run #3](https://github.com/tlqthai111/gatherbox/actions/runs/39555516703), whose build and deploy jobs both succeeded. Deployed source: [`1d135f18d5e8b76669392682ff429af64e4e943b`](https://github.com/tlqthai111/gatherbox/commit/1d135f18d5e8b76669392682ff429af64e4e943b). The workflow reran its dependency install, Node tests and production build successfully.

Repeated the full **46/46 grouped browser checks on the actual HTTPS site**, including all seven computed brand names, inert-template association, two-kit runtime names/IDs, empty and populated carts, quantities/removal, keyboard/mobile paths and checkout protection. Anonymous HTTPS responses for all seven HTML pages matched the local build byte-for-byte. These are the updated rendered-browser results, not a fresh AChecker report. Version details are also in `deployment-results.md`; the subsequent documentation-only commit does not change website build content.

Baseline browser-name observations, hosted HTML hashes, header comparison images and hosted test captures are retained in ignored `tmp/accessibility-review-2026-10-21/`. They are local test evidence, not published reference documents or a formal evaluation report.

The initial AChecker results above are user-reported. A fresh AChecker run is still needed against the updated published version; no claim is made that either check has disappeared. Actual speech output in VoiceOver/NVDA, full human keyboard traversal, browser text zoom, Safari/Firefox and broader device coverage remain pending. Chromium accessible-name evidence is useful but does not substitute for those checks, AChecker retesting or the W3C WAI evaluation report. No unfinished report section has been marked complete.
