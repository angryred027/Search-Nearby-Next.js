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

    let extraStyles = ''
    const baseStyles = 'h-6 w-6 inline-flex items-center justify-center px-1 py-1 subpixel-antialiased text-sm font-thin leading-none rounded-full'

    switch (color) {
        case 'blue':
            extraStyles = 'bg-blue-600 text-blue-100'
            break;
        case 'green':
            extraStyles = 'bg-green-600 text-green-100'
            break;
        case 'yellow':
            extraStyles = 'bg-yellow-600 text-yellow-100'
            break;
        case 'red':
        default:
            extraStyles = 'bg-red-600 text-red-100'
            break;
    }
    const className = `${baseStyles} ${extraStyles} ${extraClass ?? ''}`

    return (
        <div className={className}>
            <AdvancedMarker key={id} position={{ lat: latitude, lng: longitude }} onClick={() => handleClick()}>
                <span id={`tonari-marker-${id}`} style={{ transform: "translate(${-size / 2}px,${-size}px)" }} className={className}>{content}</span>
            </AdvancedMarker>
        </div>
    )
}