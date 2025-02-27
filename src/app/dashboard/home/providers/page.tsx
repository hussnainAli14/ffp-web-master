import { Metadata } from 'next/types';

import { DashboardProvidersPage } from '@ffp-web/modules/Dashboard/Home';

export const metadata: Metadata = {
  title: 'CMS - All Providers',
  description: 'FFP CMS all providers',
};

const Page = () => {
  return <DashboardProvidersPage />;
};

export default Page;