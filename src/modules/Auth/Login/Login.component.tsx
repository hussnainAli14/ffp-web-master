'use client';

import Link from 'next/link';
import { FaArrowLeft, FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

import { LoadingSpinner } from '@ffp-web/components';

import useLogin from './useLogin';

const LoginPage = () => {
  const {
    handleSubmit,
    onSubmit,
    register,
    formState: { errors },
    isLoading,
    togglePassword,
    setTogglePassword,
    isUser,
  } = useLogin();

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='on' className='flex justify-center'>
      <div className='w-full max-w-96 flex flex-col'>
        <div className='text-center text-3xl font-semibold'>Log in to your account</div>
        <div className='mt-3 text-center text-base text-tertiary-gray font-normal'>Welcome back! Please enter your details.</div>

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
              autoComplete='on'
              type={togglePassword.password ? 'text' : 'password'}
              className='w-full text-base font-normal rounded-md pl-3 pr-10 h-11 focus:outline-primary-btn border'
              placeholder='Input your password'
            />
          </div>
          {errors.password?.type === 'required' &&
            <div className='error-form'>Please input your password</div>}
        </div>

        <Link
          href={isUser ? '/user/forgot' : '/dashboard/forgot'}
          className='mt-6 text-base text-primary-btn font-semibold'
        >
          Forgot password
        </Link>

        <button
          type='submit'
          disabled={isLoading}
          className='mt-6 bg-primary-btn hover:bg-opacity-90 rounded-full w-full py-2.5 text-base text-primary-white font-semibold'
        >
          {isLoading ? <LoadingSpinner size='small' variant='secondary' /> : 'Sign in'}
        </button>

        <span className='mt-8 text-center tetx-base text-tertiary-gray font-normal'>
          Don’t have an account? <Link
            href={isUser ? '/user/register' : '/become-a-provider/join'}
            className='text-primary-btn font-semibold'
          >
            {isUser ? 'Register as User' : 'Become a Provider'}
          </Link>
        </span>

        {isUser &&
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

export default LoginPage;