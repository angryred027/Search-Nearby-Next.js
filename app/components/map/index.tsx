'use client'

import { useContext, useEffect, useMemo, useState } from 'react';
import { Map as GMap, InfoWindow } from '@vis.gl/react-google-maps';
import { isGeoSupported, isStorageSupported } from '../../swSupport';

import Neighbor from '../neighbor';
import { PlacesContext } from '../../contexts';
import { INearby } from '@/app/types';

export default function Map() {
    const { places } = useContext<any>(PlacesContext)

    const [details, setDetails] = useState<INearby>();
    const [position, setPosition] = useState<GeolocationPosition>();
    const center = useMemo(() => ({ lat: 41.9484424, lng: -87.657913 }), []);

    useEffect(() => {
        const hasRequisite = isGeoSupported();
        const hasOptional = isStorageSupported();

        if (hasRequisite) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.info("[nearby] Geolocation is supported");
                setPosition(position);
            });
        } else {
            console.info("[nearby] Geolocation is not supported");
        }

        if (hasOptional) {
            console.info("[nearby] Storage is supported");
        }

        if (hasOptional) {
            console.info("Storage is supported");
        }
    }, []);

    const userMarker = useMemo(() => {
        if (!position) return;

        const { latitude, longitude } = position?.coords;

        return (<Neighbor id='you-are-here'
            latitude={latitude}
            longitude={longitude}
            color="blue"
            extraClass='animate-bounce'
            content="私"
            handleClick={() => console.info('Clicked: user location')}
        />)
    }, [position]);

    const pins = useMemo(() => {
        if (!places) return;
        return places.map((restaurant: any, index: number) => {
            console.info('[nearby] Rendering pins')
            const { center, place_name } = restaurant

            const address = place_name
            const latitude = center[1]
            const longitude = center[0]

            const id = `${address.replaceAll(' ', '')}` || `neighbor-${latitude}-${longitude}`

            return (<Neighbor id={id} key={id} latitude={latitude} longitude={longitude} handleClick={() => setDetails(restaurant)} />)
        })
    }, [places]);

    const info = useMemo(() => {
        if (!details) return;

        const { text, properties, center, place_name } = details
        console.info(details)

        const address = properties?.address
        const latitude = center[1]
        const longitude = center[0]

        return (
            <InfoWindow position={{ lat: latitude, lng: longitude }} onCloseClick={() => setDetails(undefined)}>
                <div className='inset-10'>
                    <h1 className="text-lg font-bold">{text}</h1>
                    <p className='py-2'>{address}</p>
                </div>
            </InfoWindow>
        )
    }, [details])

    return (
        <GMap id={'map'} mapId={'bf51a910020fa25a'} defaultCenter={center} defaultZoom={16} gestureHandling={"greedy"} minZoom={14} maxZoom={22} disableDefaultUI fullscreenControl={false}>
            {userMarker}
            {pins}
            {info}
        </GMap>
    )
}