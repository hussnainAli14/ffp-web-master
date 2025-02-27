'use client';

import { Controller } from 'react-hook-form';
import { SingleValue } from 'react-select';

import { SelectOption } from '@ffp-web/app/index.types';
import { LoadingSpinner, Phonecode, ReactSelect } from '@ffp-web/components';
import { cleanPhoneNumber } from '@ffp-web/utils/number.utils';

import useProvider from './useProvider';

const JoinProviderPage = () => {
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
  } = useProvider();

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='on'>
      <div className='mx-auto px-4 pb-4 pt-4 md:pt-8 w-full md:w-1/2 flex flex-col gap-5'>
        <div className='text-lg md:text-2xl font-semibold'>
          Basic Information
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='fullName' className='text-sm text-tertiary-gray font-medium'>
            Full Name (Contact)
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
          <label htmlFor='businessName' className='text-sm text-tertiary-gray font-medium'>
            Legal Business Name
          </label>
          <input
            {...register('businessName', {
              required: true,
            })}
            id='businessName'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='Enter your legal business name'
          />
          {errors.businessName?.type === 'required' &&
            <div className='error-form'>Please input your legal business name</div>}
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
            Phone Number
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
          {errors.phoneNumber?.type === 'required' &&
            <div className='error-form'>Please input your phone number</div>}
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

        <button
          type='submit'
          disabled={isLoadingSubmit}
          className='p-2.5 w-full text-base text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full'
        >
          {isLoadingSubmit ? <LoadingSpinner size='small' variant='secondary' /> : 'Submit'}
        </button>
      </div>

      {/* Exclude from signup */}
      {/* <div className='mx-auto p-4 w-full md:w-1/2 flex flex-col gap-5'>
        <div className='text-lg md:text-2xl font-semibold'>
          Service Details
        </div>

        <div className='flex flex-col gap-1'>
          <div className='text-sm text-tertiary-gray font-medium'>
            Service Category
          </div>
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

        <div className='flex flex-col gap-1'>
          <label htmlFor='description' className='text-sm text-tertiary-gray font-medium'>
            Briefly tell us more about your services
          </label>
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
            <div className='error-form'>Please input your service description</div>}
        </div>

        <div className='hidden flex flex-col gap-1'>
          <label htmlFor='targetAudience' className='text-sm text-tertiary-gray font-medium'>
            Ideal Target Audience
          </label>
          <input
            {...register('targetAudience')}
            id='targetAudience'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='Gender, Number of services offered, Location, Interests, etc'
          />
          {errors.targetAudience?.type === 'required' &&
            <div className='error-form'>Please input your target audience</div>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='location' className='text-sm text-tertiary-gray font-medium'>
            Does your business have multiple locations?
          </label>
          <input
            {...register('location', {
              required: true,
            })}
            id='location'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='Enter your locations of service'
          />
          {errors.location?.type === 'required' &&
            <div className='error-form'>Please input your locations of service</div>}
        </div>
      </div> */}

      {/* Exclude from signup */}
      {/* <div className='mx-auto px-4 pt-4 pb-4 md:pb-8 w-full md:w-1/2 flex flex-col gap-5'>
        <div className='text-lg md:text-2xl font-semibold'>
          Business Details
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='yearInOperation' className='text-sm text-tertiary-gray font-medium'>
            Year established
          </label>
          <input
            {...register('yearInOperation', {
              required: true,
            })}
            id='yearInOperation'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='Enter the year'
          />
          {errors.yearInOperation?.type === 'required' &&
            <div className='error-form'>Please input year established</div>}
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
            placeholder='http://www.greatcompany.com'
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
          <div className='text-sm text-tertiary-gray font-medium'>
            Certification or Licenses
          </div>
          <ReactDropzone
            value={watch('certification')}
            onChange={urls => setValue('certification', urls)}
            maxFiles={1}
            types={[FILE_TYPE.IMAGE, FILE_TYPE.PDF, FILE_TYPE.DOC]}
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='businessRegNumber' className='text-sm text-tertiary-gray font-medium'>
            Business Registration Number
          </label>
          <input
            {...register('businessRegNumber', {
              required: true,
            })}
            id='businessRegNumber'
            autoComplete='on'
            type='text'
            className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
            placeholder='Enter your business registration number'
          />
          {errors.businessRegNumber?.type === 'required' &&
            <div className='error-form'>Please input your business registration number</div>}
        </div>
      </div> */}
    </form>
  );
};

export default JoinProviderPage;