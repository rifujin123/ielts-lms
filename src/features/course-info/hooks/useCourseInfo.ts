import { useQuery } from '@tanstack/react-query'
import { courseService } from '@/services/courseService'
import type { CourseInfo } from '../types'

export const useCourseInfo = (courseId: string) => {
  return useQuery<CourseInfo>({
    queryKey: ['course-info', courseId],
    queryFn: () => courseService.getCourseInfo(courseId),
    staleTime: 5 * 60 * 1000,
  })
}
