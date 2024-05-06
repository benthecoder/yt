'use client';

import CategoriesNav from '@/components/categories';
import { IconMap } from '@/lib/constants';
import VideoCarousel from '@/components/videoCarousel';
import useSWR from 'swr';

const Explore = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const categories = Object.keys(IconMap);

  const { data: videos, isLoading } = useSWR(
    'https://weichunnn-production--yt-university-app.modal.run/api/videos?page=1&page_size=10',
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return (
    <div className="flex flex-col h-screen gap-y-10 max-w-6xl">
      <CategoriesNav categories={categories} />
      <VideoCarousel
        heading="Recently Added"
        subheading="Recent saves by everyone"
        videos={videos}
        isLoading={isLoading}
      />

      <VideoCarousel
        heading="Trending Videos"
        subheading="Popular videos right now"
        videos={videos}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Explore;
