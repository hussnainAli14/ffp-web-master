'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';

import { LoadingSpinner } from '@ffp-web/components';

import useForgot from './useForgot';


const ForgotPage = () => {
  const {
    handleSubmit,
    onSubmit,
    register,
    formState: { errors },
    watch,
    isLoading,
    isUser,
  } = useForgot();
  const isSent = watch('isSent');
  const email = watch('email');

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='on' className='flex justify-center'>
      <div className='w-full max-w-96 flex flex-col'>
        <div className='text-center text-3xl font-semibold'>
          {isSent ? 'Check your email' : 'Forgot password?'}
        </div>
        <div className='mt-3 text-center text-base text-tertiary-gray font-normal'>
          {isSent ? `We have sent a password reset link to ${email}` : 'No worries, we’ll send you reset instructions.'}
        </div>

        {!isSent &&
          <div className='mt-8 flex flex-col gap-1.5'>
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
        }

        <div className='mt-6'>
          {isSent &&
            <div className='mb-2 text-center text-sm text-tertiary-gray font-normal'>Didn’t receive the email?</div>
          }
          <button
            type='submit'
            disabled={isLoading}
            className='bg-primary-btn hover:bg-opacity-90 rounded-full w-full py-2.5 text-base text-primary-white font-semibold'
          >
            {isLoading && <LoadingSpinner size='small' variant='secondary' />}
            {!isLoading && (isSent ? 'Resend' : 'Reset password')}
          </button>
        </div>

        <Link
          href={isUser ? '/user/login' : '/dashboard/login'}
          className='mt-8 tetx-base text-tertiary-gray font-semibold flex justify-center items-center gap-2'
        >
          <FaArrowLeft /> Back to log in
        </Link>
      </div>
    </form>
  );
};

export default ForgotPage;