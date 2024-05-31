'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import Checklist from './checklist';

type VideoProps = {
  video: {
    id: string;
    title: string;
    channel: string;
    thumbnail: string;
    uploaded_at: string;
    category: string;
    playlist_ids: string[];
  };
};

const VideoList = ({ video }: VideoProps) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const handleOpenDialog = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    e.stopPropagation(); // Stop event bubbling up to other elements
    setDialogOpen(true);
  };

  return (
    <>
      <Link key={video.id} href={`/read/${video.id}`}>
        <div className="relative z-0 group flex border-b h-24 w-full items-center border-gray-100 gap-4 hover:bg-gray-100 rounded-md">
          <Image
            src={video.thumbnail}
            alt={video.title}
            width={100}
            height={60}
            className="rounded-md my-4 ml-2"
          />
          <div className="flex-1 min-w-0 max-w-xs md:max-w-md xl:max-w-4xl">
            <div className="text-md font-bold truncate">{video.title}</div>
            <div className="flex gap-3 items-center mt-2 truncate">
              <div className="text-xs text-gray-500 truncate">
                {video.channel}
              </div>
              <div className="h-[2px] w-[2px] bg-gray-500 rounded-full"></div>
              <div className="text-gray-400 text-xs truncate">
                {formatDate(video.uploaded_at)}
              </div>
              {/*{!video.category.startsWith('Failed') && (
                <div className="truncate">
                  <div className="text-xs rounded-md bg-gray-100 p-1 text-slate-700">
                    {!video.category.startsWith('Failed')
                      ? video.category
                      : null}
                  </div>
                </div>
              )}*/}
            </div>
          </div>

          <button
            onClick={handleOpenDialog}
            className="absolute right-0 z-10 p-2 mr-2 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-opacity duration-300 ease-in-out"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </Link>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="justify-center text-center max-w-xs rounded-md">
          <Checklist videoId={video.id} playlistId={video.playlist_ids} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoList;
