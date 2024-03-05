'use client'

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Map as GMap } from '@vis.gl/react-google-maps';
import { isGeoSupported, isStorageSupported } from '../../swSupport';

import Neighbor from '../neighbor';
import { PlacesContext } from '../../contexts';

export default function Map() {
    const myPlaces = useContext<any>(PlacesContext)

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
            handleClick={() => console.info('Clicked: user location')}
            color="blue"
            extraClass='animate-bounce'
            content="私"
        />)
    }, [position]);

    const pins = useMemo(() => {
        if (!myPlaces) return;
        return myPlaces.map((restaurant: any, index: number) => {
            console.info('[nearby] Rendering pins')
            const { text, properties, center, place_name } = restaurant

            const address = place_name
            const latitude = center[1]
            const longitude = center[0]

            const id = `${address.replaceAll(' ', '')}` || `neighbor-${latitude}-${longitude}`

            return (<Neighbor id={id} key={id} latitude={latitude} longitude={longitude} handleClick={() => console.info('Clicked: ' + id)} />)
        })
    }, [myPlaces]
    );

    return (
        <GMap id={'map'} mapId={'bf51a910020fa25a'} defaultCenter={center} defaultZoom={16} gestureHandling={"greedy"} minZoom={14} maxZoom={22} disableDefaultUI fullscreenControl={false}>
            {userMarker}
            {pins}
        </GMap>
    )
}