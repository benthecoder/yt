import React from 'react';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import { Clipboard } from 'lucide-react';
import Image from 'next/image';

export function Features() {
  return (
    <div className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
      <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={item.className}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
    </div>
  );
}

const ImageComponent = ({ src, alt }) => (
  <div className="relative w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
    <Image src={src} alt={alt} layout="fill" objectFit="cover" />
  </div>
);

const items = [
  {
    title: 'Convert Videos to Articles',
    description: 'Transform videos into readable articles with key takeaways.',
    header: (
      <ImageComponent src="/landing1.jpg" alt="Convert Videos to Articles" />
    ),
    className: 'md:col-span-1',
    icon: <Clipboard className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'Save and Organize Videos',
    description:
      'Easily save YouTube videos and organize them into custom playlists.',
    header: (
      <ImageComponent src="/landing4.jpg" alt="Save and Organize Videos" />
    ),
    className: 'md:col-span-2',
    icon: <Clipboard className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'Share with Friends',
    description:
      'Share your favorite videos and articles with your friends easily.',
    header: <ImageComponent src="/landing3.jpeg" alt="Share with Friends" />,
    className: 'md:col-span-2',
    icon: <Clipboard className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'Receive Newsletters',
    description:
      'Get personalized articles and videos delivered to your inbox (coming soon).',
    header: <ImageComponent src="/landing1.jpeg" alt="Receive Newsletters" />,
    className: 'md:col-span-1',
    icon: <Clipboard className="h-4 w-4 text-neutral-500" />,
  },
];
