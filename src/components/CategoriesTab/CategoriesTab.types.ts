import { CategoryRes, ProductListCardProps, PromiseFunction, Setter } from '@ffp-web/app/index.types';

export type Props = {
  categories: CategoryRes[],
  products: ProductListCardProps[],
  selectedCategoryId: string,
  setSelectedCategoryId: Setter<string>,
  isLoadingCategories: boolean,
  isLoadingProducts: boolean,
  fetchProducts: PromiseFunction<string>,
};

export type UseCategoriesTab = {
  handleClickCategory: (categoryId: string) => void,
};