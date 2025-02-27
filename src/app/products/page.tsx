import { Metadata } from 'next/types';

import { ProductsSearchPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Listings',
  description: 'FFP product search',
};

const Page = () => {
  return <ProductsSearchPage />;
};

export default Page;