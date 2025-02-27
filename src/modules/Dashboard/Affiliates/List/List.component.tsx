'use client';

import { ConfirmationModal, CustomTable } from '@ffp-web/components';

import { columns } from './column';
import useList from './useList';

const ListAffiliatePage = () => {
  const {
    listAffiliate,
    isLoadingList,
    handleDelete,
    openModalDelete,
    setOpenModalDelete,
    onDelete,
  } = useList();

  return (
    <div className='flex flex-col gap-8'>
      <div className='text-3xl font-semibold'>
        Affiliates
      </div>
      <CustomTable
        columns={columns({ handleDelete })}
        data={listAffiliate}
        emptyCaption='Affiliates are added after they are signed up'
        isLoading={isLoadingList}
      />

      <ConfirmationModal
        isOpen={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        type='delete'
        objectName='affiliate'
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

export default ListAffiliatePage;
