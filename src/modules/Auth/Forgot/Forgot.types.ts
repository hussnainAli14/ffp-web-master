import { UseFormReturn } from 'react-hook-form';

import { Setter } from '@ffp-web/app/index.types';

export type ForgotForm = {
  email: string,
  isSent: boolean,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseForgot extends UseFormReturn<ForgotForm, any, undefined> {
  onSubmit: (data: ForgotForm) => void,
  isLoading: boolean,
  setIsLoading: Setter<boolean>,
  isUser?: boolean,
}