"use client";

import classNames from "classnames";
import { isEmpty } from "lodash";
import { FaChevronDown } from "react-icons/fa6";

import {
  FilterModal,
  LoadingSpinner,
  ProductCard,
  ProductCardMobile,
  SectionTitle,
} from "@ffp-web/components";
import { EmptyPage } from "@ffp-web/modules/Website";

import useCategory from "./useCategory";
import { useState } from "react";
import { ProductListCardProps } from "@ffp-web/app/index.types";

const CategoryPage = () => {
  const {
    categoryName,
    subCategoryId,
    subCategoryName,
    cityId,
    cityName,
    popularProducts,
    products,
    pagination,
    setPagination,
    loading,
    openModal,
    setOpenModal,
    filterData,
    filterStates,
    handleCloseFilterCountry,
    handleCloseFilterCity,
  } = useCategory();

  const [rating, setRating] = useState<number>(0);
  const [startingPrice, setStartingPrice] = useState<number>(0);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedPopularProducts, setSelectedPopularProducts] = useState<
    ProductListCardProps[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<
    ProductListCardProps[]
  >([]);

  const [filterApplied, setFilterApplied] = useState(false);
  const [filterApplied2, setFilterApplied2] = useState(false);

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

    if (type === "rating") {
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
    if (type === "startingPrice") {
      setStartingPrice(Number(e.target.value));

      filteredPopularProducts = filteredPopularProducts.sort((a, b) => {
        if (e.target.value === "1") {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return b.startingPrice - a.startingPrice;
        } else if (e.target.value === "3") {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return b.reviewScore - a.reviewScore;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return a.startingPrice - b.startingPrice;
      });

      filteredProducts = filteredProducts.sort((a, b) => {
        if (e.target.value === "1") {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return b.startingPrice - a.startingPrice;
        } else if (e.target.value === "3") {
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

  const renderTitle = () => {
    if (cityName && subCategoryName) return `${subCategoryName} in ${cityName}`;

    return subCategoryName || categoryName;
  };

  const renderFilter = () =>
    !isEmpty(subCategoryId) &&
    isEmpty(cityId) && (
      <div className="px-4 md:px-20 xl:px-28 mt-4 md:mt-8">
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
          <div className="text-base">Filter by</div>
          <button
            onClick={() =>
              setOpenModal((prev) => ({ ...prev, filterCountry: true }))
            }
            className={classNames(
              "py-2.5 px-3 border rounded-lg flex items-center gap-2",
              {
                "bg-primary-white hover:bg-gray-50": isEmpty(
                  filterStates.selectedCountry
                ),
                "bg-primary-btn text-primary-white hover:bg-bg-opacity-90":
                  !isEmpty(filterStates.selectedCountry),
              }
            )}
          >
            <span>Country</span> <FaChevronDown />
          </button>
          <button
            onClick={() =>
              setOpenModal((prev) => ({ ...prev, filterCity: true }))
            }
            disabled={isEmpty(filterStates.selectedCountry)}
            className={classNames(
              "py-2.5 px-3 border rounded-lg flex items-center gap-2",
              {
                "bg-primary-white hover:bg-gray-50":
                  isEmpty(filterStates.selectedCity) &&
                  !isEmpty(filterStates.selectedCountry),
                "bg-primary-btn text-primary-white hover:bg-bg-opacity-90":
                  !isEmpty(filterStates.selectedCity) &&
                  !isEmpty(filterStates.selectedCountry),
                "bg-gray-100": isEmpty(filterStates.selectedCountry),
              }
            )}
          >
            <span>City</span> <FaChevronDown />
          </button>
          <div className="flex flex-row items-center">
            <label
              htmlFor="startingPrice"
              className="text-sm font-semibold mr-5"
            >
              Sort
            </label>
            <select
              title="Sort"
              id="startingPrice"
              value={startingPrice}
              onChange={(e) => applyOtherFilters("startingPrice", e)}
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

        {openModal.filterCountry && (
          <FilterModal
            items={filterData.countries.map((item) => ({
              value: item.countryId,
              label: item.countryName,
            }))}
            selectedItems={filterStates.selectedCountry}
            onSave={handleCloseFilterCountry}
            onBack={handleCloseFilterCountry}
            title="Countries"
            isMulti
          />
        )}
        {openModal.filterCity && (
          <FilterModal
            items={filterData.cities
              .filter((item) =>
                filterStates.selectedCountry.some(
                  (country) => item.countryId === country
                )
              )
              .map((item) => ({ value: item.cityId, label: item.cityName }))}
            selectedItems={filterStates.selectedCity}
            onSave={handleCloseFilterCity}
            onBack={handleCloseFilterCity}
            title="Cities"
            isMulti
          />
        )}
      </div>
    );

  return isEmpty(popularProducts) && isEmpty(products) && !loading.products ? (
    <div className="pt-4 md:pt-8">
      {renderFilter()}
      <div className="py-12 md:py-24 px-4 md:px-20 xl:px-28 flex justify-center items-center">
        <EmptyPage caption="But the community is out finding options for you!" />
      </div>
    </div>
  ) : (
    <div className="mb-8 md:mb-16 pt-4 md:pt-8">
      {renderFilter()}
      {isEmpty(subCategoryId) && (
        <div
          className="px-4 md:px-20 xl:px-28 mt-8 md:mt-16"
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="">
            <div className="flex flex-row md:flex-row gap-4">
              <div className="flex flex-row items-center">
                <label
                  htmlFor="startingPrice"
                  className="text-sm font-semibold mr-5"
                >
                  Sort
                </label>
                <select
                  title="Sort"
                  id="startingPrice"
                  value={startingPrice}
                  onChange={(e) => applyOtherFilters("startingPrice", e)}
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
      )}
      <div className="px-4 md:px-20 xl:px-28 mt-4 md:mt-8">
        <SectionTitle keyTitle="Popular" restTitle={renderTitle()} />
      </div>
      <div className="mt-4 md:mt-6 xl:mt-8 py-4 px-4 md:px-20 xl:px-28 hidden md:flex xl:grid xl:grid-cols-4 gap-6 overflow-x-scroll no-scroll-indicator">
        {popularProducts.map((item) => (
          <ProductCard key={item.productId} product={item} />
        ))}
      </div>
      {loading.products ? (
        <div className="my-16">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="mt-4 py-4 px-4 md:hidden flex flex-col gap-6">
          {popularProducts.map((item) => (
            <ProductCardMobile key={item.productId} product={item} />
          ))}
        </div>
      )}

      <div className="px-4 md:px-20 xl:px-28 mt-8 md:mt-16">
        <SectionTitle keyTitle="More" restTitle={renderTitle()} />
      </div>
      <div className="mt-4 md:mt-6 xl:mt-8 py-4 px-4 md:px-20 xl:px-28 hidden md:flex xl:grid xl:grid-cols-4 gap-6 overflow-x-scroll no-scroll-indicator">
        {products.slice(pagination.offset, pagination.limit).map((item) => (
          <ProductCard key={item.productId} product={item} />
        ))}
        {products.length >= pagination.limit && (
          <div className="xl:hidden flex flex-col justify-center items-center">
            <button
              className="text-lg tetx-nowrap text-primary-btn font-semibold"
              onClick={() =>
                setPagination((prev) => ({ ...prev, limit: prev.limit + 12 }))
              }
            >
              View More
            </button>
          </div>
        )}
      </div>
      {/* Mobile version */}
      {loading.products ? (
        <div className="my-16">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="mt-4 py-4 px-4 md:hidden flex flex-col gap-6">
          {products.map((item) => (
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

export default CategoryPage;
