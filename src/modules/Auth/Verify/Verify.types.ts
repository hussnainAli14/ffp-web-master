import { Setter } from '@ffp-web/app/index.types';

export type UseVerify = {
  isVerified: boolean,
  setIsVerified: Setter<boolean>,
  isLoading: boolean,
  setIsLoading: Setter<boolean>,
};