'use client';

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { FaChevronDown, FaPlus } from 'react-icons/fa6';

import { USER_TYPE } from '@ffp-web/app/index.types';
import { ConfirmationModal, CustomTable, FilterModal } from '@ffp-web/components';
import { hasAccess } from '@ffp-web/utils/storage.utils';

import { columns } from './column';
import useList from './useList';

const ListActiveListingPage = () => {
  const {
    isLoadingList,
    listProduct,
    openModalDelete,
    setOpenModalDelete,
    handleDelete,
    onDelete,
    openModalUnlist,
    setOpenModalUnlist,
    handleUnlist,
    onUnlist,
    isOpenFilterCountryListing,
    setIsOpenFilterCountryListing,
    isopenFilterCityListing,
    setIsopenFilterCityListing,
    listingCountry,
    listingCity,
    countries,
    handleCloseListingCountry,
    cities,
    handleCloseListingCity,
  } = useList();

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-wrap justify-between gap-4'>
        <div className='text-3xl font-semibold'>
          Active Listings
        </div>
        {hasAccess(USER_TYPE.ADMIN) && <Link
          href='/dashboard/listings/active/add'
          className='py-2 px-4 text-base text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full flex gap-2 items-center'
        >
          <FaPlus /> New Listing
        </Link>}
      </div>
      <div className='flex items-center gap-2 text-sm font-semibold'>
        <div>Filter by</div>
        <button
          onClick={() => setIsOpenFilterCountryListing(true)}
          className={classNames(
            'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
            'bg-primary-white hover:bg-gray-50': isEmpty(listingCountry),
            'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(listingCountry),
          })}
        >
          <span>Country</span> <FaChevronDown />
        </button>
        <button
          onClick={() => setIsopenFilterCityListing(true)}
          disabled={isEmpty(listingCountry)}
          className={classNames(
            'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
            'bg-primary-white hover:bg-gray-50': isEmpty(listingCity) && !isEmpty(listingCountry),
            'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(listingCity) && !isEmpty(listingCountry),
            'bg-gray-100': isEmpty(listingCountry),
          })}
        >
          <span>City</span> <FaChevronDown />
        </button>
      </div>
      <CustomTable
        columns={columns({ handleDelete, handleUnlist })}
        data={listProduct}
        emptyCaption='Add a new listing to start'
        isLoading={isLoadingList}
      />

      <ConfirmationModal
        isOpen={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        type='delete'
        objectName='listings'
        actions={[
          {
            label: 'Cancel',
            onClick: () => setOpenModalDelete(false),
            variant: 'secondary',
          },
          {
            label: 'Delete',
            onClick: onDelete,
            variant: 'danger',
          },
        ]}
      />

      <ConfirmationModal
        isOpen={openModalUnlist}
        onClose={() => setOpenModalUnlist(false)}
        type='unlist'
        objectName='listings'
        actions={[
          {
            label: 'Cancel',
            onClick: () => setOpenModalUnlist(false),
            variant: 'secondary',
          },
          {
            label: 'Unlist',
            onClick: onUnlist,
            variant: 'primary',
          },
        ]}
      />

      {isOpenFilterCountryListing &&
        <FilterModal
          items={countries.map(item => ({ value: item.countryId, label: item.countryName }))}
          selectedItems={listingCountry}
          onSave={handleCloseListingCountry}
          onBack={handleCloseListingCountry}
          title='Countries'
        />
      }
      {isopenFilterCityListing &&
        <FilterModal
          items={cities.map(item => ({ value: item.cityId, label: item.cityName }))}
          selectedItems={listingCity}
          onSave={handleCloseListingCity}
          onBack={handleCloseListingCity}
          title='Cities'
          isMulti
        />
      }
    </div>
  );
};

export default ListActiveListingPage;
