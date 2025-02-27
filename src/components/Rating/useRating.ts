import { useEffect, useState } from 'react';

import { Props, UseRating } from './Rating.types';

const useRating = ({ rating: initialRating, isEditable, onChange }: Props): UseRating => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const states = {
    rating,
    setRating,
    hoverRating,
    setHoverRating,
  };

  const handleMouseEnter = (rate: number) => {
    if (isEditable) setHoverRating(rate);
  };

  const handleMouseLeave = () => {
    if (isEditable) setHoverRating(0);
  };

  const handleClick = (rate: number) => {
    if (isEditable) {
      onChange?.(rate);
    }
  };

  useEffect(() => {
    if (initialRating) setRating(initialRating);
  }, [initialRating]);

  return {
    ...states,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
  };
};

export default useRating;