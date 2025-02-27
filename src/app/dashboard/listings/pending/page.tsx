import { Metadata } from 'next/types';

import { ListPendingListingPage } from '@ffp-web/modules/Dashboard/Listings';

export const metadata: Metadata = {
  title: 'CMS - Pending Listings',
  description: 'FFP CMS pending listings',
};

const Page = () => {
  return <ListPendingListingPage />;
};

export default Page;