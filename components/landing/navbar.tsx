'use client';

import React from 'react';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import { useAuth, UserButton } from '@clerk/nextjs';
import { SHOW_BACKGROUND_SEGMENTS } from '@/lib/constants';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import Logo from '@/components/Logo';

const LandingNavbar = () => {
  const scrolled = useScroll(80);
  const selectedLayout = useSelectedLayoutSegment();
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-400`,
        {
          'border-b border-gray-200 bg-white/75 backdrop-blur-lg': scrolled,
          'border-b border-gray-200 bg-white':
            selectedLayout && !SHOW_BACKGROUND_SEGMENTS.has(selectedLayout),
        }
      )}
    >
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between">
          <Logo />

          <div className="hidden lg:block">
            {sessionId ? (
              <div className="flex flex-row space-x-2">
                <div className="hidden items-center space-x-4 sm:flex font-medium text-sm">
                  <Link href="/dashboard">Dashboard</Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="animate-fade-in rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors ease-out hover:text-black"
                >
                  Log in
                </Link>

                <Link
                  href="/sign-up"
                  className="animate-fade-in rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default LandingNavbar;
