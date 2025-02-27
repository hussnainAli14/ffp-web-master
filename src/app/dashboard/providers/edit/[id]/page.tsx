import { Metadata } from 'next/types';

import { EditProviderPage } from '@ffp-web/modules/Dashboard/Providers';

export const metadata: Metadata = {
  title: 'CMS - Providers',
  description: 'FFP CMS edit provider',
};

const Page = () => {
  return <EditProviderPage />;
};

export default Page;