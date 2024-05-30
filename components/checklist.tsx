'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/nextjs';
import useSWR from 'swr';

const addToPlaylists = async (playlistId, videoIds) => {
  const response = await fetch(
    `https://weichunnn-production--yt-university-app.modal.run/api/playlists/${playlistId}/videos`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_ids: videoIds }),
    }
  );
  return response.ok;
};

const removeFromPlaylists = async (playlistId, videoIds) => {
  const response = await fetch(
    `https://weichunnn-production--yt-university-app.modal.run/api/playlists/${playlistId}/videos`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_ids: videoIds }),
    }
  );
  return response.ok;
};

const FormSchema = z.object({
  playlists: z.array(z.string()),
});

const Checklist = ({ videoId, playlistId }) => {
  const { user, isSignedIn } = useUser();
  const userId = user?.id;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      playlists: playlistId,
    },
  });

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data: playlists, error } = useSWR(
    isSignedIn
      ? `https://weichunnn-production--yt-university-app.modal.run/api/playlists?user_id=${userId}`
      : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  if (!playlists && !error) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const onSubmit = async (data) => {
    const prevPlaylist = playlistId;
    const added = data.playlists.filter((p) => !prevPlaylist.includes(p));
    const removed = prevPlaylist.filter((p) => !data.playlists.includes(p));

    console.log('Previous Playlists:', prevPlaylist);
    console.log('Current Playlists:', data.playlists);
    console.log('Added Playlists:', added);
    console.log('Removed Playlists:', removed);

    const addedResults = await Promise.all(
      added.map((playlistId) => addToPlaylists(playlistId, [videoId]))
    );
    const removedResults = await Promise.all(
      removed.map((playlistId) => removeFromPlaylists(playlistId, [videoId]))
    );

    if (
      addedResults.every((result) => result) &&
      removedResults.every((result) => result)
    ) {
      toast({
        title: 'Updated playlists successfully!',
      });
    } else {
      toast({
        title: 'Failed to update playlists',
        description: 'An error occurred while updating the playlists.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="playlists"
          render={({ field }) => (
            <FormItem>
              <div className="mb-6">
                <FormLabel className="text-base">Manage Playlist</FormLabel>
                <FormDescription>
                  Add/remove video to playlists.
                </FormDescription>
              </div>

              {playlists.map((playlist) => (
                <FormItem
                  key={playlist.id}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <Checkbox
                    checked={field.value?.includes(playlist.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...field.value, playlist.id])
                        : field.onChange(
                            field.value?.filter(
                              (value) => value !== playlist.id
                            )
                          );
                    }}
                  />
                  <FormLabel>{playlist.name}</FormLabel>
                </FormItem>
              ))}
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-10 text-xs">
          Update Playlists
        </Button>
      </form>
    </Form>
  );
};

export default Checklist;
