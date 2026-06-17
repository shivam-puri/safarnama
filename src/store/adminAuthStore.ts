import { create } from 'zustand'
import { authApi } from '../lib/api'

interface AdminUser {
  _id: string
  name: string
  email: string
  role: string
}

interface AdminAuthStore {
  user: AdminUser | null
  isLoggedIn: boolean
  loading: boolean
  initialized: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAdminAuthStore = create<AdminAuthStore>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: true,
  initialized: false,

  login: async (email, password) => {
    const result = await authApi.login(email, password)
    set({ user: result.data, isLoggedIn: true, initialized: true })
  },

  logout: async () => {
    await authApi.logout()
    set({ user: null, isLoggedIn: false, initialized: false })
  },

  checkAuth: async () => {
    // Only hit the network once per session — skip if already initialized
    if (get().initialized) return
    try {
      const user = await authApi.me()
      set({ user, isLoggedIn: true, loading: false, initialized: true })
    } catch {
      set({ user: null, isLoggedIn: false, loading: false, initialized: true })
    }
  },
}))
