'use client'

import { useEffect, useState } from 'react'

export interface Nearby {
    name: string
    address: string
}

export default function Notify() {
    const [count, setCount] = useState(0)
    const [isGranted, setIsGranted] = useState<boolean>()
    const [registration, setRegistration] = useState<ServiceWorkerRegistration>()

    const nearbyRestaurants = [
        {
            name: "Proxi",
            address: "565 W Randolph St, Chicago, IL 60661",
        },
        {
            name: "Kumiko",
            address: "630 W Lake St, Chicago, IL 60661",
        },
        {
            name: "Gaijin",
            address: "950 W Lake St, Chicago, IL 60661",
        },
        {
            name: "S.K.Y.",
            address: "1239 W 18th St, Chicago, IL 60608",
        },
        {
            name: "The Purple Pig",
            address: "444 Michigan Ave, Chicago, IL 60605",
        },
        {
            name: "The Publican",
            address: "837 W Fulton Market, Chicago, IL 60607",
        },
        {
            name: "Monteverde",
            address: "1020 W Madison St, Chicago, IL 60607",
        },
        {
            name: "Roister",
            address: "951 W Fulton Market, Chicago, IL 60607",
        },
    ] as Nearby[]

    useEffect(() => {
        if ("serviceWorker" in navigator && window.serwist !== undefined) {
            window.serwist.register().then((result) => setRegistration(result)).catch((err) => alert(err))

            window.addEventListener("beforeinstallprompt", (event: any) => {
                console.log("Before install prompt: ", event);
            });

            window.addEventListener("appinstalled", (event: any) => {
                console.log("App installed: ", event);
            });

            window.addEventListener("notificationclose", (event: any) => {
                console.log("On notification close: ", event);
            });

            window.addEventListener("notificationclick", (event: any) => {
                console.log("On notification click: ", event.notification.tag);
                event.notification.close();
            });
        }

        const updatePermission = () => {
            setIsGranted(Notification.permission === "granted")
        }
        updatePermission()
    }, []);

    useEffect(() => {
        navigator.setAppBadge && navigator.setAppBadge(count)
    }, [count])

    const isSupported = () => {
        if (Notification) return true
        return false
    }

    const randomNotification = async () => {
        if (!registration) return

        try {
            const randomItem = Math.floor(Math.random() * nearbyRestaurants.length);
            const notifTitle = `${nearbyRestaurants[randomItem].name} is nearby!`;
            const notifBody = `Drop in at ${nearbyRestaurants[randomItem].address}.`;
            // const notifImg = `data/img/${games[randomItem].slug}.jpg`;
            const options = {
                body: notifBody,
                title: notifTitle,
                icon: 'icon-192x192.png', // notifImg,
            };

            // You must use the service worker notification to show the notification
            // e.g - new Notification(notifTitle, options) does not work on iOS
            // despite working on other platforms
            await registration.showNotification(notifTitle, options);

            setCount(count + 1)
        } catch (err: any) {
            console.log("Encountered a problem: " + err.message)
            console.log(err)
            alert(err)
        }
    }

    const requestPermission = () => {
        if (isSupported())
            Notification.requestPermission().then((result) => {
                if (result === "granted") {
                    setIsGranted(true);
                } else {
                    alert("We weren't allowed to send you notifications. Permission state is: " + result);
                }
            }).catch((err) => {
                console.log(err);
                alert(err);
            });
        else {
            // Alert the user that they need to install the web page to use notifications 
            alert('You need to install this web page to use notifications');
        }
    }

    const renderControl = () => {
        if (!isGranted) return <button className='flex-initial bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded-full' onClick={() => requestPermission()}>Enable notifictions</button>

        return (
            <>
                <button className='flex-initial bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded-full' onClick={randomNotification}>Send a notifiction</button>
                <button className='flex-initial bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded-full' onClick={() => {
                    navigator.clearAppBadge();
                    setCount(0)
                }}>Clear badge</button>
            </>
        )
    }



    return (
        <div className='flex flex-col'>
            {renderControl()}
        </div>
    )
}
