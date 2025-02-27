import { UseFormReturn } from 'react-hook-form';
import { MultiValue, SingleValue } from 'react-select';

import { CategoryRes, Country, PlaceCityProps, PlaceCountryProps, SelectOption, Setter } from '@ffp-web/app/index.types';

export type ProfileForm = {
  userId: string,
  fullName: string,
  businessName: string,
  email: string,
  phoneCountry: string,
  phoneNumber: string,
  country: SingleValue<SelectOption> | '',
  city: SingleValue<SelectOption> | '',
  category: MultiValue<SelectOption> | [],
  description: string,
  targetAudience: string,
  location: string
  yearInOperation: string,
  website: string,
  instagram: string,
  facebook: string,
  tiktok: string,
  youtube: string,
  snapchat: string,
  certification: string[],
  businessRegNumber: string,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseProfile extends UseFormReturn<ProfileForm, any, undefined> {
  countries: PlaceCountryProps[],
  setCountries: Setter<PlaceCountryProps[]>,
  cities: PlaceCityProps[],
  setCities: Setter<PlaceCityProps[]>,
  categories: CategoryRes[],
  setCategories: Setter<CategoryRes[]>,
  isLoadingSubmit: boolean,
  setIsLoadingSubmit: Setter<boolean>,
  onSubmit: (data: ProfileForm) => void,
  globalCountries: Country[],
  setGlobalCountries: Setter<Country[]>,
}