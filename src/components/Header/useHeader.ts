'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { CategoryWithSubcategoryRes, PlaceRegionsAndCitiesProps } from '@ffp-web/app/index.types';
import { getCategoriesWithSubcategories } from '@ffp-web/lib/category/data';
import { getPlacesAndCities } from '@ffp-web/lib/place/data';
import { unpackError } from '@ffp-web/utils/error.utils';

import { LoadingStates, OpenMenu, UseHeader } from './Header.types';

const useHeader = (): UseHeader => {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const isHome = pathname === '/home';
  const isProductDetail = pathname?.includes('/detail/');
  const isUserDetail = pathname?.includes('/user/detail');
  const menuRef = {
    category: useRef<HTMLDivElement>(null),
    places: useRef<HTMLDivElement>(null),
    account: useRef<HTMLDivElement>(null),
  };
  const buttonRef = {
    category: useRef<HTMLButtonElement>(null),
    places: useRef<HTMLButtonElement>(null),
    account: useRef<HTMLButtonElement>(null),
  };
  const [isScrollTop, setIsScrollTop] = useState<boolean>(true);
  const [isOpenMenu, setIsOpenMenu] = useState<OpenMenu>({ category: false, places: false, account: false });
  const [categories, setCategories] = useState<CategoryWithSubcategoryRes[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithSubcategoryRes>();
  const [places, setPlaces] = useState<PlaceRegionsAndCitiesProps[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceRegionsAndCitiesProps>();
  const [loading, setLoading] = useState<LoadingStates>({ category: true, places: true });
  const [isDekstop, setIsDekstop] = useState<boolean>(true);

  const states = {
    isHome,
    isProductDetail,
    isUserDetail,
    menuRef,
    buttonRef,
    isScrollTop,
    setIsScrollTop,
    isOpenMenu,
    setIsOpenMenu,
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    places,
    setPlaces,
    selectedPlace,
    setSelectedPlace,
    loading,
    setLoading,
    isDekstop,
    setIsDekstop,
  };

  // check scroll threshold
  const _handleScroll = useCallback(() => {
    if (window.scrollY < 200) {
      setIsScrollTop(true);
    } else {
      setIsScrollTop(false);
    }
  }, []);

  // handle on click menu
  const handleClickMenuCategory = () => {
    setIsOpenMenu(prev => ({ ...prev, category: !prev.category, places: false, account: false }));
  };

  const handleClickMenuPlaces = () => {
    setIsOpenMenu(prev => ({ ...prev, category: false, places: !prev.places, account: false }));
  };

  const handleClickMenuAccount = () => {
    setIsOpenMenu(prev => ({ ...prev, category: false, places: false, account: !prev.account }));
  };

  // handle close menu when user click outside menu
  const _handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      menuRef.category.current && !menuRef.category.current.contains(event.target as Node) &&
      buttonRef.category.current && !buttonRef.category.current.contains(event.target as Node) &&
      menuRef.places.current && !menuRef.places.current.contains(event.target as Node) &&
      buttonRef.places.current && !buttonRef.places.current.contains(event.target as Node) &&
      menuRef.account.current && !menuRef.account.current.contains(event.target as Node) &&
      buttonRef.account.current && !buttonRef.account.current.contains(event.target as Node)
    ) {
      setIsOpenMenu(prev => ({ ...prev, category: false, places: false, account: false }));
    }

  }, [buttonRef.account, buttonRef.category, buttonRef.places, menuRef.account, menuRef.category, menuRef.places]);

  // fetch completed category
  const _fetchCompletedCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, category: true }));
      const { data, message } = await getCategoriesWithSubcategories();
      if (data) {
        setCategories(data);
        setSelectedCategory(data[0]);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, category: false }));
    }
  };

  const _fetchRegionsAndCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, places: true }));
      const { data, message } = await getPlacesAndCities();
      if (data) {
        setPlaces(data);
        setSelectedPlace(data[0]);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(unpackError(err));
    } finally {
      setLoading(prev => ({ ...prev, places: false }));
    }
  };

  const handleSelectCategory = (category: CategoryWithSubcategoryRes) => {
    setSelectedCategory(category);
  };

  const handleSelectPlaces = (place: PlaceRegionsAndCitiesProps) => {
    setSelectedPlace(place);
  };

  // listener on scroll event
  useEffect(() => {
    window.addEventListener('scroll', _handleScroll);

    return () => {
      window.removeEventListener('scroll', _handleScroll);
    };
  }, [_handleScroll]);

  useEffect(() => {
    document.addEventListener('mousedown', _handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', _handleClickOutside);
    };
  }, [_handleClickOutside]);

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

  useEffect(() => {
    _fetchCompletedCategories();
    _fetchRegionsAndCategories();
  }, []);

  return {
    ...states,
    handleClickMenuCategory,
    handleClickMenuPlaces,
    handleClickMenuAccount,
    handleSelectCategory,
    handleSelectPlaces,
    router,
  };
};

export default useHeader;