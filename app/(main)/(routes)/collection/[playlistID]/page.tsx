'use client';

import useSWR from 'swr';
import VideoList from '@/components/videoList';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Trash, Pencil, Clipboard } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Schema for the playlist form using Zod
const playlistSchema = z.object({
  name: z.string().min(1, 'Please provide a title.'),
  description: z.string().optional(),
});

const Playlist = ({ params }: any) => {
  const { playlistID } = params;

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const router = useRouter();
  const pathname = usePathname();

  const { isSignedIn, user } = useUser();
  const {
    data: playlists,
    error,
    mutate,
  } = useSWR(
    isSignedIn
      ? `https://onyx--yt-university-app.modal.run/api/playlists/${playlistID}`
      : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!playlists && !error) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10">Failed to fetch playlists</div>;
  }

  console.log(playlists);

  const handleDelete = async () => {
    const response = await fetch(
      `https://onyx--yt-university-app.modal.run/api/playlists/${playlistID}`,
      {
        method: 'DELETE',
      }
    );

    if (response.ok) {
      router.push('/collection');
    } else {
      console.error('Failed to delete playlist');
    }
  };

  const handleCopyPathname = () => {
    const fullURL = window.location.href;
    navigator.clipboard
      .writeText(fullURL)
      .then(() => {
        toast({
          title: 'Playlist copied to clipboard!',
        });
      })
      .catch((err) => {
        console.error('Failed to copy URL: ', err);
      });
  };

  const EditPlaylistDialog = ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    const form = useForm({
      resolver: zodResolver(playlistSchema),
      defaultValues: {
        name: playlists.name,
        description: playlists.description,
      },
    });

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = form;

    const onSubmit = async (data: any) => {
      console.log(data);

      const response = await fetch(
        `https://onyx--yt-university-app.modal.run/api/playlists`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playlist_id: playlistID,
            ...data,
          }),
        }
      );

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        mutate(); // Re-fetch the playlist data
        reset();
        onClose();

        toast({
          title: 'Playlist updated!',
        });
      } else {
        console.error('Failed to edit playlist');
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>Edit Playlist</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label>Title</label>
              <Input placeholder="Playlist Title" {...register('name')} />
              {errors.name && <p>{errors.name.message}</p>}
            </div>
            <div>
              <label>Description</label>
              <Input
                placeholder="Description (optional)"
                {...register('description')}
              />
              {errors.description && <p>{errors.description.message}</p>}
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const DeleteConfirmationDialog = ({ isOpen, onClose }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-center">
        <DialogTitle className="mt-4">Confirm Deletion</DialogTitle>
        <p>
          Are you sure you want to delete this playlist? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex space-x-2 justify-center">
          <Button onClick={handleDelete} className="bg-red-500 text-white">
            Confirm
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="md:flex">
      <div className="md:w-1/3 md:h-screen p-6 bg-gray-100 rounded-lg">
        <Image
          src={playlists.videos[0]?.thumbnail || '/home.png'}
          width={200}
          height={200}
          alt="Playlist Thumbnail"
          className="w-full rounded-xl"
        />
        <h1 className="text-2xl font-semibold mt-4">{playlists.name}</h1>
        <p className="mt-2 text-gray-700">{playlists.description}</p>

        <p className="text-gray-500 mt-2 text-xs">
          Created by {user?.fullName}
        </p>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => setEditDialogOpen(true)}
            className="text-black border border-black p-2 rounded-md hover:bg-black hover:text-white"
          >
            <Pencil />
          </button>
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="text-black border border-black p-2 items-center justify-center rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] hover:bg-red-600 hover:border-red-600 hover:text-white"
          >
            <Trash />
          </button>
          <button
            onClick={handleCopyPathname}
            className="text-black border border-black p-2 rounded-md hover:bg-black hover:text-white"
          >
            <Clipboard />
          </button>
        </div>
        <EditPlaylistDialog
          isOpen={isEditDialogOpen}
          onClose={() => setEditDialogOpen(false)}
        />
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        />
      </div>
      <div className="md:w-2/3 ">
        <div className="grid grid-cols-1 pl-2">
          {playlists.videos.length == 0 ? (
            <div className="text-center py-10">No videos found</div>
          ) : (
            playlists.videos.map((video) => (
              <VideoList key={video.id} video={video} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
