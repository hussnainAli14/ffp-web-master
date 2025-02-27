import { Input } from '@headlessui/react';
import { useFieldArray } from 'react-hook-form';

import { ReactSwitch } from '@ffp-web/components';
import { numberToDay } from '@ffp-web/utils/date.utils';
import { capitalizeFirstLetter } from '@ffp-web/utils/text.utils';

import { OperationalHoursProps } from './types';

const OperationalHours = (props: OperationalHoursProps) => {
  const { control, register, errors, className } = props;
  const operationalHours = useFieldArray({
    control: control,
    name: 'operationalHours',
  });

  const sunday = operationalHours.fields[0];
  const mappedList = operationalHours.fields.filter(e => e.day !== 0);
  mappedList.push(sunday);

  return (
    <div className={className}>
      {mappedList.map((item) => (
        <div key={item.id} className='p-4 flex flex-col gap-1.5 bg-primary-white rounded-xl border'>
          <div className='flex items-center gap-2'>
            <ReactSwitch
              checked={item.isOpen}
              onChange={(val) => operationalHours.update(item.day, { ...item, isOpen: val })}
              size='md'
            />
            <div className='text-sm text-gray-700 font-medium'>
              {capitalizeFirstLetter(numberToDay(item.day))}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Input
              {...register(`operationalHours.${item.day}.startHour`, {
                required: item.isOpen,
                disabled: !item.isOpen,
              })}
              id={`startHour-${item.day}`}
              autoComplete='on'
              type='time'
              className='w-full text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Open at'
            />
            <div>-</div>
            <Input
              {...register(`operationalHours.${item.day}.endHour` as const, {
                required: item.isOpen,
                disabled: !item.isOpen,
              })}
              id={`endHours=-${item.day}`}
              autoComplete='on'
              type='time'
              className='w-full text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Close at'
            />
          </div>
          {(errors.operationalHours?.[item.day]?.startHour?.type === 'required' || errors.operationalHours?.[item.day]?.endHour?.type === 'required') &&
            <div className='error-form'>Please input opening hours</div>}
        </div>
      ))}
    </div>
  );
};

export default OperationalHours;