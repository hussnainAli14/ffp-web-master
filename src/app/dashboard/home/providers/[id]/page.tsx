import { Metadata } from 'next/types';

import { DashboardProvidersDetailPage } from '@ffp-web/modules/Dashboard/Home';

export const metadata: Metadata = {
  title: 'CMS - All Providers',
  description: 'FFP CMS detail providers',
};

const Page = () => {
  return <DashboardProvidersDetailPage />;
};

export default Page;