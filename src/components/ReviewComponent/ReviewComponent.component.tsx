import { isEmpty } from 'lodash';
import moment from 'moment';
import Image from 'next/image';

import { Rating } from '@ffp-web/components';

import { Props } from './ReviewComponent.types';

const ReviewComponent = (props: Props) => {
  const { review, handleViewImage } = props;

  const renderImagesReview = (image: string, index: number) => !isEmpty(image) &&(
    <button
      key={index}
      onClick={() => handleViewImage?.(review.images, index)}
      className='relative min-w-28 min-h-28'
    >
      <Image
        src={image}
        alt='Review image'
        fill
        className='object-cover rounded-xl'
        priority
      />
    </button>
  );


  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-4 justify-between items-center'>
        <Rating rating={review.overallScore} />
        <div className='text-xs font-normal'>{moment(review.createdAt).format('D MMM YYYY')}</div>
      </div>
      {!isEmpty(review.images) &&
        <div className='flex gap-2 overflow-x-auto no-scroll-indicator'>
          {review.images.map(renderImagesReview)}
        </div>
      }
      <div className='text-sm font-normal'>{review.review}</div>
      <div className='text-sm font-semibold'>- {review.userName}</div>
    </div>
  );
};

export default ReviewComponent;