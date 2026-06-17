export const STORAGE_KEYS = {
  AUTH: 'admin_auth',
  DESTINATIONS: 'data_destinations',
  ITINERARIES: 'data_itineraries',
  ACTIVITIES: 'data_activities',
  HOTEL_CATEGORIES: 'data_hotel_categories',
  ROOM_CONFIGS: 'data_room_configs',
  TRANSPORT_OPTIONS: 'data_transport_options',
  LEADS: 'data_leads',
  REVIEWS: 'data_reviews',
  CMS_CONTENT: 'data_cms_content',
  SITE_SETTINGS: 'data_site_settings',
} as const;

export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to write to localStorage', key);
  }
}

export function initializeIfEmpty<T>(key: string, defaultValue: T): T {
  const existing = getItem<T>(key);
  if (existing !== null) return existing;
  setItem(key, defaultValue);
  return defaultValue;
}
