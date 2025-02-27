'use client';

import moment from 'moment';

import { BreadcrumbsProps } from '@ffp-web/app/index.types';
import { Breadcrumbs, ConfirmationModal, SeparatorLine } from '@ffp-web/components';
import { capitalizeFirstLetter } from '@ffp-web/utils/text.utils';

import useView from './useView';

const links: BreadcrumbsProps[] = [
  { id: '1', name: 'Users', href: '/dashboard/users' },
  { id: '2', name: 'User Details', href: '#' },
];

const ViewUserPage = () => {
  const {
    userDetail,
    openModalDelete,
    setOpenModalDelete,
    handleDelete,
    onDelete,
  } = useView();

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='text-3xl font-semibold'>User Details</div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='text-lg font-semibold'>Basic Information</div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Name</div>
            <div className='text-base font-normal'>{userDetail?.fullName || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Gender</div>
            <div className='text-base font-normal'>{capitalizeFirstLetter(userDetail?.gender || '-')}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Date of Birth</div>
            <div className='text-base font-normal'>{userDetail?.dob ? moment(userDetail.dob).format('DD/MM/YYYY') : '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Email Address</div>
            <div className='text-base font-normal'>{userDetail?.email || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Phone Number (Optional)</div>
            <div className='text-base font-normal'>
              {userDetail?.phoneNumber ? `+${userDetail.phoneCode} ${userDetail.phoneNumber}` : '-'}
            </div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Country of Residence</div>
            <div className='text-base font-normal'>{userDetail?.countryName || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Nationality</div>
            <div className='text-base font-normal'>{userDetail?.nationality ? userDetail.nationality.split('-')[1] : '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>My Interest</div>
            <div className='text-base font-normal'>
              {userDetail?.interests?.length ? userDetail.interests.map(e => e.subCategoryName).join(', ') : '-'}
            </div>
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='text-sm font-semibold flex justify-between items-center gap-4'>
          <button
            onClick={handleDelete}
            className='px-4 py-2 text-red-500 hover:text-red-700'
          >
            Delete User
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        type='delete'
        objectName='user'
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

export default ViewUserPage;