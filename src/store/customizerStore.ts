import { create } from 'zustand'
import { publicApi } from '../lib/api'
import { calculatePrice } from '../lib/pricing-engine'
import type { PriceBreakdown } from '../types/customization.types'

interface PricingData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itinerary: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hotelCategories: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roomConfigs: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transportOptions: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activities: any[]
  gstPercent: number
}

interface CustomizerStore {
  itineraryId: string
  travelerCount: number
  travelMonth: string
  hotelCategoryId: string
  roomSharingType: string
  numberOfRooms: number
  transportOptionId: string
  selectedActivityIds: string[]
  removedActivityIds: string[]
  currentStep: number
  priceBreakdown: PriceBreakdown | null
  pricingData: PricingData | null
  loading: boolean
  error: string | null

  initializeFromItinerary: (itineraryId: string) => Promise<void>
  setTravelerCount: (count: number) => void
  setTravelMonth: (month: string) => void
  setHotelCategory: (id: string) => void
  setRoomSharing: (type: string) => void
  setNumberOfRooms: (n: number) => void
  setTransport: (id: string) => void
  toggleActivity: (id: string) => void
  setStep: (step: number) => void
  recalculate: () => void
  reset: () => void
}

const sharingCapacity: Record<string, number> = { single: 1, double: 2, triple: 3 }

export const useCustomizerStore = create<CustomizerStore>((set, get) => ({
  itineraryId: '',
  travelerCount: 2,
  travelMonth: '',
  hotelCategoryId: '',
  roomSharingType: 'double',
  numberOfRooms: 1,
  transportOptionId: '',
  selectedActivityIds: [],
  removedActivityIds: [],
  currentStep: 1,
  priceBreakdown: null,
  pricingData: null,
  loading: false,
  error: null,

  initializeFromItinerary: async (itineraryId: string) => {
    set({ loading: true, error: null, itineraryId })
    try {
      const data = await publicApi.getItineraryPricingData(itineraryId)
      const { itinerary } = data
      const config = itinerary.customizationConfig

      const includedActivityIds: string[] = []
      for (const day of itinerary.days ?? []) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const a of day.activities ?? []) {
          if (a.isIncluded) includedActivityIds.push(a.activityId?._id ?? a.activityId)
        }
      }

      const defaultRoomSharing = config?.defaultRoomSharingType ?? 'double'
      const defaultTravelerCount = itinerary.minTravelers ?? 2
      const capacity = sharingCapacity[defaultRoomSharing] ?? 2
      const defaultRooms = Math.ceil(defaultTravelerCount / capacity)

      set({
        pricingData: data,
        travelerCount: defaultTravelerCount,
        hotelCategoryId: config?.defaultHotelCategoryId?._id ?? config?.defaultHotelCategoryId ?? '',
        roomSharingType: defaultRoomSharing,
        numberOfRooms: defaultRooms,
        transportOptionId: config?.defaultTransportOptionId?._id ?? config?.defaultTransportOptionId ?? '',
        selectedActivityIds: includedActivityIds,
        removedActivityIds: [],
        currentStep: 1,
        loading: false,
      })
      get().recalculate()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load itinerary'
      set({ error: message, loading: false })
    }
  },

  setTravelerCount: (count) => {
    const { roomSharingType } = get()
    const capacity = sharingCapacity[roomSharingType] ?? 2
    set({ travelerCount: count, numberOfRooms: Math.ceil(count / capacity) })
    get().recalculate()
  },

  setTravelMonth: (month) => { set({ travelMonth: month }); get().recalculate() },
  setHotelCategory: (id) => { set({ hotelCategoryId: id }); get().recalculate() },

  setRoomSharing: (type) => {
    const { travelerCount } = get()
    const capacity = sharingCapacity[type] ?? 2
    set({ roomSharingType: type, numberOfRooms: Math.ceil(travelerCount / capacity) })
    get().recalculate()
  },

  setNumberOfRooms: (n) => { set({ numberOfRooms: n }); get().recalculate() },
  setTransport: (id) => { set({ transportOptionId: id }); get().recalculate() },

  toggleActivity: (id) => {
    const { selectedActivityIds, removedActivityIds, pricingData } = get()
    const itinerary = pricingData?.itinerary
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isIncludedByDefault = itinerary?.days?.some((d: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      d.activities?.some((a: any) => (a.activityId?._id ?? a.activityId) === id && a.isIncluded)
    )

    if (selectedActivityIds.includes(id)) {
      set({
        selectedActivityIds: selectedActivityIds.filter(a => a !== id),
        removedActivityIds: isIncludedByDefault ? [...removedActivityIds, id] : removedActivityIds,
      })
    } else {
      set({
        selectedActivityIds: [...selectedActivityIds, id],
        removedActivityIds: removedActivityIds.filter(a => a !== id),
      })
    }
    get().recalculate()
  },

  setStep: (step) => set({ currentStep: step }),

  recalculate: () => {
    const state = get()
    if (!state.pricingData) return
    try {
      // Normalize _id -> id for pricing engine compatibility
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalize = (obj: any) => obj ? { ...obj, id: obj.id ?? obj._id } : obj
      const pd = state.pricingData
      const normalizedData = {
        itinerary: {
          ...normalize(pd.itinerary),
          customizationConfig: {
            ...pd.itinerary.customizationConfig,
            defaultHotelCategoryId: pd.itinerary.customizationConfig?.defaultHotelCategoryId?._id ?? pd.itinerary.customizationConfig?.defaultHotelCategoryId,
            defaultTransportOptionId: pd.itinerary.customizationConfig?.defaultTransportOptionId?._id ?? pd.itinerary.customizationConfig?.defaultTransportOptionId,
            availableHotelCategoryIds: (pd.itinerary.customizationConfig?.availableHotelCategoryIds ?? []).map((x: any) => x?._id ?? x),
            availableTransportOptionIds: (pd.itinerary.customizationConfig?.availableTransportOptionIds ?? []).map((x: any) => x?._id ?? x),
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          days: (pd.itinerary.days ?? []).map((d: any) => ({
            ...d,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            activities: (d.activities ?? []).map((a: any) => ({
              ...a,
              activityId: a.activityId?._id ?? a.activityId,
            })),
          })),
        },
        hotelCategories: pd.hotelCategories.map(normalize),
        roomConfigs: pd.roomConfigs.map(normalize),
        transportOptions: pd.transportOptions.map(normalize),
        activities: pd.activities.map(normalize),
      }
      const breakdown = calculatePrice(
        {
          itineraryId: state.itineraryId,
          travelerCount: state.travelerCount,
          travelMonth: state.travelMonth,
          hotelCategoryId: state.hotelCategoryId,
          roomSharingType: state.roomSharingType as 'single' | 'double' | 'triple',
          numberOfRooms: state.numberOfRooms,
          transportOptionId: state.transportOptionId,
          selectedActivityIds: state.selectedActivityIds,
          removedActivityIds: state.removedActivityIds,
        },
        normalizedData
      )
      set({ priceBreakdown: breakdown })
    } catch {
      // pricing engine may fail if data not fully loaded yet
    }
  },

  reset: () => set({
    itineraryId: '', travelerCount: 2, travelMonth: '', hotelCategoryId: '',
    roomSharingType: 'double', numberOfRooms: 1, transportOptionId: '',
    selectedActivityIds: [], removedActivityIds: [], currentStep: 1,
    priceBreakdown: null, pricingData: null, loading: false, error: null,
  }),
}))
