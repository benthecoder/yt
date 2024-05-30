// @ts-nocheck
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import AutoScroll from 'embla-carousel-auto-scroll';

import useEmblaCarousel from 'embla-carousel-react';
import VideoCard from './videoCard';
import '@/styles/carousel.css';

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
  onButtonClick?: (emblaApi: EmblaCarouselType) => void
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    if (onButtonClick) onButtonClick(emblaApi);
  }, [emblaApi, onButtonClick]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    if (onButtonClick) onButtonClick(emblaApi);
  }, [emblaApi, onButtonClick]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

type PropTypeButton = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>;

export const PrevButton: React.FC<PropTypeButton> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className="embla__button embla__button--prev"
      type="button"
      {...restProps}
    >
      <svg className="embla__button__svg" viewBox="0 0 532 532">
        <path
          fill="currentColor"
          d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
        />
      </svg>
      {children}
    </button>
  );
};

export const NextButton: React.FC<PropTypeButton> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className="embla__button embla__button--next"
      type="button"
      {...restProps}
    >
      <svg className="embla__button__svg" viewBox="0 0 532 532">
        <path
          fill="currentColor"
          d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
        />
      </svg>
      {children}
    </button>
  );
};

type Video = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  favorited: boolean;
};

interface PropType {
  heading: string;
  subheading: string;
  videos: Video[];
  isLoading: boolean;
}

const VideoCarousel: React.FC<PropType> = ({
  heading,
  subheading,
  videos,
  isLoading,
}) => {
  const options: EmblaOptionsType = { loop: false };

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    //AutoScroll({ playOnInit: true }),
    WheelGesturesPlugin(),
  ]);
  const [isPlaying, setIsPlaying] = useState(false);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoscroll = emblaApi?.plugins()?.autoScroll;
    if (!autoscroll) return;
    let resetOrStop;
    if (
      'stopOnInteraction' in autoscroll.options &&
      autoscroll.options.stopOnInteraction === false
    ) {
      resetOrStop = autoscroll.reset;
    } else {
      resetOrStop = autoscroll.stop;
    }

    if (typeof resetOrStop === 'function') {
      resetOrStop();
    }
  }, []);

  useEffect(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (!autoScroll) return;

    setIsPlaying(autoScroll.isPlaying());
    emblaApi
      .on('autoScroll:play', () => setIsPlaying(true))
      .on('autoScroll:stop', () => setIsPlaying(false))
      .on('reInit', () => setIsPlaying(autoScroll.isPlaying()));
  }, [emblaApi]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi, onNavButtonClick);

  if (!isLoading && (!Array.isArray(videos) || videos.length === 0)) {
    return (
      <section className="embla w-full">
        <div className="flex flex-row justify-between items-center mb-4">
          <h1 className="text-2xl flex-1">{heading}</h1>
        </div>
        <div className="text-center py-10">
          <p>No videos available.</p>
        </div>
      </section>
    );
  }
  return (
    <section className="embla w-full">
      <div className="flex flex-row justify-between items-center mb-6">
        <div className="flex flex-col mb-6">
          <h1 className="text-2xl flex-1">{heading}</h1>
          <p className="text-gray-600 font-light">{subheading}</p>
        </div>
        <div className="embla__controls flex-initial ">
          <div className="embla__buttons">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>
        </div>
      </div>

      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {isLoading ? (
            <React.Fragment>
              {[...Array(5)].map((_, index) => (
                <div className="embla__slide animate-pulse" key={index}>
                  <div className="block group overflow-hidden rounded-lg p-3">
                    <div className="relative w-full h-32  bg-gray-300 rounded-md"></div>
                    <div className="p-1 h-20">
                      <div className="h-4 bg-gray-300 rounded mt-4 mb-1"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ) : (
            videos.map((video) => (
              <div className="embla__slide" key={video.id}>
                <VideoCard
                  id={video.id}
                  title={video.title}
                  channel={video.channel}
                  thumbnail={video.thumbnail}
                  favorited={video.favorited}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;
