import { Metadata } from 'next/types';

import { EmptyPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'CMS - Dashboard',
  description: 'FFP CMS dashboard',
};

const Page = () => {
  return <EmptyPage caption='' />;
};

export default Page;