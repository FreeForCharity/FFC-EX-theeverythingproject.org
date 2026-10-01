import { siteMetadata } from '../../src/lib/siteMetadata'

describe('Site metadata', () => {
  it('should have the correct metadataBase URL', () => {
    expect(siteMetadata.metadataBase?.toString()).toBe('https://freeforcharity.github.io/')
  })

  it('should have a title containing The Everything Project', () => {
    const title = siteMetadata.title as { default: string; template: string }
    expect(title.default).toContain('The Everything Project')
    expect(title.template).toContain('The Everything Project')
  })

  it('should have a description mentioning Idjwi', () => {
    expect(siteMetadata.description).toContain('Idjwi')
    expect(siteMetadata.description!.length).toBeGreaterThan(50)
  })

  it('should have relevant keywords', () => {
    const keywords = siteMetadata.keywords as string[]
    expect(keywords).toContain('nonprofit')
    expect(keywords).toContain('charity')
    expect(keywords).toContain('volunteer')
  })

  it('should define OpenGraph fields', () => {
    const og = siteMetadata.openGraph as Record<string, unknown>
    expect(og.type).toBe('website')
    expect(og.siteName).toBe('The Everything Project')
    expect(og.url).toBe('https://freeforcharity.github.io/')
    expect(og.images).toBeDefined()
  })

  it('should define Twitter card fields', () => {
    const twitter = siteMetadata.twitter as Record<string, unknown>
    expect(twitter.card).toBe('summary_large_image')
    expect(twitter.site).toContain('TheEver09371964')
  })

  it('should allow indexing and following', () => {
    const robots = siteMetadata.robots as Record<string, unknown>
    expect(robots.index).toBe(true)
    expect(robots.follow).toBe(true)
  })

  it('should define icon and manifest paths', () => {
    expect(siteMetadata.manifest).toBeDefined()
    expect(siteMetadata.icons).toBeDefined()
  })
})

describe('Page metadata', () => {
  const ROUTES = [
    ['donation', '/donation/', 'Donate'],
    ['volunteer', '/volunteer/', 'Volunteer'],
    ['contact-us', '/contact-us/', 'Contact Us'],
    ['gallery', '/gallery/', 'Gallery'],
    ['crayon-drive-photo-album', '/crayon-drive-photo-album/', 'Crayon Drive Photo Album'],
    ['privacy-policy', '/privacy-policy/', 'Privacy Policy'],
    ['cookie-policy', '/cookie-policy/', 'Cookie Policy'],
    ['terms-of-service', '/terms-of-service/', 'Terms of Service'],
    ['donation-policy', '/donation-policy/', 'Donation Policy'],
    [
      'free-for-charity-donation-policy',
      '/free-for-charity-donation-policy/',
      'Free For Charity Donation Policy',
    ],
    [
      'vulnerability-disclosure-policy',
      '/vulnerability-disclosure-policy/',
      'Vulnerability Disclosure Policy',
    ],
    ['security-acknowledgements', '/security-acknowledgements/', 'Security Acknowledgements'],
  ] as const

  it.each(ROUTES)('%s has its own Open Graph and Twitter card', async (dir, path, title) => {
    const { metadata } = await import(`../../src/app/${dir}/page`)
    const { siteConfig } = await import('../../src/lib/site.config')
    const url = `${siteConfig.url}${path}`
    const fullTitle = `${title} | The Everything Project`
    expect(metadata.alternates.canonical).toBe(url)
    expect(metadata.openGraph).toMatchObject({
      url,
      title: fullTitle,
      siteName: 'The Everything Project',
    })
    expect(metadata.openGraph.description).toBe(metadata.description)
    expect(metadata.twitter).toMatchObject({ title: fullTitle, card: 'summary_large_image' })
  })
})
