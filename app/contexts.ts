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
export const PlaceContext = createContext<INearby | null>(null);
export const usePlaceContext = () => {
    const context = useContext(PlaceContext)
    if (context === undefined) {
        throw new Error('usePlaceContext must be used within a PlaceProvider')
    }
    return context
}

export const PlaceDispatchContext = createContext<React.Dispatch<any> | null>(null);
export const usePlaceDispatchContext = () => {
    const context = useContext(PlaceDispatchContext)
    if (context === undefined) {
        throw new Error('usePlaceDispatchContext must be used within a PlaceProvider')
    }
    return context
}