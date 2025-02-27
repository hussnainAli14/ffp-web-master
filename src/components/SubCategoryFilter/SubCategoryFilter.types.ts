import { SubCategoryRes } from '@ffp-web/app/index.types';

export type Props = {
  subCategories: SubCategoryRes[],
  selectedSubCategoryIds: string[],
  handleSelectSubCategory: (subCategoryId: string) => void
};