import { STORAGE_KEY, UserData, USER_TYPE } from '@ffp-web/app/index.types';

export const setStorage = (key: STORAGE_KEY, value: object) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getStorage = (key: STORAGE_KEY) => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    return JSON.parse(data ?? 'null');
  }

  return null;
};

export const removeStorage = (key: STORAGE_KEY) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const hasAccess = (user: USER_TYPE): boolean => {
  if (typeof window !== 'undefined') {
    const userData = getStorage(STORAGE_KEY.USER) as UserData;

    return user === userData?.type;
  }

  return false;
};

export const getToken = (): string | undefined => {
  if (typeof window !== 'undefined') {
    const userData = getStorage(STORAGE_KEY.USER) as UserData;

    return userData?.token;
  }
};