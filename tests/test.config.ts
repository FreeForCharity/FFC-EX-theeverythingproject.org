/**
 * Test Configuration for Template Customization
 *
 * This file contains all content-specific values used in E2E tests.
 * When customizing this template for a new organization, update these
 * values to match your content instead of modifying individual test files.
 *
 * This makes it easy to:
 * 1. Identify what needs to change when using the template
 * 2. Keep tests working with customized content
 * 3. Maintain a single source of truth for test expectations
 */

export const testConfig = {
  /**
   * Social Media Links Configuration
   * Used in: tests/social-links.spec.ts
   */
  socialLinks: {
    facebook: {
      url: 'facebook.com/The-Everything-Project-104146074916003',
      ariaLabel: 'Facebook',
    },
    twitter: {
      url: 'twitter.com/TheEver09371964',
      ariaLabel: 'X (Twitter)',
    },
    instagram: {
      url: 'instagram.com/the_everything_project',
      ariaLabel: 'Instagram',
    },
  },

  /**
   * Copyright Configuration
   * Used in: tests/copyright.spec.ts
   *
   * No 501(c)(3) status line: this charity's nonprofit status has not been
   * validated in FFC's onboarding records (FFC footer standard Level 1 —
   * see src/lib/site.config.ts `hasVerifiedNonprofitStatus`).
   */
  copyright: {
    text: 'All Rights Are Reserved by The Everything Project',
    searchText: 'All Rights Are Reserved',
    // The permanent "Supported by Free For Charity" attribution (FFC footer
    // standard) — keep these expectations when customizing the template.
    linkUrl: 'https://freeforcharity.org',
    linkText: 'Free For Charity',
  },

  /**
   * Google Tag Manager Configuration
   * Used in: tests/google-tag-manager.spec.ts
   */
  googleTagManager: {
    id: 'GTM-TQ5H8HPR',
  },

  /**
   * Logo Configuration
   * Used in: tests/footer-only.spec.ts
   */
  logo: {
    headerAlt: 'The Everything Project',
  },

  /**
   * Cookie Consent Configuration
   * Used in: tests/cookie-consent.spec.ts
   */
  cookieConsent: {
    bannerHeading: 'We Value Your Privacy',
    modalHeading: 'Cookie Preferences',
    buttons: {
      acceptAll: 'Accept All',
      declineAll: 'Decline All',
      customize: 'Customize',
      savePreferences: 'Save Preferences',
      cancel: 'Cancel',
    },
  },
}
