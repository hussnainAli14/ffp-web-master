import Image from 'next/image';
import Link from 'next/link';

import { convertGDriveLinkToSrc } from '@ffp-web/utils/link.utils';

const SubmitProviderPage = () => {
  return (
    <div className='mb-8 md:mb-16'>
      <div className='px-4 md:px-20 xl:px-28 py-8 md:py-12 xl:py-16'>
        <div className='text-4xl text-center font-semibold'>
          Thank you!
        </div>
        <div className='mt-4 text-lg text-center text-tertiary-gray font-normal'>
          Your application has been successfully submitted.
        </div>
      </div>

      <div className='px-4 md:px-20 xl:px-28 flex flex-col md:flex-row gap-4 md:gap-12'>
        <div className='w-full md:w-1/2 h-[320px] xl:h-[560px] relative'>
          <Image
            src={convertGDriveLinkToSrc('https://drive.google.com/file/d/17KjBs_0oqP0bGNHtLeoabl5hrcvBu7PM/view?usp=sharing')}
            alt='advertise thumbnail 1'
            fill
            sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
            className='card object-cover rounded-xl'
            priority
          />
        </div>
        <div className='w-full md:w-1/2 flex flex-col gap-4'>
          <div className='text-sm md:text-base text-tertiary-gray font-normal'>
            {'We appreciate you taking the time to apply to become a provider with FFPTravels. We\'re thrilled about the possibility of partnering with you to inspire and connect fitness enthusiasts around the world.'}
          </div>
          <div className='text-sm md:text-base text-tertiary-gray font-normal'>
            {'Our team will review your details and get back to you within 24 hours. If we require more information we will let you know. Once approved, you\'ll have access to our platform to create listings and showcase your services, connect with fitness enthusiasts, and grow your business.'}
          </div>
          <div className='text-sm md:text-base text-tertiary-gray font-normal'>
            In the meantime, feel free to explore our website and learn more about how FFPTravels is transforming the way people combine fitness, wellness, and adventure.
          </div>
          <div className='mt-12 self-center md:self-start'>
            <Link
              href='/home'
              className='px-6 py-3 text-lg text-primary-white font-semibold bg-primary-btn rounded-full hover:bg-opacity-90'
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitProviderPage;