'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMapGL, {
    Map,
    Marker,
    Source,
    Layer,
    NavigationControl, GeolocateControl,
    MapLayerMouseEvent,
    ViewStateChangeEvent,
    MapRef,
    MapboxEvent,
    FillLayer,
    CircleLayer
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { isGeoSupported } from './swSupport';
import type { FeatureCollection } from 'geojson';

import { nearbyRestaurants } from './data'

const PARK_LAYER: FillLayer = {
    id: 'landuse_park',
    type: 'fill',
    source: 'mapbox',
    'source-layer': 'landuse',
    filter: ['==', 'class', 'park'],
    paint: {
        'fill-color': '#4E3FC8'
    }
};

const layerStyle: CircleLayer = {
    id: 'TONARI_LAYER',
    type: 'circle',
    paint: {
        'circle-radius': 10,
        'circle-color': '#007cbf'
    }
};

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
            });
        } else {
            console.info("Geolocation is not supported");
        }
    }, []);

    const onClickHandler = (event: MapLayerMouseEvent) => {
        console.info("Map clicked: ", event)

        const map = nearbyMapRef.current?.getMap();
        if (!map) return;

        // // If the user clicked on one of your markers, get its information.
        // const features = map.queryRenderedFeatures(event.point, {
        //     layers: ['TONARI_LAYER'] // replace with your layer name
        // });
        // if (!features.length) {
        //     return;
        // }
        // const feature = features[0];
    }

    const onLoadHandler = (event: MapboxEvent) => {
        console.info("Map loaded: ", event);

        const map = nearbyMapRef.current?.getMap();
        if (!map) return;
    }

    const pins = useMemo(() =>
        nearbyRestaurants.map((restaurant, index) => {
            const { name, address, position } = restaurant
            const { latitude, longitude } = position.coords
            console.info("Drawing poi: ", name)
            return (
                <Marker key={`${address.replaceAll(' ', '')}`} latitude={latitude} longitude={longitude}>
                    <img src="./icon-192x192.png" className="w-2 h-2 rounded" alt={name} />
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
            onClick={(event: MapLayerMouseEvent) => onClickHandler(event)}
            minZoom={15}
            maxZoom={19}
            style={{ width: '100%', height: '100vh' }}
            attributionControl={false}
            dragPan>
            <NavigationControl position="top-right" showCompass showZoom />
            <GeolocateControl position="top-right" positionOptions={{ enableHighAccuracy: true }} trackUserLocation showUserHeading />
            {pins}
        </Map>
    )
}