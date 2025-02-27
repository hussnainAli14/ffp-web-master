'use client';

import { BreadcrumbsProps } from '@ffp-web/app/index.types';
import { Breadcrumbs, Chip, ConfirmationModal, SeparatorLine } from '@ffp-web/components';
import { formatTextToIncludeHyperLink } from '@ffp-web/utils/text.utils';

import useView from './useView';

const links: BreadcrumbsProps[] = [
  { id: '1', name: 'Providers', href: '/dashboard/providers' },
  { id: '2', name: 'Provider Details', href: '#' },
];

const ViewProviderPage = () => {
  const {
    providerDetail,
    openModalDelete,
    setOpenModalDelete,
    openModalApprove,
    setOpenModalApprove,
    handleDelete,
    handleApprove,
    onDelete,
    onApprove,
  } = useView();

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-5'>
        <Breadcrumbs links={links} />
        <div className='text-3xl font-semibold'>Provider Details</div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='text-lg font-semibold'>Basic Information</div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Full Name (Contact)</div>
            <div className='text-base font-normal'>{providerDetail?.fullName || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Legal Business Name</div>
            <div className='text-base font-normal'>{providerDetail?.businessName || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Email Address</div>
            <div className='text-base font-normal'>{providerDetail?.email || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Phone Number (Optional)</div>
            <div className='text-base font-normal'>
              {providerDetail?.phoneNumber ? `+${providerDetail.phoneCode} ${providerDetail.phoneNumber}` : '-'}
            </div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Country</div>
            <div className='text-base font-normal'>{providerDetail?.countryName || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>City</div>
            <div className='text-base font-normal'>{providerDetail?.cityName || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Status</div>
            {providerDetail?.isApproved ? <Chip size='sm' variant='success'>Approved</Chip> : <Chip size='sm' variant='warning'>Pending</Chip>}
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='text-lg font-semibold'>Service Details</div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Service Category</div>
            <div className='text-base font-normal'>{providerDetail?.userService?.categories?.map(e => e.name).join(', ') || '-'}</div>
          </div>
          <div className='hidden flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Target Audience</div>
            <div className='text-base font-normal'>{providerDetail?.userService?.targetAudience || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Description of Services</div>
            <div className='text-base font-normal'>{providerDetail?.userService?.description || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Locations of Service</div>
            <div className='text-base font-normal'>{providerDetail?.userService?.serviceLocation || '-'}</div>
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='text-lg font-semibold'>Business Details</div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Years Established</div>
            <div className='text-base font-normal'>{providerDetail?.userBusiness?.operationYear || '-'}</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Website</div>
            <div className='text-base font-normal'>
              {
                providerDetail?.userBusiness?.website ?
                  formatTextToIncludeHyperLink(providerDetail?.userBusiness?.website) :
                  '-'
              }
            </div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Instagram</div>
            <div className='text-base font-normal'>{
              providerDetail?.userBusiness?.instagram ?
                formatTextToIncludeHyperLink(providerDetail?.userBusiness?.instagram) :
                '-'
            }</div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Facebook</div>
            <div className='text-base font-normal'>
              {
                providerDetail?.userBusiness?.facebook ?
                  formatTextToIncludeHyperLink(providerDetail?.userBusiness?.facebook) :
                  '-'
              }
            </div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>TikTok</div>
            <div className='text-base font-normal'>
              {
                providerDetail?.userBusiness?.tiktok ?
                  formatTextToIncludeHyperLink(providerDetail?.userBusiness?.tiktok) :
                  '-'
              }
            </div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>YouTube</div>
            <div className='text-base font-normal'>
              {
                providerDetail?.userBusiness?.youtube ?
                  formatTextToIncludeHyperLink(providerDetail?.userBusiness?.youtube) :
                  '-'
              }
            </div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Snapchat</div>
            <div className='text-base font-normal'>
              {
                providerDetail?.userBusiness?.snapchat ?
                  formatTextToIncludeHyperLink(providerDetail?.userBusiness?.snapchat) :
                  '-'
              }
            </div>
          </div>
          <div className='flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Certification or Licenses</div>
            <div className='text-base font-normal'>
              {
                providerDetail?.userBusiness?.certificationOrLicenses ?
                  formatTextToIncludeHyperLink(providerDetail?.userBusiness?.certificationOrLicenses) :
                  '-'
              }
            </div>
          </div>
          <div className='hidden flex flex-col items-start gap-1.5'>
            <div className='text-sm font-semibold'>Business Registration Number</div>
            <div className='text-base font-normal'>{providerDetail?.userBusiness?.registrationNumber || '-'}</div>
          </div>
        </div>

        <SeparatorLine horizontal />

        <div className='text-sm font-semibold flex justify-between items-center gap-4'>
          <button
            onClick={handleDelete}
            className='px-4 py-2 text-red-500 hover:text-red-700'
          >
            Delete Provider
          </button>
          <button
            onClick={handleApprove}
            disabled={providerDetail?.isApproved}
            className={`px-4 py-2 rounded-full ${providerDetail?.isApproved ? 'text-gray-300 bg-gray-50 border' : 'text-primary-white bg-primary-btn hover:bg-opacity-90'}`}
          >
            Approve
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        type='delete'
        objectName='provider'
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
        isOpen={openModalApprove}
        onClose={() => setOpenModalApprove(false)}
        type='approve'
        objectName='provider'
        actions={[
          {
            label: 'Cancel',
            onClick: () => setOpenModalApprove(false),
            variant: 'secondary',
          },
          {
            label: 'Approve',
            onClick: onApprove,
            variant: 'primary',
          },
        ]}
      />
    </div>
  );
};

export default ViewProviderPage;