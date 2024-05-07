import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
type VideoProps = {
  video: {
    id: string;
    title: string;
    channel: string;
    thumbnail: string;
    uploaded_at: string;
    category: string;
  };
};

const VideoList = ({ video }: VideoProps) => {
  return (
    <Link key={video.id} href={`read/${video.id}`}>
      <div className="flex border-b h-24 items-center border-gray-100 gap-4 hover:bg-gray-100">
        <Image
          src={video.thumbnail}
          alt={video.title}
          width={100}
          height={60}
          className="rounded-md my-4 ml-2"
        />
        <div className="flex-1 min-w-0">
          <div className="text-md font-bold truncate">{video.title}</div>
          <div className="flex gap-3 items-center mt-2">
            <div className="text-xs text-gray-500">{video.channel}</div>
            <div className="h-[2px] w-[2px] bg-gray-500 rounded-full"></div>
            <div className="text-gray-400 text-xs">
              {formatDate(video.uploaded_at)}
            </div>
            {!video.category.startsWith('Failed') && (
              <div>
                <div className="text-xs rounded-md bg-gray-100 p-1 text-slate-700">
                  {!video.category.startsWith('Failed') ? video.category : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoList;
