/**
 * mocks/index.ts — Mock data toggle.
 * Set VITE_USE_MOCK=true in .env to enable mock mode.
 */

/** Returns true if mock data should be used instead of real API calls. */
export const getMock = (): boolean => import.meta.env.VITE_USE_MOCK === 'true'
