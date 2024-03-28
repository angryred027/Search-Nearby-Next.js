'use client'

import { useContext, useEffect, useState } from 'react'
import { BellIcon, ArrowPathIcon, FolderPlusIcon, BellSlashIcon } from '@heroicons/react/24/solid'

import { nearbyData } from '../../data'
import { isNotifySupported } from '../../swSupport'
import { NotificationContext } from '../../contexts'

export default function Notify() {
    const notification = useContext(NotificationContext)
    const [count, setCount] = useState(notification)
    const [isGranted, setIsGranted] = useState<boolean>()
    const [isInstalled, setIsInstalled] = useState<boolean>(false)
    const [isSupported, setIsSupported] = useState<boolean>(false)
    const [registration, setRegistration] = useState<ServiceWorkerRegistration>()

    useEffect(() => {
        const hasRequisite = isNotifySupported()
        setIsSupported(hasRequisite)

        if (window.serwist !== undefined && hasRequisite) {
            try {
                setIsGranted(Notification.permission === "granted")
            } catch (err) {
                console.info(err)
            }

            const beforeinstallprompt = (event: any) => {
                console.log("Before install prompt: ", event);
            }

            const appinstalled = (event: any) => {
                console.log("App installed: ", event);
                // setIsInstalled(true)
            }

            // Register the service worker
            window.serwist.register()
                .then((result) => setRegistration(result))
                .catch((err) => alert(err)).catch((err) => console.warn(err))

            window.addEventListener("beforeinstallprompt", beforeinstallprompt);
            window.addEventListener("appinstalled", appinstalled);

            return () => {
                window.removeEventListener("beforeinstallprompt", beforeinstallprompt);
            }
        } else {
            console.warn("Service worker, notifications, or push manager not supported")
        }
    }, []);

    useEffect(() => {
        // console.info("Service worker registration state: ", registration?.active?.state)
        setIsInstalled(registration?.active?.state === "activated")
    }, [registration?.active?.state])

    useEffect(() => {
        navigator.setAppBadge && navigator.setAppBadge(count)
    }, [count])

    const randomNotification = async () => {
        if (!registration) return

        try {
            const randomItem = Math.floor(Math.random() * nearbyData.length);
            const notifTitle = `${nearbyData[randomItem].text} is nearby!`;
            const notifBody = `Drop in at ${nearbyData[randomItem].properties?.address}.`;
            // const notifImg = `data/img/${games[randomItem].slug}.jpg`;
            const options = {
                body: notifBody,
                title: notifTitle,
                icon: 'icon-192x192.png', // notifImg,
                actions: [
                    {
                        action: "open",
                        title: "Open the app",
                    }
                ]
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
        try {
            if (isSupported)
                Notification.requestPermission().then((result) => {
                    if (result === "granted") {
                        setIsGranted(true);
                    } else {
                        alert("We weren't allowed to send you notifications. Permission state is: " + result);
                    }
                })
            else {
                // Alert the user that they need to install the web page to use notifications 
                alert('You need to install this web page to use notifications');
            }
        } catch (err) {
            console.log(err)
        }
    }

    const installSheet = () => {
        // TODO: Show installation instructions for iOS, Android, Desktop
    }

    const renderControl = () => {
        if (!isSupported) return (
            <div className='flex space-x-4'>
                <button className='flex-initial bg-gray-700 text-white font-bold py-2 px-2 rounded-full max-h-10 max-w-10' >
                    <span className="absolute -inset-.5" />
                    <span className="sr-only">Install Tonari.app</span>
                    <FolderPlusIcon className="h-6 w-6 z-10" aria-hidden="true" />
                </button>
            </div>
        )

        if (!isGranted) return (
            <div className='flex space-x-4'>
                <button className='flex-initial bg-gray-500 text-white font-bold py-2 px-2 rounded-full max-h-10 max-w-10' onClick={() => requestPermission()}>
                    <span className="absolute -inset-.5" />
                    <span className="sr-only">Enable notifications</span>
                    <BellSlashIcon className="h-6 w-6 z-10" aria-hidden="true" />
                </button>
            </div>
        )

        if (isInstalled)
            return (
                <div className='flex space-x-4'>
                    <button className='flex-initial bg-gray-700 text-white font-bold py-2 px-2 rounded-full max-h-10 max-w-10' onClick={() => randomNotification()}>
                        <span className="absolute -inset-.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6 z-10" aria-hidden="true" />
                    </button>
                    {/* <button className='flex-initial bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 max-h-40 rounded-full' onClick={() => {
                        navigator.clearAppBadge();
                        setCount(0)
                    }}>Clear badge</button> */}
                </div>
            )

        return (
            <div className='flex space-x-4'>
                <button className='flex-initial bg-gray-700 text-white font-bold py-2 px-2 rounded-full max-h-10 max-w-10 animate-spin' disabled>
                    <span className="absolute -inset-.5" />
                    <span className="sr-only">Loading...</span>
                    <ArrowPathIcon className="h-6 w-6 z-10" aria-hidden="true" />
                </button>
            </div>
        )
    }

    return (
        <NotificationContext.Provider value={count}>
            <div className='flex flex-row justify-between'>
                {renderControl()}
            </div>
        </NotificationContext.Provider>
    )
}
