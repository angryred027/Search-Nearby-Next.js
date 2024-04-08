'use client'

import { useContext, useEffect, useMemo, useState } from 'react';
import { Map as GMap, InfoWindow } from '@vis.gl/react-google-maps';
import { isGeoSupported, isStorageSupported } from '../../swSupport';

import Neighbor from '../neighbor';
import { PlacesContext, usePlaceDispatchContext } from '../../contexts';
import { INearby } from '@/app/types';

export default function Map() {
    const { places } = useContext<any>(PlacesContext)
    const dispatch = usePlaceDispatchContext()!;

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
        return places.map((place: INearby, index: number) => {
            console.info('[nearby] Rendering pins')
            try {
                const { center, address } = place

                const latitude = center[1]
                const longitude = center[0]

                const id = address ? `${address.replaceAll(' ', '')}` : `neighbor-${latitude}-${longitude}`

                const color = place.tags?.includes('visited') ? 'yellow' : 'red'

                return (<Neighbor id={id} key={id} latitude={latitude} longitude={longitude} handleClick={() => handlePlaceClick(place)} color={color} />)
            } catch (e) {
                console.warn('[nearby] Error rendering pin: ' + place.name)
                console.warn(e)
            }

            return null;
        })
    }, [places]);

    const handlePlaceClick = (place: INearby) => {
        // TODO: should be a ref?
        const map = document.getElementById('tonari-map')

        if (!map) return;

        dispatch({ type: 'SET_PLACE', payload: place });
    }

    return (
        <GMap id={'tonari-map'} mapId={'bf51a910020fa25a'} defaultCenter={center} defaultZoom={16} gestureHandling={"greedy"} minZoom={14} maxZoom={22} disableDefaultUI fullscreenControl={false}>
            {userMarker}
            {pins}
        </GMap>
    )
}