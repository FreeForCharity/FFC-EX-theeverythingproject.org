import type { Metadata } from 'next'
import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'
import { siteConfig, siteUrl } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Gallery',
  description: `Photos from ${siteConfig.name}'s programs and communities around Lake Kivu.`,
  alternates: { canonical: siteUrl('/gallery') },
}

type GalleryItem = {
  label: string
  image: string
  href?: string
}

const GALLERY_ITEMS: readonly GalleryItem[] = [
  { label: 'Idjwi', image: 'idjwi.jpg' },
  { label: 'JVA', image: 'jva.jpg' },
  { label: 'Minova unrecognized refugee camp', image: 'minova.jpg' },
  { label: 'Don Bosco', image: 'don-bosco.jpg' },
  { label: 'Mweso', image: 'mweso.jpg' },
  { label: 'Crayon Drive', image: 'crayon-drive.jpg', href: '/crayon-drive-photo-album' },
]

export default function GalleryPage() {
  return (
    <main id="main-content" className="pb-[80px]">
      <section className="bg-[#111827] text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-[32px] md:text-[40px] font-[700]" id="aria-font">
            Our Project Gallery
          </h1>
          <p className="mt-4 text-[17px] text-gray-200">
            A look at the communities and programs {siteConfig.name} works with on Idjwi and around
            Lake Kivu.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => {
            const cardClassName =
              'group block overflow-hidden rounded-xl border border-gray-100 shadow-sm'
            const cardContent = (
              <>
                <img
                  src={assetPath(`/images/theeverythingproject/gallery/${item.image}`)}
                  alt={item.label}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="p-4">
                  <p className="text-[16px] font-[700] text-[#111827]">{item.label}</p>
                  {item.href && (
                    <p className="mt-1 text-[13px] font-[600] text-[#ff6900]">
                      View full album &rarr;
                    </p>
                  )}
                </div>
              </>
            )

            return item.href ? (
              <Link key={item.label} href={item.href} className={cardClassName}>
                {cardContent}
              </Link>
            ) : (
              <div key={item.label} className={cardClassName}>
                {cardContent}
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
