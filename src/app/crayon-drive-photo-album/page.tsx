import type { Metadata } from 'next'
import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'
import { siteConfig, siteUrl } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Crayon Drive Photo Album',
  description: `Photos from ${siteConfig.name}'s Crayon Drive.`,
  alternates: { canonical: siteUrl('/crayon-drive-photo-album') },
}

const PHOTO_COUNT = 30

export default function CrayonDrivePhotoAlbumPage() {
  const photos = Array.from({ length: PHOTO_COUNT }, (_, i) => String(i + 1).padStart(2, '0'))

  return (
    <main id="main-content" className="pb-[80px]">
      <section className="bg-[#111827] text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-[32px] md:text-[40px] font-[700]" id="aria-font">
            Crayon Drive Photo Album
          </h1>
          <p className="mt-4 text-[17px] text-gray-200">
            Photos from {siteConfig.name}&apos;s Crayon Drive, supplying school children on Idjwi
            with supplies for the classroom.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((n) => (
            <div key={n} className="overflow-hidden rounded-lg">
              <img
                src={assetPath(`/images/theeverythingproject/crayon-drive/photo-${n}.jpg`)}
                alt={`Crayon Drive photo ${Number(n)}`}
                className="w-full h-32 sm:h-36 object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-block rounded-full border-2 border-[#111827] px-6 py-2.5 text-[15px] font-[700] text-[#111827] hover:bg-[#111827] hover:text-white transition-colors"
          >
            Back to Gallery
          </Link>
        </div>
      </section>
    </main>
  )
}
