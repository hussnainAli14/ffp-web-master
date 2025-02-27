
import { Input } from '@headlessui/react';
import { Controller, useFieldArray } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { FiTrash2 } from 'react-icons/fi';

import { ReactSelect, SeparatorLine } from '@ffp-web/components';

import { contentOption } from '../data';

import ContentSectionDetail from './ContentSectionDetail.component';
import { ContentSectionProps } from './types';

const ContentSection = (props: ContentSectionProps) => {
  const { control, errors, register, setValue, className } = props;
  const contents = useFieldArray({
    control: control,
    name: 'contents',
  });

  return (
    <div className={className}>
      {contents.fields.map((item, index) => (
        <div key={item.id} className='p-4 flex flex-col gap-1.5 bg-primary-white rounded-xl border'>
          <div className='text-sm text-gray-700 font-medium'>
            Section {index + 1}
          </div>
          <div className='flex items-start w-full gap-4'>
            <div className='flex flex-1 flex-col gap-2'>
              <div className='flex flex-col gap-1'>
                <Controller
                  name={`contents.${index}.contentType` as const}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      id={`contents.${index}.contentType`}
                      options={contentOption}
                      isClearable
                      placeholder='Select content type'
                    />
                  )}
                />
                {errors.contents?.[index]?.contentType?.type === 'required' &&
                  <div className='error-form'>Please select content type</div>}
              </div>
              <div className='flex flex-col gap-1'>
                <Input
                  {...register(`contents.${index}.title` as const, {
                    required: true,
                  })}
                  id={`contents.${index}.title`}
                  autoComplete='on'
                  type='text'
                  className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
                  placeholder='Input section title'
                />
                {errors.contents?.[index]?.title?.type === 'required' &&
                  <div className='error-form'>Please input section title</div>}
              </div>

              <div className='py-2'>
              <SeparatorLine horizontal />
              </div>
              <ContentSectionDetail
                control={control}
                index={index}
                errors={errors}
                register={register}
                setValue={setValue}
              />
            </div>
            <button
              type='button'
              className='text-primary-gray mt-2.5'
              onClick={() => contents.remove(index)}
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
      ))}

      <button
        type='button'
        className='flex items-center gap-2 text-sm text-primary-btn font-semibold'
        onClick={() => contents.append({ contentType: '', title: '', text: '', list: [] })}
      >
        <FaPlus /> Add section
      </button>
    </div>
  );
};

export default ContentSection;