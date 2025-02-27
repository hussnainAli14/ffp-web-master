'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ffpLogo } from '@public/images';

import { LoadingSpinner } from '../LoadingSpinner';

import { providers, resources, sosmed } from './data';
import useFooter from './useFooter';

const Footer = () => {
  const {
    categories,
    email,
    setEmail,
    onSubscribe,
    loadingSubscribe,
    isUser,
  } = useFooter();

  return (
    <div className='px-4 md:-px-20 xl:px-28 py-12 gap-16 text-primary-white bg-primary-bg flex flex-col'>
      <div className='flex flex-wrap-reverse justify-between gap-10'>
        <div className='flex flex-col items-start gap-3'>
          <div className='text-sm text-secondary-btn font-semibold'>Category</div>
          {categories.map(item => (
            <Link
              key={item.categoryId}
              className='text-base font-semibold text-nowrap hover:scale-110 origin-left transition-all duration-500 ease-in-out'
              href={`/category/${item.categoryId}?categoryName=${item.categoryName}`}
            >
              {item.categoryName}
            </Link>
          ))}
        </div>

        <div className='flex flex-col items-start gap-3'>
          <div className='text-sm text-secondary-btn font-semibold'>General</div>
          {resources.map(item => {
            const isHidden = (isUser && item.key === 'register-user') || (!isUser && item.key === 'profile');
            return !isHidden && (
              <Link
                key={item.key}
                className='text-base font-semibold text-nowrap hover:scale-110 origin-left transition-all duration-500 ease-in-out'
                href={item.href}
                target={item.target}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className='flex flex-col items-start gap-3'>
          <div className='text-sm text-secondary-btn font-semibold'>Providers</div>
          {providers.map(item => (
            <Link
              key={item.key}
              className='text-base font-semibold text-nowrap hover:scale-110 origin-left transition-all duration-500 ease-in-out'
              href={item.href}
              target={item.target}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className='flex flex-col items-start gap-6'>
          <Link href='/home'>
            <Image src={ffpLogo} height={48} alt='FFP Logo' priority />
          </Link>
          <div className='flex flex-col gap-3'>
            <div className='text-sm font-medium'>Stay up to date</div>
            <div className='flex gap-4 items-center'>
              <input
                id='subscribe'
                type='text'
                className='w-auto rounded-md px-3 text-primary-black h-full w-40 xl:w-60 focus:outline-primary-btn'
                placeholder='Enter your email'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button
                disabled={loadingSubscribe}
                onClick={onSubscribe}
                className='px-4 py-2 text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full'
              >
                {loadingSubscribe ? <LoadingSpinner size='small' variant='secondary' /> : 'Subscribe'}
              </button>
            </div>
          </div>
          <div className='flex gap-6'>
            {sosmed.map(item => (
              <Link
                key={item.key}
                href={item.href}
                target='_blank'
                className='hover:scale-125 origin-left transition-all duration-500 ease-in-out'
              >
                <item.icon size={28} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className='pt-8 text-base font-normal flex flex-wrap gap-4 justify-between items-center border-t border-primary-gray'>
        <div>Copyright © 2025 FFPTravels Ltd. All Rights Reserved</div>
        <div className='flex gap-4 items-center'>
          <Link href='/terms-and-conditions' className='hover:font-semibold hover:scale-105 transition-all duration-500 ease-in-out'>
            Terms
          </Link>
          <Link href='/privacy-policy' className='hover:font-semibold hover:scale-105 transition-all duration-500 ease-in-out'>
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;