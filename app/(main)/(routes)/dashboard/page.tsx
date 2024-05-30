'use client';

import useSWR from 'swr';
import VideoList from '@/components/videoList';
import { useUser } from '@clerk/nextjs';
import { IconMap } from '@/lib/constants';
import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Video = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  uploaded_at: string;
  updated_at: string;
  category: string;
};

const parseDate = (dateStr: String) => {
  return new Date(
    dateStr.slice(0, 4),
    dateStr.slice(4, 6) - 1,
    dateStr.slice(6, 8)
  );
};

const Home = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { isSignedIn, user } = useUser();
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [sortOrder, setSortOrder] = React.useState('updated_at');

  const { data: allVideos, isLoading } = useSWR(
    isSignedIn
      ? `https://weichunnn-production--yt-university-app.modal.run/api/videos?page=1&page_size=20&user_id=${user?.id}`
      : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  console.log(allVideos);

  let videos = React.useMemo(() => {
    if (!allVideos) return null;

    let filteredVideos =
      selectedCategory === 'All'
        ? allVideos
        : allVideos.filter(
            (video: Video) => video.category === selectedCategory
          );

    switch (sortOrder) {
      case 'uploaded_at':
        return filteredVideos.sort(
          (a, b) => parseDate(b.uploaded_at) - parseDate(a.uploaded_at)
        );
      case 'updated_at':
        return filteredVideos.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
      case 'random':
        return filteredVideos.sort(() => 0.5 - Math.random());
      default:
        return filteredVideos;
    }
  }, [allVideos, selectedCategory, sortOrder]);

  if (isLoading || !videos) {
    return <div className="text-center py-10">Loading...</div>;
  }
  if (isLoading || !videos) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-full">
        <div className="flex gap-4 pb-4 border-b">
          <Select onValueChange={(e) => setSelectedCategory(e)}>
            <SelectTrigger className="w-[150px] ml-2 text-xs">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="All">All</SelectItem>
                {Object.keys(IconMap).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={setSortOrder}>
            <SelectTrigger className="w-[120px] text-xs">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort By</SelectLabel>
                <SelectItem value="uploaded_at">Upload Date</SelectItem>
                <SelectItem value="updated_at">Added Date</SelectItem>
                <SelectItem value="random">Shuffle</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {videos && videos.length > 0 ? (
          videos.map((video: Video) => (
            <VideoList key={video.id} video={video} />
          ))
        ) : (
          <div className="text-center py-10">No videos found</div>
        )}
      </div>
    </div>
  );
};

export default Home;
