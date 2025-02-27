import { Metadata } from 'next/types';

import { AddTagPage } from '@ffp-web/modules/Dashboard/Tags';

export const metadata: Metadata = {
  title: 'CMS - New Tag',
  description: 'FFP CMS new tag',
};

const Page = () => {
  return <AddTagPage/>;
};

export default Page;