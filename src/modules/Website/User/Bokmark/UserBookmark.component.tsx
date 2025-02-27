import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { FaChevronDown } from 'react-icons/fa6';
import { FiTrash2 } from 'react-icons/fi';

import { ConfirmationModal, FilterModal, LoadingSpinner, ProductCardMobile, SearchComponent } from '@ffp-web/components';
import { EmptyPage } from '@ffp-web/modules/Website';

import { Props } from '../User.types';

const UserBookmarkPage = (props: Props) => {
  const {
    products,
    handleRemoveBookmark,
    onRemoveBookmark,
    selectedBookmarkProduct,
    isLoading,
    openModal,
    setOpenModal,
    filterData,
    filterBookmark,
    setFilterBookmark,
    handleCloseFilterCountry,
    handleCloseFilterCity,
    handleCloseFilterCategory,
    handleCloseFilterSubCategory,
  } = props;

  const renderListBookmark = () => {
    if (isLoading.bookmark) {
      return (
        products.map(item => (
          <div key={item.productId} className='p-4 gap-4 flex justify-between items-center rounded-2xl bg-primary-white drop-shadow'>
            <div className='flex gap-3'>
              <div className='w-36 h-36 animate-pulse bg-gray-200 rounded-2xl' />
              <div className='flex flex-col justify-evenly gap-1'>
                <div className='w-16 md:w-24 h-4 animate-pulse bg-gray-200 rounded-full' />
                <div className='w-36 md:w-96 h-6 animate-pulse bg-gray-200 rounded-full' />
                <div className='w-36 md:w-72 h-6 animate-pulse bg-gray-200 rounded-full' />
                <div className='w-16 md:w-32 h-4 animate-pulse bg-gray-200 rounded-full' />
                <div className='w-32 md:w-64 h-5 animate-pulse bg-gray-200 rounded-full' />
              </div>
            </div>
            <div className='w-6 h-6 animate-pulse bg-gray-200 rounded' />
          </div>
        ))
      );
    }

    if (products.length === 0) {
      return (
        <EmptyPage
          title='What Things Do You Want To Do?'
          caption='Find places to visit on your next trip'
        />
      );
    }

    return (
      products.map(item => (
        <div key={item.productId} className='p-4 gap-4 flex justify-between items-center rounded-2xl bg-primary-white drop-shadow'>
          <ProductCardMobile product={item} />
          <button onClick={() => handleRemoveBookmark(item.productId, item.productName)}>
            {(isLoading.removeBookmark && selectedBookmarkProduct.productId === item.productId)
              ? <LoadingSpinner size='xsmall' />
              : <FiTrash2 size={20} />
            }
          </button>
        </div>
      ))
    );
  };

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <div className='text-lg font-semibold'>Must Do</div>
        <div className='text-sm font-normal text-gray-500'>See all your must do listing here</div>
      </div>

      <div className='flex flex-wrap justify-between items-center gap-6'>
        <div className='flex flex-wrap items-center gap-2 text-sm font-semibold'>
          <div>Filter by</div>
          <button
            onClick={() => setOpenModal(prev => ({ ...prev, filterCountry: true }))}
            className={classNames(
              'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filterBookmark.selectedCountry),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filterBookmark.selectedCountry),
            })}
          >
            <span>Country</span> <FaChevronDown />
          </button>
          <button
            onClick={() => setOpenModal(prev => ({ ...prev, filterCity: true }))}
            disabled={isEmpty(filterBookmark.selectedCountry)}
            className={classNames(
              'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filterBookmark.selectedCity) && !isEmpty(filterBookmark.selectedCountry),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filterBookmark.selectedCity) && !isEmpty(filterBookmark.selectedCountry),
              'bg-gray-100': isEmpty(filterBookmark.selectedCountry),
            })}
          >
            <span>City</span> <FaChevronDown />
          </button>
          <button
            onClick={() => setOpenModal(prev => ({ ...prev, filterCategory: true }))}
            className={classNames(
              'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filterBookmark.selectedCategory),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filterBookmark.selectedCategory),
            })}
          >
            <span>Category</span> <FaChevronDown />
          </button>
          <button
            onClick={() => setOpenModal(prev => ({ ...prev, filterSubCategory: true }))}
            disabled={isEmpty(filterBookmark.selectedCategory)}
            className={classNames(
              'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filterBookmark.selectedSubCategory) && !isEmpty(filterBookmark.selectedCategory),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filterBookmark.selectedSubCategory) && !isEmpty(filterBookmark.selectedCategory),
              'bg-gray-100': isEmpty(filterBookmark.selectedCategory),
            })}
          >
            <span>Sub-category</span> <FaChevronDown />
          </button>
        </div>
        <div className='w-96'>
          <SearchComponent id='search-bookmark' onPressEnter={query => setFilterBookmark(prev => ({ ...prev, query }))} />
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        {(isLoading.bookmark && products.length === 0) ? (
          <div className='my-8'><LoadingSpinner /></div>
        ) : (
          renderListBookmark()
        )}
      </div>

      <ConfirmationModal
        isOpen={openModal.removeBookmark}
        onClose={() => setOpenModal(prev => ({ ...prev, removeBookmark: false }))}
        type='remove-from'
        objectName='listing'
        objectFromName='bookmark'
        actions={[
          {
            label: 'Cancel',
            onClick: () => setOpenModal(prev => ({ ...prev, removeBookmark: false })),
            variant: 'secondary',
          },
          {
            label: 'Remove',
            onClick: onRemoveBookmark,
            variant: 'danger',
          },
        ]}
      />

      {openModal.filterCountry &&
        <FilterModal
          items={filterData.countries.map(item => ({ value: item.countryId, label: item.countryName }))}
          selectedItems={filterBookmark.selectedCountry}
          onSave={handleCloseFilterCountry}
          onBack={handleCloseFilterCountry}
          title='Countries'
          isMulti
        />
      }
      {openModal.filterCity &&
        <FilterModal
          items={filterData.cities
            .filter(item => filterBookmark.selectedCountry.some(country => item.countryId === country))
            .map(item => ({ value: item.cityId, label: item.cityName }))}
          selectedItems={filterBookmark.selectedCity}
          onSave={handleCloseFilterCity}
          onBack={handleCloseFilterCity}
          title='Cities'
          isMulti
        />
      }
      {openModal.filterCategory &&
        <FilterModal
          items={filterData.categories.map(item => ({ value: item.categoryId, label: item.categoryName }))}
          selectedItems={filterBookmark.selectedCategory}
          onSave={handleCloseFilterCategory}
          onBack={handleCloseFilterCategory}
          title='Categories'
          isMulti
        />
      }
      {openModal.filterSubCategory &&
        <FilterModal
          items={filterData.subCategories
            .filter(item => filterBookmark.selectedCategory.some(category => item.categoryId === category))
            .map(item => ({ value: item.subCategoryId, label: item.subCategoryName }))}
          selectedItems={filterBookmark.selectedSubCategory}
          onSave={handleCloseFilterSubCategory}
          onBack={handleCloseFilterSubCategory}
          title='SubCategories'
          isMulti
        />
      }
    </div>
  );
};

export default UserBookmarkPage;