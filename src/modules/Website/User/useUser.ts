import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { STORAGE_KEY, USER_GENDER, UserData } from '@ffp-web/app/index.types';
import { getCategories, getSubCategories } from '@ffp-web/lib/category/data';
import { getCountries as getGlobalCountries } from '@ffp-web/lib/geoApi/data';
import { getCities, getCountries } from '@ffp-web/lib/place/data';
import { unpackError } from '@ffp-web/utils/error.utils';
import { getStorage, removeStorage } from '@ffp-web/utils/storage.utils';

import useBookmark from './Bokmark/useBookmark';
import usePassword from './Password/usePassword';
import useProfile from './Profile/useProfile';
import useReview from './Review/useReview';
import { FilterData, LoadingState, ModalState, Props } from './User.types';

const defaultLoading: LoadingState = {
  bookmark: true,
  removeBookmark: false,
  review: true,
  getProfile: true,
  updateProfile: false,
  updatePassword: false,
};

const defaultModal: ModalState = {
  removeBookmark: false,
  filterCountry: false,
  filterCity: false,
  filterCategory: false,
  filterSubCategory: false,
  deleteReview: false,
  editReview: false,
  dropdownMenu: false,
};

const defaultFilterData: FilterData = {
  countries: [],
  cities: [],
  categories: [],
  subCategories: [],
  globalCountries: [],
  genders: [
    { value: USER_GENDER.MALE, label: 'Male' },
    { value: USER_GENDER.FEMALE, label: 'Female' },
  ],
};

const useUser = (): Props => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultMenu = searchParams?.get('menu') ?? '';

  const [selectedMenu, setSelectedMenu] = useState<string>(defaultMenu || '1');
  const [isLoading, setIsLoading] = useState<LoadingState>(defaultLoading);
  const [openModal, setOpenModal] = useState<ModalState>(defaultModal);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [filterData, setFilterData] = useState<FilterData>(defaultFilterData);
  const [isDekstop, setIsDekstop] = useState<boolean>(true);

  const states = {
    selectedMenu,
    setSelectedMenu,
    isLoading,
    setIsLoading,
    openModal,
    setOpenModal,
    userData,
    setUserData,
    filterData,
    setFilterData,
    isDekstop,
    setIsDekstop,
  };

  const handleSelectMenu = (key: string) => {
    setSelectedMenu(key);
    const params = new URLSearchParams(searchParams ?? '');
    params.set('menu', key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleLogout = () => {
    removeStorage(STORAGE_KEY.USER);
    router?.push('/user/login');
  };

  const _getCountries = async () => {
    try {
      const { data, message } = await getCountries();
      if (data) {
        return data;
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getCities = async () => {
    try {
      const { data, message } = await getCities();
      if (data) {
        return data;
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getCategories = async () => {
    try {
      const { data, message } = await getCategories();
      if (data) {
        return data;
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getSubcategories = async () => {
    try {
      const { data, message } = await getSubCategories({});
      if (data) {
        return data.sort((a, b) => a.subCategoryName.localeCompare(b.subCategoryName));
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const _getGlobalCountries = async () => {
    try {
      const { data, message } = await getGlobalCountries();
      if (data) {
        return data;
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      const [countries, cities, categories, subCategories, globalCountries] = await Promise.all([
        _getCountries(),
        _getCities(),
        _getCategories(),
        _getSubcategories(),
        _getGlobalCountries(),
      ]);

      setFilterData(prev => ({
        ...prev,
        countries: countries ?? [],
        cities: cities ?? [],
        categories: categories ?? [],
        subCategories: subCategories ?? [],
        globalCountries: globalCountries ?? [],
      }));
    } catch (err) {
      toast.error(unpackError(err));
    }
  }, []);

  useEffect(() => {
    if (defaultMenu) setSelectedMenu(defaultMenu);
  }, [defaultMenu]);

  useEffect(() => {
    const user = getStorage(STORAGE_KEY.USER) as (UserData | null);
    setUserData(user);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    setIsDekstop(window.matchMedia('(min-width: 768px)').matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsDekstop(e.matches);
    };

    const mediaQuery = window.matchMedia('(min-width: 768px)');

    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  const bookmakHooks = useBookmark({
    setIsLoading, setOpenModal, userData,
  });
  const reviewHooks = useReview({
    setIsLoading, setOpenModal,
  });
  const profileHooks = useProfile({
    filterData, setIsLoading, userData, router, setUserData,
  });
  const passwordHooks = usePassword({
    setIsLoading, router,
  });

  return {
    ...states,
    ...bookmakHooks,
    ...reviewHooks,
    ...profileHooks,
    ...passwordHooks,
    router,
    handleSelectMenu,
    handleLogout,
  };
};

export default useUser;