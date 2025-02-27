import { Metadata } from 'next/types';

import { AddProviderPage } from '@ffp-web/modules/Dashboard/Providers';

export const metadata: Metadata = {
  title: 'CMS - Providers',
  description: 'FFP CMS add provider',
};

const Page = () => {
  return <AddProviderPage />;
};

export default Page;