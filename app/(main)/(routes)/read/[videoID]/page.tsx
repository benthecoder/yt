'use client';

import { formatDate } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import TableOfContents from '@/components/toc';
import Markdown from '@/components/Markdown';

type StageKeys =
  | 'Downloader.run'
  | 'transcribe'
  | 'summarize'
  | 'generate_summary'
  | 'categorize_text'
  | 'end';

const calculateProgress = (status: { stage: StageKeys }) => {
  const stages: Record<StageKeys, number> = {
    'Downloader.run': 10,
    transcribe: 30,
    summarize: 60,
    generate_summary: 70,
    categorize_text: 90,
    end: 100,
  };
  return stages[status.stage] || 0;
};

const statusText = (stage: StageKeys) => {
  const descriptions: Record<StageKeys, string> = {
    'Downloader.run': 'Downloading video...',
    transcribe: 'Transcribing audio...',
    summarize: 'Summarizing content...',
    generate_summary: 'Generating summary...',
    categorize_text: 'Categorizing text...',
    end: 'Processing complete!',
  };
  return descriptions[stage] || 'Processing...';
};

const Reader = ({ params }: any) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { videoID } = params;
  console.log('Video ID:', videoID);
  const searchParams = useSearchParams();
  const router = useRouter();
  const call_id = searchParams.get('call_id');
  console.log('Call ID:', call_id);

  const [tab, setTab] = useState('summary');

  const {
    data: video,
    isLoading: videoLoading,
    error: videoError,
    mutate: refreshVideo,
  } = useSWR(
    `https://weichunnn-production--yt-university-app.modal.run/api/videos/${videoID}`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  console.log('Video data:', video);
  console.log('Video error:', videoError);

  const {
    data: status,
    mutate: refreshStatus,
    isLoading: statusLoading,
  } = useSWR(
    call_id
      ? `https://weichunnn-production--yt-university-app.modal.run/api/status/${call_id}`
      : null,
    fetcher,
    {
      refreshInterval: 1000,
      revalidateOnFocus: false,
    }
  );

  console.log('Status data:', status);
  console.log('Status loading:', statusLoading);

  useEffect(() => {
    if (status && status.stage === 'end' && status.status === 'DONE') {
      console.log('Status is done, refreshing...');
      router.replace(`/read/${videoID}`, undefined, { shallow: true });
      refreshStatus();
    }
  }, [status, refreshStatus, router, videoID]);

  if (videoLoading || (call_id && statusLoading)) {
    console.log('Loading data...');
    return <div className="text-center py-10">Loading...</div>;
  }

  if (videoError) {
    console.log('Error loading video.');
    return <div className="text-center py-10">Video not found</div>;
  }

  const progress = call_id && status ? calculateProgress(status) : 100;
  console.log('Progress:', progress);

  const renderContent = () => {
    console.log('Rendering content for stage:', status?.stage);
    switch (status?.stage) {
      case 'Downloader.run':
        console.log('Stage: Downloader.run');
        return (
          <div className="text-center py-10">
            <div className="text-xl text-gray-600">
              {statusText(status.stage)}
            </div>
            <Progress value={progress} className="w-full max-w-3xl mx-auto" />
          </div>
        );
      case 'transcribe':
        console.log('Stage: transcribe');
        return (
          <div className="py-10 px-8 max-w-7xl mx-auto flex flex-col">
            <div className="flex-1 p-4 rounded-lg">
              <div className="text-lg font-bold text-gray-500">
                {video.channel}
              </div>
              <div className="text-3xl font-bold max-w-xl">{video.title}</div>
              <div className="max-w-xl">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoID}`}
                  allowFullScreen
                />
              </div>
            </div>
            <div className="text-center py-10">
              <div className="text-xl text-gray-600">
                {statusText(status.stage)}
              </div>
              <Progress value={progress} className="w-full max-w-3xl mx-auto" />
            </div>
          </div>
        );
      case 'summarize':
        console.log('Stage: summarize');
        return (
          <div className="py-10 px-8 max-w-7xl mx-auto flex flex-col">
            <div className="flex-1 p-4 rounded-lg">
              <div className="text-lg font-bold text-gray-500">
                {video.channel}
              </div>
              <div className="text-3xl font-bold max-w-xl">{video.title}</div>
              <div className="max-w-xl">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoID}`}
                  allowFullScreen
                />
              </div>
            </div>
            <div className="text-center py-10">
              <div className="text-xl text-gray-600">
                {statusText(status.stage)}
              </div>
              <Progress value={progress} className="w-full max-w-3xl mx-auto" />
            </div>
          </div>
        );
      case 'generate_summary':
        console.log('Stage: generate_summary');
        return (
          <div className="py-10 px-8 max-w-7xl mx-auto flex flex-col">
            <div className="flex-1 p-4 rounded-lg">
              <div className="text-lg font-bold text-gray-500">
                {video.channel}
              </div>
              <div className="text-3xl font-bold max-w-xl">{video.title}</div>
              <div className="max-w-xl">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoID}`}
                  allowFullScreen
                />
              </div>
            </div>
            <div className="text-center py-10">
              <div className="text-xl text-gray-600">
                {statusText(status.stage)}
              </div>
              <Progress value={progress} className="w-full max-w-3xl mx-auto" />
            </div>
          </div>
        );
      case 'categorize_text':
        console.log('Stage: categorize_text');
        return (
          <div className="py-10 px-8 max-w-7xl mx-auto flex flex-col">
            <div className="flex-1 p-4 rounded-lg">
              <div className="text-lg font-bold text-gray-500">
                {video.channel}
              </div>
              <div className="text-3xl font-bold max-w-xl">{video.title}</div>
              <div className="max-w-xl">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoID}`}
                  allowFullScreen
                />
              </div>
            </div>
            <div className="text-center py-10">
              <div className="text-xl text-gray-600">
                {statusText(status.stage)}
              </div>
              <Progress value={progress} className="w-full max-w-3xl mx-auto" />
            </div>
          </div>
        );
      case 'end':
        console.log('Stage: end');
        return (
          <div className="py-10 px-8 max-w-7xl mx-auto flex flex-col">
            <div className="flex-1 p-4 rounded-lg">
              {video ? (
                <>
                  <div className="text-lg font-bold text-gray-500">
                    {video.channel}
                  </div>
                  <div className="text-3xl font-bold max-w-xl">
                    {video.title}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="my-4 text-gray-500">
                      {video.uploaded_at && formatDate(video.uploaded_at)}
                    </div>
                  </div>
                  <div className="max-w-xl">
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${videoID}`}
                      allowFullScreen
                    />
                  </div>
                </>
              ) : (
                <div>Loading video details...</div>
              )}
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
                  <Markdown content={video.summary} />
                </div>
                <TableOfContents />
              </div>
            ) : (
              <div className="prose bg-white p-2 rounded-lg">
                <Markdown content={video.description} />
              </div>
            )}
          </div>
        );
      default:
        console.log('Stage: default (no match)');
        return (
          <div className="py-10 px-8 max-w-7xl mx-auto flex flex-col">
            <div className="flex-1 p-4 rounded-lg">
              {video ? (
                <>
                  <div className="text-lg font-bold text-gray-500">
                    {video.channel}
                  </div>
                  <div className="text-3xl font-bold max-w-xl">
                    {video.title}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="my-4 text-gray-500">
                      {video.uploaded_at && formatDate(video.uploaded_at)}
                    </div>
                  </div>
                  <div className="max-w-xl">
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${videoID}`}
                      allowFullScreen
                    />
                  </div>
                </>
              ) : (
                <div>Loading video details...</div>
              )}
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
                  <Markdown content={video.summary} />
                </div>
                <TableOfContents />
              </div>
            ) : (
              <div className="prose bg-white p-2 rounded-lg">
                <Markdown content={video.description} />
              </div>
            )}
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
};

export default Reader;
