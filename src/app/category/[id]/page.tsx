import { Metadata } from 'next/types';

import { CategoryPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Category',
  description: 'FFP category',
};

const Page = () => {
  return <CategoryPage />;
};

export default Page;