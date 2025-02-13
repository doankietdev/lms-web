import { setError } from '@/features/errorSlice'
import { navigate } from '@/lib/utils'
import { ERROR_TYPES } from '@/utils/constants'
import { isRejectedWithValue } from '@reduxjs/toolkit'

export const errorMiddleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {    
    const { status } = action.payload || {}

    if (status === 404) {
      store.dispatch(setError(ERROR_TYPES.NOT_FOUND))
    } else if (status === 'FETCH_ERROR') {
      navigate('/500')
    }
  }

  return next(action)
}
