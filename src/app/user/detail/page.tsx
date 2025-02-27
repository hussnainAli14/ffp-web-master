import { Metadata } from 'next/types';

import { UserPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - User Management',
  description: 'FFP user management',
};

const Page = () => {
  return <UserPage />;
};

export default Page;