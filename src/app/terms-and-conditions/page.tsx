import { Metadata } from 'next/types';

import { TermsAndConditionsPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Terms And Conditions',
  description: 'FFP terms and conditions page',
};

const Page = () => {
  return <TermsAndConditionsPage />;
};

export default Page;