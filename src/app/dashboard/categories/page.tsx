import { Metadata } from 'next/types';

import { ListCategoryPage } from '@ffp-web/modules/Dashboard/Categories';

export const metadata: Metadata = {
  title: 'CMS - Categories',
  description: 'FFP CMS categories',
};

const Page = () => {
  return <ListCategoryPage/>;
};

export default Page;