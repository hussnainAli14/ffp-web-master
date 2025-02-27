import { Metadata } from 'next/types';

import { EmptyPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'CMS - Listings',
  description: 'FFP CMS listings',
};

const Page = () => {
  return <EmptyPage caption='' />;
};

export default Page;