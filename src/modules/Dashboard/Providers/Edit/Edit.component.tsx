'use client';

import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { SingleValue } from 'react-select';

import { BreadcrumbsProps, SelectOption } from '@ffp-web/app/index.types';
import { Breadcrumbs, LoadingSpinner, Phonecode, ReactDropzone, ReactSelect, SeparatorLine } from '@ffp-web/components';
import { cleanPhoneNumber } from '@ffp-web/utils/number.utils';

import useEdit from './useEdit';

const links: BreadcrumbsProps[] = [
  { id: '1', name: 'Providers', href: '/dashboard/providers' },
  { id: '2', name: 'Edit Provider', href: '#' },
];

const EditProviderPage = () => {
  const {
    countries,
    cities,
    categories,
    control,
    handleSubmit,
    onSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
    isLoadingSubmit,
    globalCountries,
  } = useEdit();

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='text-3xl font-semibold'>Edit Provider</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete='on' className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='fullName' className='text-sm font-semibold'>
            Full name (Contact)
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('fullName', {
                required: true,
              })}
              id='fullName'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Enter provider full name'
            />
            {errors.fullName?.type === 'required' &&
              <div className='error-form'>Please input provider full name</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='businessName' className='text-sm font-semibold'>
            Business name
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('businessName', {
                required: true,
              })}
              id='businessName'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Enter provider business name'
            />
            {errors.businessName?.type === 'required' &&
              <div className='error-form'>Please input provider business name</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='email' className='text-sm font-semibold'>
            Email address
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('email', {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              })}
              id='email'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='name@gmail.com'
            />
            {errors.email?.type === 'required' &&
              <div className='error-form'>Please input provider email</div>}
            {errors.email?.type === 'pattern' &&
              <div className='error-form'>Provider email format is invalid</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='phoneNumber' className='text-sm font-semibold'>
            Phone number
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <div className='relative w-full flex items-center'>
              <div className='absolute left-0 flex justify-center items-center h-full'>
                <Phonecode
                  countries={globalCountries}
                  value={watch('phoneCountry')}
                  onChange={val => setValue('phoneCountry', val)}
                />
              </div>
              <input
                {...register('phoneNumber', {
                  required: true,
                  pattern: /^[1-9]\d{6,14}$/,
                  onChange: e => setValue('phoneNumber', cleanPhoneNumber(e?.target?.value)),
                })}
                id='phoneNumber'
                autoComplete='on'
                type='text'
                className='w-full text-base font-normal rounded-md pl-24 pr-3 h-11 focus:outline-primary-btn border'
                placeholder='123 456 7890'
              />
            </div>
            {errors.phoneNumber?.type === 'required' &&
              <div className='error-form'>Please input provider phone number</div>}
            {errors.phoneNumber?.type === 'pattern' &&
              <div className='error-form'>Phone number is should have 7-15 digits</div>}
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
                  onChange={value => {
                    setValue('country', value as SingleValue<SelectOption>);
                    setValue('city', '');
                  }}
                  options={countries.map(e => ({ value: e.countryId.toString(), label: e.countryName }))}
                  isClearable
                  placeholder='Select provider country'
                />
              )}
            />
            {errors.country?.type === 'required' &&
              <div className='error-form'>Please select provider country</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            City
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='city'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='city'
                  options={cities.map(e => ({ value: e.cityId.toString(), label: e.cityName }))}
                  isClearable
                  placeholder='Select provider city'
                />
              )}
            />
            {errors.city?.type === 'required' &&
              <div className='error-form'>Please select provider city</div>}
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Service category
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='category'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='category'
                  isMulti
                  options={categories.map(e => ({ value: e.categoryId, label: e.categoryName }))}
                  isClearable
                  placeholder='Select service category'
                />
              )}
            />
            {errors.category?.type === 'required' &&
              <div className='error-form'>Please select service category</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='description' className='text-sm font-semibold'>
            Description
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('description', {
                required: true,
              })}
              id='description'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='e.g. We offer the these types of tours...'
            />
            {errors.description?.type === 'required' &&
              <div className='error-form'>Please input provider service description</div>}
          </div>
        </div>

        <div className='hidden grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='targetAudience' className='text-sm font-semibold'>
            Target audience
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('targetAudience')}
              id='targetAudience'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Gender, age group, location, Interests, etc'
            />
            {errors.targetAudience?.type === 'required' &&
              <div className='error-form'>Please input provider target audience</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='location' className='text-sm font-semibold'>
            Location
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('location', {
                required: true,
              })}
              id='location'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Enter provider location of service'
            />
            {errors.location?.type === 'required' &&
              <div className='error-form'>Please input provider location of service</div>}
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='yearInOperation' className='text-sm font-semibold'>
            Years established
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('yearInOperation', {
                required: true,
              })}
              id='yearInOperation'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Enter year established'
            />
            {errors.yearInOperation?.type === 'required' &&
              <div className='error-form'>Please input year established</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='website' className='text-sm font-semibold'>
            Website
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('website', {
                required: true,
              })}
              id='website'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='http://www.greatcompany.com'
            />
            {errors.website?.type === 'required' &&
              <div className='error-form'>Please input provider website</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='instagram' className='text-sm font-semibold'>
            Instagram
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('instagram')}
              id='instagram'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='@instagramhandle'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='facebook' className='text-sm font-semibold'>
            Facebook
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('facebook')}
              id='facebook'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='@facebookhandle'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='tiktok' className='text-sm font-semibold'>
            TikTok
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('tiktok')}
              id='tiktok'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='@tiktokhandle'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='youtube' className='text-sm font-semibold'>
            YouTube
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('youtube')}
              id='youtube'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='@youtubehandle'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='snapchat' className='text-sm font-semibold'>
            Snapchat
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('snapchat')}
              id='snapchat'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='@snapchathandle'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Certification or Licenses
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <ReactDropzone
              value={watch('certification')}
              onChange={urls => setValue('certification', urls)}
              maxFiles={1}
            />
          </div>
        </div>

        <div className='hidden grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='businessRegNumber' className='text-sm font-semibold'>
            Business Registration Number
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <input
              {...register('businessRegNumber')}
              id='businessRegNumber'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Enter provider business registration number'
            />
            {errors.businessRegNumber?.type === 'required' &&
              <div className='error-form'>Please input provider business registration number</div>}
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='text-sm font-semibold flex justify-end items-center gap-4'>
          <Link
            href={isLoadingSubmit ? '#' : '/dashboard/categories'}
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

export default EditProviderPage;