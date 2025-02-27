'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getStorage, removeStorage } from '@ffp-web/utils/storage.utils';

import { STORAGE_KEY, USER_TYPE } from '../index.types';

import { access } from './access';
import { UseLayouts } from './Layouts.types';

const useLayouts = (): UseLayouts => {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAuth = [
    '/dashboard/login',
    '/dashboard/forgot',
    '/dashboard/password',
    '/user/login',
    '/user/forgot',
    '/user/password',
    '/user/register',
    '/user/verify',
  ].includes(pathname ?? '');
  const userData = getStorage(STORAGE_KEY.USER);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
  const [userType, setUserType] = useState<USER_TYPE>();
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  const handleLogout = () => {
    removeStorage(STORAGE_KEY.USER);
    router.push('/dashboard/login');
  };

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    setUserType(userData?.type);
  }, [userData?.type]);

  useEffect(() => {
    const userData = getStorage(STORAGE_KEY.USER);
    const type = userData?.type as string;
    if (type) {
      const canAccess = access[type].some(item => pathname.startsWith(item));
      setHasAccess(canAccess);
    }
  }, [pathname]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return {
    pathname,
    isDashboard,
    isAuth,
    isCollapsed,
    setIsCollapsed,
    openSubMenus,
    setOpenSubMenus,
    handleLogout,
    toggleSubMenu,
    userType,
    hasAccess,
  };
};

export default useLayouts;