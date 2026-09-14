import { useQuery } from '@tanstack/react-query'
import { courseService } from '@/services/courseService'
import { queryKeys } from '@/lib/queryKeys'
import type { StudentGlobalProgress, CourseCard } from '@/types/api.types'

export const useGlobalDashboard = () => {
  const progressQuery = useQuery<StudentGlobalProgress>({
    queryKey: queryKeys.dashboard.globalProgress(),
    queryFn: () => courseService.getStudentGlobalProgress(),
    staleTime: 5 * 60 * 1000,
  })

  const coursesQuery = useQuery<CourseCard[]>({
    queryKey: queryKeys.courses.active(),
    queryFn: () => courseService.getActiveCourses(),
    staleTime: 5 * 60 * 1000,
  })

  return {
    progress: progressQuery.data,
    courses: coursesQuery.data ?? [],
    isLoading: progressQuery.isLoading || coursesQuery.isLoading,
    isError: progressQuery.isError || coursesQuery.isError,
  }
}
