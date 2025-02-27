import { Metadata } from 'next/types';

import { AdvertisingPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Advertising',
  description: 'FFP advertising page',
};

const Page = () => {
  return <AdvertisingPage />;
};

export default Page;