'use client';

import Image from 'next/image';

import { carousel } from './data';
import useCarousel from './useCarousel';

const Carousel = () => {
  const { currentIdx, setCurrentIdx } = useCarousel();

  return (
    <div className='relative w-full overflow-hidden -mt-52 md:-mt-28 xl:-mt-20'>
      <div
        className='flex transition-transform duration-1000 ease-in-out'
        style={{ transform: `translateX(-${currentIdx * 100}%)` }}
      >
        {carousel.map((item, idx) => (
          <div key={item.id} className='flex-shrink-0 w-full h-[600px] relative'>
            <Image
              src={item.src}
              alt={`${idx}-${item.title}`}
              fill
              className='object-cover'
              priority
            />
            <div className='absolute bottom-0 px-4 md:px-20 xl:px-28 pb-12 md:pb-16 xl:pb-20 flex flex-col items-start md:max-w-[60%] xl:max-w-[50%]'>
              {item.title && <div className='text-primary-white text-3xl md:text-5xl font-extrabold'>{item.title}</div>}
              {item.subtitle && <div className='mt-6 text-primary-white text-xl font-normal'>{item.subtitle}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className='absolute bottom-4 w-full flex justify-center items-center'>
        <div className='px-3 py-1.5 rounded-full flex gap-2 justify-center items-center bg-primary-white bg-opacity-60'>
          {carousel.map((item, idx) => (
            <button
              key={item.id}
              className={`${currentIdx === idx ? 'w-10 bg-primary-btn' : 'w-1.5 bg-primary-white'} h-1.5 rounded-full transition-all duration-500 ease-in-out`}
              onClick={() => { setCurrentIdx(idx); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;