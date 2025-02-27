import { isEmpty } from 'lodash';

import { LoadingSpinner, ProductCard } from '@ffp-web/components';

import { Props } from './CategoriesTab.types';
import useCategoriesTab from './useCategoriesTab';

const CategoriesTab = (props: Props) => {
  const {
    categories,
    products,
    selectedCategoryId,
    isLoadingCategories,
    isLoadingProducts,
  } = props;
  const { handleClickCategory } = useCategoriesTab(props);

  const renderProducts = () => (
    isEmpty(products) ?
      <div className='my-40 flex justify-center text-xl font-semibold'>No listings available</div> :
      <div className='py-4 px-4 md:px-20 xl:px-28 flex xl:grid xl:grid-cols-4 gap-6 overflow-x-scroll no-scroll-indicator'>
        {products.map(item => <ProductCard key={item.productId} product={item} />)}
      </div>
  );

  const renderTab = () => (
    <div className='mt-8'>
      <div className='mx-4 md:mx-20 xl:mx-28 flex overflow-scroll no-scroll-indicator gap-3 md:gap-4 xl:gap-5 border-b'>
        {categories?.map(item => (
          <div
            key={item.categoryId}
            className={`pb-2 ${selectedCategoryId === item.categoryId ? 'border-b-2 border-primary-btn' : ''}`}
          >
            <button
              className={`tab text-sm text-nowrap font-semibold hover:cursor-pointer hover:text-primary-btn
                ${selectedCategoryId === item.categoryId ? 'text-primary-btn' : 'text-primary-gray'}`}
              onClick={() => handleClickCategory(item.categoryId)}
            >
              {item.categoryName}
            </button>
          </div>
        ))}
      </div>
      <div className='mt-4 md:mt-8'>
        {isLoadingProducts ? <div className='mx-auto my-40'><LoadingSpinner /></div> : renderProducts()}
      </div>
    </div>
  );

  return (
    isLoadingCategories ? <div className='mx-auto my-12'><LoadingSpinner /></div> : renderTab()
  );
};

export default CategoriesTab;