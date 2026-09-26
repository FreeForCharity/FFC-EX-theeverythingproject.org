// No top-level import/export: that would turn these into augmentations.
declare module 'jest-axe' {
  export function axe(
    html: Element | Document | string,
    options?: Record<string, unknown>
  ): Promise<unknown>
  export const toHaveNoViolations: Record<string, jest.CustomMatcher>
}

declare module 'jest-axe/extend-expect'
