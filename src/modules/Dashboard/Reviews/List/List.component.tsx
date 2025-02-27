'use client';

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { FaChevronDown } from 'react-icons/fa6';

import { SORT_REVIEW } from '@ffp-web/app/index.types';
import { ConfirmationModal, CustomTable, FilterModal, ImagesModal, SearchComponent } from '@ffp-web/components';
import { capitalizeFirstLetter } from '@ffp-web/utils/text.utils';

import { columns } from './column';
import useList from './useList';

const ListReviewsPage = () => {
  const {
    listReviews,
    isLoadingList,
    openModal,
    setOpenModal,
    handleDelete,
    onDelete,
    filter,
    setFilter,
    handleCloseFilterSortings,
    handleCloseFilterRatings,
    imageReview,
    handleViewImage,
  } = useList();

  return (
    <div className='flex flex-col gap-8'>
      <div className='text-3xl font-semibold'>
        Reviews
      </div>

      <div className='flex justify-between items-center flex-wrap gap-6'>
        <div className='flex flex-wrap items-center gap-2 text-sm font-semibold'>
          <div>Filter by</div>
          <button
            onClick={() => setOpenModal(prev => ({ ...prev, filterSortings: true }))}
            className={classNames(
              'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filter.selectedSortings),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filter.selectedSortings),
            })}
          >
            <span>Sort by</span> <FaChevronDown />
          </button>
          <button
            onClick={() => setOpenModal(prev => ({ ...prev, filterRatings: true }))}
            className={classNames(
              'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
              'bg-primary-white hover:bg-gray-50': isEmpty(filter.selectedRatings),
              'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filter.selectedRatings),
            })}
          >
            <span>Ratings</span> <FaChevronDown />
          </button>
        </div>
        <div className='w-96'>
          <SearchComponent
            id='search-review'
            onPressEnter={query => setFilter(prev => ({ ...prev, query }))}
          />
        </div>
      </div>


      <CustomTable
        columns={columns({ handleDelete, handleViewImage })}
        data={listReviews}
        emptyCaption='Reviews are added after user leave a comment'
        isLoading={isLoadingList}
      />

      <ConfirmationModal
        isOpen={openModal.delete}
        onClose={() => setOpenModal(prev => ({ ...prev, delete: false }))}
        type='delete'
        objectName='review'
        actions={[
          {
            label: 'Cancel',
            onClick: () => setOpenModal(prev => ({ ...prev, delete: false })),
            variant: 'secondary',
          },
          {
            label: 'Delete',
            onClick: onDelete,
            variant: 'danger',
          },
        ]}
      />

      {openModal.filterSortings &&
        <FilterModal
          items={filter.sortings.map(item => ({ value: item, label: capitalizeFirstLetter(item) }))}
          selectedItems={filter.selectedSortings}
          onSave={handleCloseFilterSortings}
          onBack={handleCloseFilterSortings}
          title='Sort by'
          defaultValue={{ value: SORT_REVIEW.NEWEST, label: capitalizeFirstLetter(SORT_REVIEW.NEWEST) }}
        />
      }
      {openModal.filterRatings &&
        <FilterModal
          items={filter.ratings.map(item => ({ value: item, label: item.toString() }))}
          selectedItems={filter.selectedRatings}
          onSave={handleCloseFilterRatings}
          onBack={handleCloseFilterRatings}
          title='Ratings'
          isMulti
        />
      }

      {openModal.imagesReview &&
        <ImagesModal
          isOpen={openModal.imagesReview}
          onClose={() => setOpenModal(prev => ({ ...prev, imagesReview: false }))}
          images={imageReview.images}
          defaultImageIndex={imageReview.defaultIndex}
        />
      }
    </div>
  );
};

export default ListReviewsPage;
