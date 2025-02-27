'use client';

import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

import { LoadingSpinner, SeparatorLine } from '@ffp-web/components';

import { UsePassword } from './Password.types';

const PasswordTab = (props: UsePassword) => {
  const {
    handleSubmit,
    onSubmit,
    register,
    formState: { errors },
    isLoading,
    togglePassword,
    setTogglePassword,
  } = props;

  return (
    <div className='flex flex-col gap-10'>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='on' className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='password' className='text-sm font-semibold'>
            Old password
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
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
                placeholder='Input your old password'
              />
            </div>
            {errors.password?.type === 'required' &&
              <div className='error-form'>Please input your old password</div>}
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='newPassword' className='text-sm font-semibold'>
            New password
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <div className='relative w-full flex items-center'>
              <button
                type='button'
                onClick={() => setTogglePassword(prev => ({ ...prev, newPassword: !prev.newPassword }))}
                className='absolute right-4 flex justify-center items-center h-full'
              >
                {togglePassword.newPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
              <input
                {...register('newPassword', {
                  required: true,
                })}
                id='newPassword'
                autoComplete='new-password'
                type={togglePassword.newPassword ? 'text' : 'password'}
                className='w-full text-base font-normal rounded-md pl-3 pr-10 h-11 focus:outline-primary-btn border'
                placeholder='Input your new password'
              />
            </div>
            {errors.newPassword?.type === 'required' &&
              <div className='error-form'>Please input your new password</div>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
          <label htmlFor='confirmPassword' className='text-sm font-semibold'>
            Confirm password
          </label>
          <div className='col-span-2 flex flex-col gap-1'>
            <div className='relative w-full flex items-center'>
              <button
                type='button'
                onClick={() => setTogglePassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                className='absolute right-4 flex justify-center items-center h-full'
              >
                {togglePassword.confirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
              <input
                {...register('confirmPassword', {
                  required: true,
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
        </div>

        <SeparatorLine horizontal />

        <div className='text-sm font-semibold flex justify-end items-center gap-4'>
          <button
            type='submit'
            disabled={isLoading}
            className='px-4 py-2 text-primary-white bg-primary-btn hover:bg-opacity-90 rounded-full'
          >
            {isLoading ? <LoadingSpinner size='small' variant='secondary' /> : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordTab;