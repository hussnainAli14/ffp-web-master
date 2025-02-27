'use client';

import { Controller } from 'react-hook-form';
import { SingleValue } from 'react-select';

import { SelectOption } from '@ffp-web/app/index.types';
import { LoadingSpinner, Phonecode, ReactSelect } from '@ffp-web/components';
import { cleanPhoneNumber } from '@ffp-web/utils/number.utils';

import { affiliateType } from './data';
import useAffiliate from './useAffiliate';

const JoinAffiliatePage = () => {
  const {
    countries,
    cities,
    control,
    handleSubmit,
    onSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
    isLoadingSubmit,
    globalCountries,
  } = useAffiliate();

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='on'>
      <div className='mx-auto px-4 pb-4 pt-4 md:pt-8 w-full md:w-1/2 flex flex-col gap-5'>
        <div className='text-lg md:text-2xl font-semibold'>
          Basic Information
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='fullName' className='text-sm text-tertiary-gray font-medium'>
            Full Name
          </label>
          <input
            {...register('fullName', {
              required: true,
            })}
            id='fullName'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='Enter your full name'
          />
          {errors.fullName?.type === 'required' &&
            <div className='error-form'>Please input your full name</div>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='email' className='text-sm text-tertiary-gray font-medium'>
            Email Address
          </label>
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
            <div className='error-form'>Please input your email</div>}
          {errors.email?.type === 'pattern' &&
            <div className='error-form'>Your email format is invalid</div>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='phoneNumber' className='text-sm text-tertiary-gray font-medium'>
            Phone Number (Optional)
          </label>
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
          {errors.phoneNumber?.type === 'pattern' &&
            <div className='error-form'>Phone number is should have 7-15 digits</div>}
        </div>

        <div className='flex flex-col gap-1'>
          <div className='text-sm text-tertiary-gray font-medium'>
            Country
          </div>
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
                placeholder='Select your country'
              />
            )}
          />
          {errors.country?.type === 'required' &&
            <div className='error-form'>Please select your country</div>}
        </div>

        <div className='flex flex-col gap-1'>
          <div className='text-sm text-tertiary-gray font-medium'>
            City
          </div>
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
                placeholder='Select your city'
              />
            )}
          />
          {errors.city?.type === 'required' &&
            <div className='error-form'>Please select your city</div>}
        </div>
      </div>

      <div className='mx-auto px-4 pt-4 pb-4 md:pb-8 w-full md:w-1/2 flex flex-col gap-5'>
        <div className='text-lg md:text-2xl font-semibold'>
          Affiliate Business Details
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='businessName' className='text-sm text-tertiary-gray font-medium'>
            Business Name (Optional)
          </label>
          <input
            {...register('businessName')}
            id='businessName'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='Enter your business name'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='website' className='text-sm text-tertiary-gray font-medium'>
            Website
          </label>
          <input
            {...register('website', {
              required: true,
            })}
            id='website'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='Enter your website'
          />
          {errors.website?.type === 'required' &&
            <div className='error-form'>Please input your website</div>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='instagram' className='text-sm text-tertiary-gray font-medium'>
            Instagram
          </label>
          <input
            {...register('instagram')}
            id='instagram'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='@yoursocialhandle'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='facebook' className='text-sm text-tertiary-gray font-medium'>
            Facebook
          </label>
          <input
            {...register('facebook')}
            id='facebook'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='@yoursocialhandle'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='tiktok' className='text-sm text-tertiary-gray font-medium'>
            TikTok
          </label>
          <input
            {...register('tiktok')}
            id='tiktok'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='@yoursocialhandle'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='youtube' className='text-sm text-tertiary-gray font-medium'>
            YouTube
          </label>
          <input
            {...register('youtube')}
            id='youtube'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='@yoursocialhandle'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='snapchat' className='text-sm text-tertiary-gray font-medium'>
            Snapchat
          </label>
          <input
            {...register('snapchat')}
            id='snapchat'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='@yoursocialhandle'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='niche' className='text-sm text-tertiary-gray font-medium'>
            Preferred Niche
          </label>
          <input
            {...register('niche', {
              required: true,
            })}
            id='niche'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='Enter your preferred niche'
          />
          {errors.niche?.type === 'required' &&
            <div className='error-form'>Please input your preferred niche</div>}
        </div>

        <div className='flex flex-col gap-1'>
          <div className='text-sm text-tertiary-gray font-medium'>
            Affiliate Type
          </div>
          <Controller
            name='type'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <ReactSelect
                {...field}
                id='type'
                options={affiliateType}
                isClearable
                placeholder='Select your affiliate type'
              />
            )}
          />
          {errors.type?.type === 'required' &&
            <div className='error-form'>Please select your affiliate type</div>}
        </div>

        <button
          type='submit'
          disabled={isLoadingSubmit}
          className='p-2.5 w-full text-base text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full'
        >
          {isLoadingSubmit ? <LoadingSpinner size='small' variant='secondary' /> : 'Submit'}
        </button>
      </div>
    </form >
  );
};

export default JoinAffiliatePage;