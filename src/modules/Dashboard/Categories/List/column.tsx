import Link from 'next/link';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import { Column, ListCategoryProps } from '@ffp-web/app/index.types';

import { ColumnProps } from './List.types';

export const columns = ({
  handleDelete,
}: ColumnProps): Column<ListCategoryProps>[] =>
  [
    {
      header: 'Category name',
      accessor: 'categoryName',
    },
    {
      header: 'Sub-categories',
      accessor: 'subCategoryCount',
      render: (value) => (<span>{value ?? 0} sub-categories</span>),
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
            href={`/dashboard/categories/edit/${row.categoryId}`}
          >
            <FiEdit2 size={20} />
          </Link>
        </div>
      ),
    },
  ];