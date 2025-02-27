'use client';

import { FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa6';

import UserBookmarkPage from './Bokmark/UserBookmark.component';
import PasswordPage from './Password/Password.component';
import ProfilePage from './Profile/Profile.component';
import UserReviewPage from './Review/UserReview.component';
import { Props } from './User.types';

const UserMobilePage = (props: Props) => {
  const {
    selectedMenu,
    handleSelectMenu,
    userData,
    openModal,
    setOpenModal,
    handleLogout,
  } = props;

  const menu = [
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
  ];

  return (
    <div className='bg-primary-white'>
      <div className='pt-6 flex flex-col gap-8'>
        <div className='px-4 text-wrap text-3xl font-semibold'>{userData?.fullName}</div>

        <div className='hidden relative'>
          <button
            onClick={() => setOpenModal(prev => ({ ...prev, dropdownMenu: !prev.dropdownMenu }))}
            className='px-4 text-base font-semibold text-primary-btn flex items-center gap-4'
          >
            <div>{'Menu'}</div>
            {openModal.dropdownMenu ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          <div className={`${openModal.dropdownMenu ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}
            absolute origin-top z-20 py-4 w-full bg-primary-white transition-all duration-1000 ease-in-out`}
          >
            {menu.map(item => (
              <button
                key={item.key}
                onClick={() => {
                  handleSelectMenu(item.key);
                  setOpenModal(prev => ({ ...prev, dropdownMenu: !prev.dropdownMenu }));
                }}
                className='w-full px-4 py-2 flex justify-between gap-2 text-sm font-medium'
              >
                <div>{item.label}</div>
                <FaArrowRight />
              </button>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setOpenModal(prev => ({ ...prev, dropdownMenu: !prev.dropdownMenu }));
              }}
              className='w-full px-4 py-2 flex justify-between gap-2 text-sm font-medium'
            >
              <div>Logout</div>
              <FaArrowRight />
            </button>
          </div>
        </div>

      </div>

      <div className='py-8 relative'>
        <div className={`${openModal.dropdownMenu ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}
            absolute origin-top inset-0 z-10 bg-black bg-opacity-30 transition-all duration-1000 ease-in-out`} />
        <div className='px-4'>
          {menu.find(e => e.key === selectedMenu)?.component}
        </div>
      </div>
    </div>
  );
};

export default UserMobilePage;