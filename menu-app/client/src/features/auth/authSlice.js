import { createSlice } from '@reduxjs/toolkit'

export const TOKEN_KEY = 'menu_token'

export function loadToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function saveToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // localStorage əlçatan deyil, səssiz keç
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: loadToken(), admin: null },
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.token
      state.admin = action.payload.admin || null
    },
    setAdmin(state, action) {
      state.admin = action.payload || null
    },
    logout(state) {
      state.token = null
      state.admin = null
    },
  },
})

export const { setCredentials, setAdmin, logout } = authSlice.actions

export const selectToken = (state) => state.auth.token
export const selectAdmin = (state) => state.auth.admin

export default authSlice.reducer
