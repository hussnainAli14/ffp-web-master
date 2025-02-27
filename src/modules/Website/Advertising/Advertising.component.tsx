import Image from 'next/image';
import { FaCircleCheck } from 'react-icons/fa6';

import { convertGDriveLinkToSrc } from '@ffp-web/utils/link.utils';

import { advertisingBenefits, advertisingOpportunities } from './data';

const AdvertisingPage = () => {
  return (
    <div className='mb-8 md:mb-16'>
      <div className='px-4 md:px-20 xl:px-28 py-12 md:py-16 xl:py-20 flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-8'>
        <div className='w-full md:w-1/2'>
          <div className='text-3xl md:text-5xl font-semibold'>
            Advertise with FFP
          </div>
          <div className='mt-4 md:mt-6 text-base md:text-xl text-tertiary-gray font-normal'>
            Want to reach travel enthusiasts? Advertise with FFP and showcase your brand to a global community of adventurers and planners!
          </div>
          <div className='flex justify-center md:justify-start'>
            <button className='mt-8 md:mt-12 px-6 py-3 text-lg text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full'>
              Advertise with Us
            </button>
          </div>
        </div>
        <div className='w-full md:w-1/2 h-[320px] xl:h-[560px] relative'>
          <Image
            src={convertGDriveLinkToSrc('https://drive.google.com/file/d/18HVY6BmAXYM8tXigBjNM19Xl-4IxQbtD/view?usp=sharing')}
            alt='advertise thumbnail 1'
            fill
            sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
            className='card object-cover rounded-xl'
            priority
          />
        </div>
      </div>

      <div className='bg-primary-bg text-primary-white px-4 md:px-20 xl:px-28 py-12 md:py-16 xl:py-20'>
        <div className='text-2xl md:text-4xl font-semibold'>
          Why <span className='text-secondary-btn'>advertise</span> with Us?
        </div>
        <div className='mt-8 md:mt-12 xl:mt-16 flex flex-col md:flex-row gap-6 md:gap-8 xl:gap-12'>
          {advertisingBenefits.map(item => (
            <div key={item.title} className='md:min-w-64 md:max-w-96 w-full md:w-1/3 flex flex-col items-center text-center'>
              <div className='min-w-10 md:min-w-12 h-10 md:h-12 flex justify-center items-center bg-primary-btn rounded-lg'>
                <item.icon size={24} />
              </div>
              <div className='mt-2 md:mt-4 tex-base md:text-xl font-semibold'>{item.title}</div>
              <div className='mt-1 md:mt-2 text-sm md:text-base'>{item.content}</div>
            </div>
          ))}
        </div>
      </div>

      <div className='px-4 md:px-20 xl:px-28 pt-12 md:pt-16 xl:pt-20 pb-4 md:pb-6'>
        <div className='text-2xl md:text-4xl font-semibold'>
          Advertising opportunities
        </div>
      </div>
      <div className='px-4 md:px-20 xl:px-28 pb-12 md:pb-16 xl:pb-20 pt-4 md:pt-6 flex gap-6 overflow-x-scroll no-scroll-indicator'>
        {advertisingOpportunities.map(item => (
          <div key={item.title} className='card p-6 md:p-8 bg-primary-white rounded-xl min-w-64 max-w-96 w-1/3'>
            <div className='text-xl md:text-2xl font-semibold'>
              {item.title}
            </div>
            <div className='mt-4 md:mt-6 flex flex-col gap-3 md:gap-4'>
              {item.opportunities.map(val => (
                <div key={val} className='flex gap-2 md:gap-3'>
                  <div className='text-primary-btn'><FaCircleCheck size={24} /></div>
                  <div className='text-base text-tertiary-gray font-normal'>{val} </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className='card mx-8 md:mx-20 xl:mx-28 p-8 md:p-12 xl:p-16 bg-primary-bg rounded-xl flex flex-wrap gap-4 justify-center xl:justify-between items-center'>
        <div className='text-center xl:text-left text-primary-white'>
          <div className='text-xl md:text-3xl font-semibold'>
            Let’s work <span className='text-secondary-btn'>together</span>
          </div>
          <div className='text-base md:text-lg font-normal mt-3 md:mt-4'>
            Partner with FFP to enhance your brand’s visibility and connect with travelers worldwide.
          </div>
        </div>
        <button className='w-full md:w-auto text-base text-primary-white font-semibold px-4 py-2 rounded-full bg-primary-btn hover:bg-opacity-90'>
          Advertise with Us
        </button>
      </div>
    </div>
  );
};

export default AdvertisingPage;