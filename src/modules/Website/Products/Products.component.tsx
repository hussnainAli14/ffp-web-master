'use client';

import { LoadingSpinner, ProductCard, ProductCardMobile } from '@ffp-web/components';
import { EmptyPage } from '@ffp-web/modules/Website';

import useProducts from './useProducts';

const ProductsSearchPage = () => {
  const { products, isLoadingQuery, query } = useProducts();

  if (isLoadingQuery) {
    return (
      <div className='py-24 md:py-56'>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  if (products.length > 0) {
    return (
      <div className='mb-8 md:mb-16'>
        {query &&
          <div className='mt-4 md:mt-6 xl:mt-8 py-4 px-4 md:px-20 xl:px-28 text-lg md:text-2xl font-semibold'>
            {`Showing ${products.length} result for "${query}"`}
          </div>
        }
        <div className='mt-4 md:mt-4 xl:mt-6 py-4 px-4 md:px-20 xl:px-28 hidden md:flex xl:grid xl:grid-cols-4 gap-6 overflow-x-scroll no-scroll-indicator'>
          {products.map(item => <ProductCard key={item.productId} product={item} />)}
        </div>
        <div className='mt-4 py-4 px-4 md:hidden flex flex-col gap-6'>
          {products.map(item => <ProductCardMobile key={item.productId} product={item} />)}
        </div>
      </div>
    );
  }

  return (
    <div className='py-12 md:py-24 px-4 md:px-20 xl:px-28 flex justify-center items-center'>
      <EmptyPage caption='But the community is out finding options for you!' />
    </div>
  );
};

export default ProductsSearchPage;