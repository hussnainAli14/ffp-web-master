import { Metadata } from 'next/types';

import { DashboardUsersPage } from '@ffp-web/modules/Dashboard/Home';

export const metadata: Metadata = {
  title: 'CMS - All Users',
  description: 'FFP CMS all users',
};

const Page = () => {
  return <DashboardUsersPage />;
};

export default Page;