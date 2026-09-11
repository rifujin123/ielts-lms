import axios from 'axios'

/**
 * Configured Axios instance for all API calls.
 * Base URL comes from VITE_API_URL env variable.
 *
 * Authentication: add your token injection interceptor here when
 * the backend team confirms the auth mechanism (JWT header / cookie).
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor ───────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // 🔌 WIRE: Inject auth token here when auth mechanism is confirmed
    // const token = localStorage.getItem('auth_token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor ──────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 🔌 WIRE: Handle 401 — redirect to login or refresh token
      console.warn('[API] 401 Unauthorized — redirect to login')
    }
    return Promise.reject(error)
  },
)
