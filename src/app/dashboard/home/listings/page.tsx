import { Metadata } from 'next/types';

import { DashboardListingsPage } from '@ffp-web/modules/Dashboard/Home';

export const metadata: Metadata = {
  title: 'CMS - All Listings',
  description: 'FFP CMS all listings',
};

const Page = () => {
  return <DashboardListingsPage />;
};

export default Page;