import { test, expect } from '@playwright/test'

const fakeSdk = `
window.paypal = {
  Buttons: (o) => ({
    render: (el) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.textContent = 'Fake PayPal'
      b.onclick = async () => {
        let ok = false
        await o.onClick({}, { resolve: async () => { ok = true }, reject: async () => {} })
        if (!ok) return
        const actions = {
          order: {
            create: async (order) => { window.__order = order; return 'ORDER-1' },
            capture: async () => ({ purchase_units: [{ payments: { captures: [{ id: 'TX-E2E' }] } }] }),
          },
        }
        await o.createOrder({}, actions)
        await o.onApprove({}, actions)
      }
      el.appendChild(b)
      return Promise.resolve()
    },
  }),
}`

test.describe('Donation page PayPal flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://www.paypal.com/sdk/js**', (route) =>
      route.fulfill({ contentType: 'application/javascript', body: fakeSdk })
    )
  })

  test('validates, creates the order from the form, and shows a receipt', async ({ page }) => {
    const csp: string[] = []
    page.on('console', (m) => {
      if (/Content Security Policy/i.test(m.text())) csp.push(m.text())
    })
    await page.goto('donation/')

    const pay = page.getByRole('button', { name: 'Fake PayPal' })
    await pay.click()
    await expect(page.getByText('PayPal amount must be greater than 0.')).toBeVisible()
    await expect(page.getByLabel(/^Name/)).toBeFocused()

    await page.getByLabel(/^Name/).fill('Jane Donor')
    await page.getByLabel(/^Email Address/).fill('jane@example.org')
    await page.getByLabel(/^Street Address/).fill('1 Main St')
    await page.getByLabel(/^City/).fill('Goma')
    await page.getByLabel(/^State\/Province/).fill('North Kivu')
    await page.getByLabel(/^ZIP/).fill('00000')
    await page.getByLabel('Country').selectOption('CD')
    await page.getByLabel(/^Donation Amount/).fill('25')
    await pay.click()

    await expect(page.getByRole('heading', { name: 'Thank you, Jane Donor!' })).toBeVisible()
    await expect(page.getByText('TX-E2E')).toBeVisible()
    const order = await page.evaluate(() => (window as unknown as { __order: unknown }).__order)
    expect(order).toMatchObject({
      purchase_units: [{ amount: { currency_code: 'USD', value: '25.00' } }],
      payer: { email_address: 'jane@example.org', address: { country_code: 'CD' } },
    })
    expect(csp).toEqual([])
  })

  test('falls back to email when PayPal cannot load', async ({ page }) => {
    await page.unroute('https://www.paypal.com/sdk/js**')
    await page.route('https://www.paypal.com/sdk/js**', (route) => route.abort())
    await page.goto('donation/')
    await expect(page.getByRole('link', { name: 'Email us to donate' })).toBeVisible()
  })
})
