import { useRef } from 'react';

import { UseCategoriesSlider } from './CategoriesSlider.types';

const useCategoriesSlider = (): UseCategoriesSlider => {
  const sliderRef = useRef<HTMLDivElement>(null);

  // handle on click scroll left
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -500,
        behavior: 'smooth',
      });
    }
  };

  // handle on click scroll right
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 500,
        behavior: 'smooth',
      });
    }
  };

  return {
    sliderRef,
    scrollLeft,
    scrollRight,
  };
};

export default useCategoriesSlider;