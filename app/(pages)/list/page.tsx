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
    const { places } = useContext<any>(PlacesContext)
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
        if (!routesLib || !places || !position) {
            console.warn('[list] Routes dependencies not ready')
            return;
        }

        const service = new routesLib.DirectionsService()
        setRoutesService(service)

        const { latitude, longitude } = position.coords;

    }, [places, routesLib, position])

    /* TODO: Add distance to each place
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
        if (!pins || pins.length === 0) return <p className="text-center text-lg">No places added yet</p>
        return (
            <>
                <p className='text-sm py-2 px-4'>Places to Visit ({pins.length})</p>
                <Menu as="div" className="py-2 px-4 max-w-prose">
                    <Menu.Items id='popover-menu' static className="rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {pins}
                    </Menu.Items>
                </Menu>
            </>
        )
    }

    const renderCheckedList = () => {
        if (!checked || checked.length === 0) return <p className="text-center text-lg">No places visited yet</p>
        return (
            <>
                <p className='text-sm py-2 px-4'>Places Visited ({checked.length})</p>
                <Menu as="div" className="py-2 px-4 max-w-prose">

                    <Menu.Items id='popover-menu' static className="rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {checked}
                    </Menu.Items>
                </Menu>
            </>
        )
    }

    const checked = useMemo(() => {
        if (!places) return;

        return places.filter((p: INearby) => p.tags?.includes('visited')).map((restaurant: INearby, index: number) => {
            console.info('[nearby] Rendering pins')
            const { name, address, center } = restaurant

            const latitude = center[1]
            const longitude = center[0]

            const id = address ? `list-${address.replaceAll(' ', '')}` : `list-neighbor-${latitude}-${longitude}`

            if (!name) return;

            return (<Menu.Item key={id}>
                {({ active }) => (
                    <a
                        href={`?place=${name}`}
                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 flex gap-2')}
                    >
                        <span className='font-bold'>{(index + 1).toLocaleString('en', { minimumIntegerDigits: 2 })}.</span> {name} <span className='flex-grow' /> -- mi.
                    </a>
                )}
            </Menu.Item>)
        })
    }, [places]);

    const pins = useMemo(() => {
        if (!places) return;

        return places.filter((p: INearby) => !p.tags?.includes('visited')).map((restaurant: INearby, index: number) => {
            console.info('[nearby] Rendering pins')
            const { name, address, center } = restaurant

            const latitude = center[1]
            const longitude = center[0]

            const id = address ? `list-${address.replaceAll(' ', '')}` : `list-neighbor-${latitude}-${longitude}`

            if (!name) return;

            return (<Menu.Item key={id}>
                {({ active }) => (
                    <a
                        href={`?place=${name}`}
                        className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 flex gap-2')}
                    >
                        <span className='font-bold'>{(index + 1).toLocaleString('en', { minimumIntegerDigits: 2 })}.</span> {name} <span className='flex-grow' /> -- mi.
                    </a>
                )}
            </Menu.Item>)
        })
    }, [places]);

    return (
        <section id="page-list">
            <div className="w-dvw h-dvh flex flex-col align-center">
                {renderWishList()}
                {renderCheckedList()}
            </div>
        </section>
    )
}