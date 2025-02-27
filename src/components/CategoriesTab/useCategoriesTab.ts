import { Props, UseCategoriesTab } from './CategoriesTab.types';

export const useCategoriesTab = (props: Props): UseCategoriesTab => {
  // handle on click category
  const handleClickCategory = (categoryId: string) => {
    props.setSelectedCategoryId(categoryId);
    props.fetchProducts(categoryId);
  };

  return {
    handleClickCategory,
  };
};

export default useCategoriesTab;