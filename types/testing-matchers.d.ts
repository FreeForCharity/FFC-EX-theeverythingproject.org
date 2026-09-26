// pnpm's strict layout hides @types/jest from tsc's auto-discovery.
/// <reference types="jest" />

import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R
    }
  }
}
