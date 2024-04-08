'use client'

import { PlacesContext, usePlaceContext, usePlaceDispatchContext } from '@/app/contexts'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce';

export default function Place() {
    const place = usePlaceContext()!;
    const dispatch = usePlaceDispatchContext()!;

    const { places, savePlace, updatePlace } = useContext<any>(PlacesContext);

    const [isOpen, setIsOpen] = useState(false);
    const [isInList, setIsInList] = useState(false);
    const [isVisited, setIsVisited] = useState(false);

    useEffect(() => {
        if (place !== null) {
            console.info('[place] Initializing place dialog');
            console.info('[place] Details for ' + place?.name);

            const found = places.find((p: any) => p.id === place.id);
            console.info(`[place] is ${place.name} in list: ${!!found}`);
            setIsInList(!!found)

            const visited = place.tags?.includes('visited');
            setIsVisited(visited || false);

            openModal();
        }
    }, [place])

    const handleAdd = useDebouncedCallback(() => {
        if (!place) return;

        savePlace(place);

        console.info(`Added ${place.name} to myPlaces`);
        console.info([...places, place]);

        closeModal();
    }, 300);

    const handleRemove = useDebouncedCallback(() => {
        if (!place) return;

        if (!place.tags) place.tags = ['visited'];
        else
            place.tags?.push('visited');

        updatePlace(place);

        console.info(`Removed ${place.name} from myPlaces`);
        console.info([...places]);

        closeModal();
    }, 300);

    function closeModal() {
        dispatch({ type: 'CLEAR_PLACE' })
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {/* <div className="fixed inset-0 bg-black/25" /> */}
                        <div className="fixed inset-0" />

                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {place?.name}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {place?.address}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex flex-row gap-x-2">
                                        {place?.website && (
                                            <a href={place?.website} target="_blank" className="text-xs text-gray-500">Website</a>
                                        )}
                                        <span className="text-xs text-gray-500">•</span>
                                        {place?.phone && (
                                            <a href={"tel://" + place?.phone.replaceAll(' ', '')} className="text-xs text-gray-500">{place.phone}</a>
                                        )}
                                    </div>

                                    {!isInList && !isVisited && (<div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                            onClick={handleAdd}
                                        >
                                            Add to List!
                                        </button>
                                    </div>)}
                                    {isInList && !isVisited && (<div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={handleRemove}
                                        >
                                            Visited!
                                        </button>
                                    </div>)}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
