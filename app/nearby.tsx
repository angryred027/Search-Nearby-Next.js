'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMapGL, {
    Map,
    Marker,
    NavigationControl, GeolocateControl,
    MapLayerMouseEvent,
    ViewStateChangeEvent,
    MapRef,
    MapboxEvent,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { isGeoSupported } from './swSupport';

import { nearbyRestaurants } from './data'
import mapboxgl from 'mapbox-gl';

export default function Nearby() {
    const nearbyMapRef = useRef<MapRef>(null);
    const token = process.env.MAPBOX_TOKEN

    const [viewport, setViewport] = useState({
        latitude: 41.948437,
        longitude: -87.655334,
        zoom: 7,
    });

    useEffect(() => {
        const hasRequisite = isGeoSupported();

        if (hasRequisite) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.info("Geolocation is supported");

                nearbyMapRef.current?.getMap().flyTo({
                    center: [position.coords.longitude, position.coords.latitude],
                    zoom: 5,
                    speed: 0.8,
                    easing(t: number) {
                        return t;
                    }
                });

                // TODO: add  amrker for user's current position?

            });
        } else {
            console.info("Geolocation is not supported");
        }
    }, []);

    const popup = useMemo(() => {
        return new mapboxgl.Popup();
    }, [])

    const onLoadHandler = (event: MapboxEvent) => {
        console.info("Map loaded: ", event);

        const map = nearbyMapRef.current?.getMap();
        if (!map) return;
    }

    const pins = useMemo(() =>
        nearbyRestaurants.map((restaurant, index) => {
            const { name, address, position } = restaurant
            const { latitude, longitude } = position.coords
            return (
                <Marker key={`${address.replaceAll(' ', '')}`} latitude={latitude} longitude={longitude} onClick={(event) => {
                    console.info("Marker clicked: ", name, address)

                    // prevent other click handlers from executing
                    event.originalEvent.stopPropagation()

                    const map = nearbyMapRef.current?.getMap();
                    if (!map) return;

                    popup.setLngLat([longitude, latitude])
                        .setOffset([0, -10])
                        .setHTML(`<h1>${name}</h1><p>${address}</p>`)
                        .addTo(map);

                }}>
                    <span className="cursor-pointer inline-flex items-center justify-center px-2 py-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">隣</span>
                </Marker>
            )
        }),
        [nearbyRestaurants]
    );

    return (
        <Map {...viewport}
            ref={nearbyMapRef}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={token}
            initialViewState={viewport}
            onMove={(event: ViewStateChangeEvent) => { setViewport(event.viewState) }}
            onLoad={(event: MapboxEvent) => onLoadHandler(event)}
            minZoom={15}
            maxZoom={19}
            attributionControl={false}
            style={{ width: "100%", height: "100%" }}
            dragPan>
            <NavigationControl position="top-right" showCompass showZoom />
            <GeolocateControl position="top-right" positionOptions={{ enableHighAccuracy: true }} trackUserLocation showUserHeading />
            {pins}
        </Map>
    )
}