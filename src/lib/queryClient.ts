import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { toast } from '@/shared/components/Toast/toastStore'

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: {
      suppressToast?: boolean
    }
    mutationMeta: {
      suppressToast?: boolean
    }
  }
}

/**
 * Shared TanStack Query client with global cache error handling.
 * Emits animated toast notifications with retry actions.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Skip if explicitly suppressed in query options
      if (query.meta?.suppressToast) return

      // If it's an Axios error, Axios interceptor already handles it
      const isAxios = typeof error === 'object' && error !== null && 'isAxiosError' in error

      if (!isAxios) {
        toast.error('Lỗi tải dữ liệu', {
          description:
            error instanceof Error ? error.message : 'Không thể tải dữ liệu cho học phần này.',
          action: {
            label: 'Thử lại',
            onClick: () => {
              void query.fetch()
            },
          },
        })
      }
    },
  }),

  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.suppressToast) return

      const isAxios = typeof error === 'object' && error !== null && 'isAxiosError' in error

      if (!isAxios) {
        toast.error('Thao tác không thành công', {
          description:
            error instanceof Error ? error.message : 'Đã xảy ra lỗi khi gửi yêu cầu lên hệ thống.',
        })
      }
    },
  }),

  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes — data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes — cache retention
      retry: 2, // retry failed requests twice
      refetchOnWindowFocus: false, // don't refetch on tab switch
    },
    mutations: {
      retry: 0,
    },
  },
})
