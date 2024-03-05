'use client'

import Map from '@/app/components/map';
import Notify from '@/app/components/notify';
import Search from '@/app/components/search';
import { APIProvider } from '@vis.gl/react-google-maps';
import { PlacesContext } from '@/app/contexts';
import { nearbyData } from '@/app//data';

export default function Nearby() {
    const token = process.env.MAPS_TOKEN || '';

    return (
        <PlacesContext.Provider value={nearbyData}>
            <APIProvider apiKey={token}>
                <div className="absolute z-10 w-full justify-center flex flex-row gap-4 top-20 justify-center">
                    <div className="max-w-prose px-4 flex flex-row flex-grow gap-4">
                        <div className="flex-grow">
                            <Search />
                        </div>
                        <Notify />
                    </div>
                </div>
                <div className="w-dvw h-dvh">
                    <Map />
                </div>
            </APIProvider>
        </PlacesContext.Provider>
    )
}