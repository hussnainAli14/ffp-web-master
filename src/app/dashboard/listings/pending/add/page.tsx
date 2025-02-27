import { Metadata } from 'next/types';

import { AddPendingListingPage } from '@ffp-web/modules/Dashboard/Listings';

export const metadata: Metadata = {
  title: 'CMS - New Pending Listings',
  description: 'FFP CMS new pending listings',
};

const Page = () => {
  return <AddPendingListingPage />;
};

export default Page;