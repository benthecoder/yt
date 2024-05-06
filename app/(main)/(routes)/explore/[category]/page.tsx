'use client';

import VideoCarousel from '@/components/videoCarousel';
import useSWR from 'swr';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

const VideoByCategory = ({ params }: any) => {
  const { category } = params;
  const { data: videos, isLoading } = useSWR(
    `https://weichunnn-production--yt-university-app.modal.run/api/videos?page=1&page_size=10&category=${category}`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return (
    <div className="flex h-screen">
      <VideoCarousel
        heading={`${category} videos`}
        subheading={`Showing ${videos ? videos.length : 0} videos`}
        videos={videos}
        isLoading={isLoading}
      />
    </div>
  );
};

export default VideoByCategory;