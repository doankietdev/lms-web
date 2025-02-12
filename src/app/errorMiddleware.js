import { resetError, setError } from '@/features/errorSlice'
import { loginWithRedirect } from '@/lib/utils'
import { ERROR_TYPES } from '@/utils/constants'
import { isRejectedWithValue } from '@reduxjs/toolkit'

export const errorMiddleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    store.dispatch(resetError())
    
    const { status } = action.payload || {}

    if (status === 401) {
      return loginWithRedirect()
    }

    if (status === 403) {
      store.dispatch(setError(ERROR_TYPES.ACCESS_DENIED))
    } else if (status === 404) {
      store.dispatch(setError(ERROR_TYPES.NOT_FOUND))
    } else if (status === 500 || status === 'FETCH_ERROR') {
      store.dispatch(setError(ERROR_TYPES.SERVER_ERROR))
    }
  }

  return next(action)
}
