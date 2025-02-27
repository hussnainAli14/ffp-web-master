'use client';

import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

import { Props } from './ImagesModal.types';
import useImagesModal from './useImagesModal';

const ImagesModal = (props: Props) => {
  const { isOpen, images, onClose } = props;
  const { index, handlePrev, handleNext } = useImagesModal(props);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
      <div className='relative rounded-2xl shadow-lg w-[90vw] h-[90vh] p-6'>
        <button
          onClick={handlePrev}
          className='absolute top-1/2 -left-3 md:-left-6 z-10 p-3 md:p-4 transform -translate-y-1/2 bg-primary-white hover:bg-opacity-90 text-primary-bg rounded-full shadow-lg transition duration-300'
        >
          <FaChevronLeft />
        </button>

        <Image
          src={images[index]}
          alt={`Images preview ${index + 1}`}
          fill
          sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
          className='object-contain'
          priority
        />
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-primary-white'
        >
          <IoClose size={32} />
        </button>

        <button
          onClick={handleNext}
          className='absolute top-1/2 -right-3 md:-right-6 z-10 p-3 md:p-4 transform -translate-y-1/2 bg-primary-white hover:bg-opacity-90 text-primary-bg rounded-full shadow-lg transition duration-300'
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ImagesModal;