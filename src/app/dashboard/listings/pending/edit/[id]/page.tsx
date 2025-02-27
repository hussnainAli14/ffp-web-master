import { Metadata } from 'next/types';

import { EditPendingListingPage } from '@ffp-web/modules/Dashboard/Listings';

export const metadata: Metadata = {
  title: 'CMS - Edit Pending Listings',
  description: 'FFP CMS edit pending listings',
};

const Page = () => {
  return <EditPendingListingPage />;
};

export default Page;