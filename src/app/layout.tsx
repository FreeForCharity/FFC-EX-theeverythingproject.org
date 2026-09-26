import './globals.css'
import SiteNav from './../components/site-nav'
import Footer from './../components/footer'
import CookieConsent from './../components/cookie-consent'
import GoogleTagManager, { GoogleTagManagerNoScript } from './../components/google-tag-manager'
import { siteConfig } from '@/lib/site.config'
import {
  openSans,
  lato,
  raleway,
  faustina,
  cantataOne,
  faunaOne,
  montserrat,
  cinzel,
} from '@/lib/fonts'
import { siteMetadata } from '@/lib/siteMetadata'
import { assetPath } from '@/lib/assetPath'
import { CONSENT_MODE_BOOTSTRAP } from '@/lib/consent-mode'

export const metadata = siteMetadata

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://connect.facebook.net https://www.clarity.ms https://*.clarity.ms https://*.paypal.com https://*.paypalobjects.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://stats.g.doubleclick.net https://connect.facebook.net https://www.facebook.com https://www.clarity.ms https://*.clarity.ms https://*.paypal.com https://*.paypalobjects.com",
  'frame-src https://www.googletagmanager.com https://www.youtube-nocookie.com https://*.paypal.com',
  "media-src 'self' blob: https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ')

// React dev mode needs eval() for debugging; production never uses it.
const metaCsp =
  process.env.NODE_ENV === 'development'
    ? contentSecurityPolicy.replace("script-src 'self'", "script-src 'self' 'unsafe-eval'")
    : contentSecurityPolicy

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Keep this aligned with public/_headers for static hosts that honor headers. */}
        <meta httpEquiv="Content-Security-Policy" content={metaCsp} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content={siteConfig.themeColor} />

        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Preload critical LCP image */}
        <link
          rel="preload"
          as="image"
          href={assetPath('/Images/figma-hero-img.webp')}
          fetchPriority="high"
        />

        {/*
          Google Consent Mode v2 defaults. MUST come before <GoogleTagManager />
          (and any other Google tag) so the regional defaults are in place
          before the first tag executes: denied-by-default in the EEA/UK/CH,
          granted-by-default everywhere else. See src/lib/consent-mode.ts.
        */}
        <script
          id="consent-mode-default"
          dangerouslySetInnerHTML={{ __html: CONSENT_MODE_BOOTSTRAP }}
        />
        <GoogleTagManager />
      </head>
      <body
        className={[
          'antialiased',
          openSans.variable,
          lato.variable,
          raleway.variable,
          faustina.variable,
          cantataOne.variable,
          faunaOne.variable,
          montserrat.variable,
          cinzel.variable,
        ].join(' ')}
        suppressHydrationWarning={true}
      >
        <GoogleTagManagerNoScript />
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <SiteNav />
        {/* <PopupProvider> */}
        {children}
        <Footer />
        <CookieConsent />
        {/* <PopupsRootClient /> */}
        {/* </PopupProvider> */}
      </body>
    </html>
  )
}
