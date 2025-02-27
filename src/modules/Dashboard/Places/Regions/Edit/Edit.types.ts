import { UseFormReturn } from 'react-hook-form';

import { Setter } from '@ffp-web/app/index.types';

export type RegionForm = {
  regionId: number,
  regionName: string,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseEdit extends UseFormReturn<RegionForm, any, undefined> {
  onSubmit: (data: RegionForm) => void,
  isLoadingSubmit: boolean,
  setIsLoadingSubmit: Setter<boolean>,
}