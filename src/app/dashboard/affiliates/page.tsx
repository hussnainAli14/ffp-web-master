import { Metadata } from 'next/types';

import { ListAffiliatePage } from '@ffp-web/modules/Dashboard/Affiliates';

export const metadata: Metadata = {
  title: 'CMS - Affiliates',
  description: 'FFP CMS affiliates',
};

const Page = () => {
  return <ListAffiliatePage />;
};

export default Page;