import { Metadata } from 'next/types';

import { ListCityPage } from '@ffp-web/modules/Dashboard/Places';

export const metadata: Metadata = {
  title: 'CMS - Cities',
  description: 'FFP CMS cities',
};

const Page = () => {
  return <ListCityPage />;
};

export default Page;