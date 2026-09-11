// import { apiClient } from '@/lib/axios'
import { roadmapMock } from '@/mocks/roadmap.mock'
import type { RoadmapItem } from '@/types/api.types'

export const roadmapService = {
  /**
   * Lấy danh sách lộ trình cá nhân hóa / theo giai đoạn
   */
  getRoadmapItems: async (): Promise<RoadmapItem[]> => {
    // 🔌 WIRE: GET /api/roadmap
    // const { data } = await apiClient.get<RoadmapItem[]>('/roadmap')
    // return data
    return roadmapMock
  },
}
