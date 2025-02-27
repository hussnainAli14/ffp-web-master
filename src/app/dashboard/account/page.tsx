import { Metadata } from 'next/types';

import { AccountPage } from '@ffp-web/modules/Dashboard/Account';

export const metadata: Metadata = {
  title: 'CMS - Account',
  description: 'FFP CMS account',
};

const Page = () => {
  return <AccountPage />;
};

export default Page;