import { Metadata } from 'next/types';

import { ViewProviderPage } from '@ffp-web/modules/Dashboard/Providers';

export const metadata: Metadata = {
  title: 'CMS - Providers',
  description: 'FFP CMS view provider',
};

const Page = () => {
  return <ViewProviderPage />;
};

export default Page;