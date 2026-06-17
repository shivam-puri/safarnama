import apiClient from './api-client'

// Normalize MongoDB _id to id for frontend compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeId(obj: any): any {
  if (Array.isArray(obj)) return obj.map(normalizeId)
  if (obj && typeof obj === 'object') {
    const result: any = {}
    for (const key of Object.keys(obj)) {
      result[key] = normalizeId(obj[key])
    }
    if (result._id && !result.id) result.id = result._id
    return result
  }
  return obj
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(r: any) { return normalizeId(r) }

export const publicApi = {
  getDestinations: () =>
    apiClient.get('/api/destinations').then(r => normalize(r.data.data)),
  getDestinationBySlug: (slug: string) =>
    apiClient.get(`/api/destinations/${slug}`).then(r => normalize(r.data.data)),
  getItineraryBySlug: (slug: string) =>
    apiClient.get(`/api/itineraries/${slug}`).then(r => normalize(r.data.data)),
  getItineraryPricingData: (id: string) =>
    apiClient.get(`/api/itineraries/${id}/pricing-data`).then(r => normalize(r.data.data)),
  calculatePrice: (payload: object) =>
    apiClient.post('/api/price/calculate', payload).then(r => normalize(r.data.data)),
  createLead: (payload: object) =>
    apiClient.post('/api/leads', payload).then(r => normalize(r.data.data)),
  getReviewsByDestination: (destinationSlug: string) =>
    apiClient.get(`/api/reviews/${destinationSlug}`).then(r => normalize(r.data.data)),
  submitReview: (payload: object) =>
    apiClient.post('/api/reviews', payload).then(r => normalize(r.data.data)),
  getCmsContent: (key: string) =>
    apiClient.get(`/api/cms/${key}`).then(r => normalize(r.data.data)),
  getPublicSettings: () =>
    apiClient.get('/api/settings').then(r => normalize(r.data.data)),
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/api/auth/admin/login', { email, password }).then(r => r.data),
  logout: () =>
    apiClient.post('/api/auth/admin/logout').then(r => r.data),
  me: () =>
    apiClient.get('/api/auth/admin/me').then(r => r.data.data),
}

