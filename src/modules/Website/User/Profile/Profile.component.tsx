'use client';

import { Input } from '@headlessui/react';
import { Controller } from 'react-hook-form';

import { Avatar, LoadingSpinner, Phonecode, ReactDatePicker, ReactSelect, SeparatorLine } from '@ffp-web/components';
import { cleanPhoneNumber } from '@ffp-web/utils/number.utils';

import { Props } from '../User.types';

const ProfilePage = (props: Props) => {
  const {
    profileFormHooks: {
      control,
      handleSubmit,
      register,
      setValue,
      watch,
      formState: { errors },
    },
    onSubmitProfile,
    filterData,
    isLoading,
  } = props;

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <div className='text-lg font-semibold'>Profile</div>
        <div className='text-sm font-normal text-gray-500'>You can update your personal information here</div>
      </div>

      <form onSubmit={handleSubmit(onSubmitProfile)} autoComplete='on' className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='profilePicture' className='text-sm font-semibold'>
            Your Photo<br />
            <span className='text-tertiary-gray font-normal'>
              This will be displayed on your profile.
            </span>
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <Avatar
              isEdit
              profilePicture={watch('profilePicture')}
              onChanges={uri => setValue('profilePicture', uri)}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='fullName' className='text-sm font-semibold'>
            Name
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <Input
              {...register('fullName', {
                required: true,
              })}
              id='fullName'
              autoComplete='on'
              type='text'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Enter full name'
            />
            {errors.fullName?.type === 'required' &&
              <div className='error-form'>Please input full name</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Gender
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='gender'
              control={control}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='gender'
                  options={filterData.genders}
                  isClearable
                  placeholder='Select gender'
                />
              )}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='dob' className='text-sm font-semibold'>
            Date of Birth
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            {/* <Input
              {...register('dob')}
              id='dob'
              autoComplete='on'
              type='date'
              className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
              placeholder='Enter date of birth'
            /> */}
            <Controller
              name='gender'
              control={control}
              render={() => (
                <ReactDatePicker
                  value={watch('dob')}
                  onChange={val => setValue('dob', val)} />
              )}
            />

          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='email' className='text-sm font-semibold'>
            Email
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <Input
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
              <div className='error-form'>Please input email</div>}
            {errors.email?.type === 'pattern' &&
              <div className='error-form'>Email format is invalid</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='phoneNumber' className='text-sm font-semibold'>
            Phone Number
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <div className='relative w-full flex items-center'>
              <div className='absolute left-0 flex justify-center items-center h-full'>
                <Phonecode
                  countries={filterData.globalCountries}
                  value={watch('phoneCountry')}
                  onChange={val => setValue('phoneCountry', val)}
                />
              </div>
              <Input
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
              <div className='error-form'>Please input phone number</div>}
            {errors.phoneNumber?.type === 'pattern' &&
              <div className='error-form'>Phone number is should have 7-15 digits</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Country of Residence
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
                  options={filterData.countries.map(e => ({ value: e.countryId.toString(), label: e.countryName }))}
                  isClearable
                  placeholder='Select country'
                />
              )}
            />
            {errors.country?.type === 'required' &&
              <div className='error-form'>Please select country</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <div className='text-sm font-semibold'>
            Nationality
          </div>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='nationality'
              control={control}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='nationality'
                  options={filterData.globalCountries.map(e => ({ value: `${e.iso2}-${e.nationality}`, label: e.nationality }))}
                  isClearable
                  placeholder='Select nationality'
                />
              )}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='interests' className='text-sm font-semibold'>
            My Interest
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <Controller
              name='interests'
              control={control}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id='interests'
                  isMulti
                  options={filterData.subCategories.map(e => ({ value: e.subCategoryId, label: e.subCategoryName }))}
                  isClearable
                  placeholder='Select your interests'
                />
              )}
            />
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='text-sm font-semibold flex justify-end items-center gap-4'>
          <button
            type='submit'
            disabled={isLoading.updateProfile}
            className='px-4 py-2 text-primary-white bg-primary-btn hover:bg-opacity-90 rounded-full'
          >
            {isLoading.updateProfile ? <LoadingSpinner size='small' variant='secondary' /> : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;