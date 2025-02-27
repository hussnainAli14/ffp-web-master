import { Metadata } from 'next/types';

import { ForgotPage } from '@ffp-web/modules/Auth';

export const metadata: Metadata = {
  title: 'FFP Travels - Forgot Passowrd',
  description: 'FFP user forgot password',
};

const Page = () => {
  return <ForgotPage />;
};

export default Page;