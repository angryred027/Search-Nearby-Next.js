'use client'

import { APIProvider } from '@vis.gl/react-google-maps';
import { PlacesContext } from '@/app/contexts';
import { nearbyData } from '@/app/data';
import { Analytics } from '@vercel/analytics/react';

export default function Providers({ children }: React.PropsWithChildren) {
    const token = process.env.MAPS_TOKEN || '';

    return (
        <PlacesContext.Provider value={nearbyData}>
            <APIProvider apiKey={token}>
                <Analytics />
                {children}
            </APIProvider>
        </PlacesContext.Provider>
    )
}