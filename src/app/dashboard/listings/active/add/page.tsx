import { Metadata } from 'next/types';

import { AddActiveListingPage } from '@ffp-web/modules/Dashboard/Listings';

export const metadata: Metadata = {
  title: 'CMS - New Active Listings',
  description: 'FFP CMS new active listings',
};

const Page = () => {
  return <AddActiveListingPage />;
};

export default Page;