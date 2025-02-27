'use client';

import Link from 'next/link';
import { FaPlus } from 'react-icons/fa6';

import { ConfirmationModal, CustomTable, Tab } from '@ffp-web/components';

import { columnCities, columnHomeCities } from './column';
import useList from './useList';

const ListCityPage = () => {
  const {
    selectedTab,
    setSelectedTab,
    listCity,
    listHomeCity,
    loading,
    handleDelete,
    handleAddToHome,
    handleRemoveFromHome,
    handleMoveUp,
    handleMoveDown,
    openModal,
    setOpenModal,
    onDelete,
  } = useList();
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-wrap justify-between gap-4'>
        <div className='text-3xl font-semibold'>
          Cities
        </div>
        <Link
          href='/dashboard/places/cities/add'
          className='py-2 px-4 text-base text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full flex gap-2 items-center'
        >
          <FaPlus /> New City
        </Link>
      </div>

      <Tab
        tabs={[
          {
            key: '1',
            label: 'All cities',
            component: <CustomTable
              columns={columnCities({ handleDelete, handleAddToHome })}
              data={listCity}
              emptyCaption='Add a new city to start'
              isLoading={loading.list}
            />,
          },
          {
            key: '2',
            label: 'Cities on Homepage',
            component: <CustomTable
              columns={columnHomeCities({ handleRemoveFromHome })}
              data={listHomeCity}
              emptyCaption='Add a city to home'
              isLoading={loading.list}
              orderRow={{
                orderKey: 'displayOrder',
                moveUp: handleMoveUp,
                moveDown: handleMoveDown,
              }}
            />,
          },
        ]}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />

      <ConfirmationModal
        isOpen={openModal.delete}
        onClose={() => setOpenModal(prev => ({ ...prev, delete: false }))}
        type='delete'
        objectName='city'
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
    </div>
  );
};

export default ListCityPage;