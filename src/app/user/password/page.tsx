import { Metadata } from 'next/types';

import { PasswordPage } from '@ffp-web/modules/Auth';

export const metadata: Metadata = {
  title: 'FFP Travels - New Password',
  description: 'FFP user new password',
};

const Page = () => {
  return <PasswordPage />;
};

export default Page;