'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { getStorage, removeStorage } from '@ffp-web/utils/storage.utils';

import { STORAGE_KEY, USER_TYPE, UserData } from '../index.types';

const useAuthRedirect = () => {
  const pathname = usePathname();
  const router = useRouter();
  const userData = getStorage(STORAGE_KEY.USER) as UserData | null;
  const token = userData?.token;
  const isExpired = new Date().getTime() > (userData?.loginExpires ?? 0);
  const isProvider = userData?.type === USER_TYPE.PROVIDER;
  const isUser = userData?.type === USER_TYPE.USER;

  const _removeStorageUser = useCallback(() => {
    removeStorage(STORAGE_KEY.USER);
    router.refresh();
  }, [router]);

  const _handleRouteDashboard = useCallback(() => {
    if (pathname?.startsWith('/dashboard')) {
      if (!token || isExpired) {
        if (
          pathname.startsWith('/dashboard/login') ||
          pathname.startsWith('/dashboard/forgot') ||
          pathname.startsWith('/dashboard/password')
        ) {
          return;
        } else {
          router.push('/dashboard/login');
        }
      } else if (
        token && !isExpired &&
        (pathname.startsWith('/dashboard/login') ||
          pathname.startsWith('/dashboard/forgot'))
      ) {
        if (isUser) {
          return;
        } else if (isProvider) {
          router.push('/dashboard/listings/pending');
        } else {
          router.push('/dashboard/home');
        }
      }
    }
  }, [isExpired, isProvider, isUser, pathname, router, token]);

  const _handleRouteUser = useCallback(() => {
    if (pathname?.startsWith('/user')) {
      if (!token || isExpired) {
        if (
          pathname.startsWith('/user/detail')
        ) {
          router.push('/user/login');
        } else {
          return;
        }
      } else if (
        token && !isExpired &&
        (pathname.startsWith('/user/login') ||
          pathname.startsWith('/user/forgot'))
      ) {
        if (isUser) {
          router.push('/user/detail');
        } else {
          return;
        }
      }
    }
  }, [isExpired, isUser, pathname, router, token]);

  useEffect(() => {
    if (!pathname) return;

    if (isExpired) _removeStorageUser();

    _handleRouteDashboard();
    _handleRouteUser();
  }, [_handleRouteDashboard, _handleRouteUser, _removeStorageUser, isExpired, pathname]);
};

export default useAuthRedirect;