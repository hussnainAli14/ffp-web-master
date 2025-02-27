import { textUtils } from '@ffp-web/utils';

import { privacyPolicy } from './data';

const PrivacyPolicyPage = () => {
  const { formatTextWithBreakLine } = textUtils;

  return (
    <div className='px-4 md:px-20 xl:px-28 py-12 md:py-14 xl:py-16'>
      <div className='text-2xl md:text-4xl font-semibold'>
        Privacy Policy
      </div>
      <div className='text-xl md:text-2xl font-semibold mt-6 mb-3'>
        Version 08/18/2024
      </div>
      <div className='text-base md:text-lg overflow-hidden text-tertiary-gray fonr-normal'>
        {formatTextWithBreakLine(privacyPolicy)}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;