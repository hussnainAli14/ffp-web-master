import { UseFormReturn } from 'react-hook-form';
import { SingleValue } from 'react-select';

import { PlaceCountryProps, PlaceRegionProps, SelectOption, Setter } from '@ffp-web/app/index.types';

export type CityForm = {
  region: SingleValue<SelectOption> | '',
  country: SingleValue<SelectOption> | '',
  cityId?: number,
  cityName: string,
  image: string[],
  isShowOnHome: boolean,
};

export type LoadingStates = {
  submit: boolean,
  region: boolean,
  country: boolean,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseAdd extends UseFormReturn<CityForm, any, undefined> {
  onSubmit: (data: CityForm) => void,
  loading: LoadingStates,
  setLoading: Setter<LoadingStates>,
  listRegion: PlaceRegionProps[],
  setListRegion: Setter<PlaceRegionProps[]>,
  listCountry: PlaceCountryProps[],
  setListCountry: Setter<PlaceCountryProps[]>,
}