import { Metadata } from 'next/types';

import { ContactUsPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Contact Us',
  description: 'FFP customer support',
};

const Page = () => {
  return <ContactUsPage />;
};

export default Page;