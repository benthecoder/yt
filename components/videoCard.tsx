import Image from 'next/image';
import Link from 'next/link';

interface VideoListProps {
  id: string;
  title: string;
  channel: string;
  thumbnail: string | boolean;
}

const VideoList: React.FC<VideoListProps> = ({
  id,
  title,
  channel,
  thumbnail,
}) => {
  const imageSrc = typeof thumbnail === 'string' ? thumbnail : '/thumbnail.jpg';

  return (
    <Link
      href={`/read/${id}`}
      className="block group overflow-hidden rounded-md bg-white border border-black h-72 md:h-60 xl:h-72 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
    >
      <div className="relative w-full h-54 xl:h-48 overflow-hidden">
        <Image
          priority
          src={imageSrc}
          alt={title}
          height={500}
          width={1000}
          className="transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>
      <div className="px-3 pt-2 xl:pt-0 flex flex-col justify-between">
        <p className="text-md text-gray-500 font-bold overflow-hidden">
          {channel}
        </p>
        <p className="text-sm pt-2 text-gray-800 font-bold line-clamp-2 overflow-hidden">
          {title}
        </p>
      </div>
    </Link>
  );
};

export default VideoList;
