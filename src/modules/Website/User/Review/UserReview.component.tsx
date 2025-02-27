'use client';

import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import { Column, ListReviewProps } from '@ffp-web/app/index.types';
import { ConfirmationModal, CustomTable, ReviewModal } from '@ffp-web/components';

import { Props } from '../User.types';

const columns = (
  {
    handleDeleteReview,
    handleEditReview,
  }: {
    handleDeleteReview: (data: ListReviewProps) => void,
    handleEditReview: (data: ListReviewProps) => void,
  }
): Column<ListReviewProps>[] =>
  [
    {
      header: 'Listing name',
      accessor: 'productName',
    },
    {
      header: 'Review',
      accessor: 'review',
      render: (value) => <div className='text-wrap'>{value}</div>,
    },
    {
      header: 'Rating',
      accessor: 'overallScore',
    },
    {
      header: '',
      render: (_, row) => (
        <div className='flex justify-end gap-4'>
          <button onClick={() => handleDeleteReview(row)}>
            <FiTrash2 size={20} />
          </button>
          <button onClick={() => handleEditReview(row)}>
            <FiEdit2 size={20} />
          </button>
        </div>
      ),
    },
  ];

const UserReviewPage = (props: Props) => {
  const {
    reviews,
    isLoading,
    openModal,
    setOpenModal,
    handleDeleteReview,
    onDeleteReview,
    handleEditReview,
    handleRefecthReview,
    selectedReview,
  } = props;

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <div className='text-lg font-semibold'>My Reviews</div>
        <div className='text-sm font-normal text-gray-500'>See all your past reviews here</div>
      </div>

      <CustomTable
        columns={columns({ handleDeleteReview, handleEditReview })}
        data={reviews}
        emptyCaption='Leave a review for a listing you have tried'
        isLoading={isLoading.review}
      />

      <ConfirmationModal
        isOpen={openModal.deleteReview}
        onClose={() => setOpenModal(prev => ({ ...prev, deleteReview: false }))}
        type='delete'
        objectName='review'
        actions={[
          {
            label: 'Cancel',
            onClick: () => setOpenModal(prev => ({ ...prev, deleteReview: false })),
            variant: 'secondary',
          },
          {
            label: 'Delete',
            onClick: onDeleteReview,
            variant: 'danger',
          },
        ]}
      />

      {openModal.editReview &&
        <ReviewModal
          isOpen={openModal.editReview}
          onClose={() => setOpenModal(prev => ({ ...prev, editReview: false }))}
          initialReview={selectedReview}
          refetch={handleRefecthReview}
          isEdit
        />
      }
    </div>
  );
};

export default UserReviewPage;