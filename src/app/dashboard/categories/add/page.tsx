import { Metadata } from 'next/types';

import { AddCategoryPage } from '@ffp-web/modules/Dashboard/Categories';

export const metadata: Metadata = {
  title: 'CMS - New Category',
  description: 'FFP CMS new category',
};

const Page = () => {
  return <AddCategoryPage/>;
};

export default Page;