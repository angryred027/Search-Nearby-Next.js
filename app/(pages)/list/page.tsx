'use client'

import { useContext, useEffect, useMemo, useState } from 'react';
import { Menu, Tab } from '@headlessui/react'
import { Map as GMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { isGeoSupported, isStorageSupported } from '../../swSupport';

import { PlacesContext } from '../../contexts';
import { INearby } from '@/app/types';

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function List() {
    const myPlaces = useContext<INearby[] | null>(PlacesContext)
    const routesLib = useMapsLibrary('routes')

    const [position, setPosition] = useState<GeolocationPosition>();
    const [myPlacesDistance, setMyPlacesDistance] = useState<any[]>([]);

    const [routesService, setRoutesService] = useState<google.maps.DirectionsService | null>();

    useEffect(() => {
        const hasRequisite = isGeoSupported();
        const hasOptional = isStorageSupported();

        if (hasRequisite) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.info("[list] Geolocation is supported");
                setPosition(position);
            });
        } else {
            console.info("[list] Geolocation is not supported");
        }

        if (hasOptional) {
            console.info("[list] Storage is supported");
        }

        if (hasOptional) {
            console.info("Storage is supported");
        }
    }, []);

    useEffect(() => {
        if (!routesLib || !myPlaces || !position) {
            console.warn('[list] Routes dependencies not ready')
            return;
        }

        const service = new routesLib.DirectionsService()
        setRoutesService(service)

        const { latitude, longitude } = position.coords;

    }, [myPlaces, routesLib, position])

    /* TODO: Add distancwe to each place
        const placesWithDistance = myPlaces.map((restaurant: INearby, index: number) => {
            const { center } = restaurant
            const route = {
                origin: { lat: latitude, lng: longitude },
                destination: { lat: center[1], lng: center[0] },
                travelMode: google.maps.TravelMode.DRIVING
            }

            if (!service) {
                console.warn('[list] Routes service not available')
                return;
            }

            console.warn('[list] fetching distances...');

            const dist = service.route(route, (result, status) => {
                console.info('[list] Route result:', result)

                // TODO: Danger: this should be better/smarter
                return result?.routes[0]?.legs[0]?.distance?.text || '? mi';
            })

            return { ...restaurant, dist }
        })

        setMyPlacesDistance(placesWithDistance)
    */

    const renderWishList = () => {
        return (
            <>
                <Menu as="div" className="py-2 px-4 max-w-prose flex-grow">
                    <Menu.Items id='popover-menu' static className="rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {pins}
                    </Menu.Items>
                </Menu>
            </>
        )
    }

    const pins = useMemo(() => {
        if (!myPlaces) return;

        return myPlaces.map((restaurant: any, index: number) => {
            console.info('[nearby] Rendering pins')
            const { text, properties, center, place_name } = restaurant

            const address = place_name
            const latitude = center[1]
            const longitude = center[0]

            const id = `list-${address.replaceAll(' ', '')}` || `list-neighbor-${latitude}-${longitude}`

            return (<Menu.Item key={id}>
                {({ active }) => (
                    <a
                        href={`?place=${text}`}
                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 flex gap-2')}
                    >
                        <span className='font-bold'>{(index + 1).toLocaleString('en', { minimumIntegerDigits: 2 })}.</span> {text} <span className='flex-grow' /> 1 mi.
                    </a>
                )}
            </Menu.Item>)
        })
    }, [myPlaces]
    );

    return (
        <section id="page-list">
            <div className="w-dvw h-dvh flex justify-center">
                {renderWishList()}
            </div>
        </section>
    )
}