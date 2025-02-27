import { Metadata } from 'next/types';

import { EditCityPage } from '@ffp-web/modules/Dashboard/Places';

export const metadata: Metadata = {
  title: 'CMS - Edit City',
  description: 'FFP CMS edit city',
};

const Page = () => {
  return <EditCityPage/>;
};

export default Page;