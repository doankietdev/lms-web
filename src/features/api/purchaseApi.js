import { API_ROOT, API_VERSION } from '@/configs/env'
import { getAccessTokenSilently } from '@/lib/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const COURSE_PURCHASE_API = `${API_ROOT}/${API_VERSION}/purchase`

export const purchaseApi = createApi({
  reducerPath: 'purchaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: 'include',
    prepareHeaders: async (headers) => {
      try {
        const token = await getAccessTokenSilently()
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
      // eslint-disable-next-line no-unused-vars
      } catch (error) { /* empty */ }
    }
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: '/checkout/create-checkout-session',
        method: 'POST',
        body: { courseId }
      })
    }),
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: 'GET'
      })
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/`,
        method: 'GET'
      })
    })
  })
})

export const {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery
} = purchaseApi
