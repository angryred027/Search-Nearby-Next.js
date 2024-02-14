'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import { AdvancedMarker, Map } from '@vis.gl/react-google-maps';
import { isGeoSupported } from './swSupport';

import { nearbyData } from './data'

export default function Nearby() {
    const nearbyMapRef = useRef<React.JSX.Element>(null);
    const token = process.env.MAPS_TOKEN || '';

    const [position, setPosition] = useState<GeolocationPosition>();
    const center = useMemo(() => ({ lat: 41.9484424, lng: -87.657913 }), []);

    useEffect(() => {
        const hasRequisite = isGeoSupported();

        if (hasRequisite) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.info("Geolocation is supported");
                setPosition(position);
            });
        } else {
            console.info("Geolocation is not supported");
        }
    }, []);

    const userMarker = useMemo(() => {
        if (!position) return;

        const { latitude, longitude } = position?.coords;

        return (
            <AdvancedMarker className='cursor-pointer' key='userMarker' position={{ lat: latitude, lng: longitude }}>
                <span style={{ transform: "translate(${-size / 2}px,${-size}px)" }} className="animate-bounce cursor-pointer inline-flex items-center justify-center px-2 py-2 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">隣</span>
            </AdvancedMarker>
        )
    }, [position]);

    const pins = useMemo(() =>
        nearbyData.map((restaurant, index) => {
            const { text, properties, center, place_name } = restaurant

            // if (!properties?.address) return; // TODO: Is "no address" ever an expected case?
            const address = place_name
            const latitude = center[1]
            const longitude = center[0]

            return (
                <AdvancedMarker className='cursor-pointer' key={`${address.replaceAll(' ', '')}`} position={{ lat: latitude, lng: longitude }}>
                    <span style={{ transform: "translate(${-size / 2}px,${-size}px)" }} className="cursor-pointer inline-flex items-center justify-center px-2 py-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full" title='You are Here!'>隣</span>
                </AdvancedMarker>
            )
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