import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null
}

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.user = action.payload.user
    },
    userLoggedOut: (state) => {
      state.user = null
    }
  }
})

export const { userLoggedIn, userLoggedOut } = userSlice.actions
export default userSlice.reducer
