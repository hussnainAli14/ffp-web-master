import { Metadata } from 'next/types';

import { ListActiveListingPage } from '@ffp-web/modules/Dashboard/Listings';

export const metadata: Metadata = {
  title: 'CMS - Active Listings',
  description: 'FFP CMS active listings',
};

const Page = () => {
  return <ListActiveListingPage />;
};

export default Page;