import { Metadata } from 'next/types';

import { EditTagPage } from '@ffp-web/modules/Dashboard/Tags';

export const metadata: Metadata = {
  title: 'CMS - Edit Tag',
  description: 'FFP CMS edit tag',
};

const Page = () => {
  return <EditTagPage/>;
};

export default Page;