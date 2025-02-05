import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { authApi } from '@/features/api/authApi'
import { courseApi } from '@/features/api/courseApi'
import { purchaseApi } from '@/features/api/purchaseApi'
import { courseProgressApi } from '@/features/api/courseProgressApi'
import { userApi } from '@/features/api/userApi'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { categoryApi } from '@/features/api/categoryApi'

const persistConfig = {
  key: "root",
  storage,
  whitelist: ['user']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const appStore = configureStore({
  reducer: persistedReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      categoryApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware,
      courseProgressApi.middleware
    )
})

export const persistor = persistStore(appStore);

// const initializeApp = async () => {
//   await appStore.dispatch(userApi.endpoints.loadUser.initiate({}, { forceRefetch: true }))
// }
// initializeApp()
