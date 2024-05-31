'use client';

import { formatDate } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import TableOfContents from '@/components/toc';
import Markdown from '@/components/Markdown';

type StageKeys =
  | 'services.download.Downloader.run'
  | 'services.transcribe.transcribe'
  | 'services.summarize.generate_summary'
  | 'services.summarize.categorize_text'
  | 'end';

const calculateProgress = (status: { stage: StageKeys }) => {
  if (!status) return 0;

  const stages: Record<StageKeys, number> = {
    'services.download.Downloader.run': 10,
    'services.transcribe.transcribe': 30,
    'services.summarize.generate_summary': 50,
    'services.summarize.categorize_text': 90,
    end: 100,
  };
  return stages[status.stage] || 0;
};

const statusText = (stage: StageKeys) => {
  const descriptions: Record<StageKeys, string> = {
    'services.download.Downloader.run': 'Downloading video...',
    'services.transcribe.transcribe': 'Transcribing audio...',
    'services.summarize.generate_summary': 'Summarizing content...',
    'services.summarize.categorize_text': 'Categorizing text...',
    end: 'Processing complete!',
  };
  return descriptions[stage] || 'Processing...';
};

const Reader = ({ params }: any) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { videoID } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const call_id = searchParams.get('call_id');
  const [tab, setTab] = useState('summary');

  //if call id exist, then we're summarizing
  //if not, then we're reading
  const [downloaded, isDownloaded] = useState(call_id ? false : true);
  const [summarized, isSummarized] = useState(call_id ? false : true);

  const {
    data: video,
    isLoading: videoLoading,
    error: videoError,
    mutate: refreshVideo,
  } = useSWR(
    `https://onyx--yt-university-app.modal.run/api/videos/${videoID}`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const {
    data: status,
    mutate: refreshStatus,
    error: statusError,
    isValidating: statusValidating,
  } = useSWR(
    call_id
      ? `https://onyx--yt-university-app.modal.run/api/status/${call_id}`
      : null,
    fetcher,
    {
      refreshInterval: 1000,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    console.log('Video data:', video);

    if (call_id) {
      console.log('Status data:', status);
      refreshStatus();
    }

    if (status && statusError) {
      console.log('Error processing job, refreshing...');
    }

    if (status && status.stage === 'services.transcribe.transcribe') {
      isDownloaded(true);

      refreshVideo();
    }

    if (status && status.stage === 'end' && status.status === 'DONE') {
      console.log('Status is done, refreshing...');
      isSummarized(true);

      router.replace(`/read/${videoID}`);
      router.refresh();
    }
  }, [
    status,
    video,
    call_id,
    refreshStatus,
    refreshVideo,
    statusValidating,
    router,
    videoID,
  ]);

  if (videoLoading) {
    console.log('Loading video...');
    return <div className="text-center py-10">Loading video...</div>;
  }

  if (videoError) {
    console.log('Error loading video.');
    return <div className="text-center py-10">Video not found</div>;
  }

  if (statusError) {
    console.log('Error loading status.');
    return <div className="text-center py-10">Error processing video</div>;
  }

  return downloaded ? (
    <>
      <div className="py-10 px-8 max-w-7xl mx-auto flex flex-col">
        <div className="flex-1 p-4 rounded-lg">
          <div className="text-lg font-bold text-gray-500">{video.channel}</div>
          <div className="text-3xl font-bold max-w-xl">{video.title}</div>
          <div className="flex items-center gap-4">
            <div className="my-4 text-gray-500">
              {video.uploaded_at && formatDate(video.uploaded_at)}
            </div>
            {/*<div className="text-gray-500">•</div>*/}
            {/*<div className="my-4 text-gray-500">
              {Math.floor(video.duration / 60)} minutes saved
            </div>*/}
          </div>
          <div className="max-w-xl">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${videoID}`}
              allowFullScreen
            />
          </div>
        </div>
        <div className="border-b border-gray">
          <button
            onClick={() => setTab('summary')}
            className={`px-2 py-2 text-gray-500 ${
              tab === 'summary'
                ? 'font-bold border-b-4 border-black text-black'
                : ''
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setTab('video')}
            className={`px-2 py-2 text-gray-500 ${
              tab === 'video'
                ? 'font-bold border-b-4 border-black text-black'
                : ''
            }`}
          >
            Video
          </button>
        </div>
        {tab === 'summary' && video ? (
          <div className="flex">
            <div className="prose bg-white p-2 rounded-lg">
              {summarized ? (
                <Markdown content={video.summary} />
              ) : (
                <div className="text-center py-10">
                  <div>{statusText(status?.stage)}</div>
                  <Progress value={calculateProgress(status.stage)} />
                </div>
              )}
            </div>
            <TableOfContents />
          </div>
        ) : (
          <div className="prose bg-white p-2 rounded-lg">
            <Markdown content={video.description} />
          </div>
        )}
      </div>
    </>
  ) : (
    <p className="text-center py-10">Downloading your video...</p>
  );
};

export default Reader;
