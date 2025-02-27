import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { RefObject } from 'react';

import { CategoryWithSubcategoryRes, PlaceRegionsAndCitiesProps, Setter, VoidFunction } from '@ffp-web/app/index.types';

export type OpenMenu = {
  category: boolean,
  places: boolean,
  account: boolean,
};

export type LoadingStates = {
  category: boolean,
  places: boolean,
};

export type UseHeader = {
  isHome: boolean,
  isProductDetail: boolean,
  isUserDetail: boolean,
  menuRef: {
    category: RefObject<HTMLDivElement>,
    places: RefObject<HTMLDivElement>,
    account: RefObject<HTMLDivElement>,
  },
  buttonRef: {
    category: RefObject<HTMLButtonElement>,
    places: RefObject<HTMLButtonElement>,
    account: RefObject<HTMLButtonElement>,
  },
  isScrollTop: boolean,
  setIsScrollTop: Setter<boolean>,
  isOpenMenu: OpenMenu,
  setIsOpenMenu: Setter<OpenMenu>,
  categories: CategoryWithSubcategoryRes[],
  setCategories: Setter<CategoryWithSubcategoryRes[]>,
  selectedCategory?: CategoryWithSubcategoryRes,
  setSelectedCategory: Setter<CategoryWithSubcategoryRes | undefined>,
  places: PlaceRegionsAndCitiesProps[],
  setPlaces: Setter<PlaceRegionsAndCitiesProps[]>,
  selectedPlace?: PlaceRegionsAndCitiesProps,
  setSelectedPlace: Setter<PlaceRegionsAndCitiesProps | undefined>,
  handleClickMenuCategory: VoidFunction,
  handleClickMenuPlaces: VoidFunction,
  handleClickMenuAccount: VoidFunction,
  handleSelectCategory: (category: CategoryWithSubcategoryRes) => void,
  handleSelectPlaces: (place: PlaceRegionsAndCitiesProps) => void,
  loading: LoadingStates,
  setLoading: Setter<LoadingStates>,
  router: AppRouterInstance,
  isDekstop: boolean,
  setIsDekstop: Setter<boolean>,
};