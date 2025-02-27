import Link from 'next/link';

import { formatNumberWithCommas } from '@ffp-web/utils/number.utils';

import { Props } from './SummaryCard.types';

const SummaryCard = (props: Props) => {
  const { title, value, category, href, loading } = props;

  if (loading) return (
    <div className='p-2 md:p-4 bg-primary-white hover:bg-gray-50 border rounded-lg md:rounded-xl flex flex-col justify-between gap-2'>
      <div className='text-xs md:text-base font-medium'>
        <div className='w-full py-2 md:py-3 animate-pulse bg-gray-200 rounded-full' />
      </div>
      <div className='flex gap-1 items-end'>
        <div className='w-1/3 text-base md:text-3xl font-semibold'>
          <div className='w-full py-3 md:py-[18px] animate-pulse bg-gray-200 rounded-full' />
        </div>
        <div className='w-1/2 text-xs md:text-sm text-tertiary-gray font-medium'>
          <div className='w-full py-2 md:py-2.5 animate-pulse bg-gray-200 rounded-full' />
        </div>
      </div>
    </div>
  );

  if (href) return (
    <Link href={href} className='p-2 md:p-4 bg-primary-white hover:bg-gray-50 border rounded-lg md:rounded-xl flex flex-col justify-between gap-2'>
      <div className='text-xs md:text-base font-medium'>{title}</div>
      <div className='flex gap-1 items-end'>
        <div className='text-base md:text-3xl font-semibold'>{formatNumberWithCommas(value, 0)}</div>
        <div className='text-xs md:text-sm text-tertiary-gray font-medium'>{category}</div>
      </div>
    </Link>
  );

  return (
    <div className='p-2 md:p-4 bg-primary-white hover:bg-gray-50 border rounded-lg md:rounded-xl flex flex-col justify-between gap-2'>
      <div className='text-xs md:text-base font-medium'>{title}</div>
      <div className='flex gap-1 items-end'>
        <div className='text-base md:text-3xl font-semibold'>{formatNumberWithCommas(value, 0)}</div>
        <div className='text-xs md:text-sm text-tertiary-gray font-medium'>{category}</div>
      </div>
    </div>
  );
};

export default SummaryCard;