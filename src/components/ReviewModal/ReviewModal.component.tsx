'use client';

import { Textarea } from '@headlessui/react';
import { Controller } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';

import { AlertBox, LoadingSpinner, Rating, ReactDropzone } from '@ffp-web/components';

import { Props } from './ReviewModal.types';
import useReviewModal from './useReviewModal';

const ratingList: { key: 'overallScore' | 'staffScore' | 'facilitesScore' | 'valueForMoneyScore', label: string, }[] = [
  { key: 'overallScore', label: 'Overall Experience' },
  { key: 'staffScore', label: 'Staff' },
  { key: 'facilitesScore', label: 'Facilities' },
  { key: 'valueForMoneyScore', label: 'Value For Money' },
];

const ReviewModal = (props: Props) => {
  const {
    isOpen,
    onClose,
    isEdit,
  } = props;
  const {
    handleSubmit,
    onSubmit,
    control,
    register,
    watch,
    setValue,
    formState: { errors },
    isLoading,
  } = useReviewModal(props);

  return isOpen && (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50'>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='on' className='relative p-6 flex flex-col gap-6 bg-primary-white rounded-xl overflow-y-scroll max-h-[90%] max-w-[480px]'>
        <button
          type='button'
          onClick={onClose}
          disabled={isLoading.submit}
          className='absolute top-4 right-4 text-gray-500'
        >
          <IoClose size={28} />
        </button>

        <div className='text-lg font-semibold'>
          {isEdit ? 'Edit Review' : 'Add Review'}
        </div>

        {ratingList.map(item => (
          <div className='flex flex-col gap-3' key={item.key}>
            <div className='text-sm font-medium text-gray-700'>{item.label}</div>
            <div className='flex flex-col gap-1'>
              <Controller
                name={item.key}
                control={control}
                rules={{ validate: val => val > 0 }}
                render={() => (
                  <Rating
                    rating={watch(item.key)}
                    onChange={value => setValue(item.key, value, { shouldValidate: true })}
                    useIcon
                    isEditable
                    size={28}
                  />
                )}
              />
              {errors[item.key]?.type === 'validate' &&
                <div className='error-form'>Please select the score</div>}
            </div>
          </div>
        ))}

        <div className='flex flex-col gap-3' >
          <div className='text-sm font-medium text-gray-700'>Leave Comment</div>
          <div className='flex flex-col gap-1'>
            <Textarea
              {...register('review', {
                required: true,
              })}
              id='review'
              autoComplete='on'
              className='text-base font-normal rounded-md p-3 h-32 focus:outline-primary-btn border'
              placeholder='Leave a comment'
            />
            {errors.review?.type === 'required' &&
              <div className='error-form'>Please input your comment</div>}
          </div>
        </div>

        <div className='flex flex-col gap-3' >
          <div className='text-sm font-medium text-gray-700'>Images</div>
          <div className='flex flex-col gap-1'>
            <Controller
              name='images'
              control={control}
              render={() => (
                <ReactDropzone
                  value={watch('images')}
                  onChange={urls => setValue('images', urls, { shouldValidate: true })}
                />
              )}
            />
          </div>
        </div>

        <AlertBox type='warning'>
          Any foul language or disturbing images will result in account being deleted.
        </AlertBox>

        <div className='text-sm font-semibold flex justify-end items-center gap-4'>
          <button
            type='button'
            onClick={onClose}
            disabled={isLoading.submit}
            className='px-4 py-2 bg-primary-white hover:bg-opacity-90 rounded-full border'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading.submit}
            className='px-4 py-2 text-primary-white bg-primary-btn hover:bg-opacity-90 rounded-full'
          >
            {isLoading.submit ? <LoadingSpinner size='xsmall' variant='secondary' /> : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewModal;