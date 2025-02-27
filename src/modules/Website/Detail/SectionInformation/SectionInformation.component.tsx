import { useState } from 'react';

import { CONTENT_TYPE } from '@ffp-web/app/index.types';

import { Props } from './SectionInformation.types';

const SectionInformation = ({ data }: Props) => {
  const maxLength = 400;
  const [isTruncated, setIsTruncated] = useState(data.details?.[0]?.length > maxLength);

  const renderSectionText = () => {
    return (
      <div className='flex flex-col gap-3 pb-8 border-b border-gray-300'>
        <div className='text-2xl font-semibold'>
          {data.title}
        </div>
        <div className='text-base md:text-lg text-tertiary-gray font-normal'>
          {isTruncated ?
            data.details?.[0].slice(0, maxLength) + '...  ' :
            data.details?.[0]
          }
          {isTruncated && <button
            className='text-base md:text-lg text-primary-btn font-semibold'
            onClick={() => setIsTruncated(false)}
          >
            Show more
          </button>}
        </div>
      </div>
    );
  };

  const renderSectionList = () => {
    return (
      <div className='flex flex-col xl:flex-row gap-3 pb-8 border-b border-gray-300'>
        <div className='text-2xl font-semibold xl:w-1/4'>
          {data.title}
        </div>
        <ul className='list-disc pl-8 xl:pl-0  xl:w-3/4'>
          {data.details?.map(e => <li key={e} className='text-base md:text-lg text-tertiary-gray font-normal'>{e}</li>)}
        </ul>
      </div>
    );
  };

  if (data.contentType === CONTENT_TYPE.TEXT) return renderSectionText();
  if (data.contentType === CONTENT_TYPE.LIST) return renderSectionList();
  return null;
};

export default SectionInformation;