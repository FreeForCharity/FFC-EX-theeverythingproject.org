import React from 'react'
import fs from 'fs'
import path from 'path'
import { fireEvent, render, screen } from '@testing-library/react'

import PhotoAlbum from '../../src/components/ui/PhotoAlbum'
import { GALLERY_ALBUMS, albumPhotos } from '../../src/lib/galleryAlbums'

const photos = [
  { src: '/a/photo-01.jpg', alt: 'Test photo 1' },
  { src: '/a/photo-02.jpg', alt: 'Test photo 2' },
  { src: '/a/photo-03.jpg', alt: 'Test photo 3' },
]

describe('PhotoAlbum component', () => {
  it('renders one button per photo and no dialog until clicked', () => {
    render(<PhotoAlbum photos={photos} />)
    expect(screen.getAllByRole('button', { name: /^Open Test photo/ })).toHaveLength(3)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the clicked photo in a lightbox and focuses Close', () => {
    render(<PhotoAlbum photos={photos} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open Test photo 2' }))
    expect(screen.getByRole('dialog', { name: 'Test photo 2' })).toBeInTheDocument()
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
  })

  it('shows the full-size image in the lightbox when one is given', () => {
    render(<PhotoAlbum photos={[{ ...photos[0], full: '/a/full/photo-01.jpg' }, photos[1]]} />)
    expect(screen.getByRole('img', { name: 'Test photo 1' })).toHaveAttribute(
      'src',
      '/a/photo-01.jpg'
    )
    fireEvent.click(screen.getByRole('button', { name: 'Open Test photo 1' }))
    const dialog = screen.getByRole('dialog', { name: 'Test photo 1' })
    expect(dialog.querySelector('img')).toHaveAttribute('src', '/a/full/photo-01.jpg')
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }))
    expect(
      screen.getByRole('dialog', { name: 'Test photo 2' }).querySelector('img')
    ).toHaveAttribute('src', '/a/photo-02.jpg')
  })

  it('steps with buttons and arrow keys, wrapping at the ends', () => {
    render(<PhotoAlbum photos={photos} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open Test photo 3' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }))
    expect(screen.getByRole('dialog', { name: 'Test photo 1' })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(screen.getByRole('dialog', { name: 'Test photo 3' })).toBeInTheDocument()
  })

  it('closes on Escape and returns focus to the opener', () => {
    render(<PhotoAlbum photos={photos} />)
    const opener = screen.getByRole('button', { name: 'Open Test photo 1' })
    fireEvent.click(opener)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })
})

describe('PhotoAlbum focus trap', () => {
  it('wraps Tab and Shift+Tab within the lightbox controls', () => {
    render(<PhotoAlbum photos={photos} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open Test photo 1' }))
    const close = screen.getByRole('button', { name: 'Close' })
    const next = screen.getByRole('button', { name: 'Next photo' })
    next.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(close).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(next).toHaveFocus()
  })
})

describe('gallery albums', () => {
  it('ships every photo each album references', () => {
    for (const album of GALLERY_ALBUMS) {
      for (const photo of albumPhotos(album)) {
        expect(fs.existsSync(path.join(__dirname, '../../public', photo.src))).toBe(true)
        if (photo.full) {
          expect(fs.existsSync(path.join(__dirname, '../../public', photo.full))).toBe(true)
        }
      }
    }
  })

  it('gives Crayon Drive full-size originals for its lightbox', () => {
    const crayon = GALLERY_ALBUMS.find((a) => a.slug === 'crayon-drive')!
    expect(albumPhotos(crayon).every((p) => p.full?.startsWith(`${crayon.photoDir}/full/`))).toBe(
      true
    )
  })

  it('links every album so each gallery tile opens its photos', () => {
    expect(GALLERY_ALBUMS).toHaveLength(6)
    for (const album of GALLERY_ALBUMS) {
      expect(album.href).toMatch(/^\/(gallery\/[a-z-]+|crayon-drive-photo-album)$/)
    }
  })
})
