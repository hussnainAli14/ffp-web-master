'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';

import { SeparatorLine } from '@ffp-web/components';
import { avatar } from '@public/images';

import { Props } from './AccountMenu.types';
import useAccountMenu from './useAccountMenu';

const AccountMenu = (props: Props) => {
  const { onClick } = props;
  const {
    userData,
    isUser,
    handleLogout,
  } = useAccountMenu();

  return (
    <div
      className='w-full md:w-auto bg-primary-white text-primary-black text-nowrap drop-shadow'
    >
      {isUser ? (
        <div className='w-full md:w-auto min-w-96 py-1'>
          <div className='w-full py-3 px-4 flex gap-4 items-center'>
            <Image src={userData?.profilePicture || avatar} height={40} width={40} alt='FFP Logo' priority />
            <div className='text-ellipsis text-base font-semibold overflow-hidden'>
              {userData?.fullName}
            </div>
          </div>
          <SeparatorLine horizontal />
          <Link
            href='/user/detail?menu=3'
            onClick={onClick}
            className='w-full py-3 px-4 text-base font-medium flex gap-8 justify-between items-center hover:bg-gray-100'
          >
            <div>My Profile</div>
            <div><FaArrowRight /></div>
          </Link>
          <Link
            href='/user/detail?menu=1'
            onClick={onClick}
            className='w-full py-3 px-4 text-base font-medium flex gap-8 justify-between items-center hover:bg-gray-100'
          >
            <div>Must Do</div>
            <div><FaArrowRight /></div>
          </Link>
          <Link
            href='/user/detail?menu=2'
            onClick={onClick}
            className='w-full py-3 px-4 text-base font-medium flex gap-8 justify-between items-center hover:bg-gray-100'
          >
            <div>My Reviews</div>
            <div><FaArrowRight size={16} /></div>
          </Link>
          <Link
            href='/user/detail?menu=4'
            onClick={onClick}
            className='w-full py-3 px-4 text-base font-medium flex gap-8 justify-between items-center hover:bg-gray-100'
          >
            <div>Password</div>
            <div><FaArrowRight size={16} /></div>
          </Link>
          <button
            onClick={handleLogout}
            className='w-full py-3 px-4 text-base font-medium flex gap-8 justify-between items-center hover:bg-gray-100'
          >
            <div>Logout</div>
            <div><FaArrowRight /></div>
          </button>
        </div>
      ) : (
        <div className='w-full md:w-auto min-w-96 py-1'>
          <Link
            href='/user/login'
            onClick={onClick}
            className='w-full py-3 px-4 text-base font-medium flex gap-8 justify-between items-center hover:bg-gray-100'
          >
            <div>Login as User</div>
            <div><FaArrowRight /></div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;