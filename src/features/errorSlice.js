import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  errorType: null
}

const errorSlice = createSlice({
  name: 'errorSlice',
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
