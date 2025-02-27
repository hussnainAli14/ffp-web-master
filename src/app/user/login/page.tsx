import { Metadata } from 'next/types';

import { LoginPage } from '@ffp-web/modules/Auth';

export const metadata: Metadata = {
  title: 'FFP Travels - User Login',
  description: 'FFP user login',
};

const Page = () => {
  return <LoginPage />;
};

export default Page;