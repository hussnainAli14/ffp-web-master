import { Metadata } from 'next/types';

import { VerifyPage } from '@ffp-web/modules/Auth';

export const metadata: Metadata = {
  title: 'FFP Travels - Verify Registration',
  description: 'FFP verify registration',
};

const Page = () => {
  return <VerifyPage />;
};

export default Page;