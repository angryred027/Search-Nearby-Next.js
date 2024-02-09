import Nearby from './nearby';
import Navigation from './Navigation';
import Notify from './notify';
import Search from './search';

export default function Home() {

  return (
    <div className='max-h-full overflow-y-hidden'>
      <main>
        <div className="absolute w-full z-999">
          <Navigation />
        </div>
        <div className="z-10 w-full max-w-prose px-4 flex flex-row gap-4 absolute top-20">
          <div className="flex-grow">
            <Search />
          </div>
          <Notify />
        </div>
        <div className="w-dvw h-dvh pt-16">
          <Nearby />
        </div>
      </main>
    </div>
  );
}
