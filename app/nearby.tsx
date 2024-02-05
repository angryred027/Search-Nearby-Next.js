'use client'

import { useEffect, useRef, useState } from 'react';
import ReactMapGL, {
    Marker,
    Source,
    Layer,
    NavigationControl, GeolocateControl
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { isGeoSupported } from './swSupport';

export default function Nearby() {
    const nearbyMapRef = useRef<any>(null);
    const token = process.env.MAPBOX_TOKEN

    const [viewport, setViewport] = useState({
        latitude: 41.948437,
        longitude: -87.655334,
        zoom: 17,
    });

    const [flights, setFlights] = useState([]);

    useEffect(() => {
        const hasRequisite = isGeoSupported();

        if (hasRequisite) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.info("Geolocation is supported");

                nearbyMapRef.current?.getMap().flyTo({
                    center: [position.coords.longitude, position.coords.latitude],
                    zoom: 17,
                    speed: 0.8,
                    easing(t: unknown) {
                        return t;
                    }
                });
            });
        } else {
            console.info("Geolocation is not supported");
        }
    }, []);

    return (
        <ReactMapGL {...viewport}
            ref={nearbyMapRef}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={token}
            initialViewState={viewport}
            onMove={(event) => { setViewport(event.viewState) }}
            minZoom={15}
            maxZoom={19}
            style={{ width: '100%', height: '100vh' }}
            dragPan>
            <NavigationControl position="top-right" showCompass showZoom />
            <GeolocateControl position="top-right" positionOptions={{ enableHighAccuracy: true }} trackUserLocation showUserHeading />
        </ReactMapGL>
    )
}