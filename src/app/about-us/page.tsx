import { Metadata } from 'next/types';

import { AboutUsPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - About Us',
  description: 'FFP about us page',
};

const Page = () => {
  return <AboutUsPage />;
};

export default Page;