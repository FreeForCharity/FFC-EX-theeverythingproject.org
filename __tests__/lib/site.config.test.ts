import {
  canonicalPath,
  cardDescription,
  siteConfig,
  sitePath,
  siteUrl,
  twitterSite,
} from '../../src/lib/site.config'

const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH

afterEach(() => {
  if (originalBasePath === undefined) {
    delete process.env.NEXT_PUBLIC_BASE_PATH
  } else {
    process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath
  }
})

describe('siteConfig contract', () => {
  it('exposes the full site identity shape used by runtime consumers', () => {
    expect(siteConfig).toMatchObject({
      name: 'The Everything Project',
      tagline: 'Humanitarian Aid for Isle Idjwi',
      url: 'https://freeforcharity.github.io',
      twitterHandle: '@TheEver09371964',
      contactEmail: 'everythingprojectusa@gmail.com',
      themeColor: '#ff6900',
      vulnerabilityDisclosurePath: '/vulnerability-disclosure-policy',
    })
    expect(siteConfig.description).toContain('Idjwi')
    expect(siteConfig.shortDescription).toContain('Idjwi')
    expect(siteConfig.keywords).toEqual(
      expect.arrayContaining(['The Everything Project', 'nonprofit', 'charity', 'volunteer'])
    )
    expect(siteConfig.social.map((link) => link.label)).toEqual([
      'Facebook',
      'X (Twitter)',
      'Instagram',
    ])
    // Converged shape: these keys must match the FFC Single Page template's
    // canonical SiteConfig (guidestar.profileUrl / directProfileUrl,
    // phone.display / phone.tel, addresses[].mapUrl, supportedBy.hubUrl).
    // No validated Candid/GuideStar profile or IRS-confirmed nonprofit status
    // exists for this charity yet (see the comments on `ein`,
    // `hasVerifiedNonprofitStatus` and `hasGuidestarProfile` in
    // site.config.ts) — the FFC footer standard's Level 1 tier, so the
    // footer never renders these two fields. The contract still requires
    // non-empty strings, so both stay present but are asserted as inert.
    expect(siteConfig.hasVerifiedNonprofitStatus).toBe(false)
    expect(siteConfig.hasGuidestarProfile).toBe(false)
    expect(siteConfig.guidestar.profileUrl.length).toBeGreaterThan(0)
    expect(siteConfig.guidestar.directProfileUrl.length).toBeGreaterThan(0)
    expect(siteConfig.ein.length).toBeGreaterThan(0)
    expect(siteConfig.phone).toEqual({
      display: '(978) 254-3327',
      tel: '9782543327',
    })
    expect(siteConfig.addresses.map((address) => address.label)).toEqual(['Mailing Address'])
    for (const address of siteConfig.addresses) {
      expect(address.mapUrl).toMatch(/^https:\/\/www\.google\.com\/maps\//)
    }
    // Permanent "Supported by" footer attribution (FFC footer standard) — the
    // values are intentionally FFC's and must survive template customization.
    expect(siteConfig.supportedBy).toEqual({
      name: 'Free For Charity',
      url: 'https://freeforcharity.org',
      hubUrl: 'https://freeforcharity.org/hub/',
    })
    // Standalone charity by default: no "a project of" parent organization.
    expect(siteConfig.parentOrg).toBeUndefined()
  })

  it('builds same-origin absolute site URLs in the served (canonical) shape', () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH
    // sitePath() is basePath-only and deliberately slash-agnostic.
    expect(sitePath('/')).toBe('/')
    expect(sitePath('/privacy-policy')).toBe('/privacy-policy')
    // canonicalPath() owns the trailingSlash policy; siteUrl() applies both.
    expect(canonicalPath('/')).toBe('/')
    expect(canonicalPath('/privacy-policy')).toBe('/privacy-policy/')
    expect(siteUrl('/')).toBe('https://freeforcharity.github.io/')
    expect(siteUrl('/privacy-policy')).toBe('https://freeforcharity.github.io/privacy-policy/')
    // Files are served verbatim and must not gain a slash.
    expect(siteUrl('/sitemap.xml')).toBe('https://freeforcharity.github.io/sitemap.xml')
    expect(() => siteUrl('privacy-policy')).toThrow(TypeError)
    expect(() => siteUrl('//example.com')).toThrow(TypeError)
    expect(() => canonicalPath('//example.com')).toThrow(TypeError)
  })

  it('builds same-origin URLs that include the GitHub Pages base path', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/FFC-EX-theeverythingproject.org'

    expect(sitePath('/')).toBe('/FFC-EX-theeverythingproject.org/')
    expect(sitePath('/privacy-policy')).toBe('/FFC-EX-theeverythingproject.org/privacy-policy')
    expect(siteUrl('/')).toBe('https://freeforcharity.github.io/FFC-EX-theeverythingproject.org/')
    expect(siteUrl('/privacy-policy')).toBe(
      'https://freeforcharity.github.io/FFC-EX-theeverythingproject.org/privacy-policy/'
    )
    expect(siteUrl('/sitemap.xml')).toBe(
      'https://freeforcharity.github.io/FFC-EX-theeverythingproject.org/sitemap.xml'
    )
  })

  it('normalizes card metadata helpers', () => {
    expect(twitterSite()).toBe('@TheEver09371964')
    expect(cardDescription()).toBe(siteConfig.shortDescription)
  })
})
