import { Setter } from '@ffp-web/app/index.types';

export type Props = {
  useIcon?: boolean,
  rating: number,
  isEditable?: boolean,
  size?: number,
  onChange?: (value: number) => void,
};

export type UseRating = {
  rating: number,
  setRating: Setter<number>,
  hoverRating: number,
  setHoverRating: Setter<number>,
  handleMouseEnter: (index: number) => void,
  handleMouseLeave: () => void,
  handleClick: (index: number) => void,
};