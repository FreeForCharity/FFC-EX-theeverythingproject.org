import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig, siteUrl } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Donate',
  description: `Support ${siteConfig.name}'s humanitarian aid and development programs on the Isle Idjwi.`,
  alternates: { canonical: siteUrl('/donation') },
}

export default function DonationPage() {
  const subject = encodeURIComponent(`Donation to ${siteConfig.name}`)
  const mailtoHref = `mailto:${siteConfig.contactEmail}?subject=${subject}`

  return (
    <main id="main-content" className="pb-[80px]">
      <section className="bg-[#111827] text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-[32px] md:text-[40px] font-[700]" id="aria-font">
            Make a Donation
          </h1>
          <p className="mt-4 text-[17px] text-gray-200">
            Every gift helps fund essential programs, humanitarian aid, and development on the Isle
            Idjwi for vulnerable and at-risk people around Lake Kivu.
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 py-14" id="aria-font">
        <div className="rounded-xl border border-gray-200 p-8 text-center">
          <h2 className="text-[22px] font-[700] text-[#111827] mb-3">
            Online donations aren&apos;t available on this site right now
          </h2>
          <p className="text-[15px] leading-[24px] text-[#555] mb-6">
            {siteConfig.name} is in the process of moving to a new, secure website and its online
            donation processor is temporarily offline. To make a donation today, please reach out
            directly and we&apos;ll help you get it done.
          </p>
          <a
            href={mailtoHref}
            className="inline-block rounded-full bg-[#ff6900] px-8 py-3 text-[16px] font-[700] text-white hover:bg-orange-600 transition-colors"
          >
            Email us to donate
          </a>
          <p className="mt-4 text-[14px] text-[#777]">
            {siteConfig.contactEmail}
            {siteConfig.phone.display ? ` · ${siteConfig.phone.display}` : ''}
          </p>
        </div>

        <p className="mt-8 text-center text-[14px] text-[#777]">
          Want to help another way?{' '}
          <Link href="/volunteer" className="underline hover:text-[#ff6900]">
            Volunteer with us
          </Link>{' '}
          or{' '}
          <Link href="/contact-us" className="underline hover:text-[#ff6900]">
            get in touch
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
