import axios, { type AxiosError } from 'axios'
import { toast } from '@/shared/components/Toast/toastStore'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean
  }
}

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

// ── Response interceptor with System-Wide Toast Error Handling ────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const config = error.config

    // Allow callers to suppress toast notifications for custom handled requests
    if (!config?.skipErrorToast) {
      if (!error.response) {
        // Network timeout or offline state
        toast.error('Lỗi kết nối mạng', {
          description:
            error.code === 'ECONNABORTED'
              ? 'Yêu cầu máy chủ đã hết thời gian chờ (Timeout). Vui lòng thử lại.'
              : 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối Internet của bạn.',
        })
      } else {
        const status = error.response.status
        const serverMsg =
          error.response.data?.message ||
          error.response.data?.error ||
          (typeof error.response.data === 'string' ? error.response.data : undefined)

        switch (status) {
          case 400:
            toast.error('Yêu cầu không hợp lệ', {
              description:
                serverMsg ?? 'Thông tin cung cấp không đúng quy cách hoặc thiếu trường bắt buộc.',
            })
            break

          case 401:
            toast.warning('Phiên đăng nhập hết hạn', {
              description: 'Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống IELTS Hồ Thành.',
            })
            // 🔌 WIRE: Trigger auth logout or refresh token logic
            break

          case 403:
            toast.error('Từ chối quyền truy cập', {
              description:
                serverMsg ?? 'Tài khoản học viên của bạn không có quyền thực hiện thao tác này.',
            })
            break

          case 404:
            toast.error('Không tìm thấy tài nguyên', {
              description:
                serverMsg ?? 'Bài học, tài liệu hoặc dữ liệu bạn yêu cầu hiện không tồn tại.',
            })
            break

          case 429:
            toast.warning('Thao tác quá nhanh', {
              description: 'Bạn đang gửi quá nhiều yêu cầu. Vui lòng đợi trong giây lát.',
            })
            break

          case 500:
          case 502:
          case 503:
          case 504:
            toast.error('Lỗi hệ thống máy chủ', {
              description:
                'Máy chủ IELTS Hồ Thành đang bảo trì hoặc gặp sự cố tạm thời. Vui lòng thử lại sau.',
            })
            break

          default:
            toast.error('Đã xảy ra lỗi không xác định', {
              description:
                serverMsg ?? `Mã lỗi: ${status}. Vui lòng liên hệ ban học vụ để được hỗ trợ.`,
            })
            break
        }
      }
    }

    return Promise.reject(error)
  },
)
