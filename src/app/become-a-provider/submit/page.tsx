import { Metadata } from 'next/types';

import { SubmitProviderPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Become a Provider',
  description: 'FFP submit provider page',
};

const Page = () => {
  return <SubmitProviderPage />;
};

export default Page;