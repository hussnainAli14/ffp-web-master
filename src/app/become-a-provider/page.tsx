import { Metadata } from 'next/types';

import { ProviderPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Become a Provider',
  description: 'FFP provider page',
};

const Page = () => {
  return <ProviderPage />;
};

export default Page;