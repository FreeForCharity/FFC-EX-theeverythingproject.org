# Claude Code Instructions: The Everything Project

The static Next.js export of theeverythingproject.org, migrated from WordPress in
[#15: convert WordPress capture to static routes](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/pull/15). It is served at
<https://freeforcharity.github.io/FFC-EX-theeverythingproject.org/>. The live domain still points at
the WordPress original on Hostinger. Tracking:
[#17: Wave-1 migration tracking](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/issues/17).

See **AGENTS.md** for the template reference (architecture, commands, conventions) and
`.claude/rules/` for FFC-wide rules. This file covers what is specific to this repo.

---

## Hard Rules

- **No `public/CNAME`, DNS, Cloudflare, or custom-domain change without explicit authorization.**
  Adding `public/CNAME` is the cutover trigger: it flips `basePath` and must land together with the
  DNS switch. See [#37: cutover](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/issues/37).
- **Do not recapture, reconvert, or rebuild the migration.**

## Protected Decisions

These were deliberate choices in the migration PR. Do not "fix" them:

1. The four dormant GiveWP shortcode pages and the default `Hello world!` post are dropped.
2. Forminator forms are replaced with `mailto:` links.
3. The donation page does not claim online giving works. Restoring it is tracked in
   [#35: restore online giving via PayPal](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/issues/35).
4. No EIN or 501(c)(3) status is asserted (footer Level 1).
5. No production `CNAME`.

## Comments

Follow the `code-comments` skill (`.claude/skills/code-comments/SKILL.md`). Default to none.

---

## Workflow

- **Always create a branch.** Never commit directly to `main`.
- **Commit messages** use Conventional Commits.
- **Link issues and PRs** as `[#N: description](url)` in prose, never a bare `#N`. Use
  `Fixes #N` / `Refs #N` in PR bodies.
- **Merge commits only.** The `main` ruleset rejects squash and rebase merges.
- **kebab-case** for route folder names, and **`assetPath()`** for asset references.

## Pre-Commit Checklist

```bash
pnpm run format
pnpm run lint
pnpm test
pnpm run build
pnpm run test:e2e
pnpm run check:drift
pnpm run check:site-config
```

**Set timeout to 180+ seconds** for `build`, `test:e2e`, and `install`. Never cancel them early.

## Known Gotchas

- `next build` type-checks test files. Jest and jest-axe types live in `types/*.d.ts`.
- **Link Check (soft fail)** is red on `main`: `siteConfig.url` is the bare
  `freeforcharity.github.io` origin, which 404s. Tracked in
  [#32: SEO metadata and link integrity](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/issues/32).
- DNS for this domain is on Hostinger, not Cloudflare, so Cloudflare tooling does not apply.

---

## Custom Agents

Defined in `.claude/agents/`:

| Agent         | Purpose                                                                  |
| ------------- | ------------------------------------------------------------------------ |
| `pr-reviewer` | PR review checklist, including the comment policy and cutover guardrails |
| `site-health` | Availability, TLS, headers, robots, sitemap on the deployed site         |
| `dns-audit`   | Read-only DNS audit; never modifies records                              |
| `onboarding`  | Re-customization only; this site is already onboarded                    |
