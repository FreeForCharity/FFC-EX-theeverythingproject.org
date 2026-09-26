// next/font/local cannot be called outside of Next.js module scope in Jest.
// We verify that the module exports the expected font constants by checking
// the source file structure directly.

import fs from 'fs'
import path from 'path'

const fontsSource = fs.readFileSync(path.join(__dirname, '../../src/lib/fonts.ts'), 'utf8')

describe('lib/fonts', () => {
  it('should export the expected font names', () => {
    const expectedExports = [
      'openSans',
      'lato',
      'raleway',
      'faustina',
      'cantataOne',
      'faunaOne',
      'montserrat',
      'cinzel',
    ]

    for (const name of expectedExports) {
      expect(fontsSource).toContain(`export const ${name}`)
    }
  })

  it('should self-host fonts instead of fetching from Google at build time', () => {
    expect(fontsSource).toContain("from 'next/font/local'")
    expect(fontsSource).not.toContain('next/font/google')
  })

  it('should configure all fonts with swap display', () => {
    expect(fontsSource.match(/display:\s*'swap'/g)).toHaveLength(8)
  })

  it('should point every font at a committed woff2 file', () => {
    const files = [...fontsSource.matchAll(/'\.\.\/fonts\/([\w-]+\.woff2)'/g)].map((m) => m[1])
    expect(files).toHaveLength(9)
    for (const file of files) {
      expect(fs.existsSync(path.join(__dirname, '../../src/fonts', file))).toBe(true)
    }
  })

  it('should set CSS variable for each font', () => {
    const expectedVariables = [
      '--font-open-sans',
      '--font-lato',
      '--font-raleway',
      '--font-faustina',
      '--font-cantata-one',
      '--font-fauna-one',
      '--font-montserrat',
      '--font-cinzel',
    ]

    for (const variable of expectedVariables) {
      expect(fontsSource).toContain(variable)
    }
  })
})
