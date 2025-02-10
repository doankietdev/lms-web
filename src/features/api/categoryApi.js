import { API_ROOT, API_VERSION } from '@/configs/env'
import { getAccessTokenSilently } from '@/lib/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const CATEGORY_API = `${API_ROOT}/${API_VERSION}/category`

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  tagTypes: ['Refetch_Creator_Category', 'Refetch_Category'],
  baseQuery: fetchBaseQuery({
    baseUrl: CATEGORY_API,
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
    getCategories: builder.query({
      query: () => ({
        url: '/',
        method: 'GET'
      })
    })
  })
})
export const { useGetCategoriesQuery } = categoryApi
