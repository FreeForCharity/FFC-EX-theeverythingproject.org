import type { Metadata } from 'next'
import { siteConfig, siteUrl } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with ${siteConfig.name}.`,
  alternates: { canonical: siteUrl('/contact-us') },
}

export default function ContactUsPage() {
  return (
    <main id="main-content" className="pb-[80px]">
      <section className="bg-[#111827] text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-[32px] md:text-[40px] font-[700]" id="aria-font">
            Contact Us
          </h1>
          <p className="mt-4 text-[17px] text-gray-200">
            Questions about our programs, a donation, or getting involved? Reach out — we&apos;d
            love to hear from you.
          </p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 py-14 text-center" id="aria-font">
        <div className="rounded-xl border border-gray-200 p-8">
          <h2 className="text-[20px] font-[700] text-[#111827] mb-4">Send a message</h2>
          <p className="text-[15px] leading-[24px] text-[#555] mb-6">
            This site no longer has a live contact form — email us directly instead and we&apos;ll
            get back to you.
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="inline-block rounded-full bg-[#ff6900] px-8 py-3 text-[16px] font-[700] text-white hover:bg-orange-600 transition-colors break-all"
          >
            {siteConfig.contactEmail}
          </a>
          {siteConfig.phone.display && (
            <p className="mt-6 text-[15px] text-[#555]">
              Or call:{' '}
              <a href={`tel:${siteConfig.phone.tel}`} className="font-[600] hover:text-[#ff6900]">
                {siteConfig.phone.display}
              </a>
            </p>
          )}
          {siteConfig.addresses.map((address) => (
            <p key={address.label} className="mt-2 text-[14px] text-[#777]">
              {address.lines.join(', ')}
            </p>
          ))}
        </div>
      </section>
    </main>
  )
}
