'use client'

import Nearby from './nearby';
import Navigation from './Navigation';
import Notify from './notify';
import Search from './search';
import { APIProvider } from '@vis.gl/react-google-maps';
import { PlacesContext } from './contexts';
import { nearbyData } from './data';

export default function Home() {
  const token = process.env.MAPS_TOKEN || '';

  return (
    <div className='max-h-full overflow-y-hidden'>
      <main>
        <PlacesContext.Provider value={nearbyData}>
          <APIProvider apiKey={token}>
            {/* <Navigation /> */}
            <div className="absolute z-10 w-full justify-center flex flex-row gap-4 top-20 justify-center">
              <div className="max-w-prose px-4 flex flex-row flex-grow gap-4">
                <div className="flex-grow">
                  <Search />
                </div>
                <Notify />
              </div>
            </div>
            <div className="w-dvw h-dvh">
              <Nearby />
            </div>
          </APIProvider>
        </PlacesContext.Provider>
      </main>
    </div>
  );
}
