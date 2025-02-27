'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { TiStarFullOutline } from 'react-icons/ti';

import { LoadingSpinner, Tag } from '@ffp-web/components';
import { formatNumberWithCommas } from '@ffp-web/utils/number.utils';

import { Props } from './ProductCard.types';
import useProductCard from './useProductCard';

const ProductCard = (props: Props) => {
  const {
    productId,
    imageUrl,
    subCategoryName,
    productName,
    reviewScore,
    reviewTotal,
    tags,
    startingPrice = 0,
    currency = 'US-USD-$',
  } = props.product;

  const actualCurrency = currency?.split('-')?.[1] ?? 'USD';

  const {
    bookmarkInfo,
    isLoading,
    handleCardClick,
    handleBookmark,
  } = useProductCard(props);

  const getBookmarkIcon = (size: number) => {
    if (isLoading.bookmark) return <LoadingSpinner size='xsmall' />;
    if (bookmarkInfo.isBookmarked) return <IoMdHeart size={size} />;
    return <IoMdHeartEmpty size={size} />;
  };

  return (
    <Link
      href={`/detail/${productId}`}
      onClick={handleCardClick}
      className='card bg-primary-white rounded-2xl flex flex-col flex-1'
    >
      <div className='min-w-60 md:w-72 xl:w-full h-40 md:h-56 relative'>
        <button
          onClick={handleBookmark}
          className={`${bookmarkInfo.isLogin ? 'text-primary-btn' : 'text-gray-400'} absolute z-10 right-4 top-4 rounded-full p-2 bg-primary-white drop-shadow`}
        >
          {getBookmarkIcon(20)}
        </button>
        <Image
          src={imageUrl}
          alt={`Pricture of ${productName}`}
          fill
          sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
          className='rounded-t-2xl object-cover'
          priority
        />
      </div>
      <div className='px-4 py-5 border-b flex flex-col flex-1'>
        <div className='text-sm md:text-base text-primary-btn font-semibold'>
          {subCategoryName}
        </div>
        <div className='mt-2 text-base md:text-lg font-semibold'>
          {productName}
        </div>
        <div className='mt-1 flex items-center gap-1'>
          <TiStarFullOutline color='#F1BC44' />
          <div className='text-sm md:text-base font-semibold'>{Number(reviewScore?.toFixed(2) ?? 0)}</div>
          <div className='ml-1 text-sm md:text-base font-normal text-primary-gray'>{`• ${formatNumberWithCommas(reviewTotal, 0)} Reviews`}</div>
        </div>
        <div className='mt-4 flex flex-wrap items-center gap-2'>
          {tags.map(e => <Tag key={e.tagId} text={e.tagName} size='small' />)}
        </div>
      </div>
      <div className='p-4 flex flex-none justify-between items-center'>
        <div>
          <div className='text-xs font-normal text-primary-gray'>Starting from:</div>
          <div className='text-base md:text-lg font-semibold'>{actualCurrency} {formatNumberWithCommas(startingPrice)}</div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;