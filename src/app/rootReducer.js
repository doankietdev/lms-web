import { authApi } from '@/features/api/authApi'
import { categoryApi } from '@/features/api/categoryApi'
import { courseApi } from '@/features/api/courseApi'
import { courseProgressApi } from '@/features/api/courseProgressApi'
import { purchaseApi } from '@/features/api/purchaseApi'
import { userApi } from '@/features/api/userApi'
import { combineReducers } from '@reduxjs/toolkit'
import errorReducer from '../features/errorSlice'
import userReducer from '../features/userSlice'

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,
  [courseProgressApi.reducerPath]: courseProgressApi.reducer,
  user: userReducer,
  error: errorReducer
})
export default rootReducer
