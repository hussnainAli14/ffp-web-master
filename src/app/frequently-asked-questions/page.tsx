import { Metadata } from 'next/types';

import { FAQPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - FAQ\'s',
  description: 'FFP FAQ page',
};

const Page = () => {
  return <FAQPage />;
};

export default Page;