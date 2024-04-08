export interface INearby {
    id: string | undefined;
    name?: string,
    address?: string;
    phone?: string;
    rating?: number;
    priceLevel?: number;
    website?: string;
    center: [number, number];
    isOpen: boolean;
    status?: string;
    hours?: string[]
    description?: string;
    photos?: any[]
    tags?: string[]
  }

export type NearbyContextType = {
    nearbyData: INearby[]
};