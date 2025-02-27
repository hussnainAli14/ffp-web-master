'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { ProductOperationalHour } from '@ffp-web/app/index.types';
import { formatTime12Hrs, numberToDay } from '@ffp-web/utils/date.utils';
import { capitalizeFirstLetter } from '@ffp-web/utils/text.utils';

import { Props } from './OperationalHours.types';

const OperationalHours = (props: Props) => {
  const { operationalHours } = props;
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const today = (new Date).getDay();
  const curretOperationalHours = operationalHours.find(e => e.day === today);

  const formatOperationalHours = (data?: ProductOperationalHour) => {
    if (data?.isOpen && data?.startHour && data?.endHour) {
      return `${formatTime12Hrs(data.startHour)} - ${formatTime12Hrs(data.endHour)}`;
    }

    return 'Closed';
  };

  const sunday = operationalHours[0];
  const mappedList = operationalHours.filter(e => e.day !== 0);
  mappedList.push(sunday);

  return (
    <div className='p-8 bg-tertiary-white rounded-xl'>
      <div className='flex items-center justify-between gap-4'>
        <div className='text-base text-primary-gray font-normal'>
          {`Opening hours (${capitalizeFirstLetter(numberToDay(today))}):`}
        </div>
        <button onClick={() => setOpenDetail(prev => !prev)}>
          {openDetail ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      <div className='text-2xl text-primary-btn font-norma'>
        {formatOperationalHours(curretOperationalHours)}
      </div>
      <div
        className={`${openDetail ? 'mt-4 max-h-auto scale-y-100 opacity-100' : 'max-h-0 scale-y-0 opacity-0'}
        origin-top transition-all duration-100 ease-in-out flex flex-col gap-1`}
      >
        {mappedList.map(item => (
          <div key={item.day} className='flex items-center justify-between'>
            <div className='text-sm font-semibold'>
              {capitalizeFirstLetter(numberToDay(item.day))}
            </div>
            <div className='text-sm text-tertiary-gray font-normal'>
              {formatOperationalHours(item)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationalHours;