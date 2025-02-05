import { API_ROOT, API_VERSION } from '@/configs/env'
import { getAccessTokenSilently } from '@/lib/utils'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userLoggedIn } from '../userSlice'

const USER_API = `${API_ROOT}/${API_VERSION}/user`

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
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
    loadUser: builder.query({
      query: () => ({
        url: 'profile',
        method: 'GET'
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled
          dispatch(userLoggedIn({ user: result.data.user }))
        // eslint-disable-next-line no-unused-vars
        } catch (error) { /* empty */ }
      }
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: 'profile/update',
        method: 'PUT',
        body: formData,
        credentials: 'include'
      })
    })
  })
})
export const { useLoadUserQuery, useUpdateUserMutation } = userApi
