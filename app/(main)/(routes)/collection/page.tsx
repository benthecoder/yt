'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useSWR from 'swr';
import { toast } from '@/components/ui/use-toast';

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

// Schema for the playlist form using Zod
const playlistSchema = z.object({
  name: z.string().min(1, 'Please provide a title.'),
  description: z.string().optional(),
});

function CreatePlaylistDialog({ isOpen, onClose }) {
  const { user } = useUser();

  const form = useForm({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (data) => {
    console.log(data);
    console.log(user?.id);

    const response = await fetch(
      'https://onyx--yt-university-app.modal.run/api/playlists',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, user_id: user?.id }),
      }
    );

    const result = await response.json(); // Parsing the JSON body of the response
    console.log(result);

    console.log(response);
    console.log(response.body);

    if (response.ok) {
      reset();
      onClose(); // Close dialog
      window.location.reload(); // Reload to show new playlist

      toast({
        title: 'Playlist created successfully!',
      });
    } else {
      console.error('Failed to create playlist');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Add New Playlist</DialogTitle>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Playlist Title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description (optional)" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Create Playlist</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const PlaylistCollection = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { isSignedIn, user } = useUser();

  const { data: playlists, error } = useSWR(
    isSignedIn
      ? `https://onyx--yt-university-app.modal.run/api/playlists?user_id=${user?.id}`
      : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  console.log(playlists);

  if (!playlists && !error) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10">Failed to fetch playlists</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {playlists.length > 0 ? (
        playlists.map((playlist) => (
          <Link href={`/collection/${playlist.id}`} key={playlist.id}>
            <div className="card text-md text-black border border-black gap-2 items-center justify-center  shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-lg p-4">
              <h2 className="text-lg font-bold">{playlist.name}</h2>
              <p>{playlist.description || 'No description provided.'}</p>
            </div>
          </Link>
        ))
      ) : (
        <div className="text-center py-10">No playlists found</div>
      )}
    </div>
  );
};

const Collection = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [isPlaylistDialogOpen, setPlaylistDialogOpen] = useState(false);

  return (
    <div className="h-screen">
      <div className="flex flex-col h-full">
        <Button
          onClick={() => setPlaylistDialogOpen(true)}
          className="m-4 w-24"
        >
          Add Playlist
        </Button>

        <CreatePlaylistDialog
          isOpen={isPlaylistDialogOpen}
          onClose={() => setPlaylistDialogOpen(false)}
        />

        <PlaylistCollection />
      </div>
    </div>
  );
};

export default Collection;
