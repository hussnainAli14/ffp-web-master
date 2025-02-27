'use client';

import { BreadcrumbsProps } from '@ffp-web/app/index.types';
import { Breadcrumbs, ConfirmationModal, SeparatorLine } from '@ffp-web/components';

import useView from './useView';

const links: BreadcrumbsProps[] = [
  { id: '1', name: 'Affiliates', href: '/dashboard/affiliates' },
  { id: '2', name: 'Affiliate Details', href: '#' },
];

const ViewAffiliatePage = () => {
  const {
    affiliateDetail,
    openModalDelete,
    setOpenModalDelete,
    handleDelete,
    onDelete,
  } = useView();

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='text-3xl font-semibold'>Affiliate Details</div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='text-lg font-semibold'>Basic Information</div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Full Name (Contact)</div>
            <div className='text-base font-normal'>{affiliateDetail?.fullName || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Email Address</div>
            <div className='text-base font-normal'>{affiliateDetail?.email || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Phone Number (Optional)</div>
            <div className='text-base font-normal'>
              {affiliateDetail?.phoneNumber ? `+${affiliateDetail.phoneCode} ${affiliateDetail.phoneNumber}` : '-'}
            </div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Country</div>
            <div className='text-base font-normal'>{affiliateDetail?.countryName || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>City</div>
            <div className='text-base font-normal'>{affiliateDetail?.cityName || '-'}</div>
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='text-lg font-semibold'>Affiliate Business Details</div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Website</div>
            <div className='text-base font-normal'>{affiliateDetail?.userBusiness?.website || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Instagram</div>
            <div className='text-base font-normal'>{affiliateDetail?.userBusiness?.instagram || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Facebook</div>
            <div className='text-base font-normal'>{affiliateDetail?.userBusiness?.facebook || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>TikTok</div>
            <div className='text-base font-normal'>{affiliateDetail?.userBusiness?.tiktok || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>YouTube</div>
            <div className='text-base font-normal'>{affiliateDetail?.userBusiness?.youtube || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Snapchat</div>
            <div className='text-base font-normal'>{affiliateDetail?.userBusiness?.snapchat || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Preferred Niche</div>
            <div className='text-base font-normal'>{affiliateDetail?.userBusiness?.preferredNiche || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Affiliate Type</div>
            <div className='text-base font-normal'>{affiliateDetail?.affiliateType || '-'}</div>
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='text-sm font-semibold flex justify-between items-center gap-4'>
          <button
            onClick={handleDelete}
            className='px-4 py-2 text-red-500 hover:text-red-700'
          >
            Delete Affiliate
          </button>
        </div>
      </div>

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

export default ViewAffiliatePage;