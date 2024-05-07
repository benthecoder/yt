'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import { formatDate } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import useSWR from 'swr';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import TableOfContents from '@/components/toc';

interface MarkdownProps {
  content: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Markdown = ({ content }: MarkdownProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[[remarkGfm, { singleTilde: false }], [remarkToc]]}
      // @ts-expect-error
      rehypePlugins={[rehypeRaw, rehypeSlug, rehypeAutolinkHeadings]}
      components={{
        a: ({ node, ...props }) => (
          <a
            href={props.href}
            {...props}
            className="text-blue-500 hover:underline"
          />
        ),
        h1: ({ node, ...props }) => (
          <h1 {...props} className="text-3xl font-bold mt-8 mb-4" />
        ),
        h2: ({ node, ...props }) => (
          <h2
            {...props}
            className="text-2xl text-blue-100 font-bold mt-6 mb-4"
          />
        ),
        h3: ({ node, ...props }) => (
          <h3 {...props} className="text-xl font-bold mt-4 mb-2" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

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
  const { videoID } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const call_id = searchParams.get('call_id');

  console.log(call_id);

  const [tab, setTab] = useState('summary'); // State to manage tabs

  const {
    data: video,
    isLoading: videoLoading,
    error: videoError,
    mutate: refreshVideo,
  } = useSWR(
    `https://weichunnn-production--yt-university-app.modal.run/api/video/${videoID}`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  console.log(video);

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

  console.log(status);

  useEffect(() => {
    if (status && status.stage === 'end' && status.status === 'DONE') {
      router.replace(`/read/${videoID}`, undefined, { shallow: true }); // Replace the current URL without the call_id
      refreshStatus();
    }
  }, [status, refreshStatus, router, videoID]);

  if (videoLoading || (call_id && statusLoading)) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (videoError) {
    return <div className="text-center py-10">Video not found</div>;
  }

  const progress = call_id && status ? calculateProgress(status) : 100;
  console.log(progress);

  if (progress < 100 && progress > 0) {
    return (
      <div className="text-center py-10">
        <div className="text-xl text-gray-600">{statusText(status.stage)}</div>
        <Progress value={progress} className="w-full max-w-3xl mx-auto" />
      </div>
    );
  }

  return (
    <div className="py-10 px-8 max-w-7xl mx-auto flex flex-col ">
      <div className="flex-1 p-4 rounded-lg">
        {video ? (
          <>
            <div className="text-lg font-bold text-gray-500">
              {video.channel}
            </div>
            <div className="text-3xl font-bold max-w-xl">{video.title}</div>
            <div className="flex items-center gap-4">
              <div className="my-4 text-gray-500">
                {video.uploaded_at && formatDate(video.uploaded_at)}
              </div>
              {!video.category.startsWith('Failed') && (
                <div>
                  <div className="text-xs rounded-md bg-gray-100 p-1 text-slate-700">
                    {!video.category.startsWith('Failed')
                      ? video.category
                      : null}
                  </div>
                </div>
              )}
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
      {tab === 'summary' && video ? (
        <div className="flex">
          <div className="prose bg-white p-4 rounded-lg">
            <Markdown content={video.summary} />
          </div>
          <TableOfContents />
        </div>
      ) : (
        <div className="prose bg-white p-4 rounded-lg">
          <Markdown content={video.description} />
        </div>
      )}
    </div>
  );
};

export default Reader;
