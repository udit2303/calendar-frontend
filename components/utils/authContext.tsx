import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '@/components/utils/authAPI'
import { getCookie, setCookie, deleteCookie } from "cookies-next";
interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) 

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getCookie('token')
      if (token) {
        authApi.verifyToken(token)
          .then(setUser)
          .catch(() => deleteCookie('token'))
          .finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    }
    fetchToken()
  }, [])

  const login = async (email: string, password: string) => {
    const { user, token } = await authApi.login(email, password)
    setCookie('token', token)
    setUser(user)
  }

  const signup = async (email: string, password: string) => {
    const { user, token } = await authApi.signup(email, password)
    setCookie('token', token)
    setUser(user)
  }

  const logout = () => {
    deleteCookie('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
