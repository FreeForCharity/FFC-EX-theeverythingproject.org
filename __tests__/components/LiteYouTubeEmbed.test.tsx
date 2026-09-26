import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import LiteYouTubeEmbed from '../../src/components/home-page/LiteYouTubeEmbed'

const props = {
  videoId: 'eNO83azoVyk',
  title: 'Christmas at JVA Orphanage',
  thumbnail: '/images/theeverythingproject/jva-christmas-video.jpg',
}

describe('LiteYouTubeEmbed component', () => {
  it('shows a local thumbnail and no iframe before a click', () => {
    const { container } = render(<LiteYouTubeEmbed {...props} />)
    expect(
      screen.getByRole('button', { name: 'Play video: Christmas at JVA Orphanage' })
    ).toBeInTheDocument()
    expect(container.querySelector('img')).toHaveAttribute('src', props.thumbnail)
    expect(container.querySelector('iframe')).toBeNull()
  })

  it('loads the privacy-enhanced YouTube player on click', () => {
    render(<LiteYouTubeEmbed {...props} />)
    fireEvent.click(screen.getByRole('button', { name: /Play video/ }))
    const iframe = screen.getByTitle('Christmas at JVA Orphanage')
    expect(iframe).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/eNO83azoVyk?autoplay=1'
    )
    expect(screen.queryByRole('button', { name: /Play video/ })).toBeNull()
  })
})
