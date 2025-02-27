import Image from 'next/image';
import Link from 'next/link';
import { FaCircleCheck, FaStar } from 'react-icons/fa6';

import { Rating, Tag } from '@ffp-web/components';
import { convertGDriveLinkToSrc } from '@ffp-web/utils/link.utils';

import { benefits, joinProcedurs, list, partnerships } from './data';

const ProviderPage = () => {
  return (
    <div className='mb-8 md:mb-16'>
      <div className='px-4 md:px-20 xl:px-28 pt-8 md:pt-12 xl:pt-16 pb-8 md:pb-16 xl:pb-24'>
        <div className='flex flex-col md:flex-row md:justify-between gap-8 md:gap-12 xl:gap-16'>
          <div className='w-full md:w-1/2'>
            <div className='text-3xl md:text-5xl font-semibold'>
              Increase <span className='text-primary-btn'>brand awareness & sales</span> with low listing fees
            </div>
            <div className='mt-2 md:mt-4 xl:mt-6 text-base md:text-xl text-tertiary-gray font-normal'>
              Publishing on FFP Travels is quick & easy
            </div>
            <div className='mt-4 md:mt-8 xl:mt-12 ml-4 md:ml-0 flex flex-col gap-2 md:gap-3 xl:gap-4'>
              {benefits.map(item => (
                <div key={item} className='flex gap-3 items-center'>
                  <div className='text-primary-btn'><FaCircleCheck size={24} /></div>
                  <div className='text-base text-tertiary-gray font-normal'>{item}</div>
                </div>
              ))}
              <div className='mt-4 md:mt-8 xl:mt-12 self-end md:self-start'>
                <Link
                  href='/become-a-provider/join'
                  className='px-6 py-3 text-lg text-primary-white font-semibold bg-primary-btn rounded-full hover:bg-opacity-90'
                >
                  Join as Provider
                </Link>
              </div>
            </div>
          </div>

          <div className='w-full md:w-1/2 h-[480px] md:h-auto relative'>
            <Image
              src={convertGDriveLinkToSrc('https://drive.google.com/file/d/1KcafJ5jVnGrkNHmIaz8tV_QdMnoTINVt/view?usp=sharing')}
              alt='Become a provider thumbnail image'
              fill
              sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
              className='card object-cover rounded-ss-[80px] md:rounded-ss-[120px] xl:rounded-ss-[160px]'
              priority
            />
            <div className='card bg-primary-white rounded-xl w-48 absolute -left-4 md:-left-12 xl:-left-24 bottom-36 xl:bottom-14'>
              <div className='border-b p-3'>
                <div className='text-xs text-primary-btn font-semibold'>
                  HIIT
                </div>
                <div className='mt-1 text-sm font-semibold'>
                  High-Intensity Interval Training (HIIT)
                </div>
                <div className='mt-1 flex items-center gap-1'>
                  <FaStar color='#F1BC44' />
                  <div className='text-xs font-semibold'>4.9</div>
                  <div className='ml-1 text-xs font-normal text-tertiary-gray'>• 30 Reviews</div>
                </div>
                <div className='mt-2 flex flex-wrap items-center gap-2'>
                  <Tag text='Gym' />
                  <Tag text='Fitness' />
                </div>
              </div>
              <div className='p-3 flex justify-between items-center'>
                <div>
                  <div className='text-xs font-normal text-primary-gray'>Starting from:</div>
                  <div className='text-sm font-semibold'>$79.00</div>
                </div>
                <button className='text-xs text-primary-white font-semibold px-3 py-2 bg-primary-btn rounded-full'>
                  Book Now
                </button>
              </div>
            </div>
            <div className='card bg-primary-white rounded-xl w-72 md:w-96 absolute -right-4 md:-right-6 -bottom-9'>
              <div className='flex flex-col gap-2 p-3'>
                <Rating rating={5} size={18} />
                <div className='text-sm font-semibold'>
                  Perfect for Busy Schedules!
                </div>
                <div className='text-xs font-normal'>
                  {'"HIIT fits perfectly into my busy life! A full-body workout in just 20 minutes that leaves me energized. I adjusted the intensity as a beginner, and the results have been amazing!"'}
                </div>
                <div className='text-xs font-semibold'>
                  - Jenna L.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 md:px-20 xl:px-28 pt-8 md:pt-12 xl:pt-16'>
        <div className='text-2xl md:text-4xl font-semibold'>
          <span className='text-primary-btn'>Quick and easy to</span> join
        </div>
      </div>
      <div className='mt-4 md:mt-8 xl:mt-12 px-4 md:px-20 xl:px-28 pt-2 pb-8 md:pb-16 xl:pb-24 flex gap-6 md:gap-10 overflow-x-scroll no-scroll-indicator'>
        {joinProcedurs.map(item => (
          <div key={item.step} className='min-w-64 max-w-96 w-1/3 flex flex-col'>
            <div className='relative h-40 md:h-52 xl:h-60'>
              <Image
                src={convertGDriveLinkToSrc(item.image)}
                alt={`How to join a provider step ${item.step}`}
                fill
                sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
                className='card object-cover rounded-xl'
                priority
              />
            </div>
            <div className='text-base md:text-xl text-primary-white font-semibold md:text-xl mt-2 md:mt-4 h-8 md:h-12 w-8 md:w-12 flex justify-center items-center rounded-lg bg-primary-btn'>
              {item.step}
            </div>
            <div className='text-base md:text-xl font-semibold mt-2 md:mt-4'>
              {item.title}
            </div>
            <div className='text-sm xl:text-base text-tertiary-gray font-normal mt-1 md:mt-2'>
              {item.subtitle}
            </div>
          </div>
        ))}
      </div>

      <div className='bg-primary-bg text-primary-white'>
        <div className='px-4 md:px-20 xl:px-28 py-12 md:py-16 xl:py-20'>
          <div className='text-2xl md:text-4xl font-semibold'>
            This is why you <span className='text-secondary-btn'>partner with us</span>
          </div>
          <div className='text-base md:text-xl font-normal mt-3 md:mt-4 xl:mt-5'>
            We are more than just another marketplace, with your help we can support people to live better by helping them find the exact health, fitness and active experience you offer.
          </div>
          <div className='grid grid-col-1 md:grid-cols-2 gap-4 md:gap-8 xl:gap-12 mt-8 md:mt-12'>
            {partnerships.map(item => (
              <div key={item.title} className='flex gap-3 md:gap-5'>
                <div className='min-w-10 md:min-w-12 h-10 md:h-12 flex justify-center items-center bg-primary-btn rounded-lg'>
                  <item.icon size={24} />
                </div>
                <div>
                  <div className='text-base md:text-xl font-semibold'>{item.title}</div>
                  <div className='text-sm md:text-base font-normal mt-1 md:mt-2'>{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
          <div className='relative w-full h-[280px] md:h-[360px] xl:h-[440px] mt-8 md:mt-12'>
            <Image
              src={convertGDriveLinkToSrc('https://drive.google.com/file/d/1S9sQiZFJcMT_h_3aEx8tOqqxqV008lDC/view?usp=sharing')}
              alt='Pertanership'
              fill
              className='card object-cover rounded-xl'
              priority
            />
          </div>
        </div>
      </div>

      <div className='px-4 md:px-20 xl:px-28 pt-8 md:pt-12 xl:pt-16'>
        <div className='text-2xl md:text-4xl font-semibold'>
          What can you <span className='text-primary-btn'>list in the community</span>
        </div>
        <div className='text-base md:text-xl text-tertiary-gray xl:w-2/3 font-normal mt-3 md:mt-4 xl:mt-5'>
          Because of our mission to support healthy lifestyles and better living we are looking for the these types of activities, services and offerings from providers.
        </div>
      </div>
      <div className='px-4 md:px-20 xl:px-28 py-4 mt-4 md:mt-6 xl:mt-8 flex xl:flex-wrap gap-6 md:gap-8 overflow-x-scroll no-scroll-indicator'>
        {list.map(item => (
          <div key={item.category} className='card p-4 md:p-8 min-w-60 max-w-96 w-1/3 bg-primary-white rounded-xl'>
            <div className='text-xl md:text-2xl font-semibold'>{item.category}</div>
            <div className='mt-4 md:mt-6 flex flex-col gap-2 md:gap-4'>
              {item.subCategory.map(value => (
                <div key={value} className='flex gap-2 items-center'>
                  <div className='text-primary-btn'>
                    <FaCircleCheck size={24} />
                  </div>
                  <div className='text-sm md:text-base text-tertiary-gray font-normal'>
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-3 text-sm md:text-base text-tertiary-gray font-normal'>
              And more..
            </div>
          </div>
        ))}
      </div>

      <div className='card mx-8 md:mx-20 xl:mx-28 mt-8 md:mt-16 p-8 md:p-12 xl:p-16 bg-primary-bg rounded-xl flex flex-wrap gap-4 justify-center xl:justify-between items-center'>
        <div className='text-xl md:text-3xl text-center xl:text-left text-primary-white font-semibold'>
          Support a healthy, fit & active community
        </div>
        <Link
          href='/become-a-provider/join'
          className='w-full md:w-auto text-center text-base text-primary-white font-semibold px-4 py-2 rounded-full bg-primary-btn hover:bg-opacity-90'
        >
          Become a Provider
        </Link>
      </div>
    </div>
  );
};

export default ProviderPage;