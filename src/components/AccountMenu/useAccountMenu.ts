'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { STORAGE_KEY, USER_TYPE, UserData } from '@ffp-web/app/index.types';
import { getStorage, removeStorage } from '@ffp-web/utils/storage.utils';

import { UseAccountMenu } from './AccountMenu.types';

const useAccountMenu = (): UseAccountMenu => {
  const router = useRouter();

  const [isUser, setIsUser] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLogout = () => {
    removeStorage(STORAGE_KEY.USER);
    setUserData(null);
    router.push('/user/login');
  };

  useEffect(() => {
    const user = getStorage(STORAGE_KEY.USER) as (UserData | null);
    setUserData(user);
    setIsUser(user?.type === USER_TYPE.USER);
  }, []);

  return {
    userData,
    isUser,
    handleLogout,
  };
};

export default useAccountMenu;