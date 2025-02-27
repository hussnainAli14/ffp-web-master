import { UseFormReturn } from 'react-hook-form';
import { SingleValue } from 'react-select';

import { Country, PlaceCountryProps, SelectOption, Setter } from '@ffp-web/app/index.types';

export type RegisterForm = {
  fullName: string,
  email: string,
  phoneCountry: string,
  phoneNumber: string,
  country: SingleValue<SelectOption> | '',
  password: string,
};

export type TogglePassword = {
  password: boolean,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseRegister extends UseFormReturn<RegisterForm, any, undefined> {
  onSubmit: (data: RegisterForm) => void,
  isLoading: boolean,
  setIsLoading: Setter<boolean>,
  togglePassword: TogglePassword,
  setTogglePassword: Setter<TogglePassword>,
  countries: PlaceCountryProps[],
  setCountries: Setter<PlaceCountryProps[]>,
  globalCountries: Country[],
  setGlobalCountries: Setter<Country[]>,
  isRegistered: boolean,
  setIsRegistered: Setter<boolean>,
}