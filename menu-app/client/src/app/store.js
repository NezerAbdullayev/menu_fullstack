import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer, { saveToken } from '../features/auth/authSlice'
import { apiSlice } from '../features/api/apiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
})

// Pəncərəyə qayıdanda və internet bərpa olunanda sorğular yenilənir.
setupListeners(store.dispatch)

// Token dəyişəndə localStorage-ə yazılır. Çıxışda admin keşi təmizlənir.
let lastToken = store.getState().auth.token
store.subscribe(() => {
  const { token } = store.getState().auth
  if (token === lastToken) return
  lastToken = token
  saveToken(token)
  if (!token) store.dispatch(apiSlice.util.resetApiState())
})
