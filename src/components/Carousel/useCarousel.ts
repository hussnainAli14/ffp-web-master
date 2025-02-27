'use client';

import { useCallback, useEffect, useState } from 'react';

import { UseCarousel } from './Carousel.types';
import { carousel } from './data';

const useCarousel = (): UseCarousel => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const states = {
    currentIdx,
    setCurrentIdx,
  };

  // handle sliding next carousel
  const _handleSlide = useCallback(() => {
    if (currentIdx === (carousel.length - 1)) setCurrentIdx(0);
    else setCurrentIdx(currentIdx + 1);
  }, [currentIdx]);

  // interval for sliding next carousel
  useEffect(() => {
    const autoSlide = setInterval(_handleSlide, 5000);

    return () => clearInterval(autoSlide);
  }, [_handleSlide]);

  return {
    ...states,
  };
};

export default useCarousel;