# GenAI use log: GatherBox website prototype

This log records generative AI assistance on the GatherBox website. It supports the report appendix ("Effective and responsible use of GenAI"). Entries describe what the tool did. The **human review** column is for the team to complete: it must not be filled in by the AI.

## Entry 1: Frontend design milestone

| Field | Detail |
| --- | --- |
| Date | 20 October 2026 |
| Tool | Claude Code (Anthropic), model Claude Opus 5.5, run in VS Code by Luu Quoc Thai Tran |
| Assessment tasks supported | Task 7 (website prototype). Preparation for Task 8 (accessibility evaluation) |
| Prompt summary | Thai supplied a detailed brief: build the frontend of GatherBox with Vite, vanilla JavaScript, semantic HTML and CSS. Seven pages (home, shop, cart, checkout, confirmation, help, team). Two neutral kits (10 and 20 guests) with clearly labelled sample AUD prices. Accessibility requirements. No invented suppliers, reviews, statistics, certifications or contact details. Business logic left for Codex. Write a handoff document. |
| Inputs read by the tool | Assessment 2 guideline, marking criteria, Lecture 7 (Web Strategy) slides, and the group report draft (`GroupNumber_TutorName_Assg2.docx`) in `reference/` |

### What the AI produced
- Project setup: `package.json` (Vite 8.3.4, after checking compatibility with Node 24.9 and npm 11.6), `vite.config.js` with the `/gatherbox/` base path and all seven pages as build inputs, `.gitignore`.
- Seven static HTML pages, `src/styles.css`, `src/main.js` (mobile menu toggle), a placeholder `src/app.js`, a dev-only `src/preview.js`, and `src/catalogue.js`.
- Original SVG illustrations of the kits, a table setting and a favicon.
- Choices of sample values: $29.00 (10-guest), $49.00 (20-guest), $12.00 flat Sydney delivery. **These were chosen by the AI as placeholders and are not based on any research or quotes.**
- Website copy, including the FAQ, the proposed returns approach (report missing/damaged items within 7 days; return unopened kits within 14 days) and the proposed delivery area. **These proposals were written by the AI and need team approval.** The two-business-day dispatch target was taken from the group report's IT vision (Task 3).
- `docs/frontend-handoff.md`.

### Checks the AI performed
- `npm run build` completed successfully.
- A script checked page titles, headings, IDs, labels, image `alt` attributes, ARIA references and colour contrast ratios (0 problems reported).
- Headless Chromium screenshots at 1280 px, 390 px and 320 px widths were inspected. Layout fixes made as a result: a misaligned home-page section, spacing in the cart and confirmation pages, and large inline image data in the build output.

### Limitations the AI noted
- The AI's checks are not an AChecker or W3C WAI evaluation and are not a WCAG conformance claim.
- Keyboard-only, screen-reader and real-browser zoom testing were not performed.
- Cart, checkout, confirmation and contact behaviour are **not implemented**.
- Copy and sample values reflect AI judgement and may not match the team's business decisions in Tasks 1–3.

### Human review (to be completed by the team)
| Item | Reviewer | Outcome / changes made |
| --- | --- | --- |
| Sample prices and delivery charge | | |
| Proposed returns and delivery wording | | |
| Page copy accuracy against report Tasks 1–3 | | |
| Visual design and illustrations | | |
| Team page names and SIDs | | |
| Decision on "optional extras" mentioned in report draft | | |

## Entry 2: Integration, production testing and deployment preparation

| Field | Detail |
| --- | --- |
| Date | 20 October 2026 |
| Tool | OpenAI Codex, GPT-6 family, this GatherBox integration/testing chat |
| Assessment tasks supported | Task 7 implementation/evidence preparation; Task 8 local checks; Task 4 process boundary notes |
| User prompt summary | Continue Claude's frontend; read instructions/references first; keep its design; implement cart, privacy-preserving checkout, explicit approved/declined simulation, confirmation and contact validation; prepare GitHub Pages without pushing/publishing; test actual production behaviour without design fixtures; document actual decisions, assumptions, checks and contribution. |
| Inputs read | Existing project/source/catalogue, frontend handoff and original AI log; all four local reference files (guideline, marking criteria, Lecture 7 and group DOCX); current official GitHub Pages and Vite deployment documentation. |

### What Codex produced

- Replaced the placeholder handlers in `src/app.js`; added `src/store.js` for validated product/quantity storage and catalogue-derived AUD totals.
- Implemented add/merge, quantity change, removal/empty state, cart badge, reload/cross-tab updates, and storage error feedback.
- Added accessible checkout/contact field messages, linked error summaries and focus handling; retained native quantity validation. Forms begin disabled until JS handlers are installed, preventing native fallback form submission without JS.
- Implemented explicit declined/approved payment simulation. Decline keeps cart and current entries for retry; approval writes only reference and kit lines to tab sessionStorage, clears cart, then navigates to confirmation. Direct/corrupt confirmation states are handled.
- Chose a privacy-preserving confirmation without name/address/email, superseding the old frontend handoff suggestion to store fictional customer details. No personal form data is serialised or transmitted. Contact success explicitly says not sent/saved; no delivery/reply is promised.
- Preserved existing CSS/design/illustrations, adding only required markup/hooks, error summary, no-JS notice and privacy copy. Removed the development-only fixtures and import.
- Kept the user's $29/$49/$12 sample values in the central catalogue. Added central-price hooks to home; checked static prices against catalogue. Removed the arbitrary proposed 7/14-day website deadlines at the user's direction; retained two-business-day dispatch only as an unverified proposed target, not a guarantee.
- Prepared a manual-only, pinned GitHub Actions Pages workflow for repository `gatherbox`, using official documentation. No remote creation, push, publication or Git commit was performed.
- Wrote README, implementation notes, assumptions, accessibility checklist and exact test results; updated the current frontend handoff and this log. Added five Node tests and an optional Playwright browser regression script. The report/reference files were not edited and remain ignored.

