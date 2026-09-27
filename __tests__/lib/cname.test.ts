import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { siteConfig } from '../../src/lib/site.config'

const cnamePath = join(__dirname, '../../public/CNAME')

describe('custom domain', () => {
  // deploy.yml builds at the root whenever public/CNAME exists, so the
  // canonical, Open Graph and sitemap URLs must move to the same domain.
  it('keeps siteConfig.url on the CNAME domain', () => {
    if (!existsSync(cnamePath)) {
      expect(siteConfig.url).toBe('https://freeforcharity.github.io')
      return
    }
    const domain = readFileSync(cnamePath, 'utf8').trim()
    expect(siteConfig.url).toBe(`https://${domain}`)
  })
})
