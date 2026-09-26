'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { countries } from '@/lib/countries'

type Fields = {
  name: string
  email: string
  street: string
  line2: string
  city: string
  state: string
  zip: string
  country: string
  amount: string
}

type FieldKey = keyof Fields
type Errors = Partial<Record<FieldKey, string>>

type PayPalActions = {
  resolve: () => Promise<void>
  reject: () => Promise<void>
}

type PayPalOrderActions = {
  order: {
    create: (order: unknown) => Promise<string>
    capture: () => Promise<PayPalCapture>
  }
}

type PayPalCapture = {
  id?: string
  purchase_units?: { payments?: { captures?: { id?: string }[] } }[]
}

type PayPalButtonsOptions = {
  style: Record<string, string | number | boolean>
  onClick: (data: unknown, actions: PayPalActions) => Promise<void>
  createOrder: (data: unknown, actions: PayPalOrderActions) => Promise<string>
  onApprove: (data: unknown, actions: PayPalOrderActions) => Promise<void>
  onCancel: () => void
  onError: (err: unknown) => void
}

type PayPalNamespace = {
  Buttons: (options: PayPalButtonsOptions) => {
    render: (el: HTMLElement) => Promise<void>
    close?: () => void
  }
}

declare global {
  interface Window {
    paypal?: PayPalNamespace
  }
}

export const AMOUNT_ERROR = 'PayPal amount must be greater than 0.'
export const AMOUNT_TOO_LARGE = 'Please enter an amount under $1,000,000,000.'

const REQUIRED: [FieldKey, string][] = [
  ['name', 'Please enter your name.'],
  ['email', 'Please enter your email address.'],
  ['street', 'Please enter your street address.'],
  ['city', 'Please enter your city.'],
  ['state', 'Please enter your state or province.'],
  ['zip', 'Please enter your ZIP or postal code.'],
]

const FIELD_ORDER: FieldKey[] = ['name', 'email', 'street', 'city', 'state', 'zip', 'amount']

export function parseAmount(raw: string): string | null {
  const cleaned = raw.replace(/[$,\s]/g, '')
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(cleaned)) return null
  const value = Number(cleaned)
  return value > 0 ? value.toFixed(2) : null
}

export function validate(fields: Fields): Errors {
  const errors: Errors = {}
  for (const [key, message] of REQUIRED) {
    if (!fields[key].trim()) errors[key] = message
  }
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!parseAmount(fields.amount)) {
    errors.amount = /^\d{10,}/.test(fields.amount.replace(/[$,\s]/g, ''))
      ? AMOUNT_TOO_LARGE
      : AMOUNT_ERROR
  }
  return errors
}

export function buildOrder(fields: Fields, currency: string, charityName: string) {
  const fullName = fields.name.trim()
  const split = fullName.lastIndexOf(' ')
  return {
    intent: 'CAPTURE',
    purchase_units: [
      {
        description: `Donation to ${charityName}`,
        amount: { currency_code: currency, value: parseAmount(fields.amount) },
      },
    ],
    payer: {
      name:
        split > 0
          ? { given_name: fullName.slice(0, split), surname: fullName.slice(split + 1) }
          : { given_name: fullName },
      email_address: fields.email.trim(),
      address: {
        address_line_1: fields.street.trim(),
        address_line_2: fields.line2.trim() || undefined,
        admin_area_2: fields.city.trim(),
        admin_area_1: fields.state.trim(),
        postal_code: fields.zip.trim(),
        country_code: fields.country,
      },
    },
    application_context: { shipping_preference: 'NO_SHIPPING' },
  }
}

let sdkPromise: Promise<PayPalNamespace> | null = null

