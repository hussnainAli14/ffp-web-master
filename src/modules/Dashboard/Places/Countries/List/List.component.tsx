'use client';

import Link from 'next/link';
import { FaPlus } from 'react-icons/fa6';

import { ConfirmationModal, CustomTable } from '@ffp-web/components';

import { columns } from './column';
import useList from './useList';

const ListCountryPage = () => {
  const {
    listCountry,
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
          Countries
        </div>
        <Link
          href='/dashboard/places/countries/add'
          className='py-2 px-4 text-base text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full flex gap-2 items-center'
        >
          <FaPlus /> New Country
        </Link>
      </div>

      <CustomTable
        columns={columns({ handleDelete })}
        data={listCountry}
        emptyCaption='Add a new country to start'
        isLoading={loading.list}
      />

      <ConfirmationModal
        isOpen={openModal.delete}
        onClose={() => setOpenModal(prev => ({ ...prev, delete: false }))}
        type='delete'
        objectName='country'
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

export default ListCountryPage;