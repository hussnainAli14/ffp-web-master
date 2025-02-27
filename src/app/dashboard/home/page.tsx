import { Metadata } from 'next/types';

import { DashboardPage } from '@ffp-web/modules/Dashboard/Home';

export const metadata: Metadata = {
  title: 'CMS - Dashboard',
  description: 'FFP CMS dashboard',
};

const Page = () => {
  return <DashboardPage />;
};

export default Page;