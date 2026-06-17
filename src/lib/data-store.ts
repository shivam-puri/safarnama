import type { Destination } from '../types/destination.types';
import type { Itinerary, HotelCategory, TransportOption, Activity, RoomConfig } from '../types/itinerary.types';
import type { Lead } from '../types/lead.types';
import { STORAGE_KEYS, getItem, setItem } from './storage';

// ─── Review ──────────────────────────────────────────────────────────────────

export interface StoredReview {
  id: string;
  itineraryId: string;
  destinationId: string;
  reviewer: { name: string; city: string; email?: string };
  rating: number;
  title: string;
  body: string;
  travelMonth: string;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  featuredOrder?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CmsContentItem {
  key: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface SiteSetting {
  key: string;
  label: string;
  value: string | number;
  category: 'general' | 'contact' | 'social' | 'financial';
}

// ─── Destinations ──────────────────────────────────────────────────────────

export function getDestinations(): Destination[] {
  return getItem<Destination[]>(STORAGE_KEYS.DESTINATIONS) ?? [];
}

export function saveDestinations(data: Destination[]): void {
  setItem(STORAGE_KEYS.DESTINATIONS, data);
}

export function addDestination(dest: Omit<Destination, 'id'>): Destination {
  const all = getDestinations();
  const newDest: Destination = { ...dest, id: crypto.randomUUID() };
  saveDestinations([...all, newDest]);
  return newDest;
}

export function updateDestination(id: string, updates: Partial<Destination>): Destination {
  const all = getDestinations();
  const idx = all.findIndex(d => d.id === id);
  if (idx === -1) throw new Error(`Destination ${id} not found`);
  const updated = { ...all[idx], ...updates };
  all[idx] = updated;
  saveDestinations(all);
  return updated;
}

export function deleteDestination(id: string): void {
  saveDestinations(getDestinations().filter(d => d.id !== id));
}

// ─── Itineraries ──────────────────────────────────────────────────────────

export function getItineraries(): Itinerary[] {
  return getItem<Itinerary[]>(STORAGE_KEYS.ITINERARIES) ?? [];
}

export function saveItineraries(data: Itinerary[]): void {
  setItem(STORAGE_KEYS.ITINERARIES, data);
}

export function addItinerary(itn: Omit<Itinerary, 'id'>): Itinerary {
  const all = getItineraries();
  const newItn: Itinerary = { ...itn, id: crypto.randomUUID() };
  saveItineraries([...all, newItn]);
  return newItn;
}

export function updateItinerary(id: string, updates: Partial<Itinerary>): Itinerary {
  const all = getItineraries();
  const idx = all.findIndex(i => i.id === id);
  if (idx === -1) throw new Error(`Itinerary ${id} not found`);
  const updated = { ...all[idx], ...updates };
  all[idx] = updated;
  saveItineraries(all);
  return updated;
}

export function deleteItinerary(id: string): void {
  saveItineraries(getItineraries().filter(i => i.id !== id));
}

// ─── Activities ─────────────────────────────────────────────────────────────

export function getActivities(): Activity[] {
  return getItem<Activity[]>(STORAGE_KEYS.ACTIVITIES) ?? [];
}

export function saveActivities(data: Activity[]): void {
  setItem(STORAGE_KEYS.ACTIVITIES, data);
}

export function addActivity(act: Omit<Activity, 'id'>): Activity {
  const all = getActivities();
  const newAct: Activity = { ...act, id: crypto.randomUUID() };
  saveActivities([...all, newAct]);
  return newAct;
}

export function updateActivity(id: string, updates: Partial<Activity>): Activity {
  const all = getActivities();
  const idx = all.findIndex(a => a.id === id);
  if (idx === -1) throw new Error(`Activity ${id} not found`);
  const updated = { ...all[idx], ...updates };
  all[idx] = updated;
  saveActivities(all);
  return updated;
}

export function deleteActivity(id: string): void {
  saveActivities(getActivities().filter(a => a.id !== id));
}

// ─── Hotel Categories ───────────────────────────────────────────────────────

export function getHotelCategories(): HotelCategory[] {
  return getItem<HotelCategory[]>(STORAGE_KEYS.HOTEL_CATEGORIES) ?? [];
}

export function saveHotelCategories(data: HotelCategory[]): void {
  setItem(STORAGE_KEYS.HOTEL_CATEGORIES, data);
}

export function addHotelCategory(hc: Omit<HotelCategory, 'id'>): HotelCategory {
  const all = getHotelCategories();
  const newHc: HotelCategory = { ...hc, id: crypto.randomUUID() };
  saveHotelCategories([...all, newHc]);
  return newHc;
}

export function updateHotelCategory(id: string, updates: Partial<HotelCategory>): HotelCategory {
  const all = getHotelCategories();
  const idx = all.findIndex(h => h.id === id);
  if (idx === -1) throw new Error(`HotelCategory ${id} not found`);
  const updated = { ...all[idx], ...updates };
  all[idx] = updated;
  saveHotelCategories(all);
  return updated;
}

export function deleteHotelCategory(id: string): void {
  saveHotelCategories(getHotelCategories().filter(h => h.id !== id));
}

// ─── Room Configs ───────────────────────────────────────────────────────────

export function getRoomConfigs(): RoomConfig[] {
  return getItem<RoomConfig[]>(STORAGE_KEYS.ROOM_CONFIGS) ?? [];
}

// ─── Transport Options ──────────────────────────────────────────────────────

export function getTransportOptions(): TransportOption[] {
  return getItem<TransportOption[]>(STORAGE_KEYS.TRANSPORT_OPTIONS) ?? [];
}

export function saveTransportOptions(data: TransportOption[]): void {
  setItem(STORAGE_KEYS.TRANSPORT_OPTIONS, data);
}

export function addTransportOption(tr: Omit<TransportOption, 'id'>): TransportOption {
  const all = getTransportOptions();
  const newTr: TransportOption = { ...tr, id: crypto.randomUUID() };
  saveTransportOptions([...all, newTr]);
  return newTr;
}

export function updateTransportOption(id: string, updates: Partial<TransportOption>): TransportOption {
  const all = getTransportOptions();
  const idx = all.findIndex(t => t.id === id);
  if (idx === -1) throw new Error(`TransportOption ${id} not found`);
  const updated = { ...all[idx], ...updates };
  all[idx] = updated;
  saveTransportOptions(all);
  return updated;
}

export function deleteTransportOption(id: string): void {
  saveTransportOptions(getTransportOptions().filter(t => t.id !== id));
}

// ─── Leads ──────────────────────────────────────────────────────────────────

export function getLeads(): Lead[] {
  return getItem<Lead[]>(STORAGE_KEYS.LEADS) ?? [];
}

export function saveLeads(data: Lead[]): void {
  setItem(STORAGE_KEYS.LEADS, data);
}

export function updateLeadStatus(id: string, status: Lead['status']): void {
  const all = getLeads();
  const idx = all.findIndex(l => l.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() };
    saveLeads(all);
  }
}

export function addLeadNote(id: string, text: string): void {
  const all = getLeads();
  const idx = all.findIndex(l => l.id === id);
  if (idx !== -1) {
    const notes = all[idx].notes ?? [];
    all[idx] = {
      ...all[idx],
      notes: [...notes, { text, addedAt: new Date().toISOString() }],
      updatedAt: new Date().toISOString(),
    };
    saveLeads(all);
  }
}

export function addLead(lead: Omit<Lead, 'id' | 'leadNumber' | 'createdAt'>): Lead {
  const all = getLeads();
  const num = String(all.length + 1).padStart(5, '0');
  const newLead: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    leadNumber: `TRP-2026-${num}`,
    createdAt: new Date().toISOString(),
    notes: lead.notes ?? [],
  };
  saveLeads([...all, newLead]);
  return newLead;
}

