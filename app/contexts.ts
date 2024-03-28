import { createContext, useContext, useState } from "react";
import { INearby } from "./types";

// Notifications Context
// Describes the number of notifications
export const NotificationContext = createContext(0)

// Places Context
// Describes an array of saved places
type PlacesContextType = { 
    places: INearby[], 
    savePlace: (places: INearby) => void,
    updatePlace: (places: INearby) => void,
}

export const PlacesContext = createContext<PlacesContextType | null>(null);

export const usePlacesContext = () => {
    const context = useContext(PlacesContext)
    if (context === undefined) {
        throw new Error('usePlacesContext must be used within a PlacesProvider')
    }
    return context
}

// Place Context
// Describes a single place, currently selected
type CurrentPlaceContextType = { 
    place: INearby | undefined, 
    setPlace: (place: INearby) => void,
}
export const CurrentPlaceContext = createContext<CurrentPlaceContextType | null>(null)

export const useCurrentPlaceContext = () => {
    const context = useContext(CurrentPlaceContext)
    if (context === undefined) {
        throw new Error('useCurrentPlaceContext must be used within a CurrentPlaceProvider')
    }
    return context
}