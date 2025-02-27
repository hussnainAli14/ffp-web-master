import { UseFormReturn } from 'react-hook-form';

import { Setter } from '@ffp-web/app/index.types';

export type TogglePassword = {
  password: boolean,
  newPassword: boolean,
  confirmPassword: boolean,
};

export type PasswordForm = {
  password: string,
  newPassword: string,
  confirmPassword: string,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UsePassword extends UseFormReturn<PasswordForm, any, undefined> {
  onSubmit: (data: PasswordForm) => void,
  isLoading: boolean,
  setIsLoading: Setter<boolean>,
  togglePassword: TogglePassword,
  setTogglePassword: Setter<TogglePassword>,
}