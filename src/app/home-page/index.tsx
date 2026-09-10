import React from 'react'
import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'
import { siteConfig } from '@/lib/site.config'

type ProgramArea = {
  title: string
  body: string
}

// Program-area copy carried over verbatim from the captured WordPress home
// page (see the tracking issue for this migration's source inspection).
const PROGRAM_AREAS: readonly ProgramArea[] = [
  {
    title: 'Education',
    body: 'School, healthcare, and food security are expenses that no one should be denied because they cannot pay. Many students need support with supplies, fees, and curriculum.',
  },
  {
    title: 'Cultivation',
    body: 'Digital farming techniques and international support can be utilized for highest potential yield and greatest food security.',
  },
  {
    title: 'Infrastructure',
    body: 'With the implementation of programs we will work to augment existing infrastructure — energy, communications, community centers (Big Houses), transportation, wells, and plumbing.',
  },
  {
    title: 'Quality of Life',
    body: 'Simple but substantial development for the future, enhancing daily life for vulnerable and at-risk people on Idjwi.',
  },
]

type GalleryPreview = {
  label: string
  image: string
}

const GALLERY_PREVIEW: readonly GalleryPreview[] = [
  { label: 'Idjwi', image: 'idjwi.jpg' },
  { label: 'JVA', image: 'jva.jpg' },
  { label: 'Minova unrecognized refugee camp', image: 'minova.jpg' },
  { label: 'Don Bosco', image: 'don-bosco.jpg' },
  { label: 'Mweso', image: 'mweso.jpg' },
  { label: 'Crayon Drive', image: 'crayon-drive.jpg' },
]

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero */}
      <section id="hero" className="bg-[#111827] text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-[34px] md:text-[46px] font-[700] leading-tight" id="aria-font">
            {siteConfig.name}
          </h1>
          <p className="mt-4 text-[18px] md:text-[20px] text-gray-200 max-w-3xl mx-auto">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donation"
              className="rounded-full bg-[#ff6900] px-8 py-3 text-[16px] font-[700] text-white hover:bg-orange-600 transition-colors"
            >
              Donate
            </Link>
            <Link
              href="/volunteer"
              className="rounded-full border-2 border-white px-8 py-3 text-[16px] font-[700] text-white hover:bg-white hover:text-[#111827] transition-colors"
            >
              Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center" id="aria-font">
          <h2 className="text-[28px] md:text-[32px] font-[700] text-[#111827] mb-6">Our Mission</h2>
          <p className="text-[16px] leading-[28px] text-[#444] mb-4">
            The Everything Project was founded to implement essential programs, humanitarian aid,
            and development on the Isle Idjwi for vulnerable and at risk people — for a greater Lac
            Kivu.
          </p>
          <p className="text-[16px] leading-[28px] text-[#444] mb-4">
            Beginning with our networks in Mweso and Minova, as well as clients and children who are
            dependent upon Don Bosco and JVA around Goma, we are working towards programs on Idjwi.
          </p>
          <p className="text-[16px] leading-[28px] text-[#444]">
            Programs on Idjwi will include schools, farms, infrastructure and development for
            quality of life. Until funding is in place for major programs, we intend to continue to
            do what we can for vulnerable individuals and their needs, while networking with other
            organizations and potential aid for them.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="bg-[#f7f7f5]">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2
            className="text-[28px] md:text-[32px] font-[700] text-[#111827] mb-10 text-center"
            id="aria-font"
          >
            Our Focus Areas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PROGRAM_AREAS.map((program) => (
              <div key={program.title} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-[20px] font-[700] text-[#ff6900] mb-2">{program.title}</h3>
                <p className="text-[15px] leading-[24px] text-[#444]">{program.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project gallery preview */}
      <section id="gallery-preview" className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2
            className="text-[28px] md:text-[32px] font-[700] text-[#111827] mb-2 text-center"
            id="aria-font"
          >
            Our Project Gallery
          </h2>
          <p className="text-center text-[15px] text-[#666] mb-10">
            A look at the communities and programs we work with on Idjwi and around Lake Kivu.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {GALLERY_PREVIEW.map((item) => (
              <figure key={item.label} className="overflow-hidden rounded-lg">
                <img
                  src={assetPath(`/images/theeverythingproject/gallery/${item.image}`)}
                  alt={item.label}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
                <figcaption className="mt-2 text-[14px] font-[600] text-[#333] text-center">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/gallery"
              className="inline-block rounded-full border-2 border-[#111827] px-6 py-2.5 text-[15px] font-[700] text-[#111827] hover:bg-[#111827] hover:text-white transition-colors"
            >
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-[#ff6900]">
        <div className="max-w-4xl mx-auto px-4 py-14 text-center">
          <h2 className="text-[24px] md:text-[28px] font-[700] text-white mb-4">
            Help us reach more communities on Idjwi
          </h2>
          <p className="text-white/90 text-[16px] mb-6">
            Every contribution — money, time, or supplies — helps fund essential programs for
            vulnerable and at-risk people around Lake Kivu.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donation"
              className="rounded-full bg-white px-8 py-3 text-[16px] font-[700] text-[#ff6900] hover:bg-gray-100 transition-colors"
            >
              Donate
            </Link>
            <Link
              href="/contact-us"
              className="rounded-full border-2 border-white px-8 py-3 text-[16px] font-[700] text-white hover:bg-white hover:text-[#ff6900] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
