import { createContext, useContext, useState } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)

  const login = (password) => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAdmin(true)
      return true
    }
    return false
  }

  const logout = () => setIsAdmin(false)

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>')
  return ctx
}
