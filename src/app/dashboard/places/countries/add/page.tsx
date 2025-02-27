import { Metadata } from 'next/types';

import { AddCountryPage } from '@ffp-web/modules/Dashboard/Places';

export const metadata: Metadata = {
  title: 'CMS - New Country',
  description: 'FFP CMS new country',
};

const Page = () => {
  return <AddCountryPage/>;
};

export default Page;