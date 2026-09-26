import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import HomePage from '../../src/app/page'
import DonationPage from '../../src/app/donation/page'
import VolunteerPage from '../../src/app/volunteer/page'
import ContactUsPage from '../../src/app/contact-us/page'
import GalleryPage from '../../src/app/gallery/page'
import CrayonDrivePhotoAlbumPage from '../../src/app/crayon-drive-photo-album/page'

expect.extend(toHaveNoViolations)

const ROUTES: [string, React.ComponentType][] = [
  ['/', HomePage],
  ['/donation', DonationPage],
  ['/volunteer', VolunteerPage],
  ['/contact-us', ContactUsPage],
  ['/gallery', GalleryPage],
  ['/crayon-drive-photo-album', CrayonDrivePhotoAlbumPage],
]

describe('charity routes accessibility', () => {
  it.each(ROUTES)('%s should not have accessibility violations', async (_route, Page) => {
    const { container } = render(<Page />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
