import Image from 'next/image';
import Link from 'next/link';

import { emptyPageImage, warningPage } from '@public/images';

import { Props } from './EmptyPage.types';

const EmptyPage = (props: Props) => {
  const {
    title = 'Nothing yet',
    caption,
    type,
    withContactUs,
  } = props;
  return (
    <div className='flex flex-1 flex-col justify-center items-center gap-6'>
      <div>
        <Image
          src={type === 'warning' ? warningPage : emptyPageImage}
          alt='Empty page image'
          height={300}
          width={300}
          sizes='(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw'
          className='object-cover'
          priority
        />
      </div>

      <div className='flex flex-col items-center gap-2 text-center'>
        <div className='text-xl md:text-3xl font-semibold'>{title}</div>
        <div className='text-base md:text-xl text-wrap text-tertiary-gray font-normal'>{caption}</div>
      </div>

      {withContactUs &&
        <Link
          href='/contact-us'
          className='px-4 py-2 font-semibold text-primary-white bg-primary-btn hover:bg-opacity-90 rounded-full'
        >
          Contact Us
        </Link>
      }
    </div>
  );
};

export default EmptyPage;