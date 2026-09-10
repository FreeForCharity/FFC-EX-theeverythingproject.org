import { test, expect } from '@playwright/test'
import { testConfig } from './test.config'

/**
 * Home page + Footer smoke tests.
 *
 * This repo renders the charity's own migrated home page content (see
 * src/app/home-page) plus the FFC footer standard.
 */

test.describe('Home page', () => {
  test('should render the mission section and hero calls-to-action', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { level: 1, name: 'The Everything Project' })
    ).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Our Mission' })).toBeVisible()

    // The site nav renders the charity's own logo, not a placeholder.
    await expect(page.getByAltText(testConfig.logo.headerAlt).first()).toBeVisible()
  })

  test('should render the Footer', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('footer')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Quick Links' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible()
  })
})
