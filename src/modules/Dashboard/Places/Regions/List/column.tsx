import Link from 'next/link';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import { Column, PlaceRegionProps } from '@ffp-web/app/index.types';

import { ColumnProps } from './List.types';

export const columns = ({
  handleDelete,
}: ColumnProps): Column<PlaceRegionProps>[] =>
  [
    {
      header: 'Region',
      accessor: 'regionName',
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
            href={`/dashboard/places/regions/edit/${row.regionId}`}
          >
            <FiEdit2 size={20} />
          </Link>
        </div>
      ),
    },
  ];