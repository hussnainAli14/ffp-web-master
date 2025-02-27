import { Metadata } from 'next/types';

import { ListTagPage } from '@ffp-web/modules/Dashboard/Tags';

export const metadata: Metadata = {
  title: 'CMS - Tags',
  description: 'FFP CMS tags',
};

const Page = () => {
  return <ListTagPage />;
};

export default Page;