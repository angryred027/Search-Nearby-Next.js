'use client'

import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { useDebouncedCallback } from 'use-debounce';
import { isGeoSupported } from "../../swSupport";
import { CurrentPlaceContext, PlacesContext } from "@/app/contexts";
import { INearby } from "@/app/types";

export default function Search() {
    const { places, savePlace } = useContext<any>(PlacesContext)

    // const { place, setPlace } = useContext<any>(CurrentPlaceContext)
    const [place, setPlace] = useState<INearby | undefined>();
    const [info, setInfo] = useState<google.maps.InfoWindow | undefined>();
    const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | undefined>();

    const [searchText, setSearchText] = useState<string>('')
    const [predictionResults, setPredictionResults] = useState<Array<google.maps.places.AutocompletePrediction>>([]);

    const [position, setPosition] = useState<GeolocationPosition>();

    const map = useMap('map');
    const placesLib = useMapsLibrary('places');

    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>();
    const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>();
    const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | undefined>();

    // TODO: Temporary until reducers are set up
    useEffect(() => {
        // Client-side-only code
        if (typeof window !== "undefined") {
            window.addEventListener('message', (event) => {
                if (place && event.data === 'tonari_add_place') {
                    handleAdd();

                    if (info) info.close();
                    if (marker) marker.position = null;
                }
            });
        }
    }, [])

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
        if (typeof window !== "undefined") {
            console.info(document.getElementById("tonari-add-place"))
            document.getElementById("tonari-add-place")?.addEventListener('click', () => {
                handleAdd();

                if (info) info.close();
                if (marker) marker.position = null;
            });
        }
    }, [info, marker])

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

    const placeInfo = (text: string | undefined, address: string | undefined) => {
        return `<div class='inset-10'><h1 class="text-lg font-bold">${text}</h1><p class='py-2'>${address}</p><button id="tonari-add-place" type="button" class="text-sm font-semibold">Add to your List</button></div>`
    }

    const placeMarker = () => {
        return `<span id="tonari-marker" class="h-8 w-8 inline-flex items-center justify-center px-1 py-1 subpixel-antialiased text-sm font-thin leading-none rounded-full bg-green-600 text-green-100 ">隣</span>`
    }

    const handleAdd = useDebouncedCallback(() => {
        if (!place) return;

        savePlace(place);

        console.info(`Added ${place.text} to myPlaces`);
        console.info([...places, place]);
    }, 300);

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

                // console.log(place);

                if (!place || !map) return;

                const lat = place.geometry?.location?.lat();
                const lng = place.geometry?.location?.lng();

                if (!lat || !lng) return;
                map.panTo({ lat, lng });

                const c = document.createElement('div');
                c.innerHTML = placeMarker();

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    position: { lat, lng },
                    map,
                    title: place.name,
                    content: c
                });

                const info = new google.maps.InfoWindow({ content: placeInfo(place.name, place.adr_address) });
                info.open(map, marker)
                info.addListener('closeclick', () => marker.position = null);
                info.addListener('click', () => {
                    handleAdd();

                    if (info) info.close();
                    if (marker) marker.position = null;
                });

                setInfo(info);
                setMarker(marker);

                const newPlace = {
                    id: place.place_id,
                    text: place.name,
                    place_name: `${place.name}, ${place.formatted_address}`,
                    center: [lng, lat],
                    properties: {
                        address: place.formatted_address,
                    }
                } as INearby;

                setPlace(newPlace);

                // console.log(newPlace);

                // savePlace(newPlace);

                // console.info(`Added ${place.name} to myPlaces`);
                // console.info([...places, newPlace]);
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