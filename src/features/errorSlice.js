import { createSlice } from '@reduxjs/toolkit'

// type ErrorType = "not_found" | "forbidden" | "server_error" | null;

const initialState = {
  errorType: null
}

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.errorType = action.payload
    },
    resetError: (state) => {
      state.errorType = null
    }
  }
})

export const { setError, resetError } = errorSlice.actions
export default errorSlice.reducer
