import { Metadata } from 'next/types';

import { AffiliatePage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Affiliate',
  description: 'FFP affiliate page',
};

const Page = () => {
  return <AffiliatePage />;
};

export default Page;