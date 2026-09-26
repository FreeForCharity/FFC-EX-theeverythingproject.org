import localFont from 'next/font/local'

export const openSans = localFont({
  src: '../fonts/open-sans-400-800.woff2',
  display: 'swap',
  variable: '--font-open-sans',
  weight: '400 800',
})

export const lato = localFont({
  src: [
    { path: '../fonts/lato-400.woff2', weight: '400' },
    { path: '../fonts/lato-700.woff2', weight: '700' },
  ],
  display: 'swap',
  variable: '--font-lato',
})

export const raleway = localFont({
  src: '../fonts/raleway-400-700.woff2',
  display: 'swap',
  variable: '--font-raleway',
  preload: false,
  weight: '400 700',
})

export const faustina = localFont({
  src: '../fonts/faustina-400-700.woff2',
  display: 'swap',
  variable: '--font-faustina',
  weight: '400 700',
})

export const cantataOne = localFont({
  src: '../fonts/cantata-one-400.woff2',
  display: 'swap',
  variable: '--font-cantata-one',
  preload: false,
  weight: '400',
})

export const faunaOne = localFont({
  src: '../fonts/fauna-one-400.woff2',
  display: 'swap',
  variable: '--font-fauna-one',
  preload: false,
  weight: '400',
})

export const montserrat = localFont({
  src: '../fonts/montserrat-400-700.woff2',
  display: 'swap',
  variable: '--font-montserrat',
  preload: false,
  weight: '400 700',
})

export const cinzel = localFont({
  src: '../fonts/cinzel-400-700.woff2',
  display: 'swap',
  variable: '--font-cinzel',
  preload: false,
  weight: '400 700',
})
