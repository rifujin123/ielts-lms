import { QueryClient } from '@tanstack/react-query'

/**
 * Shared TanStack Query client.
 * Import this in main.tsx for QueryClientProvider.
 */
export const queryClient = new QueryClient({
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
