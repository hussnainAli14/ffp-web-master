'use client';

import { Input, Textarea } from '@headlessui/react';
import Link from 'next/link';

import { BreadcrumbsProps } from '@ffp-web/app/index.types';
import { Breadcrumbs, LoadingSpinner, SeparatorLine } from '@ffp-web/components';

import useEdit from './useEdit';

const links: BreadcrumbsProps[] = [
  { id: '1', name: 'Tags', href: '/dashboard/tags' },
  { id: '2', name: 'Edit Tag', href: '#' },
];

const EditTagPage = () => {
  const {
    onSubmit,
    handleSubmit,
    register,
    formState: { errors },
    isLoadingSubmit,
  } = useEdit();

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='text-3xl font-semibold'>Edit Tag</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete='on' className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='name' className='text-sm font-semibold'>
            Tag
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <Input
              {...register('name', {
                required: true,
              })}
              id='name'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Input tag'
            />
            {errors.name?.type === 'required' &&
              <div className='error-form'>Please input tag</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='description' className='text-sm font-semibold'>
            Description
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <Textarea
              {...register('description')}
              id='description'
              autoComplete='on'
              className='text-base font-normal rounded-md p-3 h-32 focus:outline-primary-btn border'
              placeholder='Input description'
            />
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='text-sm font-semibold flex justify-end items-center gap-4'>
          <Link
            href={isLoadingSubmit ? '#' : '/dashboard/tags'}
            type='button' className='px-4 py-2 bg-primary-white hover:bg-opacity-90 rounded-full border'
          >
            Cancel
          </Link>
          <button
            type='submit'
            disabled={isLoadingSubmit}
            className='px-4 py-2 text-primary-white bg-primary-btn hover:bg-opacity-90 rounded-full'
          >
            {isLoadingSubmit ? <LoadingSpinner size='small' variant='secondary' /> : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTagPage;