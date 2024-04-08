'use client'

import { APIProvider } from '@vis.gl/react-google-maps';
import { PlacesContext, PlaceContext, PlaceDispatchContext } from '@/app/contexts';
import { nearbyData } from '@/app/data';
import { Analytics } from '@vercel/analytics/react';
import { useEffect, useReducer, useState } from 'react';
import { INearby } from '../types';
import { isStorageSupported } from '../swSupport';
import { placeReducer } from '../store/placeReducer';

const isDev = !!process && process.env.NODE_ENV === 'development';

export default function Providers({ children }: React.PropsWithChildren) {
    const token = process.env.MAPS_TOKEN || '';
    const [place, dispatch] = useReducer<React.Reducer<any, any>>(placeReducer, null);

    return (
        <PlacesProvider>
            <PlaceContext.Provider value={place}>
                <PlaceDispatchContext.Provider value={dispatch}>
                    <APIProvider apiKey={token}>
                        <Analytics />
                        {children}
                    </APIProvider>
                </PlaceDispatchContext.Provider>
            </PlaceContext.Provider>
        </PlacesProvider>
    )
}

const PlacesProvider = ({ children }: any) => {
    const defaultPlaces: INearby[] = isDev ? nearbyData : [];
    const [places, setPlaces] = useState<INearby[]>([])
    const hasStorage = useState(isStorageSupported())

    useEffect(() => {
        console.warn('[providers] Initializing places provider')

        if (hasStorage) {
            const cache = localStorage.getItem('tonari_places')
            if (cache) {
                const parsed = JSON.parse(cache)
                console.info(`[providers] Found ${parsed.length} places in cache`)
                setPlaces(parsed)
            } else {
                console.info('[providers] No places found in cache, created default')
                localStorage.setItem('tonari_places', JSON.stringify(defaultPlaces))
            }
        }
    }, [])

    const savePlace = (place: INearby) => {
        console.info('[context] Saving place')
        const newPlace: INearby = place;
        setPlaces([...places, newPlace])

        // Persist locally
        if (hasStorage) localStorage.setItem('tonari_places', JSON.stringify([...places, newPlace]))
    }

    const updatePlace = (place: INearby) => {
        console.info('[context] Updating place')
        const upPlace: INearby = place;

        places.filter((p) => {
            if (p.id === place.id) {
                p = upPlace
                setPlaces([...places])
                debugger;

                if (hasStorage) localStorage.setItem('tonari_places', JSON.stringify([...places]))
            }
        })
    }

    return (
        <PlacesContext.Provider value={{ places, savePlace, updatePlace }}>
            {children}
        </PlacesContext.Provider>
    )
}
