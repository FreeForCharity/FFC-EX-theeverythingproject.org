import { test, expect } from '@playwright/test'
import { routes } from '../src/app/sitemap'

/**
 * Every image, font, stylesheet and media file must be served by the site
 * itself. Only analytics beacons and the PayPal SDK may load from elsewhere.
 */
const THIRD_PARTY_HOSTS =
  /(^|\.)(googletagmanager\.com|google-analytics\.com|doubleclick\.net|clarity\.ms|bing\.com|facebook\.net|facebook\.com|paypal\.com|paypalobjects\.com)$/

const ASSET_TYPES = new Set(['image', 'font', 'stylesheet', 'media', 'script'])

for (const { path } of routes) {
  test(`serves every asset on ${path} from the site`, async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin
    const offsite: string[] = []
    page.on('request', (request) => {
      if (request.frame() !== page.mainFrame() || !ASSET_TYPES.has(request.resourceType())) return
      const url = new URL(request.url())
      if (url.protocol === 'data:' || url.protocol === 'blob:' || url.origin === origin) return
      if (!THIRD_PARTY_HOSTS.test(url.hostname))
        offsite.push(`${request.resourceType()} ${url.href}`)
    })

    await page.goto(`.${path === '/' ? '/' : path}`)
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    })
    await page.waitForLoadState('networkidle')

    expect(offsite).toEqual([])
    const html = await page.content()
    expect(html).not.toMatch(/wp-content\/(uploads|themes|plugins)/)
    expect(html).not.toMatch(/fonts\.(googleapis|gstatic)\.com/)
  })
}
