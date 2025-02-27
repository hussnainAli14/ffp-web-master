import { Metadata } from 'next/types';

import { PrivacyPolicyPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Privacy Policy',
  description: 'FFP privacy policy page',
};

const Page = () => {
  return <PrivacyPolicyPage />;
};

export default Page;