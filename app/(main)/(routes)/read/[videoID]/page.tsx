'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkToc from 'remark-toc';
import { formatDate } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
interface MarkdownProps {
  content: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Markdown = ({ content }: MarkdownProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[
        [remarkGfm, { singleTilde: false }],
        [remarkToc, { tight: true, maxDepth: 5 }],
      ]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: ({ node, ...props }) => <a href={props.href} {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

type StageKeys = 'Downloader.run' | 'transcribe' | 'summarize' | 'end';

const calculateProgress = (status: { stage: StageKeys }) => {
  const stages: Record<StageKeys, number> = {
    'Downloader.run': 20,
    transcribe: 50,
    summarize: 80,
    end: 100,
  };
  return stages[status.stage] || 0;
};

const Reader = ({ params }: any) => {
  const { videoID } = params;
  const searchParams = useSearchParams();
  const call_id = searchParams.get('call_id');

  console.log(call_id);

  const [tab, setTab] = useState('summary'); // State to manage tabs

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
      refreshInterval: 5000,
      revalidateOnFocus: false,
    }
  );

  const {
    data: video,
    isLoading: videoLoading,
    error: videoError,
  } = useSWR(
    `https://weichunnn-production--yt-university-app.modal.run/api/video/${videoID}`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  useEffect(() => {
    if (status && status.stage === 'end' && status.status === 'DONE') {
      refreshStatus();
    }
  }, [status, refreshStatus]);

  if (videoLoading || (call_id && statusLoading)) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (videoError) {
    return <div className="text-center py-10">Video not found</div>;
  }

  const progress = call_id && status ? calculateProgress(status) : 100;

  if (progress < 100) {
    return <Progress value={progress} className="w-[60%]" />;
  }

  console.log(video);

  return (
    <div className="py-10 px-8 max-w-3xl">
      <div className="flex flex-col gap-4 mb-6">
        <div className="text-lg font-bold text-gray-500">{video.channel}</div>
        <div className="text-3xl font-bold max-w-xl">{video.title}</div>
      </div>
      <div className="my-4 text-gray-500">{formatDate(video.uploaded_at)}</div>
      <div className="max-w-2xl">
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${videoID}`}
          allowFullScreen
        />
      </div>

      <div className="border-b border-gray my-10">
        <button
          onClick={() => setTab('summary')}
          className={cn(`px-2 py-2 text-gray-500`, {
            'font-bold border-b-4 border-black text-black': tab === 'summary',
          })}
        >
          Summary
        </button>
        <button
          onClick={() => setTab('video')}
          className={cn(`px-2 py-2 text-gray-500`, {
            'font-bold border-b-4 border-black text-black': tab === 'video',
          })}
        >
          Video
        </button>
      </div>
      {tab === 'summary' ? (
        <div className="prose">
          <Markdown content={video.summary} />
        </div>
      ) : (
        <div className="prose">
          <Markdown content={video.description} />
        </div>
      )}
    </div>
  );
};

export default Reader;
