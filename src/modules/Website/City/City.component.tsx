/* eslint-disable no-console, @typescript-eslint/ban-ts-comment */

'use client';

import { isEmpty } from 'lodash';
import { useState } from 'react';

import { ProductListCardProps } from '@ffp-web/app/index.types';
import {
  LoadingSpinner,
  ProductCard,
  ProductCardMobile,
  SectionTitle,
} from '@ffp-web/components';
import SearchFilterModal from '@ffp-web/components/SearchFilterModal';
import { EmptyPage } from '@ffp-web/modules/Website';

import useCity from './useCity';

const CityPage = () => {
  const {
    cityName,
    popularProducts,
    products,
    pagination,
    setPagination,
    loading,
    categories,
  } = useCity();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedPopularProducts, setSelectedPopularProducts] = useState<
    ProductListCardProps[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<
    ProductListCardProps[]
  >([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [filterApplied2, setFilterApplied2] = useState(false);

  const [rating, setRating] = useState<number>(0);
  const [startingPrice, setStartingPrice] = useState<number>(0);

  const handleApplyFilters = (filters: {
    cities: number[];
    countries: number[];
    categories: number[];
  }) => {
    let filteredPopularProducts = popularProducts;
    let filteredProducts = products;

    if (filters.categories.length > 0) {
      filteredPopularProducts = filteredPopularProducts.filter((product) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filters.categories.includes(product.categoryId)
      );

      filteredProducts = filteredProducts.filter((product) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filters.categories.includes(product.categoryId)
      );
    }

    setSelectedCategories(filters.categories);
    setSelectedPopularProducts(filteredPopularProducts);
    setSelectedProducts(filteredProducts);
    setFilterApplied(true);
    setFilterApplied2(true);
  };

  const applyOtherFilters = (
    type: string,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.preventDefault();

    let filteredPopularProducts;
    let filteredProducts;

    if (filterApplied2 && selectedCategories.length > 0) {
      filteredPopularProducts = selectedPopularProducts;
      filteredProducts = selectedProducts;
    } else {
      filteredPopularProducts = popularProducts;
      filteredProducts = products;
    }

    if (type === 'rating') {
      setRating(Number(e.target.value));
      filteredPopularProducts = filteredPopularProducts.filter(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (product) => product.reviewScore >= e.target.value
      );

      filteredProducts = filteredProducts.filter(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (product) => product.reviewScore >= e.target.value
      );
    }
    if (type === 'startingPrice') {
      setStartingPrice(Number(e.target.value));

      filteredPopularProducts = filteredPopularProducts.sort((a, b) => {
        if (e.target.value === '1') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return b.startingPrice - a.startingPrice;
        }else if(e.target.value === '3'){
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return b.reviewScore - a.reviewScore;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return a.startingPrice - b.startingPrice;
      });

      filteredProducts = filteredProducts.sort((a, b) => {
        if (e.target.value === '1') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return b.startingPrice - a.startingPrice;
        }else if(e.target.value === '3'){
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return b.reviewScore - a.reviewScore;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return a.startingPrice - b.startingPrice;
      });
    }

    setSelectedPopularProducts(filteredPopularProducts);
    setSelectedProducts(filteredProducts);
    setFilterApplied(true);
  };

  return isEmpty(popularProducts) &&
    isEmpty(products) &&
    !loading.popularProduct &&
    !loading.moreProduct ? (
    <div className="py-12 md:py-24 px-4 md:px-20 xl:px-28 flex justify-center items-center">
      <EmptyPage caption="But the community is out finding options for you!" />
    </div>
  ) : (
    <div className="mb-8 md:mb-16">
      <div
        className="px-4 md:px-20 xl:px-28 mt-8 md:mt-16"
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SearchFilterModal
          isOpen={isFilterModalOpen}
          setIsFilterModalOpen={setIsFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
          searchData={{
            categories: categories,
            cities: [],
            countries: [],
          }}
        />
        <button
          type="button"
          className="ml-2 bg-gray-100 px-3 py-1 rounded-full border hover:bg-gray-200 flex items-center"
          onClick={() => setIsFilterModalOpen(true)}
          style={{ height: '40px' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            height="12"
            style={{ paddingRight: '5px' }}
          >
            <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
          </svg>
          Filters
        </button>
        <div className="">
          <div className="flex flex-row md:flex-row gap-4">
            {/* <div className="flex flex-col">
              <select
                title="Rating"
                id="rating"
                onChange={(e) => applyOtherFilters('rating', e)}
                value={rating}
                className="border rounded px-3 py-2"
              >
                <option value="0">Rating</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div> */}
            <div className="flex flex-row items-center">
              <label htmlFor="startingPrice" className="text-sm font-semibold mr-5">
                Sort
              </label>
              <select
                title="Sort"
                id="startingPrice"
                value={startingPrice}
                onChange={(e) => applyOtherFilters('startingPrice', e)}
                className="border rounded px-3 py-2"
              >
                {/* <option value="0">Sort</option> */}
                <option value="0">Recommended</option>
                <option value="1">Highest to Lowest</option>
                <option value="2">Lowest to Highest</option>
                <option value="3">Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-20 xl:px-28 mt-8 md:mt-16">
        <SectionTitle keyTitle="Popular" restTitle={`in ${cityName}`} />
      </div>

      <div className="mt-4 md:mt-6 xl:mt-8 py-4 px-4 md:px-20 xl:px-28 hidden md:flex xl:grid xl:grid-cols-4 gap-6 overflow-x-scroll no-scroll-indicator">
        {filterApplied
          ? selectedPopularProducts.map((item) => (
              <ProductCard key={item.productId} product={item} />
            ))
          : popularProducts.map((item) => (
              <ProductCard key={item.productId} product={item} />
            ))}
      </div>
      {loading.popularProduct ? (
        <div className="my-16">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="mt-4 py-4 px-4 md:hidden flex flex-col gap-6">
          {filterApplied
            ? selectedPopularProducts.map((item) => (
                <ProductCardMobile key={item.productId} product={item} />
              ))
            : popularProducts.map((item) => (
                <ProductCardMobile key={item.productId} product={item} />
              ))}
        </div>
      )}

      <div className="px-4 md:px-20 xl:px-28 mt-8 md:mt-16">
        <SectionTitle keyTitle="More" restTitle={`in ${cityName}`} />
      </div>
      <div className="mt-4 md:mt-6 xl:mt-8 py-4 px-4 md:px-20 xl:px-28 hidden md:flex xl:grid xl:grid-cols-4 gap-6 overflow-x-scroll no-scroll-indicator">
        {filterApplied
          ? selectedProducts.map((item) => (
              <ProductCard key={item.productId} product={item} />
            ))
          : products
              .slice(pagination.offset, pagination.limit)
              .map((item) => (
                <ProductCard key={item.productId} product={item} />
              ))}
        {filterApplied &&
        selectedProducts.length >= pagination.limit &&
        selectedProducts.length > 0 ? (
          <div className="xl:hidden flex flex-col justify-center items-center">
            <button
              className="text-lg text-nowrap text-primary-btn font-semibold"
              onClick={() =>
                setPagination((prev) => ({ ...prev, limit: prev.limit + 12 }))
              }
            >
              View More...
            </button>
          </div>
        ) : (
          products.length >= pagination.limit && (
            <div className="xl:hidden flex flex-col justify-center items-center">
              <button
                className="text-lg text-nowrap text-primary-btn font-semibold"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    limit: prev.limit + 12,
                  }))
                }
              >
                View More
              </button>
            </div>
          )
        )}
      </div>
      {loading.moreProduct ? (
        <div className="my-16">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="mt-4 py-4 px-4 md:hidden flex flex-col gap-6">
          {filterApplied
            ? selectedProducts.map((item) => (
                <ProductCardMobile key={item.productId} product={item} />
              ))
            : products.map((item) => (
                <ProductCardMobile key={item.productId} product={item} />
              ))}
        </div>
      )}
      {products.length >= pagination.limit && (
        <div className="flex md:hidden xl:flex mt-4 xl:mt-10 px-4 md:px-20 xl:px-28 justify-center items-center">
          <button
            className="text-lg text-center text-primary-btn font-semibold"
            onClick={() =>
              setPagination((prev) => ({ ...prev, limit: prev.limit + 12 }))
            }
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default CityPage;
