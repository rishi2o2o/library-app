import { createContext, useContext, useEffect, useState } from 'react'
import { getToken, removeToken, setToken } from '../utils/auth.js'

const AuthContext = createContext(null)

function decodeToken(token) {
  const payload = JSON.parse(atob(token.split('.')[1]))
  return {
    token,
    userId: payload.user_id
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()

    if (token) {
      try {
        const userData = decodeToken(token)
        setUser(userData)
      } catch (error) {
        removeToken()
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const login = (token) => {
    const userData = decodeToken(token)
    setToken(token)
    setUser(userData)
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

