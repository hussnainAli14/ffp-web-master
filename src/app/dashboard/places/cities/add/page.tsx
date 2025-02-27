import { Metadata } from 'next/types';

import { AddCityPage } from '@ffp-web/modules/Dashboard/Places';

export const metadata: Metadata = {
  title: 'CMS - New City',
  description: 'FFP CMS new city',
};

const Page = () => {
  return <AddCityPage/>;
};

export default Page;