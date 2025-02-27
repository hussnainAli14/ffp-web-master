import { StaticImageData } from 'next/image';

import { Setter } from '@ffp-web/app/index.types';

export type UseCarousel = {
  currentIdx: number,
  setCurrentIdx: Setter<number>,
};

export type Carousel = {
  id: string,
  src: StaticImageData,
  title?: string,
  subtitle?: string,
  cta?: string,
  link?: string,
};