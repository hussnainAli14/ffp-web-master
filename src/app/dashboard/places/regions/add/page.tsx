import { Metadata } from 'next/types';

import { AddRegionPage } from '@ffp-web/modules/Dashboard/Places';

export const metadata: Metadata = {
  title: 'CMS - New Region',
  description: 'FFP CMS new region',
};

const Page = () => {
  return <AddRegionPage/>;
};

export default Page;