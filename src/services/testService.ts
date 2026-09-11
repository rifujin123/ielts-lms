import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import { testsMock } from '@/mocks/tests.mock'
import type { OnlineTest } from '@/types/api.types'

export const testService = {
  /**
   * Lấy danh sách bài thi trực tuyến
   */
  getOnlineTests: async (): Promise<OnlineTest[]> => {
    if (getMock()) {
      // 🔌 WIRE: GET /api/tests
      return testsMock
    }
    const { data } = await apiClient.get<OnlineTest[]>('/tests')
    return data
  },
}
