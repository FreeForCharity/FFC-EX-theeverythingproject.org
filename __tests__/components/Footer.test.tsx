import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Footer from '../../src/components/footer'
import { PENDING_TEXT, type PendingField, siteConfig } from '../../src/lib/site.config'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('Footer component', () => {
  it('should render the footer', () => {
    render(<Footer />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('shows a GuideStar placeholder, and no seal or profile link, while GuideStar is pending', () => {
    render(<Footer />)
    expect(screen.getByText('Endorsements')).toBeInTheDocument()
    expect(screen.getByText('GuideStar / Candid Profile')).toBeInTheDocument()
    expect(screen.queryByAltText('GuideStar Platinum Seal of Transparency')).not.toBeInTheDocument()
    expect(screen.queryByText('Direct GuideStar Profile Link')).not.toBeInTheDocument()
  })

  it('displays the EIN and the 501(c)(3) clause', () => {
    render(<Footer />)
    expect(screen.getByText(`${siteConfig.name} EIN: ${siteConfig.ein}`)).toBeInTheDocument()
    expect(screen.getByText(/a US 501c3 Non Profit/)).toBeInTheDocument()
  })

  it('should display Quick Links section', () => {
    render(<Footer />)
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
  })

  it('should display Contact Us section with contact information', () => {
    render(<Footer />)
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
  })

  it('should have social media links', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('should display the current year in copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument()
  })

  it('should have email contact link', () => {
    render(<Footer />)
    const emailLink = screen.getByText('everythingprojectusa@gmail.com').closest('a')
    expect(emailLink).toHaveAttribute('href', 'mailto:everythingprojectusa@gmail.com')
  })

  it('should have phone contact link', () => {
    render(<Footer />)
    expect(screen.getByText('(978) 254-3327').closest('a')).toHaveAttribute(
      'href',
      'tel:9782543327'
    )
  })

  it('should display The Everything Project Policy section', () => {
    render(<Footer />)
    expect(screen.getByText('The Everything Project Policy')).toBeInTheDocument()
  })

  it('should have all social media links with correct aria-labels', () => {
    render(<Footer />)
    for (const { href, label } of [
      {
        label: 'Facebook',
        href: 'https://www.facebook.com/The-Everything-Project-104146074916003/',
      },
      { label: 'X (Twitter)', href: 'https://twitter.com/TheEver09371964' },
      { label: 'Instagram', href: 'https://www.instagram.com/the_everything_project/' },
    ]) {
      const link = screen.getByLabelText(label)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', href)
    }
  })

  it('should have social media links open in new tabs', () => {
    render(<Footer />)
    const fbLink = screen.getByLabelText('Facebook')
    expect(fbLink).toHaveAttribute('target', '_blank')
    expect(fbLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should have policy links with correct hrefs', () => {
    render(<Footer />)
    const policyLinks = [
      { text: 'The Everything Project Privacy Policy', href: '/privacy-policy' },
      { text: 'The Everything Project Cookie Policy', href: '/cookie-policy' },
      { text: 'The Everything Project Terms of Service', href: '/terms-of-service' },
      // FFC's own donation policy: label hardcoded to FFC on purpose.
      { text: 'Free For Charity Donation Policy', href: '/free-for-charity-donation-policy' },
      // The charity's own donation policy (label follows siteConfig.name
      // interpolation on the other entries, but this one is fixed).
      { text: 'Donation Policy', href: '/donation-policy' },
    ]

    for (const { text, href } of policyLinks) {
      const link = screen.getByText(text).closest('a')
      expect(link).toHaveAttribute('href', href)
    }
  })

  it('should have quick links pointing at the real page routes, plus the hub login link', () => {
    render(<Footer />)
    const quickLinks = [
      { text: 'Home', href: '/' },
      { text: 'Our Mission', href: '/#mission' },
      { text: 'Programs', href: '/#programs' },
      { text: 'Gallery', href: '/gallery' },
      { text: 'Donate', href: '/donation' },
      { text: 'Volunteer', href: '/volunteer' },
      { text: 'Contact', href: '/contact-us' },
    ]

    for (const { text, href } of quickLinks) {
      const link = screen.getByText(text).closest('a')
      expect(link).toHaveAttribute('href', href)
    }

    // FFC footer standard: the hub login link is always rendered and points
    // at siteConfig.supportedBy.hubUrl.
    const hubLink = screen.getByText('Supported Charity Login').closest('a')
    expect(hubLink).toHaveAttribute('href', 'https://freeforcharity.org/hub/')
    expect(hubLink).toHaveAttribute('target', '_blank')
    expect(hubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should have a Google Maps link for the mailing address', () => {
    render(<Footer />)
    // The address link has no aria-label (WCAG 2.5.3 label-in-name: the
    // visible text is the accessible name, with sr-only "(opens in Google
    // Maps)" context appended), so query it by its visible label text.
    const mailingAddress = screen.getByText('Mailing Address').closest('a')

    expect(mailingAddress).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=20+Portsmouth+Avenue+Suite+1+%231113+Stratham+NH+03885'
    )
    expect(mailingAddress).toHaveTextContent('20 Portsmouth Avenue')
  })

  it('should display the permanent "Supported by Free For Charity" attribution in copyright bar', () => {
    render(<Footer />)
    const copyright = screen.getByText((_, node) => {
      return (
        node?.tagName.toLowerCase() === 'p' && node.textContent?.includes('All Rights Are Reserved')
      )
    })
    // FFC footer standard: the attribution is always rendered and links to FFC.
    expect(copyright).toHaveTextContent('Supported by Free For Charity')
    const link = screen.getByText('Free For Charity')
    expect(link.closest('a')).toHaveAttribute('href', 'https://freeforcharity.org')
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(<Footer />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// The `pending` convention (see PendingField in src/lib/site.config.ts): a
// footer-standard field the charity has not supplied yet keeps an EMPTY value
// and renders PENDING_TEXT in its slot as plain text, never a link.
describe('pending footer fields', () => {
  const original = {
    contactEmail: siteConfig.contactEmail,
    phone: siteConfig.phone,
    addresses: siteConfig.addresses,
    ein: siteConfig.ein,
    guidestar: siteConfig.guidestar,
    social: siteConfig.social,
    pending: siteConfig.pending,
  }
  afterEach(() => {
    Object.assign(siteConfig, original)
  })

  // This site's Donate / Volunteer links go to its own pages, so the footer
  // slots that can be pending are these.
  const footerFields: readonly PendingField[] = [
    'guidestar',
    'ein',
    'email',
    'phone',
    'address',
    'social',
  ]

  it('renders one non-link placeholder per pending footer field in the shipped config', () => {
    render(<Footer />)
    const pendingInFooter = (siteConfig.pending ?? []).filter((f) => footerFields.includes(f))
    const notes = screen.queryAllByText(PENDING_TEXT)
    expect(notes).toHaveLength(pendingInFooter.length)
    for (const note of notes) expect(note.closest('a')).toBeNull()
  })

  it('renders a visible, non-link placeholder for each pending footer field', () => {
    siteConfig.contactEmail = ''
    siteConfig.phone = { display: '', tel: '' }
    siteConfig.addresses = []
    siteConfig.ein = ''
    siteConfig.guidestar = { profileUrl: '', directProfileUrl: '' }
    siteConfig.social = siteConfig.social.map((link) => ({ ...link, href: '' }))
    siteConfig.pending = [...footerFields]
    render(<Footer />)

    const notes = screen.getAllByText(PENDING_TEXT)
    expect(notes).toHaveLength(footerFields.length)
    for (const note of notes) expect(note.closest('a')).toBeNull()
    expect(document.querySelector('a[href^="tel:"]')).toBeNull()
    expect(document.querySelector('a[href*="google.com/maps"]')).toBeNull()
    expect(document.querySelector('a[href="mailto:"]')).toBeNull()
  })

  it('treats an empty field that is NOT pending as "the charity has none"', () => {
    siteConfig.phone = { display: '', tel: '' }
    siteConfig.guidestar = { profileUrl: '', directProfileUrl: '' }
    siteConfig.pending = []
    render(<Footer />)

    expect(screen.queryByText(PENDING_TEXT)).toBeNull()
    expect(screen.queryByText('Call Us Today')).toBeNull()
    expect(screen.queryByText('GuideStar / Candid Profile')).toBeNull()
  })

  it('shows each GuideStar element only when its own URL is configured', () => {
    siteConfig.guidestar = {
      profileUrl: 'https://example.org/seal',
      directProfileUrl: 'https://example.org/direct',
    }
    siteConfig.pending = []
    render(<Footer />)
    expect(
      screen.getByAltText('GuideStar Platinum Seal of Transparency').closest('a')
    ).toHaveAttribute('href', 'https://example.org/seal')
    expect(screen.getByText('Direct GuideStar Profile Link').closest('a')).toHaveAttribute(
      'href',
      'https://example.org/direct'
    )
  })
})
