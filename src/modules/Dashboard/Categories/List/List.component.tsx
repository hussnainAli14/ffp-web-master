'use client';

import Link from 'next/link';
import { FaPlus } from 'react-icons/fa6';

import { ConfirmationModal, CustomTable } from '@ffp-web/components';

import { columns } from './column';
import useList from './useList';

const ListCategoryPage = () => {
  const {
    handleDelete,
    lisCategory,
    isLoadingList,
    openModalDelete,
    setOpenModalDelete,
    onDelete,
  } = useList();

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-wrap justify-between gap-4'>
        <div className='text-3xl font-semibold'>
          Categories
        </div>
        <Link
          href='/dashboard/categories/add'
          className='py-2 px-4 text-base text-primary-white font-semibold bg-primary-btn hover:bg-opacity-90 rounded-full flex gap-2 items-center'
        >
          <FaPlus /> New Category
        </Link>
      </div>
      <CustomTable
        columns={columns({ handleDelete })}
        data={lisCategory}
        emptyCaption='Add a new category to start'
        isLoading={isLoadingList}
      />

      <ConfirmationModal
        isOpen={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        type='delete'
        objectName='category'
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
    </div>
  );
};

export default ListCategoryPage;
