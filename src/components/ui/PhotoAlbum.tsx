'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { assetPath } from '@/lib/assetPath'

type Photo = { src: string; alt: string }

export default function PhotoAlbum({ photos }: { photos: readonly Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)

  const close = useCallback(() => {
    setOpenIndex(null)
    openerRef.current?.focus()
  }, [])
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length]
  )

  useEffect(() => {
    if (openIndex === null) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openIndex, close, step])

  const current = openIndex === null ? null : photos[openIndex]

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`Open ${photo.alt}`}
            className="overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6900]"
            onClick={(e) => {
              openerRef.current = e.currentTarget
              setOpenIndex(i)
            }}
          >
            <img
              src={assetPath(photo.src)}
              alt={photo.alt}
              className="w-full h-32 sm:h-36 object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {current && openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <img
            src={assetPath(current.src)}
            alt={current.alt}
            className="max-h-[85vh] max-w-full object-contain"
          />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[14px] text-white">
            {openIndex + 1} / {photos.length}
          </p>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-2 text-white hover:bg-white/20"
            onClick={close}
          >
            <X size={28} />
          </button>
          <button
            type="button"
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/20"
            onClick={() => step(-1)}
          >
            <ChevronLeft size={36} />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/20"
            onClick={() => step(1)}
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </>
  )
}
