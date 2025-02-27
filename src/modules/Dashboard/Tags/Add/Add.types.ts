import { UseFormReturn } from 'react-hook-form';

import { Setter } from '@ffp-web/app/index.types';

export type TagForm = {
  id?: string,
  name: string,
  description?: string,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseAdd extends UseFormReturn<TagForm, any, undefined> {
  onSubmit: (data: TagForm) => void,
  isLoadingSubmit: boolean,
  setIsLoadingSubmit: Setter<boolean>,
}