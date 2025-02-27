import { UseFormReturn } from 'react-hook-form';
import { SingleValue } from 'react-select';

import { Country, PlaceCityProps, PlaceCountryProps, SelectOption, Setter } from '@ffp-web/app/index.types';

export type AffiliateForm = {
  fullName: string,
  email: string,
  phoneCountry: string,
  phoneNumber: string,
  country: SingleValue<SelectOption> | '',
  city: SingleValue<SelectOption> | '',
  businessName: string,
  website: string,
  instagram: string,
  facebook: string,
  tiktok: string,
  youtube: string,
  snapchat: string,
  niche: string,
  type: SingleValue<SelectOption> | '',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseAffiliate extends UseFormReturn<AffiliateForm, any, undefined> {
  countries: PlaceCountryProps[],
  setCountries: Setter<PlaceCountryProps[]>,
  cities: PlaceCityProps[],
  setCities: Setter<PlaceCityProps[]>,
  isLoadingSubmit: boolean,
  setIsLoadingSubmit: Setter<boolean>,
  onSubmit: (data: AffiliateForm) => void,
  globalCountries: Country[],
  setGlobalCountries: Setter<Country[]>,
}
