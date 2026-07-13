import { create } from 'zustand'
import { publicApi } from '../lib/api'

interface SiteSettingsStore {
  showPrices: boolean
  loaded: boolean
  fetch: () => Promise<void>
}

function isTruthy(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1'
  return Boolean(value)
}

export const useSiteSettingsStore = create<SiteSettingsStore>((set, get) => ({
  showPrices: true,
  loaded: false,

  fetch: async () => {
    if (get().loaded) return
    try {
      const settings = await publicApi.getPublicSettings()
      const setting = (settings as any[])?.find?.((s: any) => s.key === 'show_prices')
      set({ showPrices: setting ? isTruthy(setting.value) : true, loaded: true })
    } catch {
      set({ loaded: true })
    }
  },
}))
