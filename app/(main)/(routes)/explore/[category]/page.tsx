'use client';

import VideoCarousel from '@/components/videoCarousel';
import useSWR from 'swr';

const VideoByCategory = ({ params }: any) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { category } = params;
  const { data: videos, isLoading } = useSWR(
    `https://onyx--yt-university-app.modal.run/api/videos?page=1&page_size=10&category=${category}`,
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
