'use client';

import { Tab } from '@ffp-web/components';

import { PasswordTab } from './Password';
import usePassword from './Password/usePassword';
import { ProfileTab } from './Profile';
import useProfile from './Profile/useProfile';
import useAccount from './useAccount';

const AccountPage = () => {
  const profileProps = useProfile();
  const passwordProps = usePassword();
  const {
    selectedTab,
    setSelectedTab,
  } = useAccount();

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-wrap justify-between gap-4'>
        <div className='text-3xl font-semibold'>
          Account
        </div>
      </div>

      <Tab
        tabs={[
          {
            key: '1',
            label: 'Profile',
            component: <ProfileTab {...profileProps} />,
          },
          {
            key: '2',
            label: 'Password',
            component: <PasswordTab {...passwordProps} />,
          },
        ]}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
    </div>
  );
};

export default AccountPage;