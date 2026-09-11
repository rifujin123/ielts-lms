/**
 * mocks/index.ts — Mock data toggle.
 * Defaults to TRUE so the portal functions offline with mock data.
 * Set VITE_USE_MOCK=false in .env only when a live backend server is running.
 */

/** Returns true if mock data should be used instead of real API calls (defaults to true). */
export const getMock = (): boolean => import.meta.env.VITE_USE_MOCK !== 'false'
