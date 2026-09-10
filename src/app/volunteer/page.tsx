import type { Metadata } from 'next'
import { siteConfig, siteUrl } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Volunteer',
  description: `Become a volunteer with ${siteConfig.name}.`,
  alternates: { canonical: siteUrl('/volunteer') },
}

const INTEREST_AREAS = ['Promotion', 'Programs', 'Expertise', 'Other'] as const

export default function VolunteerPage() {
  const subject = encodeURIComponent(`Volunteering with ${siteConfig.name}`)
  const body = encodeURIComponent(
    'Hi,\n\nI would like to volunteer. Here is a bit about me:\n\nName:\nAreas I am interested in (Promotion / Programs / Expertise / Other):\nRelevant experience:\n'
  )
  const mailtoHref = `mailto:${siteConfig.contactEmail}?subject=${subject}&body=${body}`

  return (
    <main id="main-content" className="pb-[80px]">
      <section className="bg-[#111827] text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-[32px] md:text-[40px] font-[700]" id="aria-font">
            Become a Volunteer
          </h1>
          <p className="mt-4 text-[17px] text-gray-200">
            {siteConfig.name} relies on volunteers to help with promotion, program support, and
            professional expertise for our work on the Isle Idjwi.
          </p>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 py-14 text-center" id="aria-font">
        <div className="rounded-xl border border-gray-200 p-8">
          <h2 className="text-[20px] font-[700] text-[#111827] mb-4">
            Tell us how you&apos;d like to help
          </h2>
          <p className="text-[15px] leading-[24px] text-[#555] mb-4">
            We currently coordinate volunteers by email. Let us know your name and which of the
            following areas you&apos;re interested in, and a bit about your past experience:
          </p>
          <ul className="mb-6 flex flex-wrap justify-center gap-2">
            {INTEREST_AREAS.map((area) => (
              <li
                key={area}
                className="rounded-full bg-gray-100 px-4 py-1.5 text-[14px] font-[600] text-[#333]"
              >
                {area}
              </li>
            ))}
          </ul>
          <a
            href={mailtoHref}
            className="inline-block rounded-full bg-[#ff6900] px-8 py-3 text-[16px] font-[700] text-white hover:bg-orange-600 transition-colors"
          >
            Email us to volunteer
          </a>
          <p className="mt-4 text-[14px] text-[#777] break-all">{siteConfig.contactEmail}</p>
        </div>
      </section>
    </main>
  )
}
