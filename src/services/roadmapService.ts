import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import { roadmapMock } from '@/mocks/roadmap.mock'
import type { RoadmapItem } from '@/types/api.types'

export const roadmapService = {
  /**
   * Lấy danh sách lộ trình cá nhân hóa / theo giai đoạn
   */
  getRoadmapItems: async (): Promise<RoadmapItem[]> => {
    if (getMock()) {
      // 🔌 WIRE: GET /api/roadmap
      return roadmapMock
    }
    const { data } = await apiClient.get<RoadmapItem[]>('/roadmap')
    return data
  },
}
