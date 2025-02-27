import { Metadata } from 'next/types';

import { JoinProviderPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Become a Provider',
  description: 'FFP join provider page',
};

const Page = () => {
  return <JoinProviderPage />;
};

export default Page;