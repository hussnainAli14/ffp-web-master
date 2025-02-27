import { Setter, VoidFunction } from '@ffp-web/app/index.types';

export type Props = {
  isOpen?: boolean,
  onClose: VoidFunction,
  images: string[],
  defaultImageIndex?: number,
};

export type UseImagesModal = {
  index: number,
  setIndex: Setter<number>,
  handlePrev: VoidFunction,
  handleNext: VoidFunction,
}