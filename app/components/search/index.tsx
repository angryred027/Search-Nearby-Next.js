'use client'

import { AdvancedMarker, Marker, useMarkerRef, useMap, useMapsLibrary, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { useDebouncedCallback } from 'use-debounce';
import { isGeoSupported } from "../../swSupport";
import { PlacesContext } from "../../contexts";
import { INearby } from "../../types";

export default function Search() {
    // const [myPlaces, setMyPlaces] = useContext(PlacesContext)

    const [searchText, setSearchText] = useState<string>('')
    const [predictionResults, setPredictionResults] = useState<Array<google.maps.places.AutocompletePrediction>>([]);

    const [position, setPosition] = useState<GeolocationPosition>();

    const map = useMap('map');
    const placesLib = useMapsLibrary('places');

    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>();
    const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>();
    const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | undefined>();

    useEffect(() => {
        const hasRequisite = isGeoSupported();

        if (hasRequisite) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.info("[search] Geolocation is supported");
                setPosition(position);
            });
        } else {
            console.info("[search] Geolocation is not supported");
        }
    }, []);

    useEffect(() => {
        if (position && map) {
            console.info("Setting map center to user's location")
            map?.panTo({ lat: position.coords.latitude, lng: position.coords.longitude })
        }
    }, [position, map])

    useEffect(() => {
        if (!placesLib || !map) return;

        setPlacesService(new placesLib.PlacesService(map));
        setAutocompleteService(new placesLib.AutocompleteService());
        setSessionToken(new placesLib.AutocompleteSessionToken());

        return () => setAutocompleteService(null);
    }, [placesLib, map])

    const handleSearch = useDebouncedCallback(async (input) => {
        let locationBias = null
        const options = {
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
        };
        if (input.length < 3) {
            setPredictionResults([]);
            return;
        };

        console.log(`Searching... ${input}`);
        if (!autocompleteService || !input) {
            setPredictionResults([]);
            return;
        }

        // Attempt to filter results to nearby area
        if (position) {
            const { latitude, longitude } = position?.coords;
            const point = { lat: latitude, lng: longitude };

            locationBias = { radius: 3200, center: point };
        }

        const request = { input, locationBias, options, sessionToken };
        const response = await autocompleteService.getPlacePredictions(request);
        setPredictionResults(response.predictions);

    }, 300);

    const handleClick = (place_id: string) => {
        if (!placesService) return;

        placesService.getDetails({ placeId: place_id }, (place, status) => {
            if (status === "OK") {
                setPredictionResults([]);
                setSearchText('');

                console.log(place);

                if (!place || !map) return;

                const lat = place.geometry?.location?.lat();
                const lng = place.geometry?.location?.lng();

                if (!lat || !lng) return;
                map.panTo({ lat, lng });

                const marker = new google.maps.Marker({ position: { lat, lng }, map, title: place.name });
                const info = new google.maps.InfoWindow({ content: place.name }).open(map, marker);

                // console.info("Adding place to myPlaces:")
                // console.info(myPlaces);

                // myPlaces.push({
                //     id: '',
                //     text: place.name,
                //     center: [lng, lat],
                // })
                // console.info(`Added ${place.name} to myPlaces`);
                // console.info(myPlaces);

                // setMyPlaces(myPlaces);
            }

            setPredictionResults([]);
        });
    };

    return (
        <div className="flex-grow">
            <input className="w-full h-10 max-h-10 px-4 text-base text-gray-700 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:shadow-outline"
                type="text"
                placeholder="Find something amazing..."
                value={searchText}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setSearchText(event.target.value);
                    handleSearch(event.target.value);
                }}
            />
            {predictionResults.length > 0 && (
                <div className="bg-white border-2 rounded-lg">
                    <ul className="list-inside">
                        {predictionResults.map(({ place_id, description }) => (
                            <li key={place_id} className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleClick(place_id)}>{description}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>)
}