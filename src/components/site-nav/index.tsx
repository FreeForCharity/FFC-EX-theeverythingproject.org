'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FiMenu } from 'react-icons/fi'
import { RxCross2 } from 'react-icons/rx'
import { assetPath } from '@/lib/assetPath'
import { siteConfig } from '@/lib/site.config'

type NavItem = { label: string; href: string }

// The charity's real page routes (see the wordpress-to-pages-migration skill
// §3: converted from the captured WordPress pages into real src/app routes).
const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Contact Us', href: '/contact-us' },
]

const SiteNav: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header id="site-nav" className="w-full bg-white shadow-sm sticky top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Home">
          <img
            src={assetPath('/images/theeverythingproject/logo.png')}
            alt={siteConfig.name}
            className="h-12 w-auto"
          />
        </Link>

        <nav className="hidden md:block" id="lato-font">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="px-3 py-2 text-[15px] font-[600] text-gray-700 hover:text-[#ff6900] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/donation"
                className="ml-2 inline-block rounded-full bg-[#ff6900] px-5 py-2 text-[15px] font-[700] text-white transition-colors hover:bg-orange-600"
              >
                Donate
              </Link>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className="md:hidden p-2 text-gray-700 hover:text-[#ff6900]"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <RxCross2 className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav
          className="md:hidden border-t border-gray-100 bg-white px-4 py-3"
          id="lato-font"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {[...NAV_ITEMS, { label: 'Donate', href: '/donation' }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-[15px] font-[600] text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default SiteNav
