import { Metadata } from 'next/types';

import { HomePage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Home',
  description: 'FFP home website',
};

const Page = () => {
  return <HomePage />;
};

export default Page;