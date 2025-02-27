import { UseFormReturn } from 'react-hook-form';
import { MultiValue, SingleValue } from 'react-select';

import { CategoryRes, Country, ListUserProps, PlaceCityProps, PlaceCountryProps, PlaceRegionProps, SelectOption, Setter, SubCategoryRes, TagProps, UserData } from '@ffp-web/app/index.types';

export type AddForm = {
  productId?: string,
  parentProductId?: string,
  provider: SingleValue<SelectOption> | '',
  category: SingleValue<SelectOption> | '',
  subCategory: SingleValue<SelectOption> | '',
  name: string,
  images: string[],
  summary: string,
  region: SingleValue<SelectOption> | '',
  country: SingleValue<SelectOption> | '',
  city: SingleValue<SelectOption> | '',
  tags: MultiValue<SelectOption> | [],
  video: string,
  hasPrice: boolean,
  price: string,
  currency: string,
  hasOperationalHours: boolean,
  operationalHours: OperationalHours[],
  quickDetails: QuickDetailForm[],
  contents: ContentForm[],
  ctaText: SingleValue<SelectOption> | '',
  ctaLink: string,
};

export type OperationalHours = {
  day: number,
  isOpen: boolean,
  startHour: string,
  endHour: string,
};

export type QuickDetailForm = {
  detailType: SingleValue<SelectOption> | '',
  value: string,
};

export type ContentForm = {
  title: string,
  contentType: SingleValue<SelectOption> | '',
  text: string,
  list: string[],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseAdd extends UseFormReturn<AddForm, any, undefined> {
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
  globalCountries: Country[],
  setGlobalCountries: Setter<Country[]>,
}