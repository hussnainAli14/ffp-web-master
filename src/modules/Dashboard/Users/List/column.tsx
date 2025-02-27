import moment from 'moment';
import Link from 'next/link';
import { FiEye, FiTrash2 } from 'react-icons/fi';

import { Column, ListUserProps } from '@ffp-web/app/index.types';
import { capitalizeFirstLetter } from '@ffp-web/utils/text.utils';

import { ColumnProps } from './List.types';

export const columns = ({
  handleDelete, handleBlock, handleVerify,
}: ColumnProps): Column<ListUserProps>[] =>
  [
    {
      header: 'Name',
      accessor: 'fullName',
    },
    {
      header: 'Gender',
      accessor: 'gender',
      render: (value) => typeof value === 'string' ? capitalizeFirstLetter(value) : '-',
    },
    {
      header: 'Date of Birth',
      accessor: 'dob',
      render: (value) => typeof value === 'string' ? moment(value).format('DD/MM/YYYY') : '-',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Country of Residence',
      accessor: 'countryName',
    },
    {
      header: '',
      render: (_, row) => (
        <div className='flex justify-end gap-4'>
          {!row.isApproved ? (
            <button
              onClick={() => handleVerify(row)}
              className={'text-primary-btn font-semibold'}
            >
              Verify
            </button>
          ) : (
            <button
              onClick={() => handleBlock(row)}
              className={'text-primary-btn font-semibold'}
            >
              {row.isBlocked ? 'Unblock' : 'Block'}
            </button>
          )}

          <button
            onClick={() => handleDelete(row)}
          >
            <FiTrash2 size={20} />
          </button>
          <Link
            href={`/dashboard/users/view/${row.userId}`}
          >
            <FiEye size={20} />
          </Link>
        </div>
      ),
    },
  ];