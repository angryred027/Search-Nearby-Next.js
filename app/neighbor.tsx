'use client'

import { AdvancedMarker } from "@vis.gl/react-google-maps";

export interface neighborProps {
    id: string
    latitude: number
    longitude: number
    handleClick: () => void
    content?: any
    color?: string
    extraClass?: string
}

export default function Neighbor({ id, latitude, longitude, handleClick, content = '隣', color = 'red', extraClass }: neighborProps) {
    // color = 'red'

    const className = `h-8 w-8 inline-flex items-center justify-center px-1 py-1 subpixel-antialiased text-sm font-thin leading-none rounded-full text-${color}-100 bg-${color}-600 ${extraClass ?? ''}`

    return (
        <div className={className}>
            <AdvancedMarker key={id} position={{ lat: latitude, lng: longitude }} onClick={() => handleClick()}>
                <span id="tonari-marker" style={{ transform: "translate(${-size / 2}px,${-size}px)" }} className={className}>{content}</span>
            </AdvancedMarker>
        </div>
    )
}