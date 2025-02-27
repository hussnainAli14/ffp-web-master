import { Metadata } from 'next/types';

import { JoinAffiliatePage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Affiliate',
  description: 'FFP join affiliate page',
};

const Page = () => {
  return <JoinAffiliatePage />;
};

export default Page;