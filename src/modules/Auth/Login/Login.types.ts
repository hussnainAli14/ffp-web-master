import { UseFormReturn } from 'react-hook-form';

import { Setter } from '@ffp-web/app/index.types';

export type LoginForm = {
  email: string,
  password: string,
};

export type TogglePassword = {
  password: boolean,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseLogin extends UseFormReturn<LoginForm, any, undefined> {
  onSubmit: (data: LoginForm) => void,
  isLoading: boolean,
  setIsLoading: Setter<boolean>,
  togglePassword: TogglePassword,
  setTogglePassword: Setter<TogglePassword>,
  isUser?: boolean,
}