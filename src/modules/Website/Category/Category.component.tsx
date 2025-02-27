'use client';

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { FaChevronDown } from 'react-icons/fa6';

import { FilterModal, LoadingSpinner, ProductCard, ProductCardMobile, SectionTitle } from '@ffp-web/components';
import { EmptyPage } from '@ffp-web/modules/Website';

import useCategory from './useCategory';

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

  const renderTitle = () => {
    if (cityName && subCategoryName) return `${subCategoryName} in ${cityName}`;

    return subCategoryName || categoryName;
  };

  const renderFilter = () => !isEmpty(subCategoryId) && isEmpty(cityId) && (
    <div className='px-4 md:px-20 xl:px-28 mt-4 md:mt-8'>
      <div className='flex flex-wrap items-center gap-3 text-sm font-semibold'>
        <div className='text-base'>Filter by</div>
        <button
          onClick={() => setOpenModal(prev => ({ ...prev, filterCountry: true }))}
          className={classNames(
            'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
            'bg-primary-white hover:bg-gray-50': isEmpty(filterStates.selectedCountry),
            'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filterStates.selectedCountry),
          })}
        >
          <span>Country</span> <FaChevronDown />
        </button>
        <button
          onClick={() => setOpenModal(prev => ({ ...prev, filterCity: true }))}
          disabled={isEmpty(filterStates.selectedCountry)}
          className={classNames(
            'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
            'bg-primary-white hover:bg-gray-50': isEmpty(filterStates.selectedCity) && !isEmpty(filterStates.selectedCountry),
            'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filterStates.selectedCity) && !isEmpty(filterStates.selectedCountry),
            'bg-gray-100': isEmpty(filterStates.selectedCountry),
          })}
        >
          <span>City</span> <FaChevronDown />
        </button>
      </div>

      {openModal.filterCountry &&
        <FilterModal
          items={filterData.countries.map(item => ({ value: item.countryId, label: item.countryName }))}
          selectedItems={filterStates.selectedCountry}
          onSave={handleCloseFilterCountry}
          onBack={handleCloseFilterCountry}
          title='Countries'
          isMulti
        />
      }
      {openModal.filterCity &&
        <FilterModal
          items={filterData.cities
            .filter(item => filterStates.selectedCountry.some(country => item.countryId === country))
            .map(item => ({ value: item.cityId, label: item.cityName }))}
          selectedItems={filterStates.selectedCity}
          onSave={handleCloseFilterCity}
          onBack={handleCloseFilterCity}
          title='Cities'
          isMulti
        />
      }
    </div>
  );

  return (isEmpty(popularProducts) && isEmpty(products) && !loading.products) ? (
    <div className='pt-4 md:pt-8'>
      {renderFilter()}
      <div className='py-12 md:py-24 px-4 md:px-20 xl:px-28 flex justify-center items-center'>
        <EmptyPage caption='But the community is out finding options for you!' />
      </div>
    </div>

  ) : (
    <div className='mb-8 md:mb-16 pt-4 md:pt-8'>
      {renderFilter()}
      <div className='px-4 md:px-20 xl:px-28 mt-4 md:mt-8'>
        <SectionTitle keyTitle='Popular' restTitle={renderTitle()} />
      </div>
      <div className='mt-4 md:mt-6 xl:mt-8 py-4 px-4 md:px-20 xl:px-28 hidden md:flex xl:grid xl:grid-cols-4 gap-6 overflow-x-scroll no-scroll-indicator'>
        {popularProducts.map(item => <ProductCard key={item.productId} product={item} />)}
      </div>
      {loading.products ? (
        <div className='my-16'>
          <LoadingSpinner size='large' />
        </div>
      ) : (
        <div className='mt-4 py-4 px-4 md:hidden flex flex-col gap-6'>
          {popularProducts.map(item => <ProductCardMobile key={item.productId} product={item} />)}
        </div>
      )}

      <div className='px-4 md:px-20 xl:px-28 mt-8 md:mt-16'>
        <SectionTitle keyTitle='More' restTitle={renderTitle()} />
      </div>
      <div className='mt-4 md:mt-6 xl:mt-8 py-4 px-4 md:px-20 xl:px-28 hidden md:flex xl:grid xl:grid-cols-4 gap-6 overflow-x-scroll no-scroll-indicator'>
        {
          products
            .slice(pagination.offset, pagination.limit)
            .map(item => <ProductCard key={item.productId} product={item} />)
        }
        {products.length >= pagination.limit && (
          <div className='xl:hidden flex flex-col justify-center items-center'>
            <button
              className='text-lg tetx-nowrap text-primary-btn font-semibold'
              onClick={() => setPagination(prev => ({ ...prev, limit: prev.limit + 12 }))}
            >
              View More
            </button>
          </div>
        )}
      </div>
      {/* Mobile version */}
      {loading.products ? (
        <div className='my-16'>
          <LoadingSpinner size='large' />
        </div>
      ) : (
        <div className='mt-4 py-4 px-4 md:hidden flex flex-col gap-6'>
          {products.map(item => <ProductCardMobile key={item.productId} product={item} />)}
        </div>
      )}
      {products.length >= pagination.limit && (
        <div className='flex md:hidden xl:flex mt-4 xl:mt-10 px-4 md:px-20 xl:px-28 justify-center items-center'>
          <button
            className='text-lg text-center text-primary-btn font-semibold'
            onClick={() => setPagination(prev => ({ ...prev, limit: prev.limit + 12 }))}
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;