'use client';

import Link from 'next/link';
import { FaArrowLeft, FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

import { LoadingSpinner } from '@ffp-web/components';

import usePassword from './usePassword';

const PasswordPage = () => {
  const {
    handleSubmit,
    onSubmit,
    register,
    formState: { errors },
    watch,
    getTitle,
    getSubtitle,
    getButtonText,
    isNew,
    isLoading,
    togglePassword,
    setTogglePassword,
    isUser,
  } = usePassword();
  const isSent = watch('isSent');

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='on' className='flex justify-center'>
      <div className='w-full max-w-96 flex flex-col'>
        <div className='text-center text-3xl font-semibold'>{getTitle()}</div>
        <div className='mt-3 text-center text-base text-tertiary-gray font-normal'>{getSubtitle()}</div>

        {!isSent &&
          <div className='mt-5 flex flex-col gap-1.5'>
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
                placeholder='Input your new password'
              />
            </div>
            {errors.password?.type === 'required' &&
              <div className='error-form'>Please input your new password</div>}
          </div>
        }
        {!isSent &&
          <div className='mt-5 flex flex-col gap-1.5'>
            <label htmlFor='confirmPassword' className='text-sm text-tertiary-gray font-medium'>
              Confirm password
            </label>
            <div className='relative w-full flex items-center'>
              <button
                type='button'
                onClick={() => setTogglePassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                className='absolute right-4 flex justify-center items-center h-full'
              >
                {togglePassword.password ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
              <input
                {...register('confirmPassword', {
                  required: true,
                  validate: (value, formValues) => value === formValues.password,
                })}
                id='confirmPassword'
                autoComplete='new-password'
                type={togglePassword.confirmPassword ? 'text' : 'password'}
                className='w-full text-base font-normal rounded-md pl-3 pr-10 h-11 focus:outline-primary-btn border'
                placeholder='Confirm your password'
              />
            </div>
            {errors.confirmPassword?.type === 'required' &&
              <div className='error-form'>Please confirm your password</div>}
            {errors.confirmPassword?.type === 'validate' &&
              <div className='error-form'>Your password is not match</div>}
          </div>
        }

        {!isSent &&
          <button
            type='submit'
            disabled={isLoading}
            className='mt-6 bg-primary-btn hover:bg-opacity-90 rounded-full w-full py-2.5 text-base text-primary-white font-semibold'
          >
            {isLoading ? <LoadingSpinner size='small' variant='secondary' /> : getButtonText()}
          </button>
        }
        {isSent &&
          <Link
            href={isUser ? '/user/login' : '/dashboard/login'}
            className='mt-6 bg-primary-btn hover:bg-opacity-90 rounded-full w-full py-2.5 text-base text-center text-primary-white font-semibold'
          >
            Continue
          </Link>
        }

        {!isNew &&
          <Link
            href={isUser ? '/user/login' : '/dashboard/login'}
            className='mt-8 tetx-base text-tertiary-gray font-semibold flex justify-center items-center gap-2'
          >
            <FaArrowLeft /> Back to log in
          </Link>
        }
      </div>
    </form>
  );
};

export default PasswordPage;