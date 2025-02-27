import { Metadata } from 'next/types';

import { RegisterPage } from '@ffp-web/modules/Auth';

export const metadata: Metadata = {
  title: 'FFP Travels - User Register',
  description: 'FFP user register',
};

const Page = () => {
  return <RegisterPage />;
};

export default Page;