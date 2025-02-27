import { Metadata } from 'next/types';

import { EditRegionPage } from '@ffp-web/modules/Dashboard/Places';

export const metadata: Metadata = {
  title: 'CMS - Edit Region',
  description: 'FFP CMS edit region',
};

const Page = () => {
  return <EditRegionPage/>;
};

export default Page;