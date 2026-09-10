# FFC-EX-theeverythingproject.org

Static GitHub Pages site for **The Everything Project** (theeverythingproject.org), migrated from
a live self-hosted WordPress (Divi) site as part of the Free For Charity WordPress-to-Pages
migration (Wave 1, epic
[FFC-Cloudflare-Automation#702](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/702)).

The Everything Project implements humanitarian aid, education, farming, and infrastructure
programs for vulnerable and at-risk people on the Isle Idjwi and around Lake Kivu in the
Democratic Republic of the Congo.

## What this is

- Built on the [FFC Footer-Only Template](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template)
  scaffold (Next.js 16, static export, `pnpm`).
- Content captured from the live WordPress site (`705. Website - Capture WordPress Site`,
  REST API + rendered-HTML scrape — the site uses the Divi page builder, so the rendered scrape
  was required) and converted into real `src/app` routes: `/`, `/donation`, `/volunteer`,
  `/contact-us`, `/gallery`, `/crayon-drive-photo-album`.
- **Fully localized assets**: the logo, hero images, and all 36 project-gallery/Crayon-Drive
  photos are served from this repository (`public/images/theeverythingproject/`) — no external
  asset hosts.
- **Forms replaced**: the site's Forminator contact/volunteer forms and its GiveWP donation form
  have no backend once static. The Contact and Volunteer pages use `mailto:` links instead; the
  Donation page explains that online giving isn't available yet and links to email.
- **Dropped (dormant/placeholder content)**: the four GiveWP dynamic pages (`donor-dashboard`,
  `donation-history`, `donation-confirmation`, `donation-failed`) rendered nothing but an unfilled
  shortcode and are meaningless without a live donation backend; the `hello-world` post is
  WordPress's default, unedited sample post. Neither is present in this site.
- **FFC standard footer**, Level 1 (see below).

## Footer standard: Level 1 — no EIN or 501(c)(3) claim

The live source site's own footer and schema.org markup publish an EIN (`85-4043819`) and
describe the org as a "501c3 charity" — but that is the charity's own unverified self-report on a
legacy site, not something validated in FFC's onboarding records for this migration. Per the
migration's rule against fabricating legal/EIN status, this site's footer does **not** display an
EIN or a 501(c)(3) claim (`hasVerifiedNonprofitStatus: false` / `hasGuidestarProfile: false` in
`src/lib/site.config.ts`). If an operator confirms the number through FFC's own records, flip
those two flags and the footer will render the EIN line and the "a US 501(c)(3) Non Profit"
copyright clause automatically.

## Deployment

Deployed to the **default GitHub Pages URL**
(https://freeforcharity.github.io/FFC-EX-theeverythingproject.org/) — no custom domain, no DNS
changes. Cutover is separately gated.

- `CI - Build and Test` (`ci.yml`) — format, lint, unit tests, build, and sharded Playwright E2E
  on every PR/push.
- `Deploy to GitHub Pages` (`deploy.yml`) runs after CI succeeds on `main`.
- `Lighthouse CI` (`lighthouse.yml`) audits the deployed site under the repo subpath.
- `FFC Drift Check` (`drift-check.yml`) enforces the footer-only template's best-practice rules
  (kebab-case routes, `assetPath()` usage, security.txt/CSP sync, the shared SiteConfig contract).

## Development

```bash
pnpm install
pnpm run dev
```

Pre-commit checklist (see `CLAUDE.md`):

```bash
pnpm run format
pnpm run lint
pnpm test
pnpm run build
pnpm run test:e2e
```

---

Supported by [Free For Charity](https://freeforcharity.org).
