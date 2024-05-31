'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';

interface VideoCardProps {
  id: string;
  title: string;
  channel: string;
  thumbnail: string | boolean;
  favorited: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  id,
  title,
  channel,
  thumbnail,
  favorited,
}) => {
  const imageSrc = typeof thumbnail === 'string' ? thumbnail : '/thumbnail.jpg';
  const [isFavorited, setIsFavorited] = useState(favorited);
  const { isSignedIn, user } = useUser();
  const { toast } = useToast();

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    console.log(favorited);
    console.log('Toggling favorite');

    try {
      const response = await fetch(
        `https://onyx--yt-university-app.modal.run/api/users/${user?.id}/favorites/${id}`,
        {
          method: isFavorited ? 'POST' : 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response);

      const data = await response.json();
      setIsFavorited(!isFavorited);
      console.log(data.message);

      if (response.ok) {
        isFavorited
          ? toast({
              title: 'Video Favorited',
              description: "It's now in your home page! 🎉",
            })
          : toast({
              title: 'Video Unfavorited',
              description: "It's now removed from your home page! 😢",
            });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };
  return (
    <Link href={`/read/${id}`} className="block group w-full relative z-0">
      <div>
        <Image
          priority
          width={1920}
          height={1080}
          src={imageSrc}
          alt={title}
          className="transition-transform duration-300 ease-in-out group-hover:scale-95 rounded-xl"
        />
        <button
          className="absolute z-10 top-0 right-0 m-2 p-2 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
          onClick={(e) => toggleFavorite(e)}
        >
          <Bookmark size={18} color="white" fill={favorited ? 'white' : ''} />
        </button>
      </div>
      <div className="p-2 flex flex-col">
        <p className="text-xs md:text-sm font-bold text-gray-600 mb-2">
          {channel}
        </p>
        <p className="text-xs md:text-sm lg:text-sm font-bold text-gray-800 line-clamp-2">
          {title}
        </p>
      </div>
    </Link>
  );
};

export default VideoCard;
