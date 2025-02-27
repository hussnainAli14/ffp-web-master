import { UseFormReturn } from 'react-hook-form';

import { CategoryRes, Country, ListUserProps, PlaceCityProps, PlaceCountryProps, PlaceRegionProps, Setter, SubCategoryRes, TagProps, UserData } from '@ffp-web/app/index.types';

import { AddForm } from '../Add/add.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseEdit extends UseFormReturn<AddForm, any, undefined> {
  onSubmit: (data: AddForm) => void,
  user?: UserData,
  setUser: Setter<UserData | undefined>,
  listProvider: ListUserProps[],
  setListProvider: Setter<ListUserProps[]>,
  listCategory: CategoryRes[],
  setListCategory: Setter<CategoryRes[]>,
  listSubCategory: SubCategoryRes[],
  setListSubCategory: Setter<SubCategoryRes[]>,
  regions: PlaceRegionProps[],
  setRegions: Setter<PlaceRegionProps[]>,
  countries: PlaceCountryProps[],
  setCountries: Setter<PlaceCountryProps[]>,
  cities: PlaceCityProps[],
  setCities: Setter<PlaceCityProps[]>,
  listTag: TagProps[],
  setListTag: Setter<TagProps[]>,
  isLoadingSubmit: boolean,
  setIsLoadingSubmit: Setter<boolean>,
  openModalDelete: boolean,
  setOpenModalDelete: Setter<boolean>,
  isLoadingDelete: boolean,
  setIsLoadingDelete: Setter<boolean>,
  onDelete: VoidFunction,
  onSavaPending: VoidFunction,
  globalCountries: Country[],
  setGlobalCountries: Setter<Country[]>,
}