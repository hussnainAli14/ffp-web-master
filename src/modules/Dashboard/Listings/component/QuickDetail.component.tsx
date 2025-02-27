import { Input } from '@headlessui/react';
import { Controller, useFieldArray } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { FiTrash2 } from 'react-icons/fi';

import { ReactSelect } from '@ffp-web/components';

import { quickDetailsOption } from '../data';

import { QuickDetailProps } from './types';

const QuickDetail = (props: QuickDetailProps) => {
  const { control, errors, register, className } = props;
  const quickDetails = useFieldArray({
    control: control,
    name: 'quickDetails',
  });

  return (
    <div className={className}>
      {quickDetails.fields.map((item, index) => (
        <div key={item.id} className='p-4 flex flex-col gap-1.5 bg-primary-white rounded-xl border'>
          <div className='text-sm text-gray-700 font-medium'>
            Quick detail {index + 1}
          </div>
          <div className='flex items-start w-full gap-4'>
            <div className='flex flex-1 flex-col gap-2'>
              <div className='flex flex-col gap-1'>
                <Controller
                  name={`quickDetails.${index}.detailType` as const}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      id={`quickDetails.${index}.detailType`}
                      options={quickDetailsOption}
                      isClearable
                      placeholder='Select quick detail'
                    />
                  )}
                />
                {errors.quickDetails?.[index]?.detailType?.type === 'required' &&
                  <div className='error-form'>Please select quick detail</div>}
              </div>
              <div className='flex flex-col gap-1'>
                <Input
                  {...register(`quickDetails.${index}.value` as const, {
                    required: true,
                  })}
                  id={`quickDetails.${index}.value`}
                  autoComplete='on'
                  type='text'
                  className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
                  placeholder='Input content'
                />
                {errors.quickDetails?.[index]?.value?.type === 'required' &&
                  <div className='error-form'>Please input content</div>}
              </div>
            </div>
            <button
              type='button'
              className='text-primary-gray mt-2.5'
              onClick={() => quickDetails.remove(index)}
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
      ))}

      <button
        type='button'
        className='flex items-center gap-2 text-sm text-primary-btn font-semibold'
        onClick={() => quickDetails.append({ detailType: '', value: '' })}
      >
        <FaPlus /> Add quick detail
      </button>
    </div>
  );
};

export default QuickDetail;