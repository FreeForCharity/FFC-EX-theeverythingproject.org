import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { siteConfig } from '../src/lib/site.config'

const GITHUB_PAGES_PROJECT_PATH = '/FFC-EX-theeverythingproject.org'

const root = process.cwd()

function readFixture(path: string): string {
  return readFileSync(join(root, path), 'utf8')
}

function payload(body: string): string {
  return body
    .split('\n')
    .filter((line) => !line.startsWith('#') && line.trim() !== '')
    .join('\n')
    .trim()
}

describe('deployable security artifacts', () => {
  // Names what this asserts and what it does NOT. public/_headers is inert on
  // FFC deploys (FFC-Cloudflare-Automation#884) — no host in FFC's stack reads
  // it — so this locks the forward-compatible copy's content for a possible
  // future Cloudflare Pages deploy. It is not evidence that any of these
  // headers reach a browser today; that is measured on the wire by
  // FFC-Cloudflare-Automation#894, not by a file check.
  it('keeps the forward-compatible _headers copy intact with a footer-only CSP', () => {
    expect(existsSync(join(root, 'public/_headers'))).toBe(true)

    const headers = readFixture('public/_headers')
    expect(headers).toContain('X-Frame-Options: SAMEORIGIN')
    expect(headers).toContain('X-Content-Type-Options: nosniff')
    expect(headers).toContain('Referrer-Policy: strict-origin-when-cross-origin')
    expect(headers).toContain('Strict-Transport-Security: max-age=63072000; includeSubDomains')
    expect(headers).toContain("Content-Security-Policy: default-src 'self'")
    expect(headers).toContain('https://www.googletagmanager.com')
    expect(headers).toContain('https://www.google-analytics.com')
    expect(headers).toContain('https://connect.facebook.net')
    expect(headers).toContain('https://www.clarity.ms')
    expect(headers).not.toContain('widgets.sociablekit.com')
    expect(headers).not.toContain('www.youtube.com')
  })

  it('publishes matching RFC 9116 security.txt payloads at root and well-known paths', () => {
    expect(existsSync(join(root, 'public/.well-known/security.txt'))).toBe(true)
    expect(existsSync(join(root, 'public/security.txt'))).toBe(true)

    const wellKnown = readFixture('public/.well-known/security.txt')
    const rootCopy = readFixture('public/security.txt')
    const wellKnownPayload = payload(wellKnown)

    expect(payload(rootCopy)).toBe(wellKnownPayload)
    // No Contact line until the charity's email is known (never another
    // organization's address).
    if (siteConfig.contactEmail) {
      expect(wellKnownPayload).toContain(`Contact: mailto:${siteConfig.contactEmail}`)
    } else {
      expect(wellKnownPayload).not.toMatch(/^Contact:/m)
    }
    expect(wellKnownPayload).toContain('Preferred-Languages: en')
    // No public/CNAME: the site is served only under the GitHub Pages project
    // path, so every URL carries it.
    const base = `${siteConfig.url}${GITHUB_PAGES_PROJECT_PATH}`
    expect(wellKnownPayload).toContain(`Canonical: ${base}/.well-known/security.txt`)
    expect(wellKnownPayload).toContain(`Canonical: ${base}/security.txt`)
    expect(wellKnownPayload).toContain(`Policy: ${base}${siteConfig.vulnerabilityDisclosurePath}`)
    expect(wellKnownPayload).toContain(`Acknowledgments: ${base}/security-acknowledgements`)

    const expires = wellKnownPayload.match(/^Expires:\s*(.+)$/m)?.[1]
    expect(expires).toBeDefined()
    expect(new Date(expires as string).getTime()).toBeGreaterThan(Date.now())
  })

  it('defines a least-privilege expiry workflow for security.txt maintenance', () => {
    const workflow = readFixture('.github/workflows/security-txt-expiry.yml')

    expect(workflow).toContain('workflow_dispatch:')
    expect(workflow).toContain("cron: '0 12 * * 1'")
    expect(workflow).toContain('contents: read')
    expect(workflow).toContain('issues: write')
    expect(workflow).toContain('ffc-security-txt:missing')
    expect(workflow).toContain('ffc-security-txt:no-expires')
    expect(workflow).toContain('ffc-security-txt:invalid-expires')
    expect(workflow).toContain('ffc-security-txt:expiring-soon')
    expect(workflow).toContain('github.rest.issues.listForRepo')
    expect(workflow).toContain('github.rest.issues.create')
    expect(workflow).not.toContain('secrets.')
  })
})
