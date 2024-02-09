'use client'

import { ChangeEvent, useState } from "react"
import { useDebouncedCallback } from 'use-debounce';



const SEARCH_API = {
    ROOT: 'https://api.mapbox.com/geocoding/v6/mapbox.places/',
    PARAMS: {
        access_token: process.env.MAPBOX_TOKEN || '',
        proximity: 'ip',
        limit: '3',
        language: 'en',
        country: 'us',
    }
}

const buildSearchUrl = (searchText: string) => {
    const { ROOT, PARAMS } = SEARCH_API;

    const urlSafeQuery = encodeURI(searchText);
    return `${ROOT}${urlSafeQuery}.json?${new URLSearchParams(PARAMS).toString()}`
}


export default function Search() {
    const [searchText, setSearchText] = useState<string>('')

    const handleSearch = useDebouncedCallback(async (term) => {
        console.log(`Searching... ${term}`);

        const searchUrl = buildSearchUrl(term);

        // replace(`${pathname}?${params.toString()}`);
        // This request should be cached with a lifetime of 10 seconds.
        // Similar to `getStaticProps` with the `revalidate` option.
        const revalidatedData = await fetch(searchUrl, {
            next: { revalidate: 10 },
        })

        console.log(revalidatedData);

    }, 300);

    return (<input className="w-full h-10 px-4 text-base text-gray-700 placeholder-gray-500 border-2 border-gray-300 rounded-lg focus:shadow-outline"
        type="text"
        placeholder="Find something amazing..."
        value={searchText}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value)}
    />)
}