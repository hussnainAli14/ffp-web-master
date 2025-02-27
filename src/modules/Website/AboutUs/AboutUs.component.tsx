import Image from 'next/image';

import { convertGDriveLinkToSrc, formatYoutubeLinkToEmbed } from '@ffp-web/utils/link.utils';

import { founders, services } from './data';

const AboutUsPage = () => {
  return (
    <div className='mb-8 md:mb-16'>
      <div className='px-4 md:px-20 xl:px-28 py-12 md:py-16 xl:py-20 flex flex-col gap-6 md:gap-8'>
        <div className='w-full'>
          <div className='text-3xl md:text-5xl font-semibold'>
            Welcome to FFPTravels
          </div>
          <div className='mt-4 md:mt-6 text-base md:text-xl text-tertiary-gray font-normal'>
            {'FFPTravels is a vibrant global community designed for fitness minded who love to explore the world while staying active and healthy. Whether you\'re seeking adventure-packed tours, fitness facilities, healthy cafes or wellness services, FFPTravels connects you with top-tier providers worldwide, making it easy to find, plan, and book activities tailored to your lifestyle.'}
          </div>
        </div>
        <div className='w-full relative'>
          <iframe
            id='video-player'
            className='w-full h-[300px] md:h-[400px] lg:h-[600px] xl:h-[700px] rounded-2xl'
            src={formatYoutubeLinkToEmbed('https://www.youtube.com/watch?v=XXSrJcc2SR4')}
            title='YouTube video player'
            allowFullScreen
          />
        </div>
      </div>

      <div className='px-4 md:px-20 xl:px-28 pt-8 md:pt-12 xl:pt-16'>
        <div className='text-2xl md:text-4xl font-semibold'>
          What <span className='text-primary-btn'>we do</span>
        </div>
        <div className='mt-3 md:mt-5 xl:w-2/3 text-base md:text-xl text-tertiary-gray font-normal'>
          At FFPTravels, we help travelers discover, plan, and book adventure, fitness and wellness experiences worldwide, combining adventure with a healthy lifestyle.
        </div>
      </div>
      <div className='mt-4 md:mt-8 xl:mt-12 px-4 md:px-20 xl:px-28 pt-2 pb-8 md:pb-16 xl:pb-24 flex gap-6 md:gap-10 overflow-x-scroll no-scroll-indicator'>
        {services.map(item => (
          <div key={item.title} className='min-w-64 max-w-96 w-1/3 flex flex-col'>
            <div className='relative h-40 md:h-52 xl:h-60'>
              <Image
                src={convertGDriveLinkToSrc(item.image)}
                alt='What we do'
                fill
                sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
                className='card object-cover rounded-xl'
                priority
              />
            </div>
            <div className='text-base md:text-xl text-primary-white font-semibold md:text-xl mt-2 md:mt-4 h-8 md:h-12 w-8 md:w-12 flex justify-center items-center rounded-lg bg-primary-btn'>
              <item.icon size={24} />
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

      <div className='hidden px-4 md:px-20 xl:px-28 py-12 md:py-16 xl:py-20'>
        <div className='text-2xl md:text-4xl font-semibold'>
          <span className='text-primary-btn'>The founder</span> and the story
        </div>
        <div className='mt-8 md:mt-12 flex flex-col md:flex-row flex-wrap md:flex-no-wrap items-center gap-6 md:gap-8'>
          {founders.map(item => (
            <div key={item.name} className='min-w-64 max-w-96 md:w-[70%] lg:w-[50%] xl:w-[30%] flex flex-col'>
              <div className={'card relative h-40 md:h-52 xl:h-60 rounded-xl'} style={{ backgroundColor: item.bgColor }}>
                <Image
                  src={convertGDriveLinkToSrc(item.image)}
                  alt='What we do'
                  fill
                  sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
                  className='object-cover rounded-xl'
                  priority
                />
              </div>
              <div className='text-base md:text-xl font-semibold mt-4 md:mt-6'>
                {item.name}
              </div>
              <div className='text-base md:text-lg text-primary-btn font-normal mt-1'>
                {item.short}
              </div>
              <div className='text-sm xl:text-base text-tertiary-gray font-normal mt-2 md:mt-4'>
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='px-4 md:px-20 xl:px-28'>
        <div className='text-2xl md:text-4xl font-semibold'>
          How we <span className='text-primary-btn'>came to be</span>
        </div>
        <div className='mt-8 md:mt-12 flex flex-col md:flex-row gap-8'>
          <div className='w-full md:w-1/2'>
            <iframe
              id='video-player'
              className='w-full h-96 rounded-2xl'
              src={formatYoutubeLinkToEmbed('https://www.youtube.com/watch?v=CmCD92LTisQ')}
              title='YouTube video player'
              allowFullScreen
            />
          </div>
          <div className='w-full md:w-1/2 flex flex-col gap-4'>
            <div className='text-sm md:text-base text-tertiary-gray font-normal'>
              FFPTravels was born out of my deep passion for sports and fitness and my own challenges as a traveler. During recent trips to the UK, Indonesia, and Australia, I found it surprisingly difficult to locate running tracks, cycling routes, fitness facilities, health food cafes, sports clubs, and recovery options that suited my needs.
            </div>
            <div className='text-sm md:text-base text-tertiary-gray font-normal'>
              After speaking with fellow travelers, I discovered this struggle was common—we all wanted to maintain a healthy lifestyle on the road but often lacked the resources to do so. Another challenge I often heard was the financial strain of travel, with many running out of funds or facing limited budgets.
            </div>
            <div className='text-sm md:text-base text-tertiary-gray font-normal'>
              {'That\'s when I knew I had to take action. I made it my mission to create FFPTravels: a global community designed to connect travelers with fitness and wellness opportunities while empowering them to earn an income on the go. It\'s my way of making it easier for people like us to live our passions, stay healthy, and travel the world.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;