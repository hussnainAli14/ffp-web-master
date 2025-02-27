import { Metadata } from 'next/types';

import { ViewUserPage } from '@ffp-web/modules/Dashboard/Users';

export const metadata: Metadata = {
  title: 'CMS - Users',
  description: 'FFP CMS view users',
};

const Page = () => {
  return <ViewUserPage />;
};

export default Page;