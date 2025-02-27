'use client';

import { Input } from '@headlessui/react';
import Link from 'next/link';

import { BreadcrumbsProps } from '@ffp-web/app/index.types';
import { Breadcrumbs, LoadingSpinner, SeparatorLine } from '@ffp-web/components';

import useAdd from './useAdd';

const links: BreadcrumbsProps[] = [
  { id: '1', name: 'Regions', href: '/dashboard/places/regions' },
  { id: '2', name: 'Add New Region', href: '#' },
];

const AddRegionPage = () => {
  const {
    onSubmit,
    handleSubmit,
    register,
    formState: { errors },
    isLoadingSubmit,
  } = useAdd();

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='text-3xl font-semibold'>Add New Region</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete='on' className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='regionName' className='text-sm font-semibold'>
            Region name
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <Input
              {...register('regionName', {
                required: true,
              })}
              id='regionName'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Input region name'
            />
            {errors.regionName?.type === 'required' &&
              <div className='error-form'>Please input region name</div>}
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='text-sm font-semibold flex justify-end items-center gap-4'>
          <Link
            href={isLoadingSubmit ? '#' : '/dashboard/places/regions'}
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

export default AddRegionPage;