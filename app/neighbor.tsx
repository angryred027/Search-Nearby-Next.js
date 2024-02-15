import { AdvancedMarker } from "@vis.gl/react-google-maps";

export interface neighborProps {
    id: string
    latitude: number
    longitude: number
    color?: string
}

export default function Neighbor({ id, latitude, longitude, color = 'red' }: neighborProps) {
    return (
        <AdvancedMarker className='cursor-pointer' key={id} position={{ lat: latitude, lng: longitude }}>
            <span style={{ transform: "translate(${-size / 2}px,${-size}px)" }} className={`cursor-pointer inline-flex items-center justify-center px-2 py-2 text-xs font-bold leading-none text-${color}-100 bg-${color}-600 rounded-full`} title='You are Here!'>隣</span>
        </AdvancedMarker>
    )
}