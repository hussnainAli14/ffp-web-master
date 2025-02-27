import Image from 'next/image';
import Link from 'next/link';

import { convertGDriveLinkToSrc } from '@ffp-web/utils/link.utils';

import { benefits, roles } from './data';

const AffiliatePage = () => {
  return (
    <div className='mb-8 md:mb-16'>
      <div className='px-4 md:px-20 xl:px-28 py-12 md:py-16 xl:py-20 flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-8'>
        <div className='w-full md:w-1/2'>
          <div className='text-3xl md:text-5xl font-semibold'>
            Join the FFP <span className='text-primary-btn'>affiliate program</span>
          </div>
          <div className='mt-4 md:mt-6 text-base md:text-xl text-tertiary-gray font-normal'>
            Love travel and want to earn extra income? Join a network of travel enthusiasts earning commissions by promoting exciting travel packages!
          </div>
          <div className='flex justify-center md:justify-start'>
            <Link
              href={'/affiliate/join'}
              className='mt-8 md:mt-12 px-6 py-3 text-lg text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full'
            >
              Join as Affiliate
            </Link>
          </div>
        </div>
        <div className='w-full md:w-1/2 h-[320px] xl:h-[560px] relative'>
          <Image
            src={convertGDriveLinkToSrc('https://drive.google.com/file/d/1_pW-OU6zpkKHUkkyZS6EUkChS8EnOLDF/view?usp=sharing')}
            alt='affiliate thumbnail 1'
            fill
            sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
            className='card object-cover rounded-xl'
            priority
          />
        </div>
      </div>

      <div className='px-4 md:px-20 xl:px-28 py-12 md:py-16 xl:py-20'>
        <div className='text-2xl md:text-4xl font-semibold'>
          <span className='text-primary-btn'>Why join</span> the FFP affiliate program?
        </div>
        <div className='mt-8 md:mt-12 xl:mt-16 flex flex-col md:flex-row gap-8 md:gap-12 xl:gap-16'>
          <div className='w-full md:w-1/2 h-[320px] md:h-auto relative'>
            <Image
              src={convertGDriveLinkToSrc('https://drive.google.com/file/d/10m1w5xfSa2yFxIX_HSOkgnUB7xFHoBtk/view?usp=sharing')}
              alt='affiliate thumbnail 1'
              fill
              sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
              className='card object-cover rounded-xl'
              priority
            />
          </div>
          <div className='w-full md:w-1/2 flex flex-col gap-8 md:gap-12'>
            {benefits.map(item => (
              <div key={item.title} className='flex gap-3 md:gap-5'>
                <div className='min-w-10 md:min-w-12 h-10 md:h-12 text-primary-white flex justify-center items-center bg-primary-btn rounded-lg'>
                  <item.icon size={24} />
                </div>
                <div>
                  <div className='text-base md:text-xl font-semibold'>{item.title}</div>
                  <div className='text-sm md:text-base font-normal mt-1 md:mt-2'>{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='px-4 md:px-20 xl:px-28 pt-12 md:pt-16 xl:pt-20 pb-4 md:pb-6'>
        <div className='text-2xl md:text-4xl font-semibold'>
          Affiliate <span className='text-primary-btn'>roles</span>
        </div>
        <div className='mt-3 md:mt-4 xl:mt-5 xl:w-2/3 text-base md:text-xl text-tertiary-gray font-normal'>
          Our Affiliate Program offers three distinct roles, each with its own benefits and earning potential:
        </div>
      </div>
      <div className='px-4 md:px-20 xl:px-28 pb-12 md:pb-16 xl:pb-20 pt-4 md:pt-6 flex gap-6 overflow-x-scroll no-scroll-indicator'>
        {roles.map(item => (
          <div key={item.role} className='card p-6 md:p-8 bg-primary-white rounded-xl min-w-64 max-w-96 w-1/3'>
            <div className='text-xl md:text-2xl font-semibold'>
              {item.role}
            </div>
            <div className='mt-4 md:mt-6 flex flex-col gap-3 md:gap-4'>
              {item.details.map(val => (
                <div key={val.title} className='flex gap-3'>
                  <div className='text-primary-btn'>
                    <val.icon size={24} />
                  </div>
                  <div className='text-sm md:text-base'>
                    <div className='font-semibold'>
                      {val.title}
                    </div>
                    <div className='mt-1 text-tertiary-gray'>
                      {val.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className='card mx-8 md:mx-20 xl:mx-28 p-8 md:p-12 xl:p-16 bg-primary-bg rounded-xl flex flex-wrap gap-4 justify-center xl:justify-between items-center'>
        <div className='text-center xl:text-left text-primary-white'>
          <div className='text-xl md:text-3xl font-semibold'>
            Ready to <span className='text-secondary-btn'>join?</span>
          </div>
          <div className='text-base md:text-lg font-normal mt-3 md:mt-4'>
            Sign up today to explore the world, connect, and generate income on your schedule!
          </div>
        </div>
        <Link
          href={'/affiliate/join'}
          className='w-full md:w-auto text-center text-base text-primary-white font-semibold px-4 py-2 rounded-full bg-primary-btn hover:bg-opacity-90'
        >
          Join as Affiliate
        </Link>
      </div>
    </div>
  );
};

export default AffiliatePage;