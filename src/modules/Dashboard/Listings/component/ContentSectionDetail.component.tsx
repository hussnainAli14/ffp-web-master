import { Input, Textarea } from '@headlessui/react';
import { useWatch } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { FiTrash2 } from 'react-icons/fi';

import { ContentSectionDetailProps } from './types';

const ContentSectionDetail = (props: ContentSectionDetailProps) => {
  const { control, index, errors, register, setValue } = props;
  const contentType = useWatch({
    control: control,
    name: `contents.${index}.contentType`,
  });

  const list = useWatch({
    control: control,
    name: `contents.${index}.list`,
  });

  const renderText = () => (
    <div className='flex flex-col gap-1'>
      <Textarea
        {...register(`contents.${index}.text` as const, {
          required: true,
        })}
        id={`contents.${index}.text`}
        autoComplete='on'
        className='text-base font-normal rounded-md p-3 h-44 focus:outline-primary-btn border'
        placeholder='Input content'
      />
      {errors.contents?.[index]?.text?.type === 'required' &&
        <div className='error-form'>Please input content</div>}
    </div>
  );

  const renderList = () => (
    <div className='flex w-full flex-col gap-2'>
      {list?.map((_, idx) => (
        <div key={'id' + idx} className='flex items-start w-full gap-4'>
          <div className='flex flex-1 flex-col gap-1'>
            <Input
              {...register(`contents.${index}.list.${idx}`, {
                required: true,
              })}
              id={`contents.${index}.list.${idx}`}
              autoComplete='on'
              type='text'
              className='w-full text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder={`Bullet point ${idx + 1}`}
            />
            {errors.contents?.[index]?.list?.[idx]?.type === 'required' &&
              <div className='error-form'>Please input content</div>}
          </div>
          <button
            type='button'
            className='text-primary-gray mt-2.5'
            onClick={() => setValue(
              `contents.${index}.list`, list.filter((_, i) => i !== idx),
              { shouldValidate: true }
            )}
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      ))}

      <button
        type='button'
        className='flex items-center gap-2 text-sm text-primary-btn font-semibold'
        onClick={() => setValue(`contents.${index}.list`, [...list, ''])}
      >
        <FaPlus /> Add bullet point
      </button>
    </div>
  );

  if (typeof contentType === 'string') return null;

  if (contentType?.value === 'TEXT') return renderText();

  if (contentType?.value === 'LIST') return renderList();

  return null;
};

export default ContentSectionDetail;