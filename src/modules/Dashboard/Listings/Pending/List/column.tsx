import Link from 'next/link';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import { Column, ProductListProps, USER_TYPE } from '@ffp-web/app/index.types';
import { hasAccess } from '@ffp-web/utils/storage.utils';

import { ColumnProps } from './List.types';

export const columns = ({
  handleDelete, handleApprove,
}: ColumnProps): Column<ProductListProps>[] =>
  [
    {
      header: 'Listing name',
      accessor: 'productName',
    },
    {
      header: 'Provider',
      accessor: 'businessName',
    },
    {
      header: 'Category',
      accessor: 'categoryName',
    },
    {
      header: 'Sub-category',
      accessor: 'subCategoryName',
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
          {hasAccess(USER_TYPE.ADMIN) &&
            <button
              onClick={() => handleApprove(row)}
              className='text-primary-btn font-semibold'
            >
              Approve
            </button>
          }
          <button
            onClick={() => handleDelete(row)}
          >
            <FiTrash2 size={20} />
          </button>
          <Link
            href={`/dashboard/listings/pending/edit/${row.productId}`}
          >
            <FiEdit2 size={20} />
          </Link>
        </div>
      ),
    },
  ];