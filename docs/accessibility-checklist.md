# Accessibility checklist

**21 October 2026 follow-up:** user-reported AChecker Checks 7 and 188 were reviewed against source and Chromium accessible names. Updated the brand/template patterns and passed 46 local production-browser checks. See [accessibility-review.md](accessibility-review.md) for the before/after evidence, classification, deployment result and pending checker retest. This is not a fresh AChecker result.

**Local and hosted integration checks: 20 October 2026, Codex.** Tested the production preview and [published site](https://tlqthai111.github.io/gatherbox/) using Playwright and installed headless Chromium, with real cart/form interactions and no preview fixtures. The expanded hosted suite passed 37 grouped checks; see `deployment-results.md`. These checks are not an AChecker or W3C WAI report and establish no WCAG conformance level.

## Actual Codex results

| Check | Result and limit |
| --- | --- |
| All seven pages | Passed local loading; one h1 per page, en-AU language, unique IDs, form labels, valid ARIA ID references and present image alt attributes checked by script. Alt quality is not established just by presence. |
| Image/asset loading and navigation | Passed all seven pages; local links returned 200, image resources loaded and same-origin links/assets stayed beneath `/gatherbox/`. No HTTP failures or JS errors observed in the main browser test context. |
| Add to cart | Both kit sizes and mixed cart passed. Added/limit messages use a polite status region; a keyboard Enter submission was tested. |
| Quantity controls | Valid change updates totals; zero restores previous saved quantity with feedback. Controls retain their DOM node during quantity edits. Whole-number and maximum validation also tested at store level. |
| Removal focus | Browser-driven keyboard removal focuses the remaining kit quantity. Last-line removal focuses the empty-cart heading. Both states verified. |
| Invalid checkout | Six required errors appear as text, not colour alone; summary receives focus and error link moves focus to the relevant control. Field associations and invalid attributes present in source. Invalid email and postcode rejected; corrected messages clear. |
| Payment choices and retry | Native radio choices, no preselected outcome. Decline keeps cart/entries; keyboard Space selects approval and Enter submits the retry, reaching confirmation. |
| Empty checkout/direct confirmation | Blocked checkout reports an empty cart; missing or corrupt confirmation shows an honest empty state. |
| Contact | Four required errors and summary focus verified; malformed email and whitespace-only message rejected. Valid result says not sent/saved and form clears. |
| Mobile menu and skip link | At 390px, keyboard Enter opens menu, Tab reaches Home, Escape closes and returns focus to toggle. Skip link activation focuses main. |
| Responsive reflow | All seven pages checked at 390px and 320px; no horizontal document overflow detected. This is viewport testing, not browser text zoom. |
| Visual inspection | Inspected desktop cart/confirmation, 390px checkout, 390px validation summary and confirmation, 320px cart/shop screenshots. No clipping or overlapping content observed in those captures. Screenshots exist for the other pages but were not all individually inspected. |
| JS unavailable | Checkout/contact controls remain disabled; no fallback form submission. Static navigation/content remains available. |
| Storage unavailable | Cart-save and confirmation-save errors are explicit; blocked confirmation storage retains cart. |
| Status/alert semantics | Cart/contact use role=status; storage/decline use role=alert. DOM/result text verified. Actual speech timing, wording and repetition have **not** been tested with assistive technology. |

The automated keyboard actions cover selected paths. They are not a complete human keyboard-only pass across every control, tab sequence, state and viewport. See `testing-results.md` for the original 34 local checks and five Node tests; `deployment-results.md` records the expanded 37-check hosted suite.

## Claude's earlier reported checks (not rerun claims)

`ai-use-log.md` Entry 1 records Claude's reported frontend build, heading/label/ARIA checks, contrast calculations and screenshots at 1280/390/320px. Codex independently rebuilt and checked the semantics, links and responsive states listed above. Codex did **not** independently repeat Claude's full contrast calculation or heading-level audit. Do not present those earlier figures as fresh Codex measurements.

## Pending manual and formal work

- [ ] Human keyboard-only pass across every page and interactive state, including Shift+Tab, number-input arrows, all radio choices, menu at responsive breakpoints, FAQ disclosure, contact result and focus visibility/obscuring.
- [ ] Screen-reader test (for example VoiceOver with Safari): landmarks, kit names, quantity controls, error summary/links, grouped radio error, repeated status announcements, decline and retry.
- [ ] Real-browser 200% text zoom and magnification; check clipping, reading order and all controls. Narrow viewports do not substitute for this.
- [ ] Independent contrast assessment for normal/hover/focus/error/disabled states; colour independence, alt-text quality, reading order and target sizes.
- [ ] Safari/Firefox and real mobile device testing; browser Back/Forward and restored-session behaviour. The Chromium runner disables back/forward cache by default, so its tests do not establish cache restoration behaviour.
- [ ] User review of wording, cognitive load, fictional-data instructions and visual clarity.
- [ ] Rerun AChecker against the updated published version. The user supplied initial Checks 7/188; record the actual new page URLs, date, settings and known/likely/potential findings, then verify findings manually. No fresh AChecker result has been obtained by Codex.
- [ ] Then complete the W3C WAI Website Accessibility Evaluation Report for the same final published version: evaluator, evaluation scope, chosen target, representative sample, findings, evidence and unresolved issues. No report has been generated here.
- [ ] Attach the actual report/evidence to Task 8 and match Task 7 screenshots/URL to that version. Re-evaluate after material changes.

Formal evaluation resources specified in the supplied assessment: [AChecker](https://achecks.org/checker/) and [W3C WAI report tool](https://www.w3.org/WAI/eval/report-tool/). No automated tool result alone establishes conformance.


## Hosted evaluation sample ready

All seven published page URLs are listed in `deployment-results.md`. Hosted keyboard/DOM/reflow checks passed, including empty checkout refusing an order even with valid inputs, and linked errors when a cart contains a kit. No AChecker/W3C report or assistive-technology result is implied. Formal Task 8 checks remain pending against the published version.
