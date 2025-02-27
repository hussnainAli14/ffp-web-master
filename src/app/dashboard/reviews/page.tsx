import { Metadata } from 'next/types';

import { ListReviewsPage } from '@ffp-web/modules/Dashboard/Reviews';

export const metadata: Metadata = {
  title: 'CMS - Reviews',
  description: 'FFP CMS reviews',
};

const Page = () => {
  return <ListReviewsPage />;
};

export default Page;