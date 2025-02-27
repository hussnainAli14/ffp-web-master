'use client';

import Link from 'next/link';
import { FaPlus } from 'react-icons/fa6';

import { ConfirmationModal, CustomTable } from '@ffp-web/components';

import { columns } from './column';
import useList from './useList';

const ListRegionPage = () => {
  const {
    listRegion,
    loading,
    handleDelete,
    openModal,
    setOpenModal,
    onDelete,
  } = useList();
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-wrap justify-between gap-4'>
        <div className='text-3xl font-semibold'>
          Regions
        </div>
        <Link
          href='/dashboard/places/regions/add'
          className='py-2 px-4 text-base text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full flex gap-2 items-center'
        >
          <FaPlus /> New Region
        </Link>
      </div>

      <CustomTable
        columns={columns({ handleDelete })}
        data={listRegion}
        emptyCaption='Add a new region to start'
        isLoading={loading.list}
      />

      <ConfirmationModal
        isOpen={openModal.delete}
        onClose={() => setOpenModal(prev => ({ ...prev, delete: false }))}
        type='delete'
        objectName='region'
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

export default ListRegionPage;