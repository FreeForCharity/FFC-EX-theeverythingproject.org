import { assetPath } from '@/lib/assetPath'

export type GalleryAlbum = {
  slug: string
  label: string
  cover: string
  photoCount: number
  href: string
  photoDir: string
  fullDir?: string
}

const album = (slug: string, label: string, cover: string, photoCount: number): GalleryAlbum => ({
  slug,
  label,
  cover,
  photoCount,
  href: `/gallery/${slug}`,
  photoDir: assetPath(`/images/theeverythingproject/albums/${slug}`),
})

export const CRAYON_DRIVE_ALBUM: GalleryAlbum = {
  slug: 'crayon-drive',
  label: 'Crayon Drive',
  cover: 'crayon-drive.jpg',
  photoCount: 35,
  href: '/crayon-drive-photo-album',
  photoDir: assetPath('/images/theeverythingproject/crayon-drive'),
  fullDir: assetPath('/images/theeverythingproject/crayon-drive/full'),
}

export const GALLERY_ALBUMS: readonly GalleryAlbum[] = [
  album('idjwi', 'Idjwi', 'idjwi.jpg', 16),
  album('jva', 'JVA', 'jva.jpg', 9),
  album('minova', 'Minova unrecognized refugee camp', 'minova.jpg', 22),
  album('don-bosco', 'Don Bosco', 'don-bosco.jpg', 9),
  album('mweso', 'Mweso', 'mweso.jpg', 25),
  CRAYON_DRIVE_ALBUM,
]

export function albumPhotos(album: GalleryAlbum): { src: string; alt: string; full?: string }[] {
  return Array.from({ length: album.photoCount }, (_, i) => {
    const file = `photo-${String(i + 1).padStart(2, '0')}.jpg`
    return {
      src: `${album.photoDir}/${file}`,
      alt: `${album.label} photo ${i + 1}`,
      ...(album.fullDir && { full: `${album.fullDir}/${file}` }),
    }
  })
}
