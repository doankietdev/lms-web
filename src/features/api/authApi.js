import { API_ROOT, API_VERSION } from '@/configs/env'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userLoggedIn } from '../userSlice'

const AUTH_API = `${API_ROOT}/${API_VERSION}/auth`

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: AUTH_API,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    authCallback: builder.mutation({
      query: ({ token, ...userData }) => ({
        url: '/callback',
        method: 'POST',
        body: userData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled
          dispatch(userLoggedIn({ user: result.data.user }))
        } catch (error) {
          console.log(error)
        }
      }
    })
  })
})
export const { useAuthCallbackMutation } = authApi
