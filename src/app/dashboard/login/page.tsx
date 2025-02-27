import { Metadata } from 'next/types';

import { LoginPage } from '@ffp-web/modules/Auth';

export const metadata: Metadata = {
  title: 'CMS - Login',
  description: 'FFP CMS login',
};

const Page = () => {
  return <LoginPage />;
};

export default Page;