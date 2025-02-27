import { UseFormReturn } from 'react-hook-form';
import { SingleValue } from 'react-select';

import { PlaceRegionProps, SelectOption, Setter } from '@ffp-web/app/index.types';

export type CountryForm = {
  region: SingleValue<SelectOption> | '',
  countryId?: number,
  countryName: string,
};

export type LoadingStates = {
  submit: boolean,
  region: boolean,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseAdd extends UseFormReturn<CountryForm, any, undefined> {
  onSubmit: (data: CountryForm) => void,
  loading: LoadingStates,
  setLoading: Setter<LoadingStates>,
  listRegion: PlaceRegionProps[],
  setListRegion: Setter<PlaceRegionProps[]>,
}