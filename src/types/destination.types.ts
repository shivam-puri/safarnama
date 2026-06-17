export interface DestinationImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: DestinationImage[];
  location: {
    state: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  tags: string[];
  startingPrice: number;
  itineraryCount: number;
  isActive?: boolean;
}
