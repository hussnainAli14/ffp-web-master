'use client';

import Link from 'next/link';

import { LoadingSpinner } from '@ffp-web/components';

import useVerify from './useVerify';

const VerifyPage = () => {
  const {
    isLoading,
    isVerified,
  } = useVerify();

  return (
    <div className='flex justify-center'>
      {isLoading ? (
        <div className='my-20'><LoadingSpinner /></div>
      ) : (
        <div className='w-full max-w-96 flex flex-col'>
          <div className='text-center text-3xl font-semibold'>
            {isVerified ? 'Welcome to FFP!' : 'Something wrong!'}
          </div>
          <div className='mt-3 text-center text-base text-tertiary-gray font-normal'>
            {isVerified
              ? 'Congratulations! You’ve successfully registered as an FFP user! Log in now with your credentials to start enjoying the benefits!'
              : 'We cannot verify your registration. Please contact our support to solve the problem.'
            }
          </div>
          <Link
            href={isVerified ? '/user/login' : '/contact-us'}
            className='mt-6 bg-primary-btn hover:bg-opacity-90 rounded-full w-full py-2.5 text-base text-center text-primary-white font-semibold'
          >
            {isVerified ? 'Login' : 'Contact Us'}
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyPage;