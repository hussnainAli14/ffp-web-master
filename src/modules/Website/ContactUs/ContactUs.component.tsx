'use client';

import Image from 'next/image';

import { LoadingSpinner, Phonecode } from '@ffp-web/components';
import { numberUtils } from '@ffp-web/utils';
import { convertGDriveLinkToSrc } from '@ffp-web/utils/link.utils';

import { contacts } from './data';
import useContactUs from './useContactUs';

const ContactUsPage = () => {
  const { cleanPhoneNumber } = numberUtils;
  const {
    handleSubmit,
    onSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
    countries,
    loading,
  } = useContactUs();

  return (
    <div className='flex'>
      <div className='md:w-2/3 xl:w-1/2 px-4 md:px-20 xl:px-28 py-10 md:py-20 xl:py-24'>
        <div className='flex flex-col gap-6 md:gap-8 xl:gap-12'>
          <div className='flex flex-col gap-4 md:gap-6'>
            <div className='text-3xl md:text-5xl font-semibold'>
              <span className='text-primary-btn'>Contact</span> us
            </div>
            <div className='text-base md:text-xl text-tertiary-gray font-normal'>
              Our friendly team would love to hear from you.
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} autoComplete='on'>
            <div className='flex flex-col gap-4 md:gap-6'>
              <div className='flex flex-col gap-1'>
                <label htmlFor='name' className='text-sm text-tertiary-gray font-medium'>
                  Name
                </label>
                <input
                  {...register('name', {
                    required: true,
                  })}
                  id='name'
                  autoComplete='on'
                  type='text'
                  className='text-base font-normal rounded-md px-3 h-11 focus:outline-primary-btn border'
                  placeholder='Your name'
                />
                {errors.name?.type === 'required' &&
                  <div className='error-form'>Please input your name</div>}
              </div>

              <div className='flex flex-col gap-1'>
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
                  placeholder='you@company.com name'
                />
                {errors.email?.type === 'required' &&
                  <div className='error-form'>Please input your email</div>}
                {errors.email?.type === 'pattern' &&
                  <div className='error-form'>Your email format is invalid</div>}
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor='phone' className='text-sm text-tertiary-gray font-medium'>
                  Phone Number (Optional)
                </label>
                <div className='relative w-full flex items-center'>
                  <div className='absolute left-0 flex justify-center items-center h-full'>
                    <Phonecode
                      countries={countries}
                      value={watch('phoneCountry')}
                      onChange={val => setValue('phoneCountry', val)}
                    />
                  </div>
                  <input
                    {...register('phone', {
                      required: true,
                      pattern: /^[1-9]\d{6,14}$/,
                      onChange: e => setValue('phone', cleanPhoneNumber(e?.target?.value)),
                    })}
                    id='phone'
                    autoComplete='on'
                    type='text'
                    className='w-full text-base font-normal rounded-md pl-24 pr-3 h-11 focus:outline-primary-btn border'
                    placeholder='123 456 7890'
                  />
                </div>
                {errors.phone?.type === 'pattern' &&
                  <div className='error-form'>Phone number is should have 7-15 digits</div>}
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor='message' className='text-sm text-tertiary-gray font-medium'>
                  Message
                </label>
                <textarea
                  {...register('message', {
                    required: true,
                  })}
                  id='message'
                  autoComplete='on'
                  className='text-base font-normal rounded-md p-3 h-32 focus:outline-primary-btn border'
                  placeholder='Leave us a message...'
                />
                {errors.message?.type === 'required' &&
                  <div className='error-form'>Please write your message</div>}
              </div>

              <button
                type='submit'
                disabled={loading}
                className='bg-primary-btn hover:bg-opacity-90 rounded-full py-3 text-base text-primary-white font-semibold'
              >
                {loading ? <LoadingSpinner size='small' variant='secondary' /> : 'Send message'}
              </button>
            </div>
          </form>

          <div className='flex flex-wrap gap-6 md:gap-8'>
            {contacts.map(item => (
              <div key={item.contact} className='flex flex-col gap-1'>
                <div className='text-lg md:text-xl font-semibold'>{item.contact}</div>
                <div className='text-base text-primary-btn font-semibold'>{item.email}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='hidden md:block md:w-1/3 xl:w-1/2 h-auto relative'>
        <Image
          src={convertGDriveLinkToSrc('https://drive.google.com/file/d/1xRsU5z5dvFpubhfgL5Kxm44txHCq3F3S/view?usp=sharing')}
          alt='Contact Us Thumbnail'
          fill
          sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
          className='object-cover'
          priority
        />
      </div>
    </div>
  );
};

export default ContactUsPage;