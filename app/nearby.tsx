'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import { AdvancedMarker, Map } from '@vis.gl/react-google-maps';
import { isGeoSupported, isStorageSupported } from './swSupport';

import { nearbyData } from './data'
import Neighbor from './neighbor';

export default function Nearby() {
    const nearbyMapRef = useRef<React.JSX.Element>(null);
    const token = process.env.MAPS_TOKEN || '';

    const [position, setPosition] = useState<GeolocationPosition>();
    const center = useMemo(() => ({ lat: 41.9484424, lng: -87.657913 }), []);

    useEffect(() => {
        const hasRequisite = isGeoSupported();
        const hasOptional = isStorageSupported();

        if (hasRequisite) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.info("Geolocation is supported");
                setPosition(position);
            });
        } else {
            console.info("Geolocation is not supported");
        }

        if (hasOptional) {
            console.info("Storage is supported");
        }
    }, []);

    const userMarker = useMemo(() => {
        if (!position) return;

        const { latitude, longitude } = position?.coords;

        return (<Neighbor id='you-are-here' latitude={latitude} longitude={longitude} color="blue" />)
    }, [position]);

    const pins = useMemo(() =>
        nearbyData.map((restaurant, index) => {
            const { text, properties, center, place_name } = restaurant

            const address = place_name
            const latitude = center[1]
            const longitude = center[0]

            const id = `${address.replaceAll(' ', '')} | neighbor-${latitude}-${longitude}`

            return (<Neighbor id={id} key={id} latitude={latitude} longitude={longitude} />)
        }),
        [nearbyData]
    );

    return (
        <Map id={'map'} mapId={'bf51a910020fa25a'} defaultCenter={center} defaultZoom={16} gestureHandling={"greedy"} minZoom={14} maxZoom={22} disableDefaultUI fullscreenControl={false}>
            {userMarker}
            {pins}
        </Map>
    )
}