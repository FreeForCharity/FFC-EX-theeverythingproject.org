import React from 'react'
import { render, screen } from '@testing-library/react'

import HomePage from '../../src/app/home-page'

describe('HomePage (app/home-page)', () => {
  it('should render without crashing', () => {
    render(<HomePage />)
  })

  it('should render the mission heading and hero call-to-actions', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'The Everything Project' })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Our Mission' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Donate' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Volunteer' }).length).toBeGreaterThan(0)
  })

  it('should render the program areas', () => {
    render(<HomePage />)
    for (const program of ['Education', 'Cultivation', 'Infrastructure', 'Quality of Life']) {
      expect(screen.getByText(program)).toBeInTheDocument()
    }
  })

  it('should render the JVA orphanage video as a click-to-play embed', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Christmas at JVA Orphanage' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Play video: Christmas at JVA Orphanage' })
    ).toBeInTheDocument()
  })

  it('should render the project gallery preview with a link to the full gallery', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: 'Our Project Gallery' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Full Gallery' })).toHaveAttribute(
      'href',
      '/gallery'
    )
  })

  it('should link the Crayon Drive preview to its photo album', () => {
    render(<HomePage />)
    expect(screen.getByRole('link', { name: /Crayon Drive/ })).toHaveAttribute(
      'href',
      '/crayon-drive-photo-album'
    )
  })
})
