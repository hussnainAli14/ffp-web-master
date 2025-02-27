import { Metadata } from 'next/types';

import { EmptyPage } from '@ffp-web/modules/Website';

export const metadata: Metadata = {
  title: 'FFP Travels - Blocked',
  description: 'FFP user blocked',
};

const Page = () => {
  return (
    <div className='my-10 mx-auto max-w-[80%]'>
      <EmptyPage
        type='warning'
        withContactUs
        title='Account Blocked'
        caption='Your account has been temporarily blocked. To resolve this issue and regain access, please contact our support team for clarification and assistance.'
      />
    </div>
  );
};

export default Page;