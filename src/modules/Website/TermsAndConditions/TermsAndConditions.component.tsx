import { textUtils } from '@ffp-web/utils';

import { tnc } from './data';

const TermsAndConditionsPage = () => {
  const { formatTextWithBreakLine } = textUtils;

  return (
    <div className='px-4 md:px-20 xl:px-28 py-12 md:py-14 xl:py-16'>
      <div className='text-2xl md:text-4xl font-semibold'>
        General terms and conditions
      </div>
      <div className='text-xl md:text-2xl font-semibold mt-6 mb-3'>
        Version 06/24/2024
      </div>
      <div className='text-base md:text-lg text-tertiary-gray fonr-normal'>
        {formatTextWithBreakLine(tnc)}
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;