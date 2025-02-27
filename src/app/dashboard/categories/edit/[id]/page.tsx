import { Metadata } from 'next/types';

import { EditCategoryPage } from '@ffp-web/modules/Dashboard/Categories';

export const metadata: Metadata = {
  title: 'CMS - Edit Category',
  description: 'FFP CMS edit category',
};

const Page = () => {
  return <EditCategoryPage/>;
};

export default Page;