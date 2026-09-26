import { render, screen } from '@testing-library/react'

import DonationPage from '../../src/app/donation/page'
import { siteConfig } from '../../src/lib/site.config'

const paypal = siteConfig.integrations.paypal
const original = paypal.clientId

afterEach(() => {
  paypal.clientId = original
  delete window.paypal
})

describe('Donation page', () => {
  it('renders the PayPal donation form when a client ID is configured', () => {
    paypal.clientId = 'test-id'
    render(<DonationPage />)
    expect(screen.getByRole('form', { name: 'Donate with PayPal' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Email us' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:/)
    )
  })

  it('shows the honest email fallback when PayPal is not configured', () => {
    paypal.clientId = ''
    render(<DonationPage />)
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Online donations aren.t available/ })
    ).toBeInTheDocument()
  })
})
