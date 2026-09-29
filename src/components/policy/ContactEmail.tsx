import React from 'react'
import { PENDING_TEXT, isPending, mailtoHref, siteConfig } from '@/lib/site.config'

/**
 * The organization's contact email as a `mailto:` link, for policy pages.
 *
 * While the email is still awaited from the charity (listed in
 * `siteConfig.pending`, see `PendingField`) the value is empty, so this renders
 * the plain-text "awaiting information" note instead: never an empty `mailto:`
 * link that looks usable and goes nowhere, and never another organization's
 * address.
 */
export default function ContactEmail({
  className = 'text-[#0062cc] underline',
}: {
  className?: string
}) {
  if (isPending('email') || !siteConfig.contactEmail.trim()) {
    return <em>{PENDING_TEXT}</em>
  }
  return (
    <a href={mailtoHref()} className={className}>
      {siteConfig.contactEmail}
    </a>
  )
}
