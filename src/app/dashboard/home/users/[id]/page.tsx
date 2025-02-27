import { Metadata } from 'next/types';

import { DashboardUsersDetailPage } from '@ffp-web/modules/Dashboard/Home';

export const metadata: Metadata = {
  title: 'CMS - All Users',
  description: 'FFP CMS detail users',
};

const Page = () => {
  return <DashboardUsersDetailPage />;
};

export default Page;