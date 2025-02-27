'use client';

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import { FaChevronDown, FaPlus } from 'react-icons/fa6';

import { ConfirmationModal, CustomTable, FilterModal } from '@ffp-web/components';

import { columns } from './column';
import useList from './useList';

const ListProviderPage = () => {
  const {
    listProvider,
    handleDelete,
    handleApprove,
    onDelete,
    onApprove,
    openModal,
    setOpenModal,
    loading,
    filter,
    handleCloseFilterCountry,
    handleCloseFilterCity,
  } = useList();

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-wrap justify-between gap-4'>
        <div className='text-3xl font-semibold'>
          Providers
        </div>
        <Link
          href='/dashboard/providers/add'
          className='py-2 px-4 text-base text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full flex gap-2 items-center'
        >
          <FaPlus /> New Provider
        </Link>
      </div>

      <div className='flex items-center gap-2 text-sm font-semibold'>
        <div>Filter by</div>
        <button
          onClick={() => setOpenModal(prev => ({ ...prev, filterCountry: true }))}
          className={classNames(
            'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
            'bg-primary-white hover:bg-gray-50': isEmpty(filter.selectedCountry),
            'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filter.selectedCountry),
          })}
        >
          <span>Country</span> <FaChevronDown />
        </button>
        <button
          onClick={() => setOpenModal(prev => ({ ...prev, filterCity: true }))}
          disabled={isEmpty(filter.selectedCountry)}
          className={classNames(
            'py-2.5 px-3 border rounded-lg flex items-center gap-2', {
            'bg-primary-white hover:bg-gray-50': isEmpty(filter.selectedCity) && !isEmpty(filter.selectedCountry),
            'bg-primary-btn text-primary-white hover:bg-bg-opacity-90': !isEmpty(filter.selectedCity) && !isEmpty(filter.selectedCountry),
            'bg-gray-100': isEmpty(filter.selectedCountry),
          })}
        >
          <span>City</span> <FaChevronDown />
        </button>
      </div>

      <CustomTable
        columns={columns({ handleApprove, handleDelete })}
        data={listProvider}
        emptyCaption='Providers are added after they are signed up'
        isLoading={loading.loadingList}
      />

      <ConfirmationModal
        isOpen={openModal.delete}
        onClose={() => setOpenModal(prev => ({ ...prev, delete: false }))}
        type='delete'
        objectName='provider'
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
      <ConfirmationModal
        isOpen={openModal.approve}
        onClose={() => setOpenModal(prev => ({ ...prev, approve: false }))}
        type='approve'
        objectName='provider'
        actions={[
          {
            label: 'Cancel',
            onClick: () => setOpenModal(prev => ({ ...prev, approve: false })),
            variant: 'secondary',
          },
          {
            label: 'Approve',
            onClick: onApprove,
            variant: 'primary',
          },
        ]}
      />

      {openModal.filterCountry &&
        <FilterModal
          items={filter.countries.map(item => ({ value: item.countryId, label: item.countryName }))}
          selectedItems={filter.selectedCountry}
          onSave={handleCloseFilterCountry}
          onBack={handleCloseFilterCountry}
          title='Countries'
        />
      }
      {openModal.filterCity &&
        <FilterModal
          items={filter.cities.map(item => ({ value: item.cityId, label: item.cityName }))}
          selectedItems={filter.selectedCity}
          onSave={handleCloseFilterCity}
          onBack={handleCloseFilterCity}
          title='Cities'
          isMulti
        />
      }
    </div>
  );
};

export default ListProviderPage;
