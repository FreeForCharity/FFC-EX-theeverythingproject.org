import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PhotoAlbum from '@/components/ui/PhotoAlbum'
import { pageMetadata } from '@/lib/siteMetadata'
import { siteConfig } from '@/lib/site.config'
import { GALLERY_ALBUMS, albumPhotos } from '@/lib/galleryAlbums'

const ALBUMS = GALLERY_ALBUMS.filter((a) => a.href === `/gallery/${a.slug}`)

type Params = { album: string }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return ALBUMS.map((a) => ({ album: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { album: slug } = await params
  const album = ALBUMS.find((a) => a.slug === slug)
  if (!album) return {}
  return pageMetadata({
    title: `${album.label} Photo Album`,
    description: `Photos from ${siteConfig.name}'s work with ${album.label}.`,
    path: album.href,
  })
}

export default async function AlbumPage({ params }: { params: Promise<Params> }) {
  const { album: slug } = await params
  const album = ALBUMS.find((a) => a.slug === slug)
  if (!album) notFound()

  return (
    <main id="main-content" className="pb-[80px]">
      <section className="bg-[#111827] text-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-[32px] md:text-[40px] font-[700]" id="aria-font">
            {album.label}
          </h1>
          <p className="mt-4 text-[17px] text-gray-200">
            {album.photoCount} photos from {siteConfig.name}&apos;s work with {album.label}.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-14">
        <PhotoAlbum photos={albumPhotos(album)} />

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
