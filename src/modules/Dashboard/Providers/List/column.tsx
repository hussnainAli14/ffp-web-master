import Link from 'next/link';
import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';

import { Column, ListUserProps } from '@ffp-web/app/index.types';
import { Chip } from '@ffp-web/components';

import { ColumnProps } from './List.types';

export const columns = ({
  handleDelete, handleApprove,
}: ColumnProps): Column<ListUserProps>[] =>
  [
    {
      header: 'Full name (Contact)',
      accessor: 'fullName',
    },
    {
      header: 'Business name',
      accessor: 'businessName',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Country',
      accessor: 'countryName',
    },
    {
      header: 'City',
      accessor: 'cityName',
    },
    {
      header: 'Status',
      accessor: 'isApproved',
      render: (value) => (
        <div className='flex'>
          {value ? <Chip size='sm' variant='success'>Approved</Chip> : <Chip size='sm' variant='warning'>Pending</Chip>}
        </div>
      ),
    },
    {
      header: '',
      render: (_, row) => (
        <div className='flex justify-end gap-4'>
          <button
            onClick={() => handleApprove(row)}
            disabled={row.isApproved && row.isPasswordCreated}
            className={`${(row.isApproved && row.isPasswordCreated) ? 'text-gray-300' : 'text-primary-btn'} font-semibold`}
          >
            {row.isApproved && !row.isPasswordCreated ? 'Resend' : 'Approve'}
          </button>
          <button
            onClick={() => handleDelete(row)}
          >
            <FiTrash2 size={20} />
          </button>
          <Link
            href={`/dashboard/providers/view/${row.userId}`}
          >
            <FiEye size={20} />
          </Link>
          <Link
            href={`/dashboard/providers/edit/${row.userId}`}
          >
            <FiEdit2 size={20} />
          </Link>
        </div>
      ),
    },
  ];