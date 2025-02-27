import { UseFormReturn } from 'react-hook-form';

import { Country, Setter } from '@ffp-web/app/index.types';

export type ContactUsForm = {
  name: string,
  email: string,
  phone: string,
  phoneCountry: string,
  message: string,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseContactUs extends UseFormReturn<ContactUsForm, any, undefined> {
  onSubmit: (data: ContactUsForm) => void,
  countries: Country[],
  setCountries: Setter<Country[]>,
  loading: boolean,
  setLoading: Setter<boolean>,
}