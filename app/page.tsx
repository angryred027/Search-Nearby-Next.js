import Nearby from './nearby';
import Navigation from './Navigation';
import Notify from './notify';
import Search from './search';

export default function Home() {

  return (
    <div className='max-h-full overflow-y-hidden'>
      <main>
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
      </main>
    </div>
  );
}
