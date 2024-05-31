'use client';

import CategoriesNav from '@/components/categories';
import { IconMap } from '@/lib/constants';
import VideoCarousel from '@/components/videoCarousel';
import useSWR from 'swr';
import { useUser } from '@clerk/nextjs';

const sortVideosByUpdatedAt = (videos: any) => {
  return videos
    .slice()
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
};

const sortVideosByFavoriteCount = (videos) => {
  return videos.slice().sort((a, b) => b.favorite_count - a.favorite_count);
};

const Explore = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { isSignedIn, user } = useUser();

  const categories = Object.keys(IconMap);

  const { data: videos, isLoading } = useSWR(
    isSignedIn
      ? `https://onyx--yt-university-app.modal.run/api/videos?user_id=${user?.id}&page=1&page_size=20`
      : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  console.log(videos);

  const recentlyAddedVideos = videos ? sortVideosByUpdatedAt(videos) : [];
  const trendingVideos = videos ? sortVideosByFavoriteCount(videos) : [];

  return (
    <div className="flex flex-col h-screen gap-y-10 max-w-6xl">
      <CategoriesNav categories={categories} />
      <VideoCarousel
        heading="Recently Added"
        subheading="Recent saves by everyone"
        videos={recentlyAddedVideos}
        isLoading={isLoading}
      />

      <VideoCarousel
        heading="Trending Videos"
        subheading="Popular videos right now"
        videos={trendingVideos}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Explore;
