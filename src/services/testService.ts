// import { apiClient } from '@/lib/axios'
import { testsMock } from '@/mocks/tests.mock'
import type { OnlineTest } from '@/types/api.types'

export const testService = {
  /**
   * Lấy danh sách bài thi trực tuyến
   */
  getOnlineTests: async (): Promise<OnlineTest[]> => {
    // 🔌 WIRE: GET /api/tests
    // const { data } = await apiClient.get<OnlineTest[]>('/tests')
    // return data
    return testsMock
  },
}
