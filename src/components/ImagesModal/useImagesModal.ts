import { useState } from 'react';

import { Props, UseImagesModal } from './ImagesModal.types';

const useImagesModal = (props: Props): UseImagesModal => {
  const imagesLength = props.images.length;
  const [index, setIndex] = useState<number>(props.defaultImageIndex ?? 0);
  const states = {
    index,
    setIndex,
  };

  const handlePrev = () => {
    setIndex(prev => {
      if (prev === 0) {
        return imagesLength - 1;
      }

      return prev - 1;
    });
  };

  const handleNext = () => {
    setIndex(prev => {
      if (prev === (imagesLength - 1)) {
        return 0;
      }

      return prev + 1;
    });
  };

  return {
    ...states,
    handlePrev,
    handleNext,
  };
};

export default useImagesModal;