// ─── Reviews ────────────────────────────────────────────────────────────────

export function getReviews(): StoredReview[] {
  return getItem<StoredReview[]>(STORAGE_KEYS.REVIEWS) ?? [];
}

export function saveReviews(data: StoredReview[]): void {
  setItem(STORAGE_KEYS.REVIEWS, data);
}

export function updateReviewStatus(id: string, status: 'approved' | 'rejected'): void {
  const all = getReviews();
  const idx = all.findIndex(r => r.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() };
    saveReviews(all);
  }
}

export function toggleReviewFeatured(id: string): void {
  const all = getReviews();
  const idx = all.findIndex(r => r.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], isFeatured: !all[idx].isFeatured, updatedAt: new Date().toISOString() };
    saveReviews(all);
  }
}

// ─── CMS Content ────────────────────────────────────────────────────────────

export function getCmsContent(): CmsContentItem[] {
  return getItem<CmsContentItem[]>(STORAGE_KEYS.CMS_CONTENT) ?? [];
}

export function updateCmsContent(key: string, content: string): void {
  const all = getCmsContent();
  const idx = all.findIndex(c => c.key === key);
  if (idx !== -1) {
    all[idx] = { ...all[idx], content, updatedAt: new Date().toISOString() };
    setItem(STORAGE_KEYS.CMS_CONTENT, all);
  }
}

// ─── Site Settings ──────────────────────────────────────────────────────────

export function getSiteSettings(): SiteSetting[] {
  return getItem<SiteSetting[]>(STORAGE_KEYS.SITE_SETTINGS) ?? [];
}

export function updateSiteSetting(key: string, value: string | number): void {
  const all = getSiteSettings();
  const idx = all.findIndex(s => s.key === key);
  if (idx !== -1) {
    all[idx] = { ...all[idx], value };
    setItem(STORAGE_KEYS.SITE_SETTINGS, all);
  }
}

// ─── Helper lookup functions (localStorage-aware) ──────────────────────────

export function getDestinationBySlug(slug: string) {
  return getDestinations().find(d => d.slug === slug);
}

export function getItineraryBySlug(slug: string) {
  return getItineraries().find(i => i.slug === slug);
}

export function getItineraryById(id: string) {
  return getItineraries().find(i => i.id === id);
}

export function getItinerariesByDestination(destinationId: string) {
  return getItineraries().filter(i => i.destinationId === destinationId);
}

export function getActivityById(id: string) {
  return getActivities().find(a => a.id === id);
}

export function getActivitiesByDestination(destinationId: string) {
  return getActivities().filter(a => a.destinationId === destinationId);
}

export function getHotelCategoryById(id: string) {
  return getHotelCategories().find(h => h.id === id);
}

export function getTransportOptionById(id: string) {
  return getTransportOptions().find(t => t.id === id);
}

export function getRoomConfigByType(type: string) {
  return getRoomConfigs().find(r => r.sharingType === type);
}

export function getFeaturedReviews() {
  return getReviews().filter(r => r.isFeatured && r.status === 'approved');
}

export function getReviewsByDestination(destinationId: string) {
  return getReviews().filter(r => r.destinationId === destinationId && r.status === 'approved');
}
