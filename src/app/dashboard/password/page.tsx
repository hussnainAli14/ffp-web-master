import { Metadata } from 'next/types';

import { PasswordPage } from '@ffp-web/modules/Auth';

export const metadata: Metadata = {
  title: 'CMS - New Password',
  description: 'FFP CMS new password',
};

const Page = () => {
  return <PasswordPage />;
};

export default Page;