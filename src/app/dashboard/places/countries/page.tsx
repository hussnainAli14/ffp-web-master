import { Metadata } from 'next/types';

import { ListCountryPage } from '@ffp-web/modules/Dashboard/Places';

export const metadata: Metadata = {
  title: 'CMS - Countries',
  description: 'FFP CMS countries',
};

const Page = () => {
  return <ListCountryPage />;
};

export default Page;