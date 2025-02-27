import { Metadata } from 'next/types';

import { EditActiveListingPage } from '@ffp-web/modules/Dashboard/Listings';

export const metadata: Metadata = {
  title: 'CMS - Edit Active Listings',
  description: 'FFP CMS edit active listings',
};

const Page = () => {
  return <EditActiveListingPage />;
};

export default Page;