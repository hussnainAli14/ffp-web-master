import { Metadata } from 'next/types';

import { ListUsersPage } from '@ffp-web/modules/Dashboard/Users';

export const metadata: Metadata = {
  title: 'CMS - Users',
  description: 'FFP CMS users',
};

const Page = () => {
  return <ListUsersPage />;
};

export default Page;