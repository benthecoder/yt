'use client';

import useSWR from 'swr';
import VideoList from '@/components/videoList';
import { useUser } from '@clerk/nextjs';

type Video = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  uploaded_at: string;
};

const Home = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { isSignedIn, user } = useUser();

  const { data: videos, isLoading } = useSWR(
    isSignedIn
      ? `https://weichunnn-production--yt-university-app.modal.run/api/videos?page=1&page_size=20&user_id=${user?.id}`
      : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!videos) {
    return <div className="text-center py-10">No videos found</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-full">
        {videos.map((video: Video) => (
          <VideoList key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Home;
