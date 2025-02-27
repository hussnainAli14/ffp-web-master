import { Metadata } from 'next/types';

import { EditCountryPage } from '@ffp-web/modules/Dashboard/Places';

export const metadata: Metadata = {
  title: 'CMS - Edit Country',
  description: 'FFP CMS edit country',
};

const Page = () => {
  return <EditCountryPage/>;
};

export default Page;