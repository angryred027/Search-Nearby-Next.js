'use client'

import { useEffect, useState } from "react"

export default function Settings() {
    const [location, setLocation] = useState<string>();

    useEffect(() => {
        // Client-side-only code
        if (typeof window !== "undefined") {
            setLocation(window.location.hostname)
        }
    })

    return (
        <section id="page-settings">
            <div className="w-dvw h-dvh p-4">
                <p>Settings</p>
                <p>{location}</p>
            </div>
        </section>
    )
}