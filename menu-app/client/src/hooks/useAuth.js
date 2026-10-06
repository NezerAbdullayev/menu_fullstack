import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout as logoutAction, selectAdmin, selectToken } from '../features/auth/authSlice'
import { useLoginMutation, useMeQuery } from '../features/api/apiSlice'

/**
 * { token, admin, isAuthenticated, checking, login(email, password), logout() }
 * Səhifə yenilənəndə token varsa admin məlumatı /auth/me ilə bərpa olunur.
 */
export function useAuth() {
  const dispatch = useDispatch()
  const token = useSelector(selectToken)
  const admin = useSelector(selectAdmin)
  const [loginMutation] = useLoginMutation()

  const { isUninitialized, isLoading } = useMeQuery(undefined, { skip: !token || Boolean(admin) })
  const checking = Boolean(token) && !admin && (isUninitialized || isLoading)

  const login = useCallback(
    (email, password) => loginMutation({ email, password }).unwrap(),
    [loginMutation],
  )
  const logout = useCallback(() => dispatch(logoutAction()), [dispatch])

  return { token, admin, isAuthenticated: Boolean(token), checking, login, logout }
}

export default useAuth
