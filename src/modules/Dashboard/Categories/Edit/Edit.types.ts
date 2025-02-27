import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';

import { CategoryDetailProps, Setter } from '@ffp-web/app/index.types';

export type SubCategoryForm = {
  subCategoryId?: string,
  subCategoryName: string,
  image: string[],
};

export type EditForm = {
  categoryId?: string,
  categoryName: string,
  image: string[],
  subCategories: SubCategoryForm[],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface UseEdit extends UseFormReturn<EditForm, any, undefined> {
  subCategories: UseFieldArrayReturn<EditForm, 'subCategories', 'id'>,
  onSubmit: (data: EditForm) => void,
  handleAddSubCategory: VoidFunction,
  handleRemoveSubCategory: (index: number) => () => void,
  categoryDetail?: CategoryDetailProps,
  setCategoryDetail: Setter<CategoryDetailProps | undefined>,
  isLoadingSubmit: boolean,
  setIsLoadingSubmit: Setter<boolean>,
  openModalDelete: boolean,
  setOpenModalDelete: Setter<boolean>,
  isLoadingDelete: boolean,
  setIsLoadingDelete: Setter<boolean>,
  onDelete: VoidFunction,
}