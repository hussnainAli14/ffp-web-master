import { Metadata } from 'next/types';

import { CityPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - City',
  description: 'FFP city',
};

const Page = () => {
  return <CityPage />;
};

export default Page;