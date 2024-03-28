'use client'

import { APIProvider } from '@vis.gl/react-google-maps';
import { CurrentPlaceContext, PlacesContext } from '@/app/contexts';
import { nearbyData } from '@/app/data';
import { Analytics } from '@vercel/analytics/react';
import { useEffect, useMemo, useState } from 'react';
import { INearby } from '../types';
import { isStorageSupported } from '../swSupport';

const isDev = !!process && process.env.NODE_ENV === 'development';

export default function Providers({ children }: React.PropsWithChildren) {
    const token = process.env.MAPS_TOKEN || '';

    return (
        <PlacesProvider>
            <CurrentPlaceContext.Provider value={{ place: undefined, setPlace: () => { } }}>
                <APIProvider apiKey={token}>
                    <Analytics />
                    {children}
                </APIProvider>
            </CurrentPlaceContext.Provider>
        </PlacesProvider>
    )
}

const PlacesProvider = ({ children }: any) => {
    const defaultPlaces: INearby[] = isDev ? nearbyData : [];
    const [places, setPlaces] = useState<INearby[]>([])
    const hasSotrage = useState(isStorageSupported())

    useEffect(() => {
        console.warn('[providers] Initializing places provider')

        if (hasSotrage) {
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
        const newPlace: INearby = {
            id: place.id,
            text: place.text,
            place_name: place.place_name,
            center: place.center,
            properties: place.properties,
        }
        setPlaces([...places, newPlace])

        // Persist locally
        if (hasSotrage) localStorage.setItem('tonari_places', JSON.stringify([...places, newPlace]))
    }

    const updatePlace = (place: INearby) => {
        console.info('[context] Updating place')
        const upPlace: INearby = {
            id: place.id,
            text: place.text,
            place_name: place.place_name,
            center: place.center,
            properties: place.properties,
        }

        places.filter((p) => {
            if (p.id === place.id) {
                p = upPlace
                setPlaces([...places])

                if (hasSotrage) localStorage.setItem('tonari_places', JSON.stringify([...places]))
            }
        })
    }

    return (
        <PlacesContext.Provider value={{ places, savePlace, updatePlace }}>
            {children}
        </PlacesContext.Provider>
    )
}
