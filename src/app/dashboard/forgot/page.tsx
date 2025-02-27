import { Metadata } from 'next/types';

import { ForgotPage } from '@ffp-web/modules/Auth';

export const metadata: Metadata = {
  title: 'CMS - Forgot Passowrd',
  description: 'FFP CMS forgot password',
};

const Page = () => {
  return <ForgotPage />;
};

export default Page;