'use client';

import { Input } from '@headlessui/react';
import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { SingleValue } from 'react-select';

import { BreadcrumbsProps, SelectOption } from '@ffp-web/app/index.types';
import { Breadcrumbs, LoadingSpinner, ReactDropzone, ReactSelect, SeparatorLine } from '@ffp-web/components';

import useEdit from './useEdit';

const links: BreadcrumbsProps[] = [
  { id: '1', name: 'Cities', href: '/dashboard/places/cities' },
  { id: '2', name: 'Edit City', href: '#' },
];

const EditCityPage = () => {
  const {
    onSubmit,
    handleSubmit,
    register,
    setValue,
    watch,
    control,
    formState: { errors },
    listRegion,
    listCountry,
    loading,
  } = useEdit();

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='text-3xl font-semibold'>Edit City</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete='on' className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Region
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='region'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='region'
                  onChange={value => {
                    setValue('region', value as SingleValue<SelectOption>, { shouldValidate: true });
                    setValue('country', '');
                  }}
                  options={listRegion.map(e => ({ value: e.regionId.toString(), label: e.regionName }))}
                  isClearable
                  isLoading={loading.region}
                  placeholder='Select region'
                />
              )}
            />
            {errors.region?.type === 'required' &&
              <div className='error-form'>Please select region</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Country
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='country'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='country'
                  options={listCountry.map(e => ({ value: e.countryId.toString(), label: e.countryName }))}
                  isClearable
                  isLoading={loading.country}
                  placeholder='Select country'
                />
              )}
            />
            {errors.country?.type === 'required' &&
              <div className='error-form'>Please select country</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='cityName' className='text-sm font-semibold'>
            City name
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <Input
              {...register('cityName', {
                required: true,
              })}
              id='cityName'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Input city name'
            />
            {errors.cityName?.type === 'required' &&
              <div className='error-form'>Please input city name</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            City image
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='image'
              control={control}
              render={() => (
                <ReactDropzone
                  value={watch('image')}
                  onChange={urls => setValue('image', urls, { shouldValidate: true })}
                  maxFiles={1}
                />
              )}
            />
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='text-sm font-semibold flex justify-end items-center gap-4'>
          <Link
            href={loading.submit ? '#' : '/dashboard/places/cities'}
            type='button' className='px-4 py-2 bg-primary-white hover:bg-opacity-90 rounded-full border'
          >
            Cancel
          </Link>
          <button
            type='submit'
            disabled={loading.submit}
            className='px-4 py-2 text-primary-white bg-primary-btn hover:bg-opacity-90 rounded-full'
          >
            {loading.submit ? <LoadingSpinner size='small' variant='secondary' /> : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCityPage;