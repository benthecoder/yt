'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const paths = [
  { path: '/dashboard', key: 'Home' },
  { path: '/explore', key: 'Explore' },
  { path: '/library', key: 'Library' },
];

const useNavigation = () => {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState({});

  useEffect(() => {
    const updatedState = paths.reduce<{ [key: string]: boolean }>(
      (acc, { path, key }) => {
        acc[key] = pathname === path;
        return acc;
      },
      {}
    );

    setActivePath(updatedState);
  }, [pathname]);

  return activePath;
};

export default useNavigation;
