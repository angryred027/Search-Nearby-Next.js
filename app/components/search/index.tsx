'use client'

import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { useDebouncedCallback } from 'use-debounce';
import { isGeoSupported } from "../../swSupport";
import { PlacesContext, usePlaceDispatchContext } from "@/app/contexts";
import { INearby } from "@/app/types";

export default function Search() {
    const dispatch = usePlaceDispatchContext()!;

    const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | undefined>();
    const { places } = useContext<any>(PlacesContext);

    const [searchText, setSearchText] = useState<string>('')
    const [predictionResults, setPredictionResults] = useState<Array<google.maps.places.AutocompletePrediction>>([]);

    const [position, setPosition] = useState<GeolocationPosition>();

    const map = useMap('tonari-map');
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
        if (!placesLib) return;

        setAutocompleteService(new placesLib.AutocompleteService());
        setSessionToken(new placesLib.AutocompleteSessionToken());

        return () => setAutocompleteService(null);
    }, [placesLib])

    useEffect(() => {
        if (!placesLib || !map) return;
        setPlacesService(new placesLib.PlacesService(map));

    }, [placesLib, map])

    const placeMarker = (color: string = 'green') => {
        return `<span id='tonari-marker-result' class="relative flex h-6 w-6 cursor-pointer z-10">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75"></span>
                    <span class="h-6 w-6 inline-flex items-center justify-center px-1 py-1 subpixel-antialiased text-sm font-thin leading-none rounded-full bg-${color}-600 text-${color}-100">隣</span>
                </span>`
    }

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
            alert("No autocomplete service available");
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
        if (!placesService) {
            console.warn("No places service available");
            return;
        }

        placesService.getDetails({ placeId: place_id }, (place, status) => {
            if (status === "OK") {
                setPredictionResults([]);
                setSearchText('');

                if (!place || !map) return;

                const lat = place.geometry?.location?.lat();
                const lng = place.geometry?.location?.lng();

                if (!lat || !lng) return;
                map.panTo({ lat, lng });

                // search places to see if place_id exists in array
                const found = places.find((p: INearby) => p.id === place_id);

                document.getElementById('tonari-search')?.remove();

                const c = document.createElement('div');
                c.id = 'tonari-search';
                c.innerHTML = placeMarker(found ? 'red' : 'green');

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    position: { lat, lng },
                    map,
                    title: place.name,
                    content: c
                });

                setMarker(marker);

                const newPlace: INearby = {
                    id: place.place_id || crypto.randomUUID(),
                    name: place.name,
                    address: place.formatted_address,
                    phone: place.formatted_phone_number,
                    rating: place.rating,
                    priceLevel: place.price_level,
                    website: place.website,
                    center: [lng, lat],
                    isOpen: place.opening_hours?.isOpen() || false,
                    status: place.business_status,
                    hours: place.opening_hours?.weekday_text,
                    photos: place.photos,
                }
                dispatch({ type: 'SET_PLACE', payload: newPlace });
            }

            setPredictionResults([]);
        });
    };

    return (
        <div id="search" className="flex-grow">
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
                <div id="search-results" className="bg-white border-2 rounded-lg">
                    <ul className="list-inside">
                        {predictionResults.map(({ place_id, description }) => (
                            <li key={place_id} className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleClick(place_id)}>{description}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>)
}