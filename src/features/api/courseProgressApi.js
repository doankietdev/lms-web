import { API_ROOT, API_VERSION } from '@/configs/env'
import { getAccessTokenSilently } from '@/lib/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const COURSE_PROGRESS_API = `${API_ROOT}/${API_VERSION}/progress`

export const courseProgressApi = createApi({
  reducerPath: 'courseProgressApi',
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: 'include',
    prepareHeaders: async (headers) => {
      const token = await getAccessTokenSilently()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: 'GET'
      })
    }),
    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/view`,
        method: 'POST'
      })
    }),

    completeCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/complete`,
        method: 'POST'
      })
    }),
    inCompleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/incomplete`,
        method: 'POST'
      })
    })
  })
})
export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useInCompleteCourseMutation
} = courseProgressApi
