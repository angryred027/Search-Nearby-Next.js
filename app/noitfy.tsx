'use client'

import { useState } from 'react'

export default function Notify() {
    const [count, setCount] = useState(0)

    const games = [
        {
            name: "Kittens Game",
            author: "Bloodrizer",
            slug: "kittens-game",
        },
        {
            name: "A Dark Room",
            author: "Amir Rajan",
            slug: "a-dark-room",
        },
        {
            name: "Candy Box 2",
            author: "aniwey",
            slug: "candy-box-2",
        },
        {
            name: "Spaceplan",
            author: "Jake Hollands",
            slug: "spaceplan",
        },
        {
            name: "Sandcastle Builder",
            author: "mikep",
            slug: "sandcastle-builder",
        }
    ]

    const isSupported = () => {
        try {
            if (Notification) {
                // A service worker must be registered in order to send notifications on iOS
                navigator.serviceWorker.register('./public/sw.js', { scope: './public/' });
                return true
            }
        } catch (err) {
            alert(err)
        }

        // Assume unsupported
        return false
    }

    const randomNotification = () => {
        setCount(count + 1)
        navigator.setAppBadge && navigator.setAppBadge(count)

        try {
            const randomItem = Math.floor(Math.random() * games.length);
            const notifTitle = games[randomItem].name;
            const notifBody = `Created by ${games[randomItem].author}.`;
            const notifImg = `data/img/${games[randomItem].slug}.jpg`;
            const options = {
                body: notifBody,
                title: "Hello, world!",
                icon: notifImg,
                badge: `${count}`,
                // vibrate: true
            };
            new Notification(notifTitle, options)

        } catch (err) {
            console.log(err)
            alert(err)
        }
    }

    const requestPermission = () => {
        if (isSupported())
            Notification.requestPermission().then((result) => {
                if (result === "granted") {
                    randomNotification();
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

    return (
        <div className='flex flex-col'>
            <button className='flex-initial bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded-full' onClick={requestPermission}>Enable notifictions</button>
            <button className='flex-initial bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded-full' onClick={randomNotification}>Send a notifiction</button>
            <button className='flex-initial bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded-full' onClick={() => navigator.clearAppBadge()}>Clear badge</button>
        </div>
    )
}
