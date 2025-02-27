import { UseFormReturn } from 'react-hook-form';

import { Setter } from '@ffp-web/app/index.types';

export type PasswordForm = {
  password: string,
  confirmPassword: string,
  isSent: boolean,
};

export type TogglePassword = {
  password: boolean,
  confirmPassword: boolean,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UsePassword extends UseFormReturn<PasswordForm, any, undefined> {
  onSubmit: (data: PasswordForm) => void,
  getTitle: () => string;
  getSubtitle: () => string;
  getButtonText: () => string;
  isNew: boolean,
  isLoading: boolean,
  setIsLoading: Setter<boolean>,
  togglePassword: TogglePassword,
  setTogglePassword: Setter<TogglePassword>,
  isUser?: boolean,
}