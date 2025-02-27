import { Metadata } from 'next/types';

import { ViewAffiliatePage } from '@ffp-web/modules/Dashboard/Affiliates';

export const metadata: Metadata = {
  title: 'CMS - Affiliates',
  description: 'FFP CMS view affiliates',
};

const Page = () => {
  return <ViewAffiliatePage />;
};

export default Page;