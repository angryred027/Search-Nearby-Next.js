'use client'

import Map from '@/app/components/map';

export default function Nearby() {
    return (
        <section id="page-nearby">
            <div className="w-dvw h-dvh absolute bottom-0">
                <Map />
            </div>
        </section>
    )
}