### Critical checks and refinements

- Verified cwd/Git root as `/Users/vanln/Developer/gatherbox` with its own `.git`; did not modify the home-folder repository.
- Independently ran `npm test` (**5/5 pass**) and production build (**pass**, seven entry pages); did not rely on Claude's earlier reported success.
- A price-consistency test found missing home-page catalogue hooks; these were corrected before the final successful run.
- Production browser test completed **34 grouped checks**: kits/mixed totals, quantities/removal/empty states, invalid forms, decline/retry, approval/confirmation/direct visit, storage validation/failure/cross-tab behaviour, privacy/network observations, keyboard actions, 390/320px page reflow and a real mobile checkout. No design fixtures were used.
- Browser tooling required an explicit existing Chromium executable because Playwright's default expected build was unavailable; no browser download was needed. During harness authoring, corrected the expected checkout error count and waited for asynchronous live-region updates before text assertions.
- Inspected seven actual-state screenshots; no clipping or overlap observed in those captures. See `testing-results.md` for filenames/scope and pending checks.
- Recorded that optional extras, supplier/material claims, real service area, final pricing, operational targets and policies remain unresolved or outside scope. Kept Ashcan's SID pending rather than inventing one.

### Limitations

No hosted deployment, GitHub Actions execution, real payment or business transaction occurred. No AChecker run, W3C WAI report, WCAG conformance claim, screen-reader test, full human keyboard-only pass, real-browser 200% text zoom or cross-browser/device study was completed. The log records AI work; it does not assert that the team has reviewed, approved or independently reproduced it. Entry 1's placeholder/functionality statements describe the historical Claude milestone, not the current implementation.

### Human review (team to complete)

| Item | Reviewer | Outcome / changes made |
| --- | --- | --- |
| Review implementation and actual production flows | | |
| Confirm no personal form data is saved/sent | | |
| Approve prices/policies/dispatch assumptions and align report scope | | |
| Verify names/SIDs and supply Ashcan's SID | User, 20 October 2026 | Confirmed Thai 25507474, Anthony 26486593 and Ashcan 26077610; Team page updated |
| Review accessibility checks and complete formal evaluation | | |
| Approve future repository creation, push and publication | User, 20 October 2026 | Explicitly authorised public gatherbox repository, push and Pages publication |
| Select representative prompts/outputs and critique for report appendix/presentation | | |


## Entry 3: Authorised publication milestone (completed)

20 October 2026, OpenAI Codex. The user explicitly authorised creation of a public GitHub repository named gatherbox, code push and GitHub Pages publication, excluding references/environment files. The user supplied Ashcan Zaman — 26077610 and confirmed Thai — 25507474 and Anthony — 26486593. Updated Team/current notes, retained the empty-cart guard and expanded browser regression checks. Preflight build and five Node tests passed; 37 grouped production-browser checks passed. Created [tlqthai111/gatherbox](https://github.com/tlqthai111/gatherbox) as public through authenticated GitHub Desktop, pushed the commit under the configured real author, configured Pages for GitHub Actions and manually dispatched [run #1](https://github.com/tlqthai111/gatherbox/actions/runs/39392380257). Both build and deploy succeeded. The expanded browser suite passed 37/37 checks on [the actual hosted site](https://tlqthai111.github.io/gatherbox/). This entry does not represent formal accessibility evaluation.


### Publication checks and limits

Codex independently inspected the workflow result, checked seven hosted page responses and /gatherbox/ assets/navigation, verified the main purchase simulation and empty-cart safeguards, and confirmed all supplied Team SIDs. Saved only source/docs/tests/configuration to Git; references, environment files and local screenshots remained excluded. `docs/deployment-results.md` lists evidence, URLs and remaining manual evaluation work. No home-folder repository, real purchase or external messaging was used. Formal AChecker/W3C evaluation, screen-reader testing and WCAG conformance are not claimed. The team still needs to assess these outputs and select report evidence.


## Entry 4: Requested development-lead credit

20 October 2026, OpenAI Codex. Added the user's exact credit, “Website development lead: Luu Quoc Thai Tran.”, to the Team page and README. Retained all three member names/SIDs and existing AI-assistance acknowledgements. Local production build passed; deployed source `098f79884dd2bdbaa1014e8796863906b5ec2b68` through the existing manual workflow [run #2](https://github.com/tlqthai111/gatherbox/actions/runs/39399578265), whose build/test/deploy steps passed. Verified the hosted Team credit/member list through the browser and compared its HTML byte-for-byte with the production output. Recorded the deployed commit, URL and HTML digest in `deployment-results.md` for later evaluation. The full browser suite was not rerun for this text-only change; no formal accessibility evaluation or unfinished report completion is claimed.


## Entry 5: Review of user-reported AChecker findings

21 October 2026, OpenAI Codex. Inspected all seven brand links, the inert Cart template and its renderer before editing. Verified that the old published brand links already had the computed name “GatherBox home page” and both rendered Cart quantities already had associated kit-specific names. Applied the user's requested image-alt/hidden-duplicate pattern; added a matching template for/id without replacing runtime product IDs or labels. Added Chromium accessibility-tree regression checks; five Node tests, production build and 46 local browser checks passed. Desktop/mobile header screenshot pairs were identical. `accessibility-review.md` distinguishes checker compatibility/static-template clarity from confirmed runtime defects and records limitations. AChecker was not rerun; no zero-findings, completed formal report or WCAG-conformance claim is made. Deployment evidence will be added after verification.
