import Notify from './noitfy';
import Nearby from './nearby';

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left absolute bottom-4">
        <div>{/** Col 1  */}</div>
        <Notify />
        <div>{/** Col 2  */}</div>
      </div>
      <div className="w-full ">
        <Nearby />
      </div>
    </main>
  );
}
