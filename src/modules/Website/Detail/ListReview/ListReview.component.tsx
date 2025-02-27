import classNames from 'classnames';
import { FaStar } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

import { SORT_REVIEW } from '@ffp-web/app/index.types';
import { LoadingSpinner, ReviewComponent } from '@ffp-web/components';
import { formatNumberWithCommas } from '@ffp-web/utils/number.utils';

import { Props } from './ListReview.types';
import useListReview from './useListReview';

const filter = [
  { key: SORT_REVIEW.NEWEST, label: 'Newest' },
  { key: SORT_REVIEW.OLDEST, label: 'Oldest' },
  { key: SORT_REVIEW.HIGHEST, label: 'Highest' },
  { key: SORT_REVIEW.LOWEST, label: 'Lowest' },
];

const ListReview = (props: Props) => {
  const {
    isOpen,
    onClose,
    handleViewImage,
  } = props;
  const {
    reviewSummary,
    reviews,
    isLoading,
    sort,
    setSort,
  } = useListReview(props);

  return isOpen && (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50'>
      <div className='relative p-6 flex flex-col gap-6 bg-primary-white rounded-xl overflow-y-scroll max-h-[90%] max-w-[480px] w-[480px]'>
        <button
          type='button'
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500'
        >
          <IoClose size={28} />
        </button>

        <div className='flex flex-col gap-2'>
          <div className='text-lg font-semibold'>All Reviews</div>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <FaStar color='#F1BC44' size={24} />
              <div className='text-base font-semibold'>{Number(reviewSummary?.reviewScore?.toFixed(2))}</div>
            </div>
            <div>•</div>
            <div className='text-base font-normal text-primary-gray'>{`${formatNumberWithCommas(reviewSummary?.reviewTotal, 0)} Reviews`}</div>
          </div>
        </div>

        <div className='flex gap-2'>
          {filter.map(item => (
            <button
              key={item.key}
              onClick={() => setSort(item.key)}
              className={classNames(
                'px-2.5 py-1 text-sm font-medium border rounded-lg hover:text-primary-btn hover:border-primary-btn', {
                'text-primary-btn border-primary-btn': item.key === sort,
              })}
            >
              {item.label}
            </button>
          ))}
        </div>

        {isLoading.review ? (
          <div className='my-4'><LoadingSpinner /></div>
        ) : (
          reviews[sort]?.map(review => (
            <ReviewComponent key={review.reviewId} review={review} handleViewImage={handleViewImage} />
          )))}
      </div>
    </div>
  );
};

export default ListReview;