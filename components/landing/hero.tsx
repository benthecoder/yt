'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '@clerk/nextjs';

export const LandingHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <>
      <div className="mx-auto h-full w-full flex items-center justify-center text-center relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="w-full max-w-screen-xl px-2.5 md:px-20 pb-28 pt-28 flex flex-col items-center justify-center text-center sm:pt-40 ">
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl">
            An Open University for
            <span className="text-purple-700"> Everyone </span>
            <br className="hidden sm:block" />
          </h1>
          <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
            Learn anything with YouTube videos. Turn videos into bite-sized
            content. Share and curate.
          </p>
          <div className="mt-2 flex items-center pt-10">
            <Link
              href={isSignedIn ? '/dashboard' : '/sign-up'}
              className="px-8 mt-5"
            >
              <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1.5px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full px-10 text-md font-medium bg-purple-100 text-black backdrop-blur-3xl">
                  Get Started
                </span>
              </button>
            </Link>
          </div>

          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image
                    src="/demo.jpeg"
                    alt="w"
                    width={1364}
                    height={866}
                    quality={100}
                    className="rounded-md bg-white  shadow-2xl ring-1 ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
