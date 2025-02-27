'use client';

import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { FaArrowLeft, FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

import { LoadingSpinner, Phonecode, ReactSelect } from '@ffp-web/components';
import { cleanPhoneNumber } from '@ffp-web/utils/number.utils';

import useRegister from './useRegister';

const RegisterPage = () => {
  const {
    handleSubmit,
    onSubmit,
    register,
    watch,
    setValue,
    control,
    formState: { errors },
    isLoading,
    togglePassword,
    setTogglePassword,
    countries,
    globalCountries,
    isRegistered,
    setIsRegistered,
  } = useRegister();

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className='flex justify-center'>
      <div className='w-full max-w-96 flex flex-col'>
        <div className='text-center text-3xl font-semibold'>
          {isRegistered ? 'Check your email' : 'Create an account'}
        </div>
        {isRegistered &&
          <div className='mt-3 text-center text-base text-tertiary-gray font-normal'>
            A confirmation email is on its way! Click the link to log in, or explore our homepage below.
          </div>
        }

        {!isRegistered &&
          <div className='mt-8 flex flex-col gap-5'>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='fullName' className='text-sm text-tertiary-gray font-medium'>
                Name
              </label>
              <input
                {...register('fullName', {
                  required: true,
                })}
                id='fullName'
                autoComplete='on'
                type='text'
                className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
                placeholder='Enter your name'
              />
              {errors.fullName?.type === 'required' &&
                <div className='error-form'>Please input your name</div>}
            </div>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='email' className='text-sm text-tertiary-gray font-medium'>
                Email
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
                placeholder='Input your email'
              />
              {errors.email?.type === 'required' &&
                <div className='error-form'>Please input your email</div>}
              {errors.email?.type === 'pattern' &&
                <div className='error-form'>Your email format is invalid</div>}
            </div>
            <div className='flex flex-col gap-1.5'>
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
                    options={countries.map(e => ({ value: e.countryId.toString(), label: e.countryName }))}
                    isClearable
                    placeholder='Select your country'
                  />
                )}
              />
              {errors.country?.type === 'required' &&
                <div className='error-form'>Please select your country</div>}
            </div>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='password' className='text-sm text-tertiary-gray font-medium'>
                Password
              </label>
              <div className='relative w-full flex items-center'>
                <button
                  type='button'
                  onClick={() => setTogglePassword(prev => ({ ...prev, password: !prev.password }))}
                  className='absolute right-4 flex justify-center items-center h-full'
                >
                  {togglePassword.password ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
                <input
                  {...register('password', {
                    required: true,
                  })}
                  id='password'
                  autoComplete='new-password'
                  type={togglePassword.password ? 'text' : 'password'}
                  className='w-full text-base font-normal rounded-md pl-3 pr-10 h-11 focus:outline-primary-btn border'
                  placeholder='Input your password'
                />
              </div>
              {errors.password?.type === 'required' &&
                <div className='error-form'>Please input your password</div>}
            </div>
          </div>
        }

        {isRegistered ? (
          <Link
            href='/home'
            className='mt-6 bg-primary-btn hover:bg-opacity-90 rounded-full w-full py-2.5 text-center text-base text-primary-white font-semibold'
          >
            Explore Homepage
          </Link>
        ) : (
          <button
            type='submit'
            disabled={isLoading}
            className='mt-6 bg-primary-btn hover:bg-opacity-90 rounded-full w-full py-2.5 text-base text-primary-white font-semibold'
          >
            {isLoading ? <LoadingSpinner size='small' variant='secondary' /> : 'Sign up'}
          </button>
        )}

        {isRegistered ? (
          <button
            onClick={() => setIsRegistered(false)}
            className='mt-8 tetx-base text-tertiary-gray font-semibold flex justify-center items-center gap-2'
          >
            <FaArrowLeft /> Back to Register
          </button>
        ) : (
          <span className='mt-8 text-center tetx-base text-tertiary-gray font-normal'>
            Already have an account? <Link
              href='/user/login'
              className='text-primary-btn font-semibold'
            >
              Login
            </Link>
          </span>
        )}

        {!isRegistered &&
          <Link
            href='/home'
            className='mt-8 tetx-base text-tertiary-gray font-semibold flex justify-center items-center gap-2'
          >
            <FaArrowLeft /> Back to homepage
          </Link>
        }
      </div>
    </form>
  );
};

export default RegisterPage;