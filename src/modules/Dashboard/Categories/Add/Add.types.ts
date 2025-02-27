import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';

import { Setter } from '@ffp-web/app/index.types';

export type SubCategoryForm = {
  subCategoryName: string,
  image: string[],
};

export type AddForm = {
  categoryName: string,
  image: string[],
  subCategories: SubCategoryForm[],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseAdd extends UseFormReturn<AddForm, any, undefined> {
  subCategories: UseFieldArrayReturn<AddForm, 'subCategories', 'id'>,
  onSubmit: (data: AddForm) => void,
  handleAddSubCategory: VoidFunction,
  handleRemoveSubCategory: (index: number) => () => void,
  isLoadingSubmit: boolean,
  setIsLoadingSubmit: Setter<boolean>,
}