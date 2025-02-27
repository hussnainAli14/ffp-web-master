'use client';

import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

import { reviewIcons } from '@public/images';

import { Props } from './Rating.types';
import useRating from './useRating';

const iconRatings = [
  { value: 1, icon: reviewIcons.one_start, iconChecked: reviewIcons.one_start_checked },
  { value: 2, icon: reviewIcons.two_start, iconChecked: reviewIcons.two_start_checked },
  { value: 3, icon: reviewIcons.three_start, iconChecked: reviewIcons.three_start_checked },
  { value: 4, icon: reviewIcons.four_start, iconChecked: reviewIcons.four_start_checked },
  { value: 5, icon: reviewIcons.five_start, iconChecked: reviewIcons.five_start_checked },
];

const Rating = (props: Props) => {
  const { isEditable, size = 24, useIcon } = props;
  const {
    rating,
    hoverRating,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
  } = useRating(props);

  if (useIcon) {
    return (
      <div className='flex items-center gap-4'>
        {iconRatings.map(rate => (
          <button
            type='button'
            key={rate.value}
            onClick={() => handleClick(rate.value)}
            onMouseEnter={() => handleMouseEnter(rate.value)}
            onMouseLeave={handleMouseLeave}
          >
            {([hoverRating, rating].includes(rate.value)) ? (
              <Image
                src={rate.iconChecked}
                height={size}
                width={size}
                alt='Rating Icon Active'
              />
            ) : (
              <Image
                src={rate.icon}
                height={size}
                width={size}
                alt='Rating Icon'
              />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map(rate => (
        <FaStar
          key={rate}
          size={size}
          color={rate <= (hoverRating || rating) ? '#F1BC44' : '#D1D5DB'}
          className='cursor-pointer transition-colors duration-200'
          onClick={() => handleClick(rate)}
          onMouseEnter={() => handleMouseEnter(rate)}
          onMouseLeave={handleMouseLeave}
          style={{ pointerEvents: isEditable ? 'auto' : 'none' }}
        />
      ))}
    </div>
  );
};

export default Rating;
