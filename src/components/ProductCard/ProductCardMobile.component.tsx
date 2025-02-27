import Image from 'next/image';
import Link from 'next/link';
import { TiStarFullOutline } from 'react-icons/ti';

import { Tag } from '@ffp-web/components';
import { formatNumberWithCommas } from '@ffp-web/utils/number.utils';

import { Props } from './ProductCard.types';

const ProductCardMobile = (props: Props) => {
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

  return (
    <Link
      href={`/detail/${productId}`}
      className='flex items-center'
    >
      <div className='h-36 min-w-36 relative'>
        <Image
          src={imageUrl}
          alt={`Pricture of ${productName}`}
          fill
          sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
          className='rounded-2xl object-cover'
          priority
        />
      </div>
      <div className='px-3 flex flex-col gap-1'>
        <div className='text-xs text-primary-btn font-semibold'>
          {subCategoryName}
        </div>
        <div className='text-base font-semibold truncate-2-lines'>
          {productName}
        </div>
        <div className='flex flex-wrap items-center gap-1'>
          {tags.map(e => <Tag key={e.tagId} text={e.tagName} size='small' />)}
        </div>
        <div className='flex items-center gap-1'>
          <TiStarFullOutline color='#F1BC44' />
          <div className='text-xs font-semibold'>{Number(reviewScore?.toFixed(2) ?? 0)}</div>
          <div className='ml-1 text-xs font-normal text-primary-gray'>{`• ${formatNumberWithCommas(reviewTotal, 0)} Reviews`}</div>
        </div>
        <div className='text-xs text-tertiary-gray font-normal'>
          From: <span className='text-sm text-primary-black font-semibold'>{actualCurrency} {formatNumberWithCommas(startingPrice)}</span> per person
        </div>
      </div>
      {/* 
      
      */}
    </Link>
  );
};

export default ProductCardMobile;