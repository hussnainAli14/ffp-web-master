import { Metadata } from 'next/types';

import { ListProviderPage } from '@ffp-web/modules/Dashboard/Providers';

export const metadata: Metadata = {
  title: 'CMS - Providers',
  description: 'FFP CMS providers',
};

const Page = () => {
  return <ListProviderPage />;
};

export default Page;