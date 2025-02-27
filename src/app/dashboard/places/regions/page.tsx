import { Metadata } from 'next/types';

import { ListRegionPage } from '@ffp-web/modules/Dashboard/Places';

export const metadata: Metadata = {
  title: 'CMS - Regions',
  description: 'FFP CMS regions',
};

const Page = () => {
  return <ListRegionPage />;
};

export default Page;