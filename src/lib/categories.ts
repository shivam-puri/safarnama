import {
  PiggyBank,
  Home,
  Sparkles,
  Mountain,
  Heart,
  GraduationCap,
  Briefcase,
  Leaf,
  Footprints,
  Users2,
  Compass,
  type LucideIcon,
} from 'lucide-react';

export type ItineraryCategory =
  | 'budget'
  | 'family'
  | 'luxury'
  | 'adventure'
  | 'honeymoon'
  | 'school_trip'
  | 'corporate'
  | 'senior_citizen'
  | 'solo'
  | 'friends';

export interface CategoryMeta {
  value: ItineraryCategory;
  label: string;
  badgeVariant: 'primary' | 'accent' | 'success' | 'warning' | 'category';
  gradient: string;
  color: string;
  icon: LucideIcon;
}

export const CATEGORY_META: CategoryMeta[] = [
  { value: 'budget', label: 'Budget', badgeVariant: 'success', gradient: 'linear-gradient(135deg, #6BAE8E 0%, #4D9070 100%)', color: '#4D9070', icon: PiggyBank },
  { value: 'family', label: 'Family', badgeVariant: 'primary', gradient: 'linear-gradient(135deg, #5B7FA6 0%, #3D6089 100%)', color: '#3D6089', icon: Home },
  { value: 'luxury', label: 'Luxury', badgeVariant: 'category', gradient: 'linear-gradient(135deg, #8B6FBE 0%, #614E9F 100%)', color: '#614E9F', icon: Sparkles },
  { value: 'adventure', label: 'Adventure', badgeVariant: 'accent', gradient: 'linear-gradient(135deg, #E8643C 0%, #C44D27 100%)', color: '#C44D27', icon: Mountain },
  { value: 'honeymoon', label: 'Honeymoon', badgeVariant: 'warning', gradient: 'linear-gradient(135deg, #F4A261 0%, #E87D32 100%)', color: '#E87D32', icon: Heart },
  { value: 'school_trip', label: 'School', badgeVariant: 'primary', gradient: 'linear-gradient(135deg, #4FA5C4 0%, #2F7E9C 100%)', color: '#2F7E9C', icon: GraduationCap },
  { value: 'corporate', label: 'Corporate', badgeVariant: 'category', gradient: 'linear-gradient(135deg, #6E7B8B 0%, #4C5866 100%)', color: '#4C5866', icon: Briefcase },
  { value: 'senior_citizen', label: 'Senior Citizen', badgeVariant: 'success', gradient: 'linear-gradient(135deg, #8AA35C 0%, #6C8746 100%)', color: '#6C8746', icon: Leaf },
  { value: 'solo', label: 'Solo', badgeVariant: 'accent', gradient: 'linear-gradient(135deg, #C4795E 0%, #A15C43 100%)', color: '#A15C43', icon: Footprints },
  { value: 'friends', label: 'Friends', badgeVariant: 'accent', gradient: 'linear-gradient(135deg, #D4A24C 0%, #B5822F 100%)', color: '#B5822F', icon: Users2 },
];

export const FEATURED_CATEGORY_VALUES: ItineraryCategory[] = [
  'school_trip',
  'friends',
  'adventure',
  'honeymoon',
  'family',
  'corporate',
];

export const FEATURED_CATEGORIES: CategoryMeta[] = FEATURED_CATEGORY_VALUES.map(
  value => CATEGORY_META.find(c => c.value === value)!
);

export const CATEGORY_MAP: Record<string, CategoryMeta> = CATEGORY_META.reduce((acc, c) => {
  acc[c.value] = c;
  return acc;
}, {} as Record<string, CategoryMeta>);

export function getCategoryMeta(category: string): CategoryMeta {
  return CATEGORY_MAP[category] ?? { value: category as ItineraryCategory, label: category, badgeVariant: 'primary', gradient: 'linear-gradient(135deg, #8A7060 0%, #5C4A3A 100%)', color: '#5C4A3A', icon: Compass };
}
