import {
  PENDING_TEXT,
  canonicalPath,
  cardDescription,
  isPending,
  type PendingField,
  siteConfig,
  sitePath,
  siteUrl,
  twitterSite,
} from '../../src/lib/site.config'
import { team } from '../../src/data/team'

const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH

// IRS EIN format (two digits, hyphen, seven digits), or empty while the EIN is
// pending (see the pending contract below).
const einPattern = (): RegExp => (isPending('ein') ? /^$/ : /^\d{2}-\d{7}$/)

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
    // The EIN is published on the charity's own site and ProPublica confirms
    // it as a 501(c)(3). No Candid/GuideStar profile has been provided, so
    // both GuideStar URLs stay empty and 'guidestar' is pending.
    expect(siteConfig.ein).toBe('85-4043819')
    expect(siteConfig.taxStatusLabel).toBe('a US 501c3 Non Profit')
    expect(siteConfig.guidestar).toEqual({ profileUrl: '', directProfileUrl: '' })
    expect(siteConfig.pending).toEqual(['guidestar', 'team'])
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

describe('siteConfig.pending contract', () => {
  // Every PendingField, mapped to "its value is empty". A pending field must
  // carry no value, so no placeholder or borrowed (template/FFC) value can
  // ship behind the "awaiting information" notice. The Record type makes this
  // map fail to compile if PendingField grows a member it does not cover.
  const isEmpty: Record<PendingField, () => boolean> = {
    email: () => siteConfig.contactEmail.trim() === '',
    phone: () => siteConfig.phone.display.trim() === '' && siteConfig.phone.tel.trim() === '',
    address: () => siteConfig.addresses.length === 0,
    ein: () => siteConfig.ein.trim() === '',
    guidestar: () =>
      siteConfig.guidestar.profileUrl.trim() === '' &&
      siteConfig.guidestar.directProfileUrl.trim() === '',
    social: () => siteConfig.social.every((s) => s.href.trim() === ''),
    team: () => team.length === 0,
    donationUrl: () => siteConfig.donationUrl.trim() === '',
    volunteerUrl: () => siteConfig.volunteerUrl.trim() === '',
  }
  const knownFields = Object.keys(isEmpty)

  /** Pending fields that are unknown, duplicated, or still carry a value. */
  function pendingViolations(): string[] {
    const pending = siteConfig.pending ?? []
    const problems: string[] = []
    pending.forEach((field, index) => {
      if (!knownFields.includes(field)) problems.push(`${field}: unknown field`)
      else if (pending.indexOf(field) !== index) problems.push(`${field}: listed twice`)
      else if (!isEmpty[field]()) problems.push(`${field}: pending but has a value`)
    })
    return problems
  }

  // This site's own config: whatever it lists must satisfy the contract.
  it('holds for the shipped config', () => {
    expect(pendingViolations()).toEqual([])
    for (const field of siteConfig.pending ?? []) expect(isPending(field)).toBe(true)
  })

  it('has a fixed, non-empty placeholder text', () => {
    expect(PENDING_TEXT).toBe('Awaiting information from the charity')
  })

  // The template itself lists nothing pending, so the fork-style states are
  // exercised by varying the config here (as the footer's phone tests do)
  // rather than depending on whichever state this site happens to ship in.
  describe('with a fork-style pending list', () => {
    const original = {
      contactEmail: siteConfig.contactEmail,
      phone: siteConfig.phone,
      addresses: siteConfig.addresses,
      ein: siteConfig.ein,
      guidestar: siteConfig.guidestar,
      social: siteConfig.social,
      donationUrl: siteConfig.donationUrl,
      volunteerUrl: siteConfig.volunteerUrl,
      pending: siteConfig.pending,
    }
    afterEach(() => {
      Object.assign(siteConfig, original)
    })

    it('isPending reflects exactly the listed fields', () => {
      siteConfig.pending = undefined
      for (const field of knownFields) expect(isPending(field as PendingField)).toBe(false)

      siteConfig.pending = ['phone', 'guidestar']
      expect(isPending('phone')).toBe(true)
      expect(isPending('guidestar')).toBe(true)
      expect(isPending('email')).toBe(false)
    })

    it('accepts every footer field pending with an empty value', () => {
      siteConfig.contactEmail = ''
      siteConfig.phone = { display: '', tel: '' }
      siteConfig.addresses = []
      siteConfig.ein = ''
      siteConfig.guidestar = { profileUrl: '', directProfileUrl: '' }
      siteConfig.social = [{ label: 'Facebook', href: '' }]
      siteConfig.donationUrl = ''
      siteConfig.volunteerUrl = ''
      // 'team' is left out: its value is the roster in src/data/team, which the
      // template populates (the empty-roster case is covered by the team
      // section's own tests).
      siteConfig.pending = knownFields.filter((f) => f !== 'team') as PendingField[]

      expect(pendingViolations()).toEqual([])
    })

    it('rejects a pending field that still carries a value', () => {
      // Give the EIN a value, so listing it is a violation. The roster is only
      // checked when this site has one (a fork whose team is pending has none).
      siteConfig.ein = '12-3456789'
      const withRoster = team.length > 0
      siteConfig.pending = withRoster ? ['ein', 'team'] : ['ein']
      expect(pendingViolations()).toEqual([
        'ein: pending but has a value',
        ...(withRoster ? ['team: pending but has a value'] : []),
      ])
    })

    it('rejects an unknown or duplicated field', () => {
      siteConfig.ein = ''
      siteConfig.pending = ['ein', 'ein', 'taxStatusLabel' as PendingField]
      expect(pendingViolations()).toEqual(['ein: listed twice', 'taxStatusLabel: unknown field'])
    })

    it('relaxes the EIN format check only while the EIN is pending', () => {
      siteConfig.ein = ''
      siteConfig.pending = ['ein']
      expect(siteConfig.ein).toMatch(einPattern())

      siteConfig.pending = []
      expect(siteConfig.ein).not.toMatch(einPattern())
    })
  })
})
