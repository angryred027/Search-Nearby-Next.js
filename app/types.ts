export interface INearby {
    id: string;
    text: string;
    place_name: string;
    center: [number, number];
    properties?: {
        address: string;
    }
  }

export type NearbyContextType = {
    nearbyData: INearby[]
};