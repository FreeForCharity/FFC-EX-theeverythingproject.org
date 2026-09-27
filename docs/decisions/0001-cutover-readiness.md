# 0001: Cutover readiness for theeverythingproject.org

- **Status:** Proposed, 2026-09-26. Authorization is not yet recorded; the cutover remains gated on [#37: cutover](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/issues/37).
- **Decision:** Proceed to cutover once conditions C1 to C5 below are met, using Option 2, a manual record change at Hostinger. The site itself is ready. The launch mechanics are not ready yet.
- **Online giving:** Accepted as is by the maintainer on 2026-09-26, based on the completed $1.00 live donation. No payment check gates cutover. The prerequisites on [#37: cutover](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/issues/37) were reconciled with this record on the same date, so C1 to C5 are the launch gate.

## How this was decided

1. **Evidence.** Five independent reviews gathered evidence on:
   - the build and basePath switch
   - DNS
   - GitHub Pages deploy mechanics
   - URL continuity, SEO and runtime
   - governance and rollback

   Every claim had to carry the command that proves it.

2. **First adversarial round.** Two further reviews re-ran the evidence. One tried to disprove every problem. The other tried to break everything marked fine and to find missed blockers.
3. **Second adversarial round.** Two fresh reviews swapped targets. One attacked the first round's refutations and the other attacked its surviving findings.
4. **Adjudication.** Each contested item was settled by re-running the deciding query. Those queries and their output are in the appendix.

## Verdict by area

| Area                                       | Verdict                 | Deciding evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root-path build (what the apex will serve) | Ready                   | With [#23: stage custom-domain CNAME for cutover](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/pull/23) merged onto main plus [#60: close the repo-side cutover gaps](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/pull/60), the root build is clean:<br>• jest: 320 of 320 pass<br>• e2e: 73 of 73 pass, including the localized-asset guard on every route<br>• 0 `freeforcharity.github.io` references in `out/`<br>• canonical, Open Graph, sitemap and robots all on the apex |
| Assets, fonts, embeds                      | Ready                   | 0 off-site asset requests, as shown in the localization sweep on [#36: closeout](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/issues/36)                                                                                                                                                                                                                                                                                                                                                                |
| Email                                      | Unaffected by Option 2  | MX, SPF, DMARC and autodiscover point at Hostinger Mail, not at the apex A record. SPF has no `a` or `mx` mechanism                                                                                                                                                                                                                                                                                                                                                                                                          |
| Apex IPv6                                  | **Blocker**             | Hostinger's CDN synthesizes rotating AAAA records at the apex. They keep serving WordPress, and GitHub will not issue a certificate while they exist (C1)                                                                                                                                                                                                                                                                                                                                                                    |
| DNS mechanism                              | Option 2                | The zone is not in Cloudflare. Workflow 120 cannot remove this zone's A or AAAA records                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Pages custom domain                        | Not done by the merge   | The deploy uses GitHub Actions as its Pages source, so `public/CNAME` is ignored. Binding needs a repo admin, or a maintainer (C4)                                                                                                                                                                                                                                                                                                                                                                                           |
| Held CNAME PR                              | Needs a rebase          | It has one conflict, in `.linkinatorrc.json`. Its 12 test failures are fixed by [#60: close the repo-side cutover gaps](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/pull/60) (C3)                                                                                                                                                                                                                                                                                                                      |
| TTL                                        | Must lower first        | The apex A record's TTL is 14400 (4 hours). Two effects, both in C2: lowering the old record first makes the switch reach visitors in minutes rather than hours, and creating the new records at 300 keeps a rollback to about 5 minutes. At 14400, visitors who reached GitHub would stay there after a revert, hard-failing under the cached WordPress HSTS, for up to 4 hours                                                                                                                                             |
| HTTPS gap in the window                    | Expect 30 to 60 minutes | That is the technologymonastery.org precedent. WordPress sends HSTS, so affected visitors cannot click through. Roll back if the certificate has not issued within 60 minutes (see Certificate recovery)                                                                                                                                                                                                                                                                                                                     |
| Legacy WordPress URLs                      | Handled                 | [#60: close the repo-side cutover gaps](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/pull/60) redirects the 15 legacy URLs that have a matching page. The rest land on the branded 404                                                                                                                                                                                                                                                                                                                  |
| Security headers                           | Accepted risk           | GitHub Pages sends none, the same as every fleet site ([FFC-Cloudflare-Automation#894: fleet security headers](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/894)). The meta CSP stays in effect                                                                                                                                                                                                                                                                                                        |
| Workflow 121                               | Not a valid gate        | Once the domain is bound it follows the redirect to the apex, and its marker text matches WordPress too. Verify with a `/_next/` asset and a crawl instead                                                                                                                                                                                                                                                                                                                                                                   |

## Conditions before the window

- **C1. Disable the Hostinger CDN for the domain at least 24 hours ahead.** Hostinger's documentation says "To enable managing of AAAA records for the root domain (@), Hostinger CDN must be fully disabled" ([Hostinger: manage AAAA records](https://www.hostinger.com/support/8899705-how-to-manage-aaaa-records-at-hostinger/)). The same applies to changing the `www` CNAME. Afterwards, `dig +short @ns1.dns-parking.com theeverythingproject.org AAAA` and the same query against `ns2.dns-parking.com` must both return nothing, repeated several times. Today each returns 2 rotating records.
- **C2. Set the TTL to 300 on the apex A record at least 4 hours ahead.** Resolvers may hold the current 14400 TTL for up to 4 hours, so the lower value only takes effect after that wait. Create the new GitHub records at 300 as well: their TTL, not the old one's, decides how fast a rollback reaches visitors.
- **C3. Rebase [#23: stage custom-domain CNAME for cutover](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/pull/23) onto main.** It must include [#60: close the repo-side cutover gaps](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/pull/60), now merged. Resolve the conflict by keeping main's two skips and adding `^https://theeverythingproject\.org/.*`. CI must be green. It is Clarke's PR, so this needs him or his go-ahead.
- **C4. A way to bind the custom domain during the window.** Binding needs Pages admin access. GitHub's REST reference for `PUT /repos/{owner}/{repo}/pages` accepts a repository admin, a maintainer, or anyone with the "manage GitHub Pages settings" permission. The Pages settings guide says admin only, so confirm the access works before the window rather than during it. Today `clarkemoyer` is the only admin and `phoganuci` has write. Any one of these works:
  - Clarke is available live.
  - Clarke grants `maintain`, or a custom role with "manage GitHub Pages settings", beforehand. Confirm it with a no-op write that changes nothing: `gh api -X PUT repos/FreeForCharity/FFC-EX-theeverythingproject.org/pages -F https_enforced=true` (already true). A 403 means the role is not enough.
  - Clarke approves a workflow 120 dispatch with `skip_cname=true`. Its DNS step skips zones outside Cloudflare, and its smoke job still binds the domain.
- **C5. Record authorization and the chosen mechanism (Option 2) on [#37: cutover](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/issues/37).**
- **C6 (recommended).** Take a WordPress backup (database and uploads) before the flip, and check whether WPMU DEV Hub already holds one. After the flip, WordPress is only reachable with a hosts override to `153.92.213.212`. **Never use hPanel's "Use temporary domain"**: it deletes the domain's email accounts and subdomains.

## Window runbook

Schedule the window off-peak, and not across 05:17 UTC when the daily smoke test runs.

1. Mark [#23: stage custom-domain CNAME for cutover](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/pull/23) ready and merge it. Wait for "Deploy to GitHub Pages" to succeed. The github.io URL is degraded from this point, but the apex is still WordPress.
2. At Hostinger, record the current values for rollback, then:
   - delete apex A `153.92.213.212`
   - add apex A `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, TTL 300
   - confirm no apex AAAA remains
   - set `www` to CNAME `freeforcharity.github.io.`, TTL 300
   - leave MX, TXT, `_dmarc`, `autodiscover`, `autoconfig` and `ftp` untouched
3. Check both nameservers. `www` must resolve to GitHub before step 4, because the certificate only covers `www` when it does:

   ```bash
   for ns in ns1 ns2; do
     dig +short @$ns.dns-parking.com theeverythingproject.org A            # only the four 185.199.x.153
     dig +short @$ns.dns-parking.com theeverythingproject.org AAAA         # nothing
     dig +short @$ns.dns-parking.com www.theeverythingproject.org CNAME    # freeforcharity.github.io.
   done
   ```

4. Bind the domain with `gh api -X PUT repos/FreeForCharity/FFC-EX-theeverythingproject.org/pages -f cname=theeverythingproject.org`, and note the time. The recovery clock below starts here.
5. Poll `gh api repos/FreeForCharity/FFC-EX-theeverythingproject.org/pages -q .https_certificate.state` every few minutes until it reads `approved`. States such as `new` and `authorization_created` mean issuance is progressing. The failure states are `errored`, `bad_authz` and `authorization_revoked`. Follow [Certificate recovery](#certificate-recovery) as soon as one appears, or if the state is still `none` 15 minutes after the bind.
6. When the state is `approved`, check that `gh api repos/FreeForCharity/FFC-EX-theeverythingproject.org/pages -q .https_certificate.domains` lists both `theeverythingproject.org` and `www.theeverythingproject.org`. If `www` is missing, follow [Certificate recovery](#certificate-recovery). Otherwise enforce HTTPS with `gh api -X PUT repos/FreeForCharity/FFC-EX-theeverythingproject.org/pages -F https_enforced=true` and check:
   - `https://theeverythingproject.org/` returns 200
   - a `/_next/static/` asset from the home page returns 200
   - `http://` redirects to `https://`
   - `https://www.theeverythingproject.org/` redirects to the apex
   - the github.io URL redirects to the apex with the path preserved
7. Dispatch the post-deploy smoke test, then crawl all 18 routes at the apex for failed requests and CSP violations.

### Certificate recovery

**Why a re-bind helps.** GitHub starts certificate issuance when the domain is bound, and only for names that pass its DNS check at that moment. Its public checker refuses a certificate while any non-GitHub IP is present (see the appendix). If issuance began before DNS was clean, it can stall in `none` or leave `www` out of the certificate. Setting the custom domain to null and binding it again starts a fresh request. That is the fix used in the technologymonastery.org cutover ([FFC-Cloudflare-Automation#774: 120 dns-flip delete any non-Pages apex A](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/774)), where the certificate issued about 2 minutes after a re-bind on clean DNS.

**Why re-binds are capped at two.** Each attempt on bad DNS can fail validation for the apex and for `www`. Let's Encrypt allows 5 failed validations per name per hour, so repeated re-binds can lock the domain out for up to an hour. Two re-binds leave headroom.

**Steps:**

1. Re-run the step 3 `dig` loop, and also query the public resolvers:

   ```bash
   for r in 1.1.1.1 8.8.8.8; do
     dig +short @$r theeverythingproject.org A            # only the four 185.199.x.153
     dig +short @$r theeverythingproject.org AAAA         # nothing
     dig +short @$r www.theeverythingproject.org CNAME    # freeforcharity.github.io.
   done
   ```

   Re-bind only when every answer shows the GitHub records and no AAAA remains. A stale answer means waiting, not re-binding.

2. Re-bind with `gh api -X PUT repos/FreeForCharity/FFC-EX-theeverythingproject.org/pages -F cname=null`, then repeat step 4 straight away. Between the two calls the domain is unbound, so the apex shows GitHub's "Site not found" page for those few seconds. Wait at least 15 minutes before judging the result.
3. **Abort threshold.** Roll back if either of these happens:
   - the apex certificate is not `approved` 60 minutes after the first bind. The only fleet precedent took about 55 minutes.
   - two re-binds have not produced an `approved` apex certificate.

   Until the apex certificate issues, every HTTPS visitor gets a certificate error. Visitors with WordPress's cached HSTS cannot click past it, so waiting longer than this is not acceptable.

4. **If only `www` is missing** once the apex is `approved`, keep the apex live. `www` visitors get a certificate error, because WordPress's cached HSTS covers subdomains, so fix it the same evening: confirm `www` resolves to GitHub everywhere, then use a re-bind. Afterwards, `.https_certificate.domains` must list `www`. If it still does not, record `www` as open on [#37: cutover](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/issues/37). This is a known fleet failure mode: the comment in `post-deploy-smoke.yml` that Pages certifies "only the host named in public/CNAME" describes a `www` that did not resolve to Pages at issuance. It is not a GitHub limit. GitHub documents that with an apex binding, "`www.example.com` will redirect to `example.com`" once both names have Pages DNS records ("About custom domains and GitHub Pages"). catnipandcattitude.org works this way: its certificate lists both names and its `www` returns a 301 to the apex.

## Rollback

The first rollback step is a DNS-only revert at Hostinger:

- apex A back to `153.92.213.212`
- `www` back to `www.theeverythingproject.org.cdn.hstgr.net`

With the TTL at 300 (C2), most visitors are back on WordPress within about 5 minutes. Leave the Pages binding and the build as they are:

- github.io then redirects to the apex, which is WordPress again.
- Keeping the binding also stops anyone else claiming the domain on Pages.

Do not revert the CNAME file on its own: while the domain is still bound, that would serve the subpath build at the apex root.

After a rollback:

- The daily post-deploy smoke test runs in apex mode, fails against WordPress, and keeps a `priority: high` issue open until the next attempt succeeds. Expect that, rather than treating it as a new incident.
- Record what failed on [#37: cutover](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/issues/37) before scheduling the next window.

Hostinger hosting must stay active until the new site has been stable for an agreed period.

## Deferred until after launch

- [#55: donation provider](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/issues/55), the fleet prompt to move from PayPal to a preferred provider.
- The React error 418 hydration warning on `/donation/`. It already happens on github.io and has no visible effect.
- Search Console for the new origin.
- Updating references to the github.io URL:
  - `README.md`
  - `CLAUDE.md`
  - `.claude/agents/site-health.md`
  - the fleet sheet
  - [#702: Wave-1 migration epic](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/702)
- `security.txt` lines that keep the `/FFC-EX-theeverythingproject.org/` prefix. `check-drift` and `security-artifacts.test.ts` enforce that prefix, and main already has the same issue on github.io.
- WordPress decommissioning. That needs the backup from C6 first. It also needs confirmation that the Hostinger DNS zone and Hostinger Mail survive cancelling the hosting plan, because both live in that account.
- Telling the charity about the change, and about the forms that became `mailto:` links.

## Appendix: verified queries

Captured on 2026-09-26 between 23:20 and 23:30 UTC, with main at `28866f8`.

**Apex records at the authoritative nameserver.** The AAAA answer rotates on every query:

```text
$ dig +noall +answer @ns1.dns-parking.com theeverythingproject.org A
theeverythingproject.org. 14400 IN A 153.92.213.212
$ dig +noall +answer @ns1.dns-parking.com theeverythingproject.org AAAA   # three runs
theeverythingproject.org. 60 IN AAAA 2a02:4780:1e:e1f6:5737:1adb:5dc9:70b3
theeverythingproject.org. 60 IN AAAA 2a02:4780:22:b14d:d31f:38df:5e42:ea15
theeverythingproject.org. 60 IN AAAA 2a02:4780:1d:7e7e:c2bf:e621:fff5:e1b6
theeverythingproject.org. 60 IN AAAA 2a02:4780:22:445e:2c65:164f:f0e9:efc5
theeverythingproject.org. 60 IN AAAA 2a02:4780:1e:d1d9:eae5:e7e0:5d2f:7dba
theeverythingproject.org. 60 IN AAAA 2a02:4780:22:5a80:34cd:77f7:6fb8:5673
$ whois 2a02:4780:1e:e1f6:5737:1adb:5dc9:70b3 | grep -i netname
netname:        HOSTINGER-CDN
$ dig +noall +answer @ns1.dns-parking.com www.theeverythingproject.org
www.theeverythingproject.org. 300 IN CNAME www.theeverythingproject.org.cdn.hstgr.net.
$ dig +short NS theeverythingproject.org
ns1.dns-parking.com.
ns2.dns-parking.com.
```

**Mail records.** None of them depend on the apex A record:

```text
$ dig +noall +answer @ns1.dns-parking.com theeverythingproject.org MX
theeverythingproject.org. 14400 IN MX 5 mx1.hostinger.com.
theeverythingproject.org. 14400 IN MX 10 mx2.hostinger.com.
$ dig +noall +answer @ns1.dns-parking.com theeverythingproject.org TXT
theeverythingproject.org. 3600 IN TXT "v=spf1 include:_spf.mail.hostinger.com ~all"
theeverythingproject.org. 3600 IN TXT "MS=ms77557213"
$ dig +noall +answer @ns1.dns-parking.com _dmarc.theeverythingproject.org TXT
_dmarc.theeverythingproject.org. 300 IN TXT "v=DMARC1; p=none"
$ dig +short theeverythingproject.org CAA | wc -l
0
```

**GitHub refuses a certificate while any non-GitHub IP is present.** This is from `github/pages-health-check`, `lib/github-pages-health-check/domain.rb`:

```ruby
def https_eligible?
  # Can't have any IP's which aren't GitHub's present.
  return false if non_github_pages_ip_present?
```

**HSTS is already cached in visitors' browsers:**

```text
$ curl -sI https://theeverythingproject.org/ | grep -i strict-transport
strict-transport-security: max-age=15811200 ; includeSubDomains ; preload
```

**Pages configuration and who can bind the domain.** GitHub's documentation, "Managing a custom domain for your GitHub Pages site", says: "If you are publishing from a custom GitHub Actions workflow ... any existing `CNAME` file is ignored and is not required."

```text
$ gh api repos/FreeForCharity/FFC-EX-theeverythingproject.org/pages -q '{cname,build_type,https_enforced,protected_domain_state}'
{"build_type":"workflow","cname":null,"https_enforced":true,"protected_domain_state":null}   # gh prints keys sorted
$ gh api "repos/FreeForCharity/FFC-EX-theeverythingproject.org/collaborators?affiliation=all" -q '.[]|"\(.login) \(.role_name)"'
phoganuci write
clarkemoyer admin
```

**The build switches to a root basePath when `public/CNAME` exists.** The file is not on main yet:

```text
$ gh api repos/FreeForCharity/FFC-EX-theeverythingproject.org/contents/.github/workflows/deploy.yml -q .content | base64 -d | grep -n 'public/CNAME" ]'
85:          if [ -s "public/CNAME" ]; then
$ gh api repos/FreeForCharity/FFC-EX-theeverythingproject.org/contents/public/CNAME
gh: Not Found (HTTP 404)
```

**Held PR [#23: stage custom-domain CNAME for cutover](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/pull/23):**

```text
$ gh pr view 23 --json isDraft,mergeable,mergeStateStatus,headRefOid \
    -q '"\(.isDraft) \(.mergeable) \(.mergeStateStatus) \(.headRefOid[0:7])"'
true CONFLICTING DIRTY 43e19c3
$ git merge-tree --write-tree --name-only origin/main origin/claude/intelligent-bardeen-pujyem | grep CONFLICT
CONFLICT (content): Merge conflict in .linkinatorrc.json
```

**[#23: stage custom-domain CNAME for cutover](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/pull/23) merged onto main plus [#60: close the repo-side cutover gaps](https://github.com/FreeForCharity/FFC-EX-theeverythingproject.org/pull/60), built at the root:**

```text
$ pnpm exec jest
Test Suites: 36 passed, 36 total
Tests:       320 passed, 320 total
$ NEXT_PUBLIC_BASE_PATH= pnpm exec next build && find out -type f | wc -l
424
$ grep -rlF freeforcharity.github.io out | wc -l
0
$ grep -rlF FFC-EX-theeverythingproject out --exclude=security.txt | wc -l
0
$ grep -rlF FFC-EX-theeverythingproject out --include=security.txt
out/security.txt
out/.well-known/security.txt      # known, see Deferred
$ pnpm exec playwright test   # baseURL on a root static server of out/
73 passed
```

**Every legacy redirect points at a page the build produces.** Run from a checkout after `pnpm run build`:

```text
$ cd out && for f in index.php/*/index.html bwg_album/*/index.html bwg_gallery/*/index.html \
    donation-confirmation/index.html donation-failed/index.html; do
    t=$(grep -o 'url=[^"]*' "$f" | cut -d= -f2); d=$(dirname "$f")
    [ -f "$(cd "$d/$t" 2>/dev/null && pwd)/index.html" ] && echo "OK  /$d/ -> $t" || echo "BAD /$d/ -> $t"
  done
OK  /index.php/contact-us/ -> ../../contact-us/
OK  /index.php/donation/ -> ../../donation/
OK  /index.php/gallery/ -> ../../gallery/
OK  /index.php/volunteer/ -> ../../volunteer/
OK  /bwg_album/idjwi/ -> ../../gallery/idjwi/
OK  /bwg_gallery/back-to-skool-22/ -> ../../gallery/
OK  /bwg_gallery/crayon-drive/ -> ../../crayon-drive-photo-album/
OK  /bwg_gallery/don-bosco/ -> ../../gallery/don-bosco/
OK  /bwg_gallery/idjwi/ -> ../../gallery/idjwi/
OK  /bwg_gallery/jva/ -> ../../gallery/jva/
OK  /bwg_gallery/minova-unrecognized-refugee-camp/ -> ../../gallery/minova/
OK  /bwg_gallery/mweso/ -> ../../gallery/mweso/
OK  /bwg_gallery/our-project-gallery-home/ -> ../../gallery/
OK  /donation-confirmation/ -> ../donation/
OK  /donation-failed/ -> ../donation/
```

The targets are relative, so they resolve the same way at the github.io subpath and at the apex. During review, each redirect was also followed in Chromium at both, and all 30 landed on the mapped page.

**The github.io build is correct today.** The canonical keeps the subpath:

```text
$ curl -s https://freeforcharity.github.io/FFC-EX-theeverythingproject.org/donation/ | grep -o '<link rel="canonical"[^>]*>'
<link rel="canonical" href="https://freeforcharity.github.io/FFC-EX-theeverythingproject.org/donation/"/>
```

**The only fleet precedent took about an hour from DNS flip to certificate.** This was technologymonastery.org, on a Cloudflare zone:

```text
$ gh run view 29715502116 -R FreeForCharity/FFC-Cloudflare-Automation --json createdAt,updatedAt \
    -q '"\(.createdAt) -> \(.updatedAt)"'
2026-07-20T03:49:58Z -> 2026-07-20T03:55:06Z   (DNS flip)
$ gh run view 29717731475 -R FreeForCharity/FFC-EX-technologymonastery.org --log | grep -v echo | grep 'Attempt 1'
smoke  UNKNOWN STEP  2026-07-20T04:48:40.4482216Z Attempt 1: HTTP 200 (cert provisioned, site reachable)
```

That run needed one manual fix along the way: a stale A record had to be removed and the domain re-bound ([FFC-Cloudflare-Automation#774: 120 dns-flip delete any non-Pages apex A](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/774)).
