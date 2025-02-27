import Image from 'next/image';
import { IoImageOutline } from 'react-icons/io5';

import { Props } from './ImageLayout.types';

const ImageLayout = ({ images, handleOpenImage }: Props) => {
  const renderImage = (src: string, alt: string) => (
    <Image
      src={src}
      alt={alt}
      fill
      className='card object-cover rounded-xl'
      priority
    />
  );

  const renderFour = () => (
    <div className='flex flex-col md:flex-row gap-2 md:gap-4 w-full'>
      <button
        onClick={() => handleOpenImage(0)}
        className='w-full md:w-2/4 h-72 xl:h-96 relative'
      >
        {renderImage(images[0], 'First Image')}
      </button>
      <button
        onClick={() => handleOpenImage(1)}
        className='w-full md:w-1/4 h-36 md:h-72 xl:h-96 relative'
      >
        {renderImage(images[1], 'Second Image')}
      </button>
      <div className='w-full md:w-1/4 h-36 md:h-72 xl:h-96 flex md:flex-col gap-2 md:gap-4'>
        <button
          onClick={() => handleOpenImage(2)}
          className='h-full md:h-1/2 w-full relative'
        >
          {renderImage(images[2], 'Third Image')}
        </button>
        <div className='h-full md:h-1/2 w-full relative'>
          <button
            onClick={() => handleOpenImage(3)}
            className='h-full w-full relative'
          >
            {renderImage(images[3], 'Fourth Image')}
          </button>
          {images.length > 4 &&
            <button
              onClick={() => handleOpenImage(4)}
              className='absolute z-50 right-2 bottom-2 px-4 py-2 text-sm font-medium bg-primary-white text-primary-btn rounded-full flex justify-center items-center gap-2'>
              <IoImageOutline size={24} />
              <div>+{images.length - 4}</div>
            </button>
          }
        </div>
      </div>
    </div>
  );

  const renderThree = () => (
    <div className='flex flex-col md:flex-row gap-2 md:gap-4 w-full'>
      <button onClick={() => handleOpenImage(0)} className='w-full md:w-2/4 h-72 xl:h-96 relative'>
        {renderImage(images[0], 'First Image')}
      </button>
      <button onClick={() => handleOpenImage(1)} className='w-full md:w-1/4 h-36 md:h-72 xl:h-96 relative'>
        {renderImage(images[1], 'Second Image')}
      </button>
      <button onClick={() => handleOpenImage(2)} className='w-full md:w-1/4 h-36 md:h-72 xl:h-96 relative'>
        {renderImage(images[2], 'Third Image')}
      </button>
    </div>
  );

  const renderTwo = () => (
    <div className='flex flex-col md:flex-row gap-2 md:gap-4 w-full'>
      <button onClick={() => handleOpenImage(0)} className='w-full md:w-2/3 h-72 xl:h-96 relative'>
        {renderImage(images[0], 'First Image')}
      </button>
      <button onClick={() => handleOpenImage(1)} className='w-full md:w-1/3 h-44 md:h-72 xl:h-96 relative'>
        {renderImage(images[1], 'Second Image')}
      </button>
    </div>
  );

  const renderOne = () => (
    <button onClick={() => handleOpenImage(0)} className='w-full h-72 xl:h-96 relative'>
      {renderImage(images[0], 'First Image')}
    </button>
  );

  if (images.length > 3) return renderFour();
  if (images.length === 3) return renderThree();
  if (images.length === 2) return renderTwo();
  if (images.length === 1) return renderOne();

  return null;
};

export default ImageLayout;