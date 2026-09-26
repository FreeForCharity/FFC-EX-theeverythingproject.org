import React from 'react'
import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'
import { GALLERY_ALBUMS } from '@/lib/galleryAlbums'
import { siteConfig } from '@/lib/site.config'
import LiteYouTubeEmbed from '@/components/home-page/LiteYouTubeEmbed'

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
    body: 'With the implementation of programs we will work to augment existing infrastructure – energy, communications, community centers (Big Houses), transportation, wells, and plumbing.',
  },
  {
    title: 'Quality Life',
    body: 'Simple but substantial development for the future. Enhancing the lives of The Everything Project while also changing the socio-economic dynamic of their communities and generating prosperity throughout the region.',
  },
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
            and development on the Isle Idjwi for vulnerable and at risk people. For a greater Lac
            Kivu.
          </p>
          <p className="text-[16px] leading-[28px] text-[#444] mb-4">
            Beginning with our networks in Mweso, Minova, as well as clients and children who are
            dependent upon Don Bosco and JVA around Goma. With them we will begin working towards
            programs on Idjwi.
          </p>
          <p className="text-[16px] leading-[28px] text-[#444]">
            Programs on Idjwi will include, schools, farms, infrastructure and development for
            quality of life. Until funding is in place for major programs we intend to continue to
            do what we can for the vulnerable individuals and their needs while networking with
            other organizations and potential aid for them.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="bg-[#f7f7f5]">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2
            className="text-[28px] md:text-[32px] font-[700] text-[#111827] mb-6 text-center"
            id="aria-font"
          >
            Our Focus Areas
          </h2>
          <div className="mb-10 text-center">
            <h3 className="text-[20px] font-[700] uppercase tracking-wide text-[#111827]">
              The Seeds of Sustainability
            </h3>
            <h3 className="mt-2 text-[20px] font-[700] uppercase tracking-wide text-[#111827]">
              The Tools of Prosperity
            </h3>
          </div>
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
          <p className="text-center text-[15px] text-[#666] -mt-6 mb-10">
            The Everything Project has begun a Crayon drive.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {GALLERY_ALBUMS.map((item) => {
              const figure = (
                <figure className="overflow-hidden rounded-lg">
                  <img
                    src={assetPath(`/images/theeverythingproject/gallery/${item.cover}`)}
                    alt={item.label}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                  <figcaption className="mt-2 text-[14px] font-[600] text-[#333] text-center">
                    {item.label}
                    {item.href && (
                      <span className="block text-[13px] text-[#ff6900]">View album &rarr;</span>
                    )}
                  </figcaption>
                </figure>
              )
              return item.href ? (
                <Link key={item.label} href={item.href} className="block rounded-lg">
                  {figure}
                </Link>
              ) : (
                <div key={item.label}>{figure}</div>
              )
            })}
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

      <section id="video" className="bg-[#f7f7f5]">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2
            className="text-[28px] md:text-[32px] font-[700] text-[#111827] mb-8 text-center"
            id="aria-font"
          >
            Christmas at JVA Orphanage
          </h2>
          <LiteYouTubeEmbed
            videoId="eNO83azoVyk"
            title="Christmas at JVA Orphanage"
            thumbnail={assetPath('/images/theeverythingproject/jva-christmas-video.jpg')}
          />
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