export const adminApi = {
  getDashboardStats: () =>
    apiClient.get('/api/admin/dashboard/stats').then(r => normalize(r.data.data)),
  getDestinations: (params?: object) =>
    apiClient.get('/api/admin/destinations', { params }).then(r => ({ ...r.data, data: normalize(r.data.data) })),
  getDestination: (id: string) =>
    apiClient.get(`/api/admin/destinations/${id}`).then(r => normalize(r.data.data)),
  createDestination: (data: object) =>
    apiClient.post('/api/admin/destinations', data).then(r => normalize(r.data.data)),
  updateDestination: (id: string, data: object) =>
    apiClient.put(`/api/admin/destinations/${id}`, data).then(r => normalize(r.data.data)),
  deleteDestination: (id: string) =>
    apiClient.delete(`/api/admin/destinations/${id}`).then(r => r.data),
  uploadDestinationImage: (id: string, formData: FormData) =>
    apiClient.post(`/api/admin/destinations/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => normalize(r.data.data)),
  getItineraries: (params?: object) =>
    apiClient.get('/api/admin/itineraries', { params }).then(r => ({ ...r.data, data: normalize(r.data.data) })),
  getItinerary: (id: string) =>
    apiClient.get(`/api/admin/itineraries/${id}`).then(r => normalize(r.data.data)),
  createItinerary: (data: object) =>
    apiClient.post('/api/admin/itineraries', data).then(r => normalize(r.data.data)),
  updateItinerary: (id: string, data: object) =>
    apiClient.put(`/api/admin/itineraries/${id}`, data).then(r => normalize(r.data.data)),
  deleteItinerary: (id: string) =>
    apiClient.delete(`/api/admin/itineraries/${id}`).then(r => r.data),
  updateItineraryStatus: (id: string, data: object) =>
    apiClient.patch(`/api/admin/itineraries/${id}/status`, data).then(r => normalize(r.data.data)),
  getActivities: (params?: object) =>
    apiClient.get('/api/admin/activities', { params }).then(r => ({ ...r.data, data: normalize(r.data.data) })),
  getActivity: (id: string) =>
    apiClient.get(`/api/admin/activities/${id}`).then(r => normalize(r.data.data)),
  createActivity: (data: object) =>
    apiClient.post('/api/admin/activities', data).then(r => normalize(r.data.data)),
  updateActivity: (id: string, data: object) =>
    apiClient.put(`/api/admin/activities/${id}`, data).then(r => normalize(r.data.data)),
  deleteActivity: (id: string) =>
    apiClient.delete(`/api/admin/activities/${id}`).then(r => r.data),
  getHotelCategories: (params?: object) =>
    apiClient.get('/api/admin/hotel-categories', { params }).then(r => ({ ...r.data, data: normalize(r.data.data) })),
  getHotelCategory: (id: string) =>
    apiClient.get(`/api/admin/hotel-categories/${id}`).then(r => normalize(r.data.data)),
  createHotelCategory: (data: object) =>
    apiClient.post('/api/admin/hotel-categories', data).then(r => normalize(r.data.data)),
  updateHotelCategory: (id: string, data: object) =>
    apiClient.put(`/api/admin/hotel-categories/${id}`, data).then(r => normalize(r.data.data)),
  deleteHotelCategory: (id: string) =>
    apiClient.delete(`/api/admin/hotel-categories/${id}`).then(r => r.data),
  getTransportOptions: (params?: object) =>
    apiClient.get('/api/admin/transport-options', { params }).then(r => ({ ...r.data, data: normalize(r.data.data) })),
  getTransportOption: (id: string) =>
    apiClient.get(`/api/admin/transport-options/${id}`).then(r => normalize(r.data.data)),
  createTransportOption: (data: object) =>
    apiClient.post('/api/admin/transport-options', data).then(r => normalize(r.data.data)),
  updateTransportOption: (id: string, data: object) =>
    apiClient.put(`/api/admin/transport-options/${id}`, data).then(r => normalize(r.data.data)),
  deleteTransportOption: (id: string) =>
    apiClient.delete(`/api/admin/transport-options/${id}`).then(r => r.data),
  getLeads: (params?: object) =>
    apiClient.get('/api/admin/leads', { params }).then(r => ({ ...r.data, data: normalize(r.data.data) })),
  getLead: (id: string) =>
    apiClient.get(`/api/admin/leads/${id}`).then(r => normalize(r.data.data)),
  updateLeadStatus: (id: string, status: string) =>
    apiClient.patch(`/api/admin/leads/${id}/status`, { status }).then(r => normalize(r.data.data)),
  addLeadNote: (id: string, text: string) =>
    apiClient.post(`/api/admin/leads/${id}/notes`, { text }).then(r => normalize(r.data.data)),
  assignLead: (id: string, assignedTo: string) =>
    apiClient.patch(`/api/admin/leads/${id}/assign`, { assignedTo }).then(r => normalize(r.data.data)),
  getReviews: (params?: object) =>
    apiClient.get('/api/admin/reviews', { params }).then(r => ({ ...r.data, data: normalize(r.data.data) })),
  updateReviewStatus: (id: string, status: string, adminNote?: string) =>
    apiClient.patch(`/api/admin/reviews/${id}/status`, { status, adminNote }).then(r => normalize(r.data.data)),
  toggleReviewFeatured: (id: string) =>
    apiClient.patch(`/api/admin/reviews/${id}/feature`, {}).then(r => normalize(r.data.data)),
  getAllCmsContent: () =>
    apiClient.get('/api/admin/cms').then(r => ({ ...r.data, data: normalize(r.data.data) })),
  getCmsContent: () =>
    apiClient.get('/api/admin/cms').then(r => ({ ...r.data, data: normalize(r.data.data) })),
  getCmsContentByKey: (key: string) =>
    apiClient.get(`/api/admin/cms/${key}`).then(r => normalize(r.data.data)),
  updateCmsContent: (key: string, content: string) =>
    apiClient.put(`/api/admin/cms/${key}`, { content }).then(r => normalize(r.data.data)),
  getSettings: () =>
    apiClient.get('/api/admin/settings').then(r => ({ ...r.data, data: normalize(r.data.data) })),
  updateSetting: (key: string, value: unknown) =>
    apiClient.put(`/api/admin/settings/${key}`, { value }).then(r => normalize(r.data.data)),
  updateSettings: (settings: { key: string; value: unknown }[]) =>
    apiClient.put('/api/admin/settings', { settings }).then(r => normalize(r.data.data)),
}
