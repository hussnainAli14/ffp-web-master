'use client';

import { Tab } from '@ffp-web/components';

import UserBookmarkPage from './Bokmark/UserBookmark.component';
import PasswordPage from './Password/Password.component';
import ProfilePage from './Profile/Profile.component';
import UserReviewPage from './Review/UserReview.component';
import { Props } from './User.types';

const UserWebPage = (props: Props) => {
  const {
    selectedMenu,
    handleSelectMenu,
    userData,
  } = props;

  return (
    <div className='mb-8 md:mb-16'>
      <div className='px-4 md:px-20 xl:px-28 py-6 md:py-12 flex flex-col gap-8'>
        <div className='text-3xl font-semibold'>{userData?.fullName}</div>

        <Tab
          tabs={[
            {
              key: '1',
              label: 'Must Do',
              component: <UserBookmarkPage {...props} />,
            },
            {
              key: '2',
              label: 'My Reviews',
              component: <UserReviewPage {...props} />,
            },
            {
              key: '3',
              label: 'Profile',
              component: <ProfilePage {...props} />,
            },
            {
              key: '4',
              label: 'Password',
              component: <PasswordPage {...props} />,
            },
          ]}
          selectedTab={selectedMenu}
          onSelectTab={handleSelectMenu}
        />
      </div>
    </div>
  );
};

export default UserWebPage;