export function loadPayPalSdk(clientId: string, currency: string): Promise<PayPalNamespace> {
  if (typeof window !== 'undefined' && window.paypal) return Promise.resolve(window.paypal)
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      'client-id': clientId,
      currency,
      intent: 'capture',
      components: 'buttons',
      locale: 'en_US',
    })
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?${params}`
    script.async = true
    script.onload = () =>
      window.paypal ? resolve(window.paypal) : reject(new Error('PayPal SDK unavailable'))
    script.onerror = () => {
      sdkPromise = null
      script.remove()
      reject(new Error('PayPal SDK failed to load'))
    }
    document.head.appendChild(script)
  })
  return sdkPromise
}

type DonationFormProps = {
  clientId: string
  currency: string
  charityName: string
  emailHref: string
  fallback: React.ReactNode
}

type Receipt = { name: string; amount: string; transactionId: string }

const inputClass =
  'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-[15px] text-[#111827] focus:border-[#ff6900] focus:outline-none focus:ring-2 focus:ring-[#ff6900]/40 aria-[invalid=true]:border-red-600'

const DonationForm: React.FC<DonationFormProps> = ({
  clientId,
  currency,
  charityName,
  emailHref,
  fallback,
}) => {
  const [fields, setFields] = useState<Fields>({
    name: '',
    email: '',
    street: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    amount: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable' | 'done'>('loading')
  const [notice, setNotice] = useState('')
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const fieldsRef = useRef(fields)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const countryList = useMemo(() => countries(), [])

  useEffect(() => {
    fieldsRef.current = fields
  }, [fields])

  useEffect(() => {
    let cancelled = false
    let buttons: ReturnType<PayPalNamespace['Buttons']> | null = null

    loadPayPalSdk(clientId, currency)
      .then((paypal) => {
        if (cancelled || !buttonsRef.current) return
        buttons = paypal.Buttons({
          style: {
            color: 'gold',
            shape: 'rect',
            layout: 'vertical',
            height: 40,
            label: 'checkout',
          },
          onClick: (_data, actions) => {
            const found = validate(fieldsRef.current)
            setErrors(found)
            setNotice('')
            const first = FIELD_ORDER.find((key) => found[key])
            if (first) {
              formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
              return actions.reject()
            }
            return actions.resolve()
          },
          createOrder: (_data, actions) =>
            actions.order.create(buildOrder(fieldsRef.current, currency, charityName)),
          onApprove: async (_data, actions) => {
            let capture: PayPalCapture
            try {
              capture = await actions.order.capture()
            } catch {
              setNotice(
                "We couldn't confirm your donation. Please check your PayPal account or email for a receipt before trying again, or email us and we'll look into it."
              )
              return
            }
            const current = fieldsRef.current
            setReceipt({
              name: current.name.trim(),
              amount: parseAmount(current.amount) ?? current.amount,
              transactionId:
                capture.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? capture.id ?? '',
            })
            setStatus('done')
          },
          onCancel: () => setNotice('Your donation was cancelled. No payment was taken.'),
          onError: () =>
            setNotice('Something went wrong with PayPal. Please try again or email us to donate.'),
        })
        return buttons.render(buttonsRef.current).then(() => {
          if (!cancelled) setStatus('ready')
        })
      })
      .catch(() => {
        if (!cancelled) setStatus('unavailable')
      })

    return () => {
      cancelled = true
      buttons?.close?.()
    }
  }, [clientId, currency, charityName])

  if (status === 'unavailable') return <>{fallback}</>

  if (status === 'done' && receipt) {
    return (
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-[22px] font-[700] text-[#111827] mb-3">Thank you, {receipt.name}!</h2>
        <p className="text-[15px] leading-[24px] text-[#555]">
          Your donation of ${receipt.amount} {currency} to {charityName} was received. PayPal will
          email your receipt.
        </p>
        {receipt.transactionId && (
          <p className="mt-3 text-[14px] text-[#777]">
            PayPal transaction ID: <span className="font-mono">{receipt.transactionId}</span>
          </p>
        )}
      </div>
    )
  }

  const errorKeys = FIELD_ORDER.filter((key) => errors[key])

  const field = (
    key: FieldKey,
    label: string,
    required: boolean,
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => {
    const id = `donation-${key}`
    const error = errors[key]
    return (
      <div>
        <label htmlFor={id} className="block text-[14px] font-[600] text-[#111827]">
          {label}
          {required && (
            <span className="text-red-600" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
        <input
          id={id}
          name={key}
          value={fields[key]}
          onChange={(e) => {
            const value = e.target.value
            setFields((prev) => ({ ...prev, [key]: value }))
            if (error) setErrors((prev) => ({ ...prev, [key]: undefined }))
          }}
          required={required}
          aria-required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="mt-1 text-[13px] text-red-700">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <>
      <p className="mb-6 text-center text-[15px] leading-[24px] text-[#555]">
        Payments are processed securely by PayPal. You can pay with a PayPal account or a debit or
        credit card. The details you enter are sent to PayPal with your payment and shared with{' '}
        {charityName}.
      </p>
      <form
        ref={formRef}
        noValidate
        onSubmit={(e) => e.preventDefault()}
        aria-labelledby="donation-form-heading"
        className="rounded-xl border border-gray-200 p-6 md:p-8"
      >
        <h2 id="donation-form-heading" className="text-[22px] font-[700] text-[#111827] mb-1">
          Donate with PayPal
        </h2>
        <p className="text-[14px] text-[#777] mb-6">
          Fields marked <span className="text-red-600">*</span> are required.
        </p>

        <div aria-live="polite" className="empty:hidden mb-4">
          {errorKeys.length > 0 && (
            <p className="rounded-md bg-red-50 p-3 text-[14px] text-red-800">
              Please correct the {errorKeys.length === 1 ? 'field' : `${errorKeys.length} fields`}{' '}
              below.
            </p>
          )}
          {notice && <p className="rounded-md bg-gray-100 p-3 text-[14px] text-[#555]">{notice}</p>}
        </div>

        <div className="grid gap-4">
          {field('name', 'Name', true, { autoComplete: 'name', placeholder: 'E.g. John Doe' })}
          {field('email', 'Email Address', true, {
            type: 'email',
            autoComplete: 'email',
            placeholder: 'E.g. john@doe.com',
          })}
          {field('street', 'Street Address', true, {
            autoComplete: 'address-line1',
            placeholder: 'E.g. 42 Wallaby Way',
          })}
          {field('line2', 'Apartment, suite, etc', false, { autoComplete: 'address-line2' })}
          <div className="grid gap-4 md:grid-cols-2">
            {field('city', 'City', true, {
              autoComplete: 'address-level2',
              placeholder: 'E.g. Sydney',
            })}
            {field('state', 'State/Province', true, {
              autoComplete: 'address-level1',
              placeholder: 'E.g. New South Wales',
            })}
            {field('zip', 'ZIP / Postal Code', true, {
              autoComplete: 'postal-code',
              placeholder: 'E.g. 2000',
            })}
            <div>
              <label
                htmlFor="donation-country"
                className="block text-[14px] font-[600] text-[#111827]"
              >
                Country
              </label>
              <select
                id="donation-country"
                name="country"
                value={fields.country}
                autoComplete="country"
                onChange={(e) => {
                  const value = e.target.value
                  setFields((prev) => ({ ...prev, country: value }))
                }}
                className={inputClass}
              >
                {countryList.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {field('amount', `Donation Amount (${currency})`, true, {
            inputMode: 'decimal',
            autoComplete: 'transaction-amount',
            placeholder: '0.00',
          })}
        </div>

        <div className="mt-6 min-h-[48px]">
          {status === 'loading' && (
            <p className="text-[14px] text-[#777]" role="status">
              Loading PayPal…
            </p>
          )}
          <div ref={buttonsRef} data-testid="paypal-buttons" />
        </div>
      </form>
      <p className="mt-6 text-center text-[14px] text-[#777]">
        Prefer another way to give?{' '}
        <a href={emailHref} className="underline hover:text-[#ff6900]">
          Email us
        </a>
        .
      </p>
    </>
  )
}

export default DonationForm
