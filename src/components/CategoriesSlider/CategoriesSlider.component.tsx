'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

import { LoadingSpinner } from '@ffp-web/components';
import { convertGDriveLinkToSrc } from '@ffp-web/utils/link.utils';

import { Props } from './CategoriesSlider.types';
import useCategoriesSlider from './useCategoriesSlider';

const CategoriesSlider = (props: Props) => {
  const { categories, isLoadingCategories } = props;
  const { sliderRef, scrollLeft, scrollRight } = useCategoriesSlider();

  const renderSlider = () => (
    <div className='relative w-full'>
      <button
        onClick={scrollLeft}
        className='absolute top-1/2 left-2 md:left-12 xl:left-20 z-10 p-3 md:p-4 transform -translate-y-1/2 bg-primary-white hover:bg-opacity-90 text-primary-bg rounded-full shadow-lg transition duration-300'
      >
        <FaChevronLeft />
      </button>

      <div
        ref={sliderRef}
        className='overflow-x-auto no-scroll-indicator flex gap-8 py-4 md:py-8 xl:py-12 px-6 md:px-20 xl:px-28 scroll-smooth'
        style={{ scrollBehavior: 'smooth' }}
      >
        {categories.map((card) => (
          <Link
            href={`/category/${card.categoryId}?categoryName=${card.categoryName}`}
            key={card.categoryId}
            className='card flex-none w-40 h-40 xl:w-60 xl:h-60 bg-white rounded-2xl overflow-hidden relative'
          >
            <Image
              src={convertGDriveLinkToSrc(card?.image)}
              alt={card.categoryName}
              fill
              sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
              className='object-cover'
              priority
            />
            <div className='absolute w-full h-full py-6 px-6 flex items-end bg-gradient-to-t from-primary-black via-transparent to-transparent'>
              <div className='text-xl xl:text-2xl text-primary-white font-semibold'>{card.categoryName}</div>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={scrollRight}
        className='absolute top-1/2 right-2 md:right-12 xl:right-20 z-10 p-3 md:p-4 transform -translate-y-1/2 bg-primary-white hover:bg-opacity-90 text-primary-bg rounded-full shadow-lg transition duration-300'
      >
        <FaChevronRight />
      </button>
    </div>
  );

  return (
    isLoadingCategories ? <div className='mx-auto my-12'><LoadingSpinner /></div> : renderSlider()
  );
};

export default CategoriesSlider;