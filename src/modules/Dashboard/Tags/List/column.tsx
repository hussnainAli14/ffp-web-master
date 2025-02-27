import Link from 'next/link';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import { Column, TagProps } from '@ffp-web/app/index.types';

import { ColumnProps } from './List.types';

export const columns = ({
  handleDelete,
}: ColumnProps): Column<TagProps>[] =>
  [
    {
      header: 'Tag',
      accessor: 'tagName',
    },
    {
      header: 'Description',
      accessor: 'description',
      headerClassName: 'max-w-40 md:max-w-96',
      cellClassName: 'max-w-40 md:max-w-96',
      render: (value) => (value ? value : '-'),
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
            href={`/dashboard/tags/edit/${row.tagId}`}
          >
            <FiEdit2 size={20} />
          </Link>
        </div>
      ),
    },
  ];