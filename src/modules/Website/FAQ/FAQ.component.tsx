import Link from 'next/link';

import { Accordion } from './Accordion';
import { accesibility, booking, general, payments, providers, safety, support } from './data';

const FAQPage = () => {
  return (
    <div className='flex flex-col gap-16 mt-8 md:mt-16 mb-8 md:mb-16'>
      <div className='mx-8 md:mx-auto'>
        <div className='text-3xl md:text-5xl text-center font-semibold'>
          Frequently asked <span className='text-primary-btn'>questions</span>
        </div>
        <div className='mt-4 md:mt-6 text-base md:text-xl text-center text-tertiary-gray font-normal'>
          Have questions? We’re here to help.
        </div>
      </div>

      <div className='w-auto md:w-2/3 xl:w-1/2 mx-8 md:mx-auto flex flex-col gap-4'>
        {general.map(item => (
          <Accordion
            key={item.title}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>

      <div className='w-auto md:w-2/3 xl:w-1/2 mx-8 md:mx-auto flex flex-col gap-4'>
        <div className='text-3xl text-center font-semibold mb-2'>Bookings & Activities</div>
        {booking.map(item => (
          <Accordion
            key={item.title}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>

      <div className='w-auto md:w-2/3 xl:w-1/2 mx-8 md:mx-auto flex flex-col gap-4'>
        <div className='text-3xl text-center font-semibold mb-2'>Payments & Refunds</div>
        {payments.map(item => (
          <Accordion
            key={item.title}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>

      <div className='w-auto md:w-2/3 xl:w-1/2 mx-8 md:mx-auto flex flex-col gap-4'>
        <div className='text-3xl text-center font-semibold mb-2'>Customer Support</div>
        {support.map(item => (
          <Accordion
            key={item.title}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>

      <div className='w-auto md:w-2/3 xl:w-1/2 mx-8 md:mx-auto flex flex-col gap-4'>
        <div className='text-3xl text-center font-semibold mb-2'>Activity Providers</div>
        {providers.map(item => (
          <Accordion
            key={item.title}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>

      <div className='w-auto md:w-2/3 xl:w-1/2 mx-8 md:mx-auto flex flex-col gap-4'>
        <div className='text-3xl text-center font-semibold mb-2'>Accessibility And Inclusivity</div>
        {accesibility.map(item => (
          <Accordion
            key={item.title}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>

      <div className='w-auto md:w-2/3 xl:w-1/2 mx-8 md:mx-auto flex flex-col gap-4'>
        <div className='text-3xl text-center font-semibold mb-2'>Safety and Policies</div>
        {safety.map(item => (
          <Accordion
            key={item.title}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>

      <div className='card mx-8 md:mx-20 xl:mx-28 p-8 md:p-12 xl:p-16 bg-primary-bg rounded-xl flex flex-wrap gap-4 justify-center xl:justify-between items-center'>
        <div className='text-center xl:text-left text-primary-white'>
          <div className='text-xl md:text-3xl font-semibold'>
            Still have <span className='text-secondary-btn'>questions?</span>
          </div>
          <div className='text-base md:text-lg font-normal mt-3 md:mt-4'>
            Can’t find the answer you’re looking for? Please chat to our friendly team.
          </div>
        </div>
        <Link
          href='/contact-us'
          className='w-full md:w-auto text-center text-base text-primary-white font-semibold px-4 py-2 rounded-full bg-primary-btn hover:bg-opacity-90'
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
};

export default FAQPage;