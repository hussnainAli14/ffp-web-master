import Link from 'next/link';
import { FiEye, FiTrash2 } from 'react-icons/fi';

import { Column, ListUserProps } from '@ffp-web/app/index.types';

import { ColumnProps } from './List.types';

export const columns = ({
  handleDelete,
}: ColumnProps): Column<ListUserProps>[] =>
  [
    {
      header: 'Full name',
      accessor: 'fullName',
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
      header: '',
      render: (_, row) => (
        <div className='flex justify-end gap-4'>
          <button
            onClick={() => handleDelete(row)}
          >
            <FiTrash2 size={20} />
          </button>
          <Link
            href={`/dashboard/affiliates/view/${row.userId}`}
          >
            <FiEye size={20} />
          </Link>
        </div>
      ),
    },
  ];