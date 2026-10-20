# Implementation notes

Updated 20 October 2026 by Codex. These are actual implementation decisions and evidence for Task 7, not completed report prose or proof of customer demand. Claude's original frontend remains the visual foundation.

## Website goal and audience

The proposed B2C store helps Sydney households choose complete neutral tableware place settings by guest count. The prototype demonstrates comparing contents and total cost, selecting kits, editing a cart and receiving a simulated outcome. This convenience is a business hypothesis; no user interviews, usability study, supplier agreements or sales results have been verified.

The offer is exactly two base kits (10 / 20 guests). Every guest receives one plate, cup, fork and napkin. Kits can be combined for larger groups. Optional extras mentioned in the report draft are outside the current implementation and must be removed or labelled future scope in Task 7.

## Design and navigation

Seven ordinary HTML pages preserve the existing neutral palette, system fonts, kit illustrations, shared navigation, itemised contents, sample price labels and student-prototype notices. Relative page links work under `/gatherbox/`; Vite rewrites built asset URLs. Header/footer markup is repeated in seven files and must be kept consistent. Small markup changes add error feedback, privacy explanation, no-JavaScript protection and accurate proposed-policy wording. No CSS redesign was made.

Native controls provide quantities, radio choices, form fields, FAQ disclosure and links. Quantity labels and removal buttons name their kit. A polite status region reports cart changes and contact results; errors use linked field messages and focused summaries. Removing a line focuses a remaining quantity; removing the last focuses the empty-cart heading. The mobile menu supports Enter/Space and Escape, returning focus to its toggle. Browser keyboard checks are in `testing-results.md`; assistive technology output is not yet verified.

## Catalogue, cart and totals

`src/catalogue.js` is the authoritative catalogue and money source. Integer cents avoid rounding errors. Sample kit prices are 2900 and 4900 cents; delivery is 1200 cents once per nonempty order. `src/store.js` calculates totals from validated product IDs and current catalogue prices, never from stored or user-supplied prices. Home/shop static fallback price text is checked against the catalogue.

The localStorage schema at `gatherbox.cart.v1` is an array of `{ productId, quantity }`. Unknown IDs and noninteger, nonpositive or unsafe quantities are discarded; duplicates are merged and quantities capped at ten. Extra fields are stripped and malformed storage repaired. Interactive additions above ten are rejected instead of silently truncating; invalid quantity edits restore the last value. Ten is a prototype UI limit, not a stock claim. Cart changes update the header count; reload, cross-tab storage events and page-show refreshes synchronise views. No storage means an explicit failure message, not an apparently successful unsaved operation.

## Checkout and simulated payment

Checkout validates fictional name/email/street/suburb, postcode format and a required simulation radio choice. It accepts four numeric postcode characters without claiming to validate an actual Sydney address. Required text fields reject whitespace-only input. Invalid submission focuses the error summary; its links focus the relevant controls, which have inline messages, `aria-describedby` and `aria-invalid`. Corrected errors clear during input.

Payment branches are explicit: **declined** announces failure and retains the cart plus current form entries for retry; **approved** creates a `GB-DEMO-` reference, writes only reference and canonical kit lines to sessionStorage, clears the cart and navigates to `confirmation.html`. If either storage write fails, checkout does not claim success and keeps the cart. A corrupt/missing session summary produces the direct-visit empty state. The last valid demo confirmation survives reload/navigation in the same tab and is replaced by a later approved demo; tab/session restoration can retain it. It is not a real order receipt or verified payment record.

`gatherbox.demo-order.v1` contains `{ reference, lines }`, no customer details or payment credentials. Confirmation recalculates display totals from catalogue data. It intentionally explains why the name/address are absent. For this immutable demonstration catalogue this keeps money consistent; a real service would need server-side order price snapshots and trustworthy payment state.

Checkout/contact values remain only in the current form DOM. The implementation never serialises them to browser storage, history, query strings, logs or a remote endpoint. Forms reset on page exit; checkout resets after approval and contact resets on success. Autocomplete is turned off as a browser hint. No card data is requested. Controls begin disabled in HTML and are enabled after JS handlers are installed, preventing native fallback GET submissions when JS fails or is disabled. Browser/form behaviour outside the app's control is not a guarantee of device-level data erasure.

## Contact

Validation covers name, email, topic and nonblank message. The valid result explicitly says the message was **not sent or saved**, no one receives it and no reply will arrive. No real contact address or social profile is invented.

## Hosting and future electronic payment strategy

The production output is static HTML/CSS/JS/SVG, suitable for GitHub Pages at `/gatherbox/`. All seven entry pages are explicitly included. The local production preview and [hosted site](https://tlqthai111.github.io/gatherbox/) have been tested. GitHub Actions [run #1](https://github.com/tlqthai111/gatherbox/actions/runs/39392380257) built and deployed successfully. `.github/workflows/deploy.yml` prepares a manual build/deploy with restricted permissions, pinned official actions, Node 24, `npm ci`, `npm test`, build, Pages artifact and `github-pages` environment. Only `dist/` is uploaded. Reference files stay ignored and are not build inputs. README lists the official documentation and maintenance steps; the user authorised public repository creation, push and publication on 20 October 2026, and these are now complete.

A future operating store could use a hosted payment provider to handle payment credentials and server-verified outcomes. No provider has been selected or integrated. This prototype has no authentication, inventory reservation, fraud controls, payment webhooks, tax/accounting service, order database, email, carrier API or fulfilment workflow. These would require business decisions and secure backend work, not deployment of this browser simulation alone.

## Task 4 process alignment

The report draft proposes sourcing/purchasing, catalogue/stock maintenance, order placement, payment handling, pick/pack/dispatch, and support/returns. Only the customer-facing catalogue, cart, simulated order/payment decision and unsent enquiry are demonstrated here. Operations, carrier, actual refunds and stock exceptions are future business processes, not implemented functionality. The payment-declined branch keeps the cart and loops to retry; approval ends in a demonstration confirmation. A future order-to-dispatch BPMN should also model real stock and fulfilment exceptions and role handoffs. No BPMN diagram was created in this integration task; do not present the browser flow as a complete operational process.

## Evidence and open work

`testing-results.md` records Codex's checks separately from Claude's reported frontend checks. Use screenshots of actual production interactions for the report. Development fixtures were removed; query parameters no longer populate sample states. The user supplied Ashcan’s SID (26077610), confirmed all three identities and authorised publication on 20 October 2026. Capture final hosted evidence after deployment and carry out Task 8. No accessibility conformance claim is made.


## Publication evidence

The expanded 37-check suite passed on the actual HTTPS site, including all three confirmed Team SIDs and the extra empty-cart checks. Direct checkout with valid fictional details plus approval still cannot create an empty order. The empty cart has a working Shop kits link; nonempty blank/invalid checkout has inline and focused-summary errors. No empty-purchase option was added. Source deployment and evidence details are in `deployment-results.md`.
