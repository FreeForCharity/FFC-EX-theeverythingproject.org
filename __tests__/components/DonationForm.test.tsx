import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import DonationForm, {
  AMOUNT_ERROR,
  buildOrder,
  parseAmount,
  validate,
} from '../../src/components/donation-form'

type Options = {
  onClick: (d: unknown, a: { resolve: jest.Mock; reject: jest.Mock }) => Promise<void>
  createOrder: (d: unknown, a: unknown) => Promise<string>
  onApprove: (d: unknown, a: unknown) => Promise<void>
  onCancel: () => void
  onError: (e: unknown) => void
}

let options: Options

beforeEach(() => {
  window.paypal = {
    Buttons: jest.fn((o: Options) => {
      options = o
      return { render: jest.fn().mockResolvedValue(undefined), close: jest.fn() }
    }),
  } as never
})

afterEach(() => {
  delete window.paypal
})

const fallback = <p>Email us to donate</p>

const renderForm = async () => {
  const view = render(
    <DonationForm
      clientId="test-id"
      currency="USD"
      charityName="Test Charity"
      fallback={fallback}
    />
  )
  await waitFor(() => expect(options).toBeDefined())
  return view
}

const filled = {
  name: 'Jane Q Donor',
  email: 'jane@example.org',
  street: '1 Main St',
  line2: '',
  city: 'Stratham',
  state: 'NH',
  zip: '03885',
  country: 'US',
  amount: '$1,025.5',
}

const fill = () => {
  const set = (label: RegExp, value: string) =>
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  set(/^Name/, filled.name)
  set(/^Email Address/, filled.email)
  set(/^Street Address/, filled.street)
  set(/^City/, filled.city)
  set(/^State\/Province/, filled.state)
  set(/^ZIP/, filled.zip)
  set(/^Donation Amount/, filled.amount)
}

describe('donation helpers', () => {
  it('parses amounts to two decimals and rejects zero or junk', () => {
    expect(parseAmount('$1,025.5')).toBe('1025.50')
    expect(parseAmount('10')).toBe('10.00')
    expect(parseAmount('0')).toBeNull()
    expect(parseAmount('1.234')).toBeNull()
    expect(parseAmount('abc')).toBeNull()
  })

  it('requires every field the live form required', () => {
    const errors = validate({ ...filled, name: '', email: 'bad', amount: '0', line2: '' })
    expect(errors.name).toBeTruthy()
    expect(errors.email).toMatch(/valid email/)
    expect(errors.amount).toBe(AMOUNT_ERROR)
    expect(errors.line2).toBeUndefined()
  })

  it('maps the donor into the PayPal order', () => {
    expect(buildOrder(filled, 'USD', 'Test Charity')).toEqual({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: 'Donation to Test Charity',
          amount: { currency_code: 'USD', value: '1025.50' },
        },
      ],
      payer: {
        name: { given_name: 'Jane Q', surname: 'Donor' },
        email_address: 'jane@example.org',
        address: {
          address_line_1: '1 Main St',
          address_line_2: undefined,
          admin_area_2: 'Stratham',
          admin_area_1: 'NH',
          postal_code: '03885',
          country_code: 'US',
        },
      },
      application_context: { shipping_preference: 'NO_SHIPPING' },
    })
  })
})

describe('DonationForm component', () => {
  it('renders the live form fields with required markers', async () => {
    await renderForm()
    for (const label of [
      /^Name/,
      /^Email Address/,
      /^Street Address/,
      /^City/,
      /^ZIP/,
      /^Donation Amount/,
    ]) {
      expect(screen.getByLabelText(label)).toBeRequired()
    }
    expect(screen.getByLabelText('Apartment, suite, etc')).not.toBeRequired()
    expect(screen.getByLabelText('Country')).toHaveValue('US')
  })

  it('blocks checkout and flags fields when the form is empty', async () => {
    await renderForm()
    const actions = { resolve: jest.fn(), reject: jest.fn() }
    await act(async () => {
      await options.onClick({}, actions)
    })
    expect(actions.reject).toHaveBeenCalled()
    expect(actions.resolve).not.toHaveBeenCalled()
    expect(screen.getByText(AMOUNT_ERROR)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Name/)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/^Name/)).toHaveFocus()
  })

  it('creates the order from the fields and shows a receipt after capture', async () => {
    await renderForm()
    fill()
    const actions = { resolve: jest.fn(), reject: jest.fn() }
    await act(async () => {
      await options.onClick({}, actions)
    })
    expect(actions.resolve).toHaveBeenCalled()

    const create = jest.fn().mockResolvedValue('ORDER-1')
    const capture = jest.fn().mockResolvedValue({
      id: 'ORDER-1',
      purchase_units: [{ payments: { captures: [{ id: 'TX-9' }] } }],
    })
    await options.createOrder({}, { order: { create, capture } })
    expect(create).toHaveBeenCalledWith(buildOrder(filled, 'USD', 'Test Charity'))

    await act(async () => {
      await options.onApprove({}, { order: { create, capture } })
    })
    expect(screen.getByRole('heading', { name: 'Thank you, Jane Q Donor!' })).toBeInTheDocument()
    expect(screen.getByText(/\$1025\.50 USD/)).toBeInTheDocument()
    expect(screen.getByText('TX-9')).toBeInTheDocument()
  })

  it('tells the donor nothing was taken when they cancel', async () => {
    await renderForm()
    act(() => options.onCancel())
    expect(screen.getByText(/No payment was taken/)).toBeInTheDocument()
  })

  it('falls back to the email copy when the PayPal SDK fails to load', async () => {
    delete window.paypal
    const append = jest.spyOn(document.head, 'appendChild').mockImplementation((node) => {
      setTimeout(() => (node as HTMLScriptElement).onerror?.(new Event('error')))
      return node
    })
    render(<DonationForm clientId="x" currency="USD" charityName="T" fallback={fallback} />)
    expect(await screen.findByText('Email us to donate')).toBeInTheDocument()
    expect(append.mock.calls[0][0]).toHaveProperty(
      'src',
      expect.stringContaining('https://www.paypal.com/sdk/js?client-id=x&currency=USD')
    )
    append.mockRestore()
  })

  it('has no axe violations', async () => {
    const { container } = await renderForm()
    expect(await axe(container)).toHaveNoViolations()
  })